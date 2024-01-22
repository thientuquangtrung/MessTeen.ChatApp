const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, generatePubPriKey } = require("./auth.utils");
const { getInfoData } = require("../../utils/index.js");
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError, InternalError } = require("../../core/error.response");
const userModel = require("../User/user.model");
const UserRepository = require("../User/user.repo");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static userRepo = new UserRepository();

    static handleRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokensUsed(refreshToken);
        if (foundToken) {
            await KeyTokenService.deleteKeyById(foundToken.user);
            throw new ForbiddenError(`Something went wrong! Please log in and try again.`);
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new AuthFailureError(`User has not registered`);
        }

        const { user_id, user_email } = JWT.verify(refreshToken, crypto.createPublicKey(holderToken.publicKey));

        const foundUser = await this.userRepo.findUserByEmail(user_email);
        if (!foundUser) throw new AuthFailureError(`User has not registered`);

        const { publicKey, privateKey } = generatePubPriKey();
        const tokens = await createTokenPair({ user_id: foundUser._id, user_email }, publicKey, privateKey);

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
                publicKey: publicKey.toString(),
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user: foundUser,
            tokens,
        };
    };

    static logout = async (keyStore) => {
        return await KeyTokenService.removeById(keyStore._id);
    };

    static login = async ({ user_email, user_password, refreshToken = null }) => {
        const foundUser = await this.userRepo.findUserByEmail(user_email);
        if (!foundUser) throw new BadRequestError(`User has not registered`);

        const match = await bcrypt.compare(user_password, foundUser.user_password);
        if (!match) throw new AuthFailureError(`Authentication failed`);

        // re-create private key and public key
        const { publicKey, privateKey } = generatePubPriKey();

        // create tokens
        const tokens = await createTokenPair({ user_id: foundUser._id, user_email }, publicKey, privateKey);

        await KeyTokenService.savePublicKeyToDB({
            userId: foundUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
        });

        return {
            user: getInfoData({
                fields: ["_id", "user_name", "user_email"],
                object: foundUser,
            }),
            tokens,
        };
    };

    static signUp = async ({ user_email, user_name, user_password }) => {
        // check existing email
        const foundUser = await userModel.findOne({ user_email }).lean();
        if (foundUser) {
            throw new ConflictRequestError("Error: Email already registered!");
        }

        // TODO: implement google sign up method

        const hashPassword = await bcrypt.hash(user_password, 10);

        const newUser = await userModel.create({
            user_email,
            user_name,
            user_password: hashPassword,
        });
        if (!newUser) {
            throw new InternalError("Cannot create new user");
        }

        // create public key and private key
        const { publicKey, privateKey } = generatePubPriKey();

        const publicKeyObject = await KeyTokenService.savePublicKeyToDB({
            userId: newUser._id,
            publicKey,
        });

        if (!publicKeyObject) {
            throw new BadRequestError("publicKeyString error");
        }

        // create tokens
        const tokens = await createTokenPair({ user_id: newUser._id, user_email }, publicKeyObject, privateKey);

        return {
            user: getInfoData({
                fields: ["_id", "user_name", "user_email"],
                object: newUser,
            }),
            tokens,
        };
    };
}

module.exports = AccessService;

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, generatePubPriKey } = require('./auth.utils');
const { getInfoData } = require('../../utils/index.js');
const {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
    ForbiddenError,
    InternalError,
} = require('../../core/error.response');
const userModel = require('../User/user.model');
const UserRepository = require('../User/user.repo');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
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
            throw new AuthFailureError(`Token not found! Please try again.`);
        }

        const { usr_id, usr_email } = JWT.verify(refreshToken, crypto.createPublicKey(holderToken.publicKey));

        const foundUser = await this.userRepo.findUserByEmail(usr_email);
        if (!foundUser) throw new AuthFailureError(`User has not registered`);

        const { publicKey, privateKey } = generatePubPriKey();
        const tokens = await createTokenPair(
            { usr_id: foundUser._id, usr_email, usr_role: foundUser.usr_role },
            publicKey,
            privateKey,
        );

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

    static login = async ({ usr_email, usr_password, refreshToken = null }) => {
        const foundUser = await this.userRepo.findUserByEmail(usr_email);
        if (!foundUser) throw new BadRequestError(`User has not registered`);

        const match = await bcrypt.compare(usr_password, foundUser.usr_password);
        if (!match) throw new AuthFailureError(`Authentication failed`);

        // re-create private key and public key
        const { publicKey, privateKey } = generatePubPriKey();

        // create tokens
        const tokens = await createTokenPair(
            { usr_id: foundUser._id, usr_email, usr_role: foundUser.usr_role },
            publicKey,
            privateKey,
        );

        await KeyTokenService.savePublicKeyToDB({
            userId: foundUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
        });

        return {
            user: getInfoData({
                fields: ['_id', 'usr_name', 'usr_email', 'usr_avatar', 'usr_bio', 'usr_provider_type', 'usr_role'],
                object: foundUser,
            }),
            tokens,
        };
    };

    static signUp = async ({ usr_email, usr_name, usr_password }) => {
        // check existing email
        const foundUser = await userModel.findOne({ usr_email }).lean();
        if (foundUser) {
            throw new ConflictRequestError('Error: Email already registered!');
        }

        // TODO: implement google sign up method

        const hashPassword = await bcrypt.hash(usr_password, 10);

        const newUser = await userModel.create({
            usr_email,
            usr_name,
            usr_password: hashPassword,
        });
        if (!newUser) {
            throw new InternalError('Cannot create new user');
        }

        // create public key and private key
        const { publicKey, privateKey } = generatePubPriKey();

        const publicKeyObject = await KeyTokenService.savePublicKeyToDB({
            userId: newUser._id,
            publicKey,
        });

        if (!publicKeyObject) {
            throw new BadRequestError('publicKeyString error');
        }

        // create tokens
        const tokens = await createTokenPair(
            { usr_id: newUser._id, usr_email, usr_role: newUser.usr_role },
            publicKeyObject,
            privateKey,
        );

        await KeyTokenService.savePublicKeyToDB({
            userId: newUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
        });

        return {
            user: getInfoData({
                fields: ['_id', 'usr_name', 'usr_email', 'usr_avatar', 'usr_bio', 'usr_provider_type', 'usr_role'],
                object: newUser,
            }),
            tokens,
        };
    };

    static authWithProvider = async ({ usr_email, usr_name, usr_provider_type, usr_provider_id, usr_avatar = '' }) => {
        // check existing email
        let foundUser = await userModel.findOne({ usr_email }).lean();

        if (foundUser) {
            if (foundUser.usr_provider_id === usr_provider_id && foundUser.usr_provider_type === usr_provider_type) {
                // login case
            } else {
                // login with different provider/method ==> Error
                throw new ConflictRequestError('Error: Email already registered!');
            }
        } else {
            // sign up case
            const newUser = await userModel.create({
                usr_email,
                usr_name,
                usr_provider_id,
                usr_provider_type,
                usr_avatar,
            });
            if (!newUser) {
                throw new InternalError('Cannot create new user');
            }

            foundUser = newUser;
        }

        // create public key and private key
        const { publicKey, privateKey } = generatePubPriKey();

        const publicKeyObject = await KeyTokenService.savePublicKeyToDB({
            userId: foundUser._id,
            publicKey,
        });

        if (!publicKeyObject) {
            throw new BadRequestError('publicKeyString error');
        }

        // create tokens
        const tokens = await createTokenPair(
            { usr_id: foundUser._id, usr_email, usr_role: foundUser.usr_role },
            publicKeyObject,
            privateKey,
        );

        await KeyTokenService.savePublicKeyToDB({
            userId: foundUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
        });

        return {
            user: getInfoData({
                fields: ['_id', 'usr_name', 'usr_email', 'usr_avatar', 'usr_bio', 'usr_provider_type', 'usr_role'],
                object: foundUser,
            }),
            tokens,
        };
    };
}

module.exports = AccessService;

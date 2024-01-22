const crypto = require("crypto");
const {
    Types: { ObjectId },
} = require("mongoose");
const { convertToObjId } = require("../../utils/index.js");
const keyTokenModel = require("./keyToken.model");

class KeyTokenService {
    static savePublicKeyToDB = async ({ userId, publicKey, refreshToken }) => {
        try {
            // convert to String to save in db
            const publicKeyString = publicKey.toString();

            const filter = { user: userId };
            const update = {
                publicKey: publicKeyString,
                refreshTokensUsed: [],
                refreshToken,
            };
            const options = {
                upsert: true,
                new: true,
            };

            const keyToken = await keyTokenModel.findOneAndUpdate(filter, update, options);

            // convert to pem format to return
            return keyToken ? crypto.createPublicKey(keyToken.publicKey) : null;
        } catch (error) {
            throw error;
        }
    };

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: convertToObjId(userId) }).lean();
    };

    static removeById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id });
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    };

    static findByRefreshTokensUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    };

    static deleteKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ user: id });
    };
}

module.exports = KeyTokenService;

const JWT = require("jsonwebtoken");
const { NotFoundError, AuthFailureError } = require("../../core/error.response");
const asyncHandler = require("../../helpers/async.handler");
const { findByUserId } = require("./keyToken.service");
const crypto = require("crypto");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2 hours",
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7 days",
        });

        // double check
        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.error(`error verifying: ${error}`);
            } else {
                console.log(`decoded value: ${decode}`);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};

const generatePubPriKey = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
    });

    return { publicKey, privateKey };
};

const authenticate = asyncHandler(async (req, res, next) => {
    /**
     * 1 - check userId
     * 2 - get access token
     * 3 - verify access token
     * 4 - check user in db
     * 5 - check keyStore with this user
     * 6 - return next() if OK
     */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError(`Invalid request`);

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError(`Keystore not found`);

    // below token can be either access token or refresh token
    const bearerHeader = req.headers[HEADER.AUTHORIZATION];
    if (!bearerHeader) throw new AuthFailureError(`Invalid request`);

    // Get token from array
    const token = bearerHeader.split(" ")[1];

    if (req.originalUrl.includes("/handle-refresh-token")) {
        req.token = token;
        return next();
    }

    try {
        const decodeUser = JWT.verify(token, crypto.createPublicKey(keyStore.publicKey));

        if (userId !== decodeUser.usr_id) throw new AuthFailureError(`Invalid user`);

        // re-assign to request
        req.keyStore = keyStore;
        req.token = token;
        req.user = decodeUser;
        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.send({
                status: 401,
                message: error.message,
            });
        } else {
            return next(error);
        }
    }
});

module.exports = {
    createTokenPair,
    authenticate,
    generatePubPriKey,
};

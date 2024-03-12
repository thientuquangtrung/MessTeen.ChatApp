// =================================================================
//       |V|
//    .::| |::.
//   ::__| |__::
//  >____   ____<           Dear Lord,
//   ::  | |  ::
//    '::| |::'             As I sit before this code, I pray for Your guidance.
//       | |                Grant me the wisdom to understand each line and the patience to debug when things go awry.
//       | |                May my application run smoothly, free from errors and exceptions.
// jgs   |A|
//           _.-/`)         In every function I craft and every algorithm I implement, let me reflect the creativity You showed in Your creation.
//          // / / )        And when success comes,
//       .=// / / / )       let me give thanks for the skills You have given me and the wonderful ways in which technology can serve Your world.
//      //`/ / / / /
//     // /     ` /         In Jesus' name, I pray. Amen.
//    ||         /
//     \\       /
//      ))    .'
// jgs //    /
//          /
// =================================================================

const { Server } = require('socket.io');
const { app, handleSocketConnect } = require('./src/app');
const { PORT } = require('./base.config');
const { findByUserId } = require('./src/v1/modules/Auth/keyToken.service');
const { AuthFailureError } = require('./src/v1/core/error.response');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const userModel = require('./src/v1/modules/User/user.model');

const server = app.listen(PORT, () => {
    console.log(`MessTeen server start with port ${PORT}`);
});

// web socket
const io = new Server(server, {
    cors: {
        origin: '*', //TODO: config later
    },
});
global._io = io;

// Add this
// Listen for when the client connects via socket.io-client
io.use(async function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token && socket.handshake.query.user_id) {
        const foundUser = await userModel.findOne({ _id: socket.handshake.query.user_id, usr_enabled: true });
        if (!foundUser) return next(new AuthFailureError(`Invalid user`));

        const keyStore = await findByUserId(socket.handshake.query.user_id);
        if (!keyStore) return next(new AuthFailureError(`Keystore not found`));

        JWT.verify(socket.handshake.query.token, crypto.createPublicKey(keyStore.publicKey), function (err, decoded) {
            if (err) return next(new AuthFailureError('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', handleSocketConnect);

process.on('SIGINT', () => {
    server.close(() => console.log(`exits server express`));
});

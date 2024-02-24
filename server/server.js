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

const server = app.listen(PORT, () => {
    console.log('MessTeen server start with port 3051');
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
io.on('connection', handleSocketConnect);

process.on('SIGINT', () => {
    server.close(() => console.log(`exits server express`));
});

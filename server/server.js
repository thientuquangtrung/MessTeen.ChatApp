const { Server } = require('socket.io');
const { app, handleSocketConnect } = require('./src/app');
const { PORT } = require('./base.config');

const server = app.listen(3051, () => {
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

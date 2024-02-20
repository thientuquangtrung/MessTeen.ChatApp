const withErrorHandling =
    (socket, handler) =>
    (...data) => {
        handler(...data).catch((err) => {
            socket.emit('error', { message: err.message });
        });
    };

module.exports = withErrorHandling;

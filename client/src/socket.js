import io from 'socket.io-client'; // Add this

let socket;

const connectSocket = (user_id, token) => {
    socket = io(process.env.REACT_APP_SERVER_DOMAIN, {
        query: {
            token,
            user_id,
        },
    });
}; // Add this -- our server will run on port 3051, so we connect to it from here

export { socket, connectSocket };

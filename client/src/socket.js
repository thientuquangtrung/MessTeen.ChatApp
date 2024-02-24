import io from 'socket.io-client'; // Add this

let socket;

const connectSocket = (user_id) => {
    //TODO: fix later
    socket = io(process.env.REACT_APP_SERVER_DOMAIN, {
        query: `user_id=${user_id}`,
    });
}; // Add this -- our server will run on port 3051, so we connect to it from here

export { socket, connectSocket };

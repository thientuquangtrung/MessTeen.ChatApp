const userModel = require('../User/user.model');
const messageModel = require('./message.model');

module.exports = {
    sendMesssageWS: async (data) => {
        console.log('Received message:', data);

        // data: {to, from, text}

        const { message, conversation_id, from, to, type } = data;

        const to_user = await userModel.findById(to);
        const from_user = await userModel.findById(from);

        // message => {to, from, type, created_at, text, file}

        const new_message = await messageModel.create({
            msg_room_id: conversation_id,
            msg_sender_id: from_user._id,
            msg_content: message,
            msg_type: type,
        });

        // emit incoming_message -> to user

        _io.to(to_user?.usr_socket_id).emit('new_message', {
            conversation_id,
            message: new_message,
        });

        // emit outgoing_message -> from user
        _io.to(from_user?.usr_socket_id).emit('new_message', {
            conversation_id,
            message: new_message,
        });
    },
};

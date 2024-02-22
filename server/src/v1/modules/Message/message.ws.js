const userModel = require('../User/user.model');
const messageModel = require('./message.model');
const chatroomModel = require('../ChatRoom/chatroom.model');

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

        // get chatroom data
        const chatroom_data = await chatroomModel
            .findByIdAndUpdate(conversation_id, {
                room_last_msg: {
                    sender_id: new_message.msg_sender_id,
                    content: new_message.msg_content,
                    timestamp: new_message.msg_timestamp,
                },
            })
            .populate('room_participant_ids', '_id usr_name usr_room_ids usr_email usr_status');

        // emit incoming_message -> to user

        _io.to(to_user?.usr_socket_id).emit('new_message', {
            message: new_message,
            conversation: chatroom_data,
        });

        // emit outgoing_message -> from user
        _io.to(from_user?.usr_socket_id).emit('new_message', {
            message: new_message,
            conversation: chatroom_data,
        });
    },
};

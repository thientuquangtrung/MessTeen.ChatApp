const userModel = require('../User/user.model');
const messageModel = require('./message.model');
const MessageService = require('./message.service');
const chatroomModel = require('../ChatRoom/chatroom.model');

module.exports = {
    sendMesssageWS: async (data) => {
        console.log('Received message:', data);

        // data: {to, from, text}

        const { message, conversation_id, from, to, type, msg_parent_id } = data;

        const to_user = await userModel.findById(to);
        const from_user = await userModel.findById(from);

        // message => {to, from, type, created_at, text, file}

        const new_message = await messageModel.create({
            msg_room_id: conversation_id,
            msg_sender_id: from_user._id,
            msg_content: message,
            msg_type: type,
            msg_parent_id: msg_parent_id,
        });

        await new_message.populate('msg_parent_id', 'msg_content _id');

        // get chatroom data
        const chatroom_data = await chatroomModel
            .findByIdAndUpdate(
                conversation_id,
                {
                    room_last_msg: {
                        sender_id: new_message.msg_sender_id,
                        content: new_message.msg_content,
                        timestamp: new_message.msg_timestamp,
                    },
                },
                {
                    new: true,
                    upsert: true,
                },
            )
            .populate('room_participant_ids', '_id usr_name usr_room_ids usr_email usr_status');

        const chatroom = await chatroomModel.findById(conversation_id);

        if (chatroom && chatroom.room_type === 'GROUP') {
            // If the chat room exists and is a group chat room
            _io.to(conversation_id).emit('new_message', {
                message: new_message,
                conversation: chatroom_data,
            });
        } else {
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
        }
    },
    getMessagesWS: async (data, callback) => {
        const messages = await MessageService.getAllMessages(data.conversation_id);
        callback(messages);
    },
    reactMessageWS: async (data, callback) => {
        // const messages = await MessageService.reactOnMessage(data.)

        const { messageID, reaction, conversation_id, from, to } = data;

        const to_user = await userModel.findById(to);
        const from_user = await userModel.findById(from);

        const messageReact = await MessageService.reactOnMessage(messageID, {
            usr_react: from_user._id,
            reaction,
        });

        _io.to(to_user?.usr_socket_id).emit('get_reaction', {
            message: messageReact,
            conversation_id,
        });
        _io.to(from_user?.usr_socket_id).emit('get_reaction', {
            message: messageReact,
            conversation_id,
        });
    },
};

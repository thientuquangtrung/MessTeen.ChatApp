const userModel = require('../User/user.model');
const UserService = require('../User/user.service');
const chatroomModel = require('./chatroom.model');

module.exports = {
    startConversationWS: async (data) => {
        // data: {to: from:}
        const { to, from } = data;

        // check if there is any existing conversation
        const existing_conversations = await chatroomModel
            .find({
                room_participant_ids: { $size: 2, $all: [to, from] },
                room_type: 'PRIVATE',
            })
            .populate('room_participant_ids', 'usr_name usr_room_ids usr_email usr_status');

        let chatroom;
        if (existing_conversations.length === 0) {
            // if no => Create a new chatroom
            let new_chat = await chatroomModel.create({
                room_participant_ids: [to, from],
            });

            chatroom = await chatroomModel
                .findById(new_chat._id)
                .populate('room_participant_ids', 'usr_name usr_room_ids usr_email usr_status');

            // Add the new chatroom id to usr_room_ids of each user
            for (const participantId of chatroom.room_participant_ids) {
                const user = await UserService.getUserById(participantId);
                user.usr_room_ids.push(chatroom._id);
                await user.save();
            }
            console.log(chatroom);
        } else {
            console.log(existing_conversations[0], 'Existing Conversation');
            // if yes => Use the existing chatroom
            chatroom = existing_conversations[0];
        }

        // get socket id
        const fromSocketId = await userModel.findById(data.from).select('usr_socket_id');
        // send conversation details as payload
        _io.to(fromSocketId.usr_socket_id).emit('start_chat', chatroom);
        console.log(fromSocketId.usr_socket_id);
    },
};

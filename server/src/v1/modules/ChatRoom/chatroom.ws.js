const userModel = require('../User/user.model');

module.exports = {
    startConversationWS: async (data) => {
        // data: {to: from:}

        const { to, from } = data;

        // check if there is any existing conversation

        const existing_conversations = await userModel
            .find({
                room_participant_ids: { $size: 2, $all: [to, from] },
            })
            .populate('room_participant_ids', 'usr_name usr_room_ids usr_email usr_status');

        console.log(existing_conversations[0], 'Existing Conversation');

        // if no => create a new OneToOneMessage doc & emit event "start_chat" & send conversation details as payload
        if (existing_conversations.length === 0) {
            let new_chat = await userModel.create({
                room_participant_ids: [to, from],
            });

            new_chat = await OneToOneMessage.findById(new_chat).populate(
                'room_participant_ids',
                'usr_name usr_room_ids usr_email usr_status',
            );

            console.log(new_chat);

            socket.emit('start_chat', new_chat);
        }
        // if yes => just emit event "start_chat" & send conversation details as payload
        else {
            socket.emit('start_chat', existing_conversations[0]);
        }
    },
};

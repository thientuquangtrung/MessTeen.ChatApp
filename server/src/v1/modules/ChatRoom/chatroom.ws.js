const { fromPairs } = require('lodash');
const { BadRequestError } = require('../../core/error.response');
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
            .populate(
                'room_participant_ids',
                'usr_name usr_room_ids usr_email usr_status usr_avatar usr_blocked_people',
            );

        let chatroom;
        if (existing_conversations.length === 0) {
            // if no => Create a new chatroom
            let new_chat = await chatroomModel.create({
                room_participant_ids: [to, from],
            });

            chatroom = await chatroomModel
                .findById(new_chat._id)
                .populate(
                    'room_participant_ids',
                    '_id usr_name usr_room_ids usr_email usr_status usr_avatar usr_blocked_people',
                );

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
        const toSocketId = await userModel.findById(data.to).select('usr_socket_id');

        // send conversation details as payload
        _io.to(fromSocketId.usr_socket_id).emit('start_chat', { chatroom, message: '' });
        _io.to(toSocketId.usr_socket_id).emit('start_chat', { chatroom, message: '' });

        console.log(fromSocketId.usr_socket_id, toSocketId.usr_socket_id);
    },

    groupConversationWS: async (data) => {
        console.log(data);
        // data: {to: from: title}
        // to: ['fds2gfds654675hfdgww', '3433fettqa54556i8]
        const { to, from, title } = data;
        if (to.length < 2) {
            throw new BadRequestError('Must have at least 3 members including yourself');
        }
        let chatroom = await chatroomModel.create({
            room_participant_ids: [...new Set([...to, from])],
            room_type: 'GROUP',
            room_title: title,
            room_owner_id: from,
            room_admins: [from],
        });

        const fromUser = await userModel.findById(from).select('usr_name');

        chatroom = await chatroomModel
            .findById(chatroom._id)
            .populate('room_participant_ids', '_id usr_name usr_room_ids usr_email usr_status usr_avatar');

        // Add the new chatroom id to usr_room_ids of each user
        for (const participantId of chatroom.room_participant_ids) {
            const user = await UserService.getUserById(participantId);
            user.usr_room_ids.push(chatroom._id);
            await user.save();

            const socket = _io.sockets.sockets.get(user.usr_socket_id);
            if (socket) {
                socket.join(chatroom._id.toString());
            }
        }

        _io.to(chatroom._id.toString()).emit('update_conversation_list', {
            message: `You have been added to a new group chat: ${title}`,
            chatroom,
        });
    },

    leaveGroupWS: async (data) => {
        console.log(data);
        const { from, conversation_id } = data;

        const chatroom = await chatroomModel
            .findByIdAndUpdate(
                conversation_id,
                {
                    $pull: {
                        room_participant_ids: from,
                    },
                },
                { new: true },
            )
            .populate('room_participant_ids', '_id usr_name usr_room_ids usr_email usr_status usr_avatar');

        const user = await userModel.findByIdAndUpdate(from, {
            $pull: {
                usr_room_ids: conversation_id,
            },
        });

        // Lấy socket id của user và leave group
        const socket = _io.sockets.sockets.get(user.usr_socket_id);
        if (socket) {
            socket.leave(chatroom._id.toString());
            socket.emit('leave_group', {
                message: `${user.usr_name} has left the group.`,
                chatroom,
            });
        }
        for (const participantId of chatroom.room_participant_ids) {
            const user = await UserService.getUserById(participantId);

            const socket = _io.sockets.sockets.get(user.usr_socket_id);
            if (socket) {
                _io.to(chatroom._id.toString()).emit('update_conversation_list', {
                    chatroom,
                });
            }
        }
    },

    addMemberToGroupWS: async (data, callback) => {
        console.log(data);
        // data: {to: from: title}
        // to: ['fds2gfds654675hfdgww', '3433fettqa54556i8]
        const { to, from, conversation_id } = data;
        if (to.length < 1) {
            throw new BadRequestError('Add at least 1 friend to the group');
        }

        const fromUser = await userModel.findById(from).select('usr_name');

        const chatroom = await chatroomModel
            .findByIdAndUpdate(
                conversation_id,
                {
                    $addToSet: { room_participant_ids: { $each: to } },
                },
                { new: true },
            )
            .populate(
                'room_participant_ids',
                '_id usr_name usr_room_ids usr_email usr_status usr_socket_id usr_avatar',
            );

        // Add the new chatroom id to usr_room_ids of each user
        for (const participantId of chatroom.room_participant_ids) {
            const user = await UserService.getUserById(participantId);
            user.usr_room_ids.push(chatroom._id);
            await user.save();

            const socket = _io.sockets.sockets.get(user.usr_socket_id);
            if (socket) {
                // Check id user có trong list id member chưa
                if (to.includes(participantId._id.toString())) {
                    //user mới có trong group
                    socket.join(chatroom._id.toString());
                    socket.emit('update_conversation_list', {
                        message: `${fromUser.usr_name} has added you to the group chat: ${chatroom.room_title}`,
                        chatroom,
                    });
                } else {
                    //user cũ có trong group
                    socket.emit('update_conversation_list', {
                        message: `New user has been added to the group: ${chatroom.room_title}`,
                        chatroom,
                    });
                }
            }
        }
    },

    getDirectConversationsWS: async ({ user_id }, callback) => {
        const existing_conversations = await chatroomModel
            .find({
                room_participant_ids: { $all: [user_id] },
            })
            .populate(
                'room_participant_ids',
                '_id usr_name usr_room_ids usr_email usr_avatar usr_status usr_blocked_people',
            );

        console.log(existing_conversations);

        callback(existing_conversations);
    },

    // listGroupsWS: async (data, callback) => {
    //     const { user_id } = data;

    //     try {
    //         const existingGroups = await chatroomModel
    //             .find({
    //                 room_participant_ids: { $all: [user_id] },
    //                 room_type: 'GROUP',
    //             })
    //             .populate('room_participant_ids', '_id usr_name usr_room_ids usr_email usr_status usr_avatar');

    //         callback(existingGroups);
    //     } catch (error) {
    //         console.error('Error listing groups:', error);
    //         throw new BadRequestError('Error listing groups');
    //     }
    // },

    joinGroupSocketWS: async (socket, user_id) => {
        const group_chat = await chatroomModel.find({ room_participant_ids: { $all: [user_id] }, room_type: 'GROUP' });
        group_chat.forEach((group) => {
            console.log('Join socket ::::::::::::::', group._id);

            socket.join(group._id.toString());
        });
    },
};

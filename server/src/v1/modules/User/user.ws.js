const { BadRequestError } = require('../../core/error.response');
const userModel = require('./user.model');
const UserService = require('./user.service');

module.exports = {
    sendFriendRequestWS: async (data) => {
        const to_user = await userModel.findById(data.to);
        const from_user = await userModel.findById(data.from);
        const indexOfFrom = to_user.usr_pending_friends.indexOf(from_user._id);
        const indexOfTo = from_user.usr_requested_list.indexOf(to_user._id);

        if (indexOfFrom > -1 && indexOfTo > -1) {
            // remove friend request
            to_user.usr_pending_friends.splice(indexOfFrom, 1);
            await to_user.save();

            from_user.usr_requested_list.splice(indexOfTo, 1);
            await from_user.save();

            await to_user.populate('usr_pending_friends');
            const newFrRequests = to_user.usr_pending_friends;

            _io.to(to_user?.usr_socket_id).emit('new_friend_request', {
                friendRequests: newFrRequests,
            });
            _io.to(from_user?.usr_socket_id).emit('request_sent', {
                message: 'Removed request successfully!',
            });
        } else {
            // create a friend request
            const newFrRequests = await UserService.sendFriendRequest({ user_id: data.from, friend_id: data.to });

            // emit event request received to recipient
            _io.to(to_user?.usr_socket_id).emit('new_friend_request', {
                message: 'New friend request received',
                friendRequests: newFrRequests,
            });
            _io.to(from_user?.usr_socket_id).emit('request_sent', {
                message: 'Request sent successfully!',
            });
        }
    },

    acceptRequestWS: async (data) => {
        await UserService.acceptFriendRequest(data);

        // accept friend request => add ref of each other in friends array
        const from = await userModel
            .findById(data.user_id)
            .select('_id usr_socket_id usr_status usr_friends')
            .populate('usr_friends');
        const to = await userModel
            .findById(data.friend_id)
            .select('_id usr_socket_id usr_status usr_friends')
            .populate('usr_friends');

        // emit event request accepted to both
        _io.to(from?.usr_socket_id).emit('request_accepted', {
            message: 'Friend Request Accepted',
            status: to.usr_status !== 'OFFLINE',
            userId: to._id,
            friendList: from.usr_friends,
        });
        _io.to(to?.usr_socket_id).emit('request_accepted', {
            message: 'Friend Request Accepted',
            status: from.usr_status !== 'OFFLINE',
            userId: from._id,
            friendList: to.usr_friends,
        });
    },

    unfriendWS: async (data, callback) => {
        await UserService.removeFriend(data);

        const from = await userModel
            .findById(data.user_id)
            .select('_id usr_socket_id usr_status usr_friends')
            .populate('usr_friends');
        const to = await userModel
            .findById(data.friend_id)
            .select('_id usr_socket_id usr_status usr_friends')
            .populate('usr_friends');

        callback({ message: 'Remove friend successfully!' });

        _io.to(from?.usr_socket_id).emit('friend-remove', {
            status: false,
            userId: to._id,
            friendList: from.usr_friends,
        });
        _io.to(to?.usr_socket_id).emit('friend-remove', {
            status: false,
            userId: from._id,
            friendList: to.usr_friends,
        });
    },
};

const { BadRequestError } = require('../../core/error.response');
const userModel = require('./user.model');
const UserService = require('./user.service');

module.exports = {
    sendFriendRequestWS: async (data) => {
        const to_user = await userModel.findById(data.to);
        const from_user = await userModel.findById(data.from);
        const index = to_user.usr_pending_friends.indexOf(from_user._id);

        if (index > -1) {
            to_user.usr_pending_friends.splice(index, 1);
            await to_user.save();

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
        // accept friend request => add ref of each other in friends array
        console.log(data);
        const from = await userModel.findById(data.user_id).select('usr_socket_id');
        const to = await userModel.findById(data.friend_id).select('usr_socket_id');

        UserService.acceptFriendRequest(data);

        // emit event request accepted to both
        _io.to(from?.usr_socket_id).emit('request_accepted', {
            message: 'Friend Request Accepted',
        });
        _io.to(to?.usr_socket_id).emit('request_accepted', {
            message: 'Friend Request Accepted',
        });
    },
};

const userModel = require('./user.model');
const UserService = require('./user.service');

module.exports = {
    sendFriendRequestWS: async (data) => {
        const to = await userModel.findById(data.to).select('usr_socket_id');
        const from = await userModel.findById(data.from).select('usr_socket_id');

        // create a friend request
        const newFrRequests = await UserService.sendFriendRequest({ user_id: data.from, friend_id: data.to });

        // emit event request received to recipient
        _io.to(to?.usr_socket_id).emit('new_friend_request', {
            message: 'New friend request received',
            friendRequests: newFrRequests,
        });
        _io.to(from?.usr_socket_id).emit('request_sent', {
            message: 'Request Sent successfully!',
        });
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

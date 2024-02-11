const userModel = require('./user.model');
const UserService = require('./user.service');

module.exports = {
    sendFriendRequestWS: async (data) => {
        const to = await userModel.findById(data.to).select('usr_socket_id');
        const from = await userModel.findById(data.from).select('usr_socket_id');

        // create a friend request
        await UserService.sendFriendRequest({ user_id: data.from, friend_id: data.to });

        // emit event request received to recipient
        _io.to(to?.usr_socket_id).emit('new_friend_request', {
            message: 'New friend request received',
        });
        _io.to(from?.usr_socket_id).emit('request_sent', {
            message: 'Request Sent successfully!',
        });
    },
};

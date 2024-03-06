const { CREATED, OK } = require('../../core/success.response');
const UserService = require('./user.service');

class UserController {
    sendFriendRequest = async (req, res, next) => {
        new CREATED({
            message: 'Friend added successfully!',
            metadata: await UserService.sendFriendRequest(req.body),
        }).send(res);
    };

    acceptFriendRequest = async (req, res, next) => {
        new CREATED({
            message: 'Friend accept successfully!',
            metadata: await UserService.acceptFriendRequest(req.body),
        }).send(res);
    };

    rejectFriend = async (req, res, next) => {
        new OK({
            message: 'Friend rejected successfully!',
            metadata: await UserService.rejectFriend(req.body),
        }).send(res);
    };

    blockFriend = async (req, res, next) => {
        new OK({
            message: 'Friend blocked successfully!',
            metadata: await UserService.blockFriend(req.body),
        }).send(res);
    };

    removeFriend = async (req, res, next) => {
        new OK({
            message: 'Friend remove successfully!',
            metadata: await UserService.removeFriend(req.body),
        }).send(res);
    };

    unBlockFriend = async (req, res, next) => {
        new OK({
            message: 'Friend unblocked successfully!',
            metadata: await UserService.unBlockFriend(req.body),
        }).send(res);
    };

    getExploreUsers = async (req, res, next) => {
        new OK({
            message: 'Explore user list retrieved successfully!',
            metadata: await UserService.getExploreUsers(req.params.userId, req.query.search),
        }).send(res);
    };

    friendsList = async (req, res, next) => {
        new OK({
            message: 'Friend list retrieved successfully!',
            metadata: await UserService.friendsList(req.params.userId, req.query.search),
        }).send(res);
    };

    pendingFriendRequests = async (req, res, next) => {
        new OK({
            message: 'Pending friend requests retrieved successfully!',
            metadata: await UserService.pendingFriendRequests(req.params.userId, req.query.search),
        }).send(res);
    };

    sentFriendRequests = async (req, res, next) => {
        new OK({
            message: 'Sent friend requests retrieved successfully!',
            metadata: await UserService.sentFriendRequests(req.params.userId, req.query.search),
        }).send(res);
    };

    updateProfileUser = async (req, res, next) => {
        new OK({
            message: 'Profile updated successfully!',
            metadata: await UserService.updateProfileUser(req.params.userId, req.body),
        }).send(res);
    };

    async createUser(req, res) {
        const user = await UserService.createUser(req.body);
        new CREATED({
            message: 'User created successfully!',
            metadata: user,
        }).send(res);
    }

    async getAllUsers(req, res) {
        const users = await UserService.getAllUsers();
        new OK({
            message: 'Get all users successfully!',
            metadata: users,
        }).send(res);
    }

    async getUserById(req, res) {
        const user = await UserService.getUserById(req.params.userId);
        new OK({
            message: 'Get user by ID successfully!',
            metadata: user,
        }).send(res);
    }

    async updateUserById(req, res) {
        const user = await UserService.updateUserById(req.params.userId, req.body);
        new OK({
            message: 'Update user by ID successfully!',
            metadata: user,
        }).send(res);
    }

    async deleteUserById(req, res) {
        const user = await UserService.deleteUserById(req.params.userId);
        new OK({
            message: 'Delete user by ID successfully!',
            metadata: user,
        }).send(res);
    }
}

module.exports = new UserController();

const { CREATED, OK } = require("../../core/success.response");
const UserService = require("./user.service");

class UserController {
    sendFriendRequest = async (req, res, next) => {
        new CREATED({
            message: "Friend added successfully!",
            metadata: await UserService.sendFriendRequest(req.body),
        }).send(res);
    };

    acceptFriendRequest = async (req, res, next) => {
        new CREATED({
            message: "Friend accept successfully!",
            metadata: await UserService.acceptFriendRequest(req.body),
        }).send(res);
    };

    rejectFriend = async (req, res, next) => {
        new OK({
            message: "Friend rejected successfully!",
            metadata: await UserService.rejectFriend(req.body),
        }).send(res);
    };

    blockFriend = async (req, res, next) => {
        new OK({
            message: "Friend blocked successfully!",
            metadata: await UserService.blockFriend(req.body),
        }).send(res);
    };

    removeFriend = async (req, res, next) => {
        new OK({
            message: "Friend remove successfully!",
            metadata: await UserService.removeFriend(req.body),
        }).send(res);
    };

    unBlockFriend = async (req, res, next) => {
        new OK({
            message: "Friend unblocked successfully!",
            metadata: await UserService.unBlockFriend(req.body),
        }).send(res);
    };

    friendsList = async (req, res, next) => {
        new OK({
            message: "Friend list retrieved successfully!",
            metadata: await UserService.friendsList(req.params.userId),
        }).send(res);
    };

    pendingFriendRequests = async (req, res, next) => {
        new OK({
            message: "Pending friend requests retrieved successfully!",
            metadata: await UserService.pendingFriendRequests(
                req.params.userId
            ),
        }).send(res);
    };

    updateProfileUser = async (req, res, next) => {
        new OK({
            message: "Profile updated successfully!",
            metadata: await UserService.updateProfileUser(req.params.userId, req.body),
        }).send(res);
    };
}

module.exports = new UserController();

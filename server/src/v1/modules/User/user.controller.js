const { CREATED, OK } = require("../../core/success.response");
const UserService = require("./user.service");

class UserController {
    addFriends = async (req, res, next) => {
        new CREATED({
            message: "Friend added successfully!",
            metadata: await UserService.addFriends(req.body),
        }).send(res);
    };

    acceptFriend = async (req, res, next) => {
        new CREATED({
            message: "Friend accept successfully!",
            metadata: await UserService.acceptFriend(req.body),
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
}

module.exports = new UserController();

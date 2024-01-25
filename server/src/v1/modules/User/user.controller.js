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

    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            new CREATED({
                message: 'User created successfully!',
                metadata: user,
            }).send(res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            new OK({
                message: 'Get all users successfully!',
                metadata: users,
            }).send(res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            new OK({
                message: 'Get user by ID successfully!',
                metadata: user,
            }).send(res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUserById(req, res) {
        try {
            const user = await UserService.updateUserById(req.params.userId, req.body);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            new OK({
                message: 'Update user by ID successfully!',
                metadata: user,
            }).send(res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUserById(req, res) {
        try {
            const user = await UserService.deleteUserById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            new OK({
                message: 'Delete user by ID successfully!',
                metadata: user,
            }).send(res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new UserController();

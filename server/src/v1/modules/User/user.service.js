const { BadRequestError, NotFoundError } = require('../../core/error.response');
const UserModel = require('../User/user.model');
const bcrypt = require('bcrypt');

class UserService {
    static async sendFriendRequest({ user_id, friend_id }) {
        const user = await UserModel.findById(user_id);
        const friend = await UserModel.findById(friend_id);

        if (!user || !friend) {
            throw new NotFoundError('User not found');
        }

        if (friend.usr_pending_friends.includes(user_id) || friend.usr_friends.includes(user_id)) {
            throw new BadRequestError('Already friends or request pending');
        }

        friend.usr_pending_friends.push(user_id);
        await friend.save();

        return { message: 'Friend request send' };
    }

    static async acceptFriendRequest({ user_id, friend_id }) {
        const user = await UserModel.findByIdAndUpdate(
            user_id,
            {
                $pull: { usr_pending_friends: friend_id },
                $addToSet: { usr_friends: friend_id },
            },
            { new: true },
        );
        const friend = await UserModel.findByIdAndUpdate(
            friend_id,
            {
                $addToSet: { usr_friends: user_id },
            },
            { new: true },
        );

        if (!user || !friend) {
            throw new NotFoundError('User not found');
        }

        return { message: 'Friend request accepted' };
    }

    static async rejectFriend({ user_id, friend_id }) {
        const user = await UserModel.findByIdAndUpdate(
            user_id,
            {
                $pull: { usr_pending_friends: friend_id },
            },
            { new: true },
        );

        if (!user) {
            throw new NotFoundError('Friend not found');
        }

        return { message: 'Friend request rejected' };
    }

    static async blockFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError('Friend not found');
        }

        await UserModel.findByIdAndUpdate(usr_id_1, {
            $addToSet: { usr_blocked_people: usr_id_2 },
        });

        return { message: 'Friend blocked successfully' };
    }

    static async unBlockFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError('Friend not found');
        }

        await UserModel.findByIdAndUpdate(usr_id_1, {
            $pull: { usr_blocked_people: usr_id_2 },
        });

        return { message: 'Friend unblocked successfully' };
    }

    static async removeFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError('Friend not found');
        }

        await UserModel.findByIdAndUpdate(usr_id_1, {
            $pull: { usr_friends: usr_id_2 },
        });

        await friend.update({ $pull: { usr_friends: usr_id_1 } });

        return { message: 'Friend remove successfully' };
    }

    static async getExploreUsers(userId, searchQuery = '') {
        const user = await UserModel.findById(userId).lean();
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const allUsers = await UserModel.find({
            usr_enabled: true,
            $or: [{ usr_name: new RegExp(searchQuery, 'i') }, { usr_email: new RegExp(searchQuery, 'i') }],
        }).select('_id usr_name usr_email usr_avatar');

        const remainingUsers = allUsers.filter(
            (u) => u._id.toString() !== user._id.toString() && !user.usr_friends.includes(u._id),
        );

        return remainingUsers;
    }

    static async friendsList(userId) {
        const user = await UserModel.findById(userId).populate('usr_friends');

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user.usr_friends;
    }

    static async pendingFriendRequests(userId) {
        const user = await UserModel.findById(userId).populate('usr_pending_friends');

        if (!user) {
            throw new NotFoundError('User not found');
        }
        console.log(user);
        return user.usr_pending_friends;
    }

    static async updateProfileUser(userId, updatedUserData) {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                usr_name: updatedUserData.usr_name,
                usr_password: updatedUserData.usr_password,
                usr_avatar: updatedUserData.usr_avatar,
            },
            { new: true },
        );

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }
    // CRUD User
    static async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.usr_password, 10);
        const user = await UserModel.create({
            usr_email: userData.usr_email,
            usr_name: userData.usr_name,
            usr_password: hashedPassword,
        });
        return user;
    }

    static async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    static async getUserById(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    static async updateUserById(userId, updatedUserData) {
        const user = await UserModel.findByIdAndUpdate(userId, updatedUserData, {
            new: true,
        });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        if (updatedUserData.usr_password) {
            const hashedPassword = await bcrypt.hash(updatedUserData.usr_password, 10);
            user.usr_password = hashedPassword;
        }

        return user;
    }

    static async deleteUserById(userId) {
        const user = await UserModel.findByIdAndUpdate(userId, { usr_enabled: false }, { new: true });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }
}

module.exports = UserService;

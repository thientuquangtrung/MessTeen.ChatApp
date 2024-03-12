const { BadRequestError, NotFoundError } = require('../../core/error.response');
const chatroomModel = require('../ChatRoom/chatroom.model');
const UserModel = require('../User/user.model');
const bcrypt = require('bcrypt');
const { escapeRegExp } = require('lodash');

class UserService {
    static async sendFriendRequest({ user_id, friend_id }) {
        const user = await UserModel.findById(user_id);
        const friend = await UserModel.findById(friend_id).populate('usr_pending_friends');

        if (!user || !friend) {
            throw new NotFoundError('User not found');
        }

        if (
            user.usr_requested_list.includes(friend_id) ||
            friend.usr_pending_friends.includes(user_id) ||
            friend.usr_friends.includes(user_id)
        ) {
            throw new BadRequestError('Already friends or request pending');
        }

        friend.usr_pending_friends.push(user_id);
        await friend.save();

        user.usr_requested_list.push(friend_id);
        await user.save();

        return friend.usr_pending_friends;
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
                $pull: { usr_requested_list: user_id },
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

    // static async blockFriend({ usr_id_1, usr_id_2 }) {
    //     const friend = await UserModel.findById(usr_id_2);
    //     if (!friend) {
    //         throw new NotFoundError('Friend not found');
    //     }

    //     const user = await UserModel.findByIdAndUpdate(usr_id_1, {
    //         $addToSet: { usr_blocked_people: usr_id_2 },
    //     }, {
    //         new: true,
    //     });

    //     return user.usr_blocked_people;
    // }

    static async blockFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError('Friend not found');
        }

        const user = await UserModel.findByIdAndUpdate(
            usr_id_1,
            { $addToSet: { usr_blocked_people: usr_id_2 } },
            { new: true },
        );

        // check if there is any existing conversation
        const existing_conversations = await chatroomModel.find({
            room_participant_ids: { $size: 2, $all: [usr_id_1, usr_id_2] },
            room_type: 'PRIVATE',
        });

        if (existing_conversations.length > 0) {
            _io.to(friend.usr_socket_id).emit('friend_blocked', {
                id: existing_conversations[0]._id,
                blocked: true,
            });
        }

        return user.usr_blocked_people;
    }

    static async unBlockFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError('Friend not found');
        }

        const user = await UserModel.findByIdAndUpdate(
            usr_id_1,
            {
                $pull: { usr_blocked_people: usr_id_2 },
            },
            {
                new: true,
            },
        );

        // check if there is any existing conversation
        const existing_conversations = await chatroomModel.find({
            room_participant_ids: { $size: 2, $all: [usr_id_1, usr_id_2] },
            room_type: 'PRIVATE',
        });

        if (existing_conversations.length > 0) {
            _io.to(friend.usr_socket_id).emit('friend_blocked', {
                id: existing_conversations[0]._id,
                blocked: false,
            });
        }

        return user.usr_blocked_people;
    }

    static async removeFriend({ user_id, friend_id }) {
        const friend = await UserModel.findById(friend_id);
        if (!friend) {
            throw new NotFoundError('Friend not found');
        }

        await UserModel.findByIdAndUpdate(user_id, {
            $pull: { usr_friends: friend_id },
        });

        await friend.update({ $pull: { usr_friends: user_id } });

        return { message: 'Friend remove successfully' };
    }

    // static async getExploreUsers(userId, searchQuery = '') {
    //     const user = await UserModel.findById(userId).lean();
    //     if (!user) {
    //         throw new NotFoundError('User not found');
    //     }

    //     const allUsers = await UserModel.find({
    //         usr_enabled: true,
    //         $or: [{ usr_name: new RegExp(searchQuery, 'i') }, { usr_email: new RegExp(searchQuery, 'i') }],
    //     }).select('_id usr_name usr_email usr_avatar');

    //     const remainingUsers = allUsers.filter(
    //         (u) => u._id.toString() !== user._id.toString() && !user.usr_friends.includes(u._id),
    //     );

    //     return remainingUsers;
    // }

    static async getExploreUsers(userId, searchQuery = '') {
        const user = await UserModel.findById(userId).lean();
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const allUsers = await UserModel.find({
            usr_enabled: true,
            $or: [
                { usr_name: new RegExp(escapeRegExp(searchQuery), 'i') },
                { usr_email: new RegExp(escapeRegExp(searchQuery), 'i') },
            ],
        }).select('_id usr_name usr_email usr_pending_friends usr_avatar');

        const userFriendIds = user.usr_friends.map((friend) => friend.toString());
        const userPendingFriendIds = user.usr_pending_friends.map((friend) => friend.toString());
        const userRequestedFriendIds = user.usr_requested_list.map((friend) => friend.toString());

        const remainingUsers = allUsers.filter(
            (u) =>
                u._id.toString() !== user._id.toString() &&
                !userFriendIds.includes(u._id.toString()) &&
                !userRequestedFriendIds.includes(u._id.toString()) &&
                !userPendingFriendIds.includes(u._id.toString()),
        );

        return remainingUsers;
    }

    static async friendsList(userId, searchQuery = '') {
        const user = await UserModel.findById(userId).populate({
            path: 'usr_friends',
            match: {
                $or: [
                    { usr_name: new RegExp(escapeRegExp(searchQuery), 'i') },
                    { usr_email: new RegExp(escapeRegExp(searchQuery), 'i') },
                ],
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user.usr_friends;
    }

    static async pendingFriendRequests(userId, searchQuery = '') {
        const user = await UserModel.findById(userId).populate({
            path: 'usr_pending_friends',
            match: {
                $or: [
                    { usr_name: new RegExp(escapeRegExp(searchQuery), 'i') },
                    { usr_email: new RegExp(escapeRegExp(searchQuery), 'i') },
                ],
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user.usr_pending_friends;
    }

    static async sentFriendRequests(userId, searchQuery = '') {
        const user = await UserModel.findById(userId).populate({
            path: 'usr_requested_list',
            match: {
                $or: [
                    { usr_name: new RegExp(escapeRegExp(searchQuery), 'i') },
                    { usr_email: new RegExp(escapeRegExp(searchQuery), 'i') },
                ],
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user.usr_requested_list;
    }

    static async updateProfileUser(userId, updatedUserData) {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                usr_name: updatedUserData.fullName,
                // usr_password: updatedUserData.usr_password,
                usr_bio: updatedUserData.about,
                usr_avatar: updatedUserData.avatar,
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
        const users = await UserModel.find({ usr_role: 'user' });
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
            await user.save();
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

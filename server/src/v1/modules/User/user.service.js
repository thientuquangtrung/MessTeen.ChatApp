const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
} = require("../../core/error.response");
const UserModel = require("../User/user.model");

class UserService {
    static async sendFriendRequest({ user_id, friend_id }) {
        const user = await UserModel.findById(user_id);
        const friend = await UserModel.findById(friend_id);

        if (!user || !friend) {
            throw new NotFoundError("User not found");
        }

        if (
            user.usr_pending_friends.includes(friend_id) ||
            user.usr_friends.includes(friend_id)
        ) {
            throw new BadRequestError("Already friends or request pending");
        }

        user.usr_pending_friends.push(friend_id);
        await user.save();

        return { message: "Friend request send" };
    }

    static async acceptFriendRequest({ user_id, friend_id }) {
        const user = await UserModel.findByIdAndUpdate(
            user_id,
            {
                $pull: { usr_pending_friends: friend_id },
                $addToSet: { usr_friends: friend_id },
            },
            { new: true }
        );
        const friend = await UserModel.findByIdAndUpdate(
            friend_id,
            {
                $addToSet: { usr_friends: user_id },
            },
            { new: true }
        );

        if (!user || !friend) {
            throw new NotFoundError("Friend not found");
        }

        return { message: "Friend request accepted" };
    }

    static async rejectFriend({ user_id, friend_id }) {
        const user = await UserModel.findByIdAndUpdate(
            user_id,
            {
                $pull: { usr_pending_friends: friend_id },
            },
            { new: true }
        );

        if (!user) {
            throw new NotFoundError("Friend not found");
        }

        return { message: "Friend request rejected" };
    }

    static async blockFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError("Friend not found");
        }

        await UserModel.findByIdAndUpdate(usr_id_1, {
            $addToSet: { usr_blocked_people: usr_id_2 },
        });

        return { message: "Friend blocked successfully" };
    }

    static async unBlockFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError("Friend not found");
        }

        await UserModel.findByIdAndUpdate(usr_id_1, {
            $pull: { usr_blocked_people: usr_id_2 },
        });

        return { message: "Friend unblocked successfully" };
    }

    static async removeFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError("Friend not found");
        }

        await UserModel.findByIdAndUpdate(usr_id_1, {
            $pull: { usr_friends: usr_id_2 },
        });

        await friend.update({ $pull: { usr_friends: usr_id_1 } });

        return { message: "Friend remove successfully" };
    }

    static async friendsList(userId) {
        const user = await UserModel.findById(userId).populate("usr_friends");

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user.usr_friends;
    }

    static async pendingFriendRequests(userId) {
        const user = await UserModel.findById(userId).populate(
            "usr_pending_friends"
        );

        if (!user) {
            throw new NotFoundError("User not found");
        }

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
            { new: true }
        );

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }
}

module.exports = UserService;

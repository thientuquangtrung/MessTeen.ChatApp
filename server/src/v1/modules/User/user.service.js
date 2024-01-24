const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
} = require("../../core/error.response");
const UserModel = require("../User/user.model");

class UserService {
    static async addFriends({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError("Friend not found");
        }

        await friend.update({ $addToSet: { usr_pending_friends: usr_id_1 } });

        return { message: "Friend added successfully" };
    }

    static async acceptFriend({ usr_id_1, usr_id_2 }) {
        const friend = await UserModel.findById(usr_id_2);
        if (!friend) {
            throw new NotFoundError("Friend not found");
        }

        await friend.update({ $addToSet: { usr_friends: usr_id_1 } });

        await UserModel.findByIdAndUpdate(usr_id_1, {
            $addToSet: { usr_friends: usr_id_2 },
            $pull: { usr_pending_friends: usr_id_2 },
        });

        return { message: "Friend added successfully" };
    }

    static async blockFriend({ usr_id_1, usr_id_2 }) {
        try {
            const friend = await UserModel.findById(usr_id_2);
            if (!friend) {
                throw new NotFoundError("Friend not found");
            }

            await UserModel.findByIdAndUpdate(usr_id_1, {
                $addToSet: { usr_blocked_people: usr_id_2 },
            });

            return { message: "Friend blocked successfully" };
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    static async unBlockFriend({ usr_id_1, usr_id_2 }) {
        try {
            const friend = await UserModel.findById(usr_id_2);
            if (!friend) {
                throw new NotFoundError("Friend not found");
            }

            await UserModel.findByIdAndUpdate(usr_id_1, {
                $pull: { usr_blocked_people: usr_id_2 },
            });

            return { message: "Friend unblocked successfully" };
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    static async removeFriend({ usr_id_1, usr_id_2 }) {
        try {
            const friend = await UserModel.findById(usr_id_2);
            if (!friend) {
                throw new NotFoundError("Friend not found");
            }

            await UserModel.findByIdAndUpdate(usr_id_1, {
                $pull: { usr_friends: usr_id_2 },
            });

            await friend.update({ $pull: { usr_friends: usr_id_1 } });

            return { message: "Friend remove successfully" };
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }
}

module.exports = UserService;
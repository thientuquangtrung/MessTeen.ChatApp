const userModel = require("../User/user.model");

class UserRepository {
    async findUserByEmail(
        user_email,
        select = {
            user_email: 1,
            user_password: 1,
            user_name: 1,
        },
    ) {
        return await userModel.findOne({ user_email }).select(select).lean();
    }
}

module.exports = UserRepository;

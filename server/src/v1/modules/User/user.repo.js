const userModel = require('../User/user.model');

class UserRepository {
    async findUserByEmail(
        usr_email,
        select = {
            usr_email: 1,
            usr_password: 1,
            usr_name: 1,
            usr_bio: 1,
            usr_avatar: 1,
        },
    ) {
        return await userModel.findOne({ usr_email }).select(select).lean();
    }
}

module.exports = UserRepository;

const UserStatistic = require('../User/userStatistic.model');
const { BadRequestError, NotFoundError } = require('../../core/error.response');
const userModel = require('../User/user.model');

class UserStatisticService {
    static async getUserStatisticByDate(receivedDate) {
        const date = new Date(receivedDate);
        if (isNaN(date.getTime())) {
            throw new BadRequestError('Invalid date format');
        }
        const userStatistic = await UserStatistic.findOne({ received_date: date });
        if (!userStatistic) {
            throw new NotFoundError('UserStatistic not found');
        }
        return userStatistic;
    }
    static async getAllUserStatistics() {
        // Step 1: Retrieve all users except admins
        const users = await userModel.find({ usr_role: 'user' });

        // Step 2: Filter out online users and count them
        const onlineUsersCount = users.filter((user) => user.usr_status !== 'OFFLINE').length;

        // Step 3: Count new signups for the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const newSignupUsersCount = await userModel.countDocuments({
            usr_role: 'user',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });

        return { onlineUsersCount, newSignupUsersCount, totalUsersCount: users.length };
    }
}

module.exports = UserStatisticService;

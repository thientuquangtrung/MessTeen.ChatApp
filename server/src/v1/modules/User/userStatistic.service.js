const UserStatistic = require('../User/userStatistic.model');

class UserStatisticService {
    static async getUserStatisticByDate(receivedDate) {
        try {
            const userStatistic = await UserStatistic.findOne({ received_date: receivedDate });
            return userStatistic;
        } catch (error) {
            throw error;
        }
    }
    static async getAllUserStatistics() {
        try {
            const userStatistics = await UserStatistic.find();
            return userStatistics;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserStatisticService;

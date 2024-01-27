const UserStatistic = require('../User/userStatistic.model');
const { BadRequestError, NotFoundError } = require("../../core/error.response");

class UserStatisticService {
    static async getUserStatisticByDate(receivedDate) {
        try {
            const date = new Date(receivedDate);
            if (isNaN(date.getTime())) {
                throw new BadRequestError('Invalid date format');
            }

            const userStatistic = await UserStatistic.findOne({ received_date: date });
            if (!userStatistic) {
                throw new NotFoundError('UserStatistic not found');
            }

            return userStatistic;
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }
    static async getAllUserStatistics() {
        try {
            const userStatistics = await UserStatistic.find();
            return userStatistics;
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

}

module.exports = UserStatisticService;

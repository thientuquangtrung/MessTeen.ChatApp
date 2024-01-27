const { OK } = require("../../core/success.response");
const UserStatisticService = require('../User/userStatistic.service');

class UserStatisticController {
    async getUserStatisticByDate(req, res) {
        const { receivedDate } = req.params;
        const userStatistic = await UserStatisticService.getUserStatisticByDate(receivedDate);
        new OK({
            message: 'UserStatistic fetched successfully',
            metadata: userStatistic,
        }).send(res);

    }

    async getAllUserStatistics(req, res) {
        const userStatistics = await UserStatisticService.getAllUserStatistics();
        new OK({
            message: 'Get all user statistics successfully!',
            metadata: userStatistics,
        }).send(res);
    }
}

module.exports = new UserStatisticController();

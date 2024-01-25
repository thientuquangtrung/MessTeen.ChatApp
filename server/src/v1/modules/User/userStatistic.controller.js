const UserStatisticService = require('../User/userStatistic.service');

class UserStatisticController {
    async getUserStatisticByDate(req, res) {
        try {
            const { received_date } = req.params;

            const date = new Date(received_date);
            if (isNaN(date.getTime())) {
                return res.status(400).json({ error: 'Invalid date format' });
            }

            const userStatistic = await UserStatisticService.getUserStatisticByDate(date);

            if (!userStatistic) {
                return res.status(404).json({ error: 'UserStatistic not found' });
            }

            return res.status(200).json({
                message: 'UserStatistic fetched successfully',
                metadata: userStatistic,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllUserStatistics(req, res) {
        try {
            const userStatistics = await UserStatisticService.getAllUserStatistics();

            return res.status(200).json({
                message: 'Get all user statistics successfully!',
                metadata: userStatistics,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserStatisticController();

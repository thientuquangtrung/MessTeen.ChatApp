const CallStatistic = require('../Call/callStatistic.model');
const { BadRequestError, NotFoundError } = require("../../core/error.response");

class CallStatisticService {
    static async getCallStatisticByDate(receivedDate) {
        const date = new Date(receivedDate);

        if (isNaN(date.getTime())) {
            throw new BadRequestError('Invalid date format');
        }
        const callStatistic = await CallStatistic.findOne({ received_date: date });
        if (!callStatistic) {
            throw new NotFoundError('CallStatistic not found');
        }
        return callStatistic;
    }
    static async getAllCallStatistics() {
        const callStatistics = await CallStatistic.find();
        return callStatistics;

    }

}

module.exports = CallStatisticService;

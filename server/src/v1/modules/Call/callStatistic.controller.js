const { OK } = require("../../core/success.response");
const CallStatisticService = require('../Call/callStatistic.service');

class CallStatisticController {
    async getCallStatisticByDate(req, res) {
        const { receivedDate } = req.params;
        const callStatistic = await CallStatisticService.getCallStatisticByDate(receivedDate);
        new OK({
            message: 'CallStatistic fetched successfully',
            metadata: callStatistic,
        }).send(res);

    }

    async getAllCallStatistics(req, res) {
        const callStatistics = await CallStatisticService.getAllCallStatistics();
        new OK({
            message: 'Get all call statistics successfully!',
            metadata: callStatistics,
        }).send(res);
    }
}

module.exports = new CallStatisticController();

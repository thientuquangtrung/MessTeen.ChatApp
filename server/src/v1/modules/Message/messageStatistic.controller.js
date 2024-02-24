const { OK } = require('../../core/success.response');
const MessageStatisticService = require('./messageStatistic.service');

class MessageStatisticController {
    async getMessageStatisticByDate(req, res) {
        const { receivedDate } = req.params;
        const messageStatistic = await MessageStatisticService.getMessageStatisticByDate(receivedDate);
        new OK({
            message: 'MessageStatistic fetched successfully',
            metadata: messageStatistic,
        }).send(res);
    }

    async getAllMessageStatistics(req, res) {
        const messageStatistics = await MessageStatisticService.getAllMessageStatistics();
        new OK({
            message: 'Get all message statistics successfully!',
            metadata: messageStatistics,
        }).send(res);
    }
}

module.exports = new MessageStatisticController();

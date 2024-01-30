const MessageStatistic = require('../Message/messageStatistic.model');
const { BadRequestError, NotFoundError } = require("../../core/error.response");

class MessageStatisticService {
    static async getMessageStatisticByDate(receivedDate) {
        const date = new Date(receivedDate);
        console.log('Received Date:', receivedDate);
        console.log('Parsed Date:', date);
        if (isNaN(date.getTime())) {
            throw new BadRequestError('Invalid date format');
        }
        const messageStatistic = await MessageStatistic.findOne({ received_date: date });
        if (!messageStatistic) {
            throw new NotFoundError('MessageStatistic not found');
        }
        return messageStatistic;
    }

    static async getAllMessageStatistics() {
        const messageStatistics = await MessageStatistic.find();
        return messageStatistics;
    }
}

module.exports = MessageStatisticService;

const MessageStatistic = require('../Message/messageStatistic.model');
const { BadRequestError, NotFoundError } = require('../../core/error.response');
const messageModel = require('./message.model');

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
        // Get the first and last days of the last month
        const lastMonthStart = new Date();
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        lastMonthStart.setDate(1);
        lastMonthStart.setHours(0, 0, 0, 0);

        const lastMonthEnd = new Date();
        lastMonthEnd.setDate(0);
        lastMonthEnd.setHours(23, 59, 59, 999);

        // Get the first and last days of this month
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);

        const thisMonthEnd = new Date();
        thisMonthEnd.setHours(23, 59, 59, 999);

        // Aggregate to get the total messages for each day in the last month
        const lastMonthMessages = await messageModel.aggregate([
            {
                $match: {
                    msg_timestamp: {
                        $gte: lastMonthStart,
                        $lte: lastMonthEnd,
                    },
                },
            },
            {
                $group: {
                    _id: { $dayOfMonth: '$msg_timestamp' },
                    totalMessages: { $sum: 1 },
                },
            },
        ]);

        // Aggregate to get the total messages for each day in this month
        const thisMonthMessages = await messageModel.aggregate([
            {
                $match: {
                    msg_timestamp: {
                        $gte: thisMonthStart,
                        $lte: thisMonthEnd,
                    },
                },
            },
            {
                $group: {
                    _id: { $dayOfMonth: '$msg_timestamp' },
                    totalMessages: { $sum: 1 },
                },
            },
        ]);

        // Aggregate to get the count of messages for each type
        const messageCountsByType = await messageModel.aggregate([
            {
                $group: {
                    _id: '$msg_type',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    messageType: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
            {
                $match: {
                    $or: [
                        { messageType: 'TEXT' },
                        { messageType: 'IMAGE' },
                        // { messageType: 'LINK' },
                        // { messageType: 'REPLY' }, // Assuming "REPLY" refers to messages with a msg_parent_id
                    ],
                },
            },
        ]);

        return { lastMonthMessages, thisMonthMessages, messageCountsByType };
    }
}

module.exports = MessageStatisticService;

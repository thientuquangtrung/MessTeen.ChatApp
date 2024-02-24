const mongoose = require('mongoose');
const MeasurementSchema = new mongoose.Schema({
    hours: [
        {
            hour: Number,
            minutes: [
                {
                    minute: Number,
                    callCount: Number,
                },
            ],
        },
    ],
});

const MessageStatisticSchema = new mongoose.Schema(
    {
        received_date: {
            type: Date,
            required: true,
        },

        measurement: [MeasurementSchema],
        total_msg: {
            type: Number,
            required: true,
        },
        peek_time: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: 'MessageStatistics',
    },
);

module.exports = mongoose.model('MessageStatistic', MessageStatisticSchema);

const mongoose = require('mongoose');

const CallStatisticSchema = new mongoose.Schema({
    received_date: {
        type: Date,
        required: true,
    },
    total_calls: {
        type: Number,
        required: true,
    },
    average_duration: {
        type: Number,
        required: true,
    },
    video_calls: {
        type: Number,
        required: true,
    },

},
    {
        timestamps: true,
        collection: "CallStatistics",
    }
);

module.exports = mongoose.model('CallStatistic', CallStatisticSchema);



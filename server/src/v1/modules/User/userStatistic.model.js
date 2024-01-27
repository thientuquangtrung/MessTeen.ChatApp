const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserStatisticSchema = new Schema(
    {
        received_date: {
            type: Date,
            required: true,
        },
        active_user: {
            type: Number,
            required: true,
        },
        inactive_user: {
            type: Number,
            required: true,
        },
        new_user: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "UserStatistics",
    }
);

module.exports = mongoose.model("UserStatistic", UserStatisticSchema);

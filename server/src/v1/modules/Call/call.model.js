const mongoose = require('mongoose');

const callSchema = new mongoose.Schema(
    {
        call_participants: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        call_from: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        call_to: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        call_verdict: {
            type: String,
            enum: ['Accepted', 'Denied', 'Missed', 'Busy'],
        },
        call_status: {
            type: String,
            enum: ['Ongoing', 'Ended'],
        },
        call_startedAt: {
            type: Date,
            default: Date.now,
        },
        call_endedAt: {
            type: Date,
        },
        call_type: {
            type: String,
            enum: ['AUDIO', 'VIDEO'],
        },
    },
    {
        collection: 'Calls',
    },
);

module.exports = new mongoose.model('Call', callSchema);

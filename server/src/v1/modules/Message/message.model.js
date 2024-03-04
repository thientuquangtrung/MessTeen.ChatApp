const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        msg_room_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        msg_sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User',
        },
        msg_content: {
            type: 'String',
            default: '',
            require: true,
        },
        msg_media_url: {
            type: 'String',
        },
        msg_timestamp: {
            type: Date,
            default: Date.now,
            // require: true,
        },
        msg_read_by: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        msg_status: {
            type: 'String',
            enum: ['READ', 'SENT', 'DELIVERED', 'FAILED'],
            default: 'SENT',
        },
        msg_parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        msg_type: {
            type: String,
            enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'LINK', 'OTHER'],
            default: 'TEXT',
        },
        msg_reactions: {
            type: [
                {
                    usr_react: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    reaction: String,
                },
            ],
        },
    },
    {
        collection: 'Messages',
    },
);
module.exports = mongoose.model('Message', MessageSchema);

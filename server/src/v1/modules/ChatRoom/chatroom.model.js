const mongoose = require('mongoose');

const ChatroomSchema = new mongoose.Schema(
    {
        room_participant_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
        room_last_msg: {
            sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            content: String,
            timestamp: { type: Date, default: Date.now },
        },
        room_type: {
            type: String,
            enum: ['PRIVATE', 'GROUP', 'OTHER'],
            default: 'PRIVATE',
        },
        room_title: { type: String },
        room_avatar: String,
        room_owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
        },
        room_pending_members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        room_settings: {
            edit_info_permission: {
                type: String,
                enum: ['ONLY_ADMIN', 'ALL_MEMBERS'],
                default: 'ALL_MEMBERS',
            },
            send_msg_permission: {
                type: String,
                enum: ['ONLY_ADMIN', 'ALL_MEMBERS'],
                default: 'ALL_MEMBERS',
            },
            can_add_or_remove_member: { type: Boolean, default: true },
            //This setting is false by default, which means new members are automatically approved unless an admin turns this feature on.
            approve_new_members: { type: Boolean, default: false },
        },
        room_enabled: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        collection: 'Chatrooms',
    },
);

module.exports = mongoose.model('Chatroom', ChatroomSchema);

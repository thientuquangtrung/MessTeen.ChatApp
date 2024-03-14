const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        usr_name: {
            type: 'String',
            required: true,
            // unique: true,
            trim: true,
        },
        usr_password: {
            type: 'String',
            // required: true,
            // minlength: 8,
        },
        usr_email: {
            type: 'String',
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        usr_pending_friends: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        usr_requested_list: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        usr_provider_type: {
            type: 'String',
            enum: ['facebook', 'google'],
        },
        usr_provider_id: {
            type: 'String',
        },
        usr_bio: {
            type: 'String',
        },
        usr_avatar: {
            type: 'String',
        },
        usr_status: {
            type: 'String',
            enum: ['ONLINE', 'OFFLINE', 'IN_CALL'],
            default: 'ONLINE',
        },
        usr_last_active: {
            type: 'Date',
        },
        usr_room_ids: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'ChatRooms',
        },
        usr_friends: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        usr_blocked_people: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        usr_enabled: {
            type: 'Boolean',
            required: true,
            default: true,
        },
        usr_role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        usr_socket_id: {
            type: 'String',
        },
    },
    {
        timestamps: true,
        collection: 'Users',
    },
);

module.exports = mongoose.model('User', UserSchema);

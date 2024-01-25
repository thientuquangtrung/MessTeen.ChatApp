const mongoose = require('mongoose');

const ChatroomSchema = new mongoose.Schema({
  room_participant_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  room_last_msg: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  room_type: {
    type: String,
    enum: ['Private', 'Group', 'Other'],
    default: 'Group'
  },
  room_title: { type: String, required: true },
  room_avatar: String,
  room_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room_admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  room_pending_members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  room_settings: {
    edit_info_permission: {
      type: String,
      enum: ['Owner', 'Admin', 'Member'],
      default: 'Owner'
    },
    send_msg_permission: {
      type: String,
      enum: ['Owner', 'Admin', 'Member'],
      default: 'Member'
    },
    can_add_or_remove_member: { type: Boolean, default: true },
    //This setting is false by default, which means new members are automatically approved unless an admin turns this feature on.
    approve_new_members: { type: Boolean, default: false } 
  },
  room_enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chatroom', ChatroomSchema);

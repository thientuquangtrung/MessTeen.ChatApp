const mongoose =require("mongoose");

const MessageSchema = new mongoose.Schema({
    msg_room_id:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ChatRooms",
    },
    msg_sender_id:{
        type: [mongoose.Schema.Types.ObjectId],
    },
    msg_content:{
        type:"String",
    },
    msg_media_url:{
        type:"String",
    },
    msg_timestamp:{
        type: Date,
        default: Date.now()
    },
    msg_read_by:{
        type: [mongoose.Schema.Types.ObjectId],
    },
    msg_status:{
        type: "String",
        enum: ["active", "inactive"]
    },
    msg_paren_id:{
        type: [mongoose.Schema.Types.ObjectId],
    },
    msg_type:{
        type: String,
        enum: ["text", "image", "video", "audio", "file", "other"],
        default: "text"
    },
    msg_reactions:{
        type: [mongoose.Schema.Types.ObjectId],
    }
})
module.exports = mongoose.model("Message", MessageSchema);

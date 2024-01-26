const mongoose =require("mongoose");

const MessageSchema = new mongoose.Schema({
    msg_room_id:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ChatRooms",
        require:true
    },
    msg_sender_id:{
        type: [mongoose.Schema.Types.ObjectId],
        require:true
    },
    msg_content:{
        type:"String",
        default: "",
        require:true
    },
    msg_media_url:{
        type:"String",
        
    },
    msg_timestamp:{
        type: Date,
        default: Date.now(),
        require:true
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

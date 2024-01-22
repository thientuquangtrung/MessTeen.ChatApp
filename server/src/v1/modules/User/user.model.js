const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_name: {
        type: "String",
        required: true,
        unique: true,
        trim: true,
    },
    user_email: {
        type: "String",
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    user_password: {
        type: "String",
        required: true,
        minlength: 8,
    },
    user_bio: {
        type: "String",
    },
    user_avatar: {
        type: "String",
    },
    // posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
}, {
    timestamps: true,
    collection: "Users",
});

module.exports = mongoose.model("User", UserSchema);

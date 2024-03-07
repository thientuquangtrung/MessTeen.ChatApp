const express = require('express');
const MessageModel = require('./message.model');
const router = express.Router();
const {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
    ForbiddenError,
    InternalError,
    NotFoundError,
} = require('../../core/error.response');
class MessageService {
    static async getAllMessages({ msg_room_id, page = 1, limit = 20 }) {
        const messages = await MessageModel.find({ msg_room_id })
            .sort({ msg_timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('msg_parent_id', 'msg_content _id msg_media_url')
            .populate('msg_sender_id', 'usr_name usr_avatar _id');

        return messages;
    }
    static async sendMessage(messageData) {
        const message = new MessageModel(messageData);
        await message.save();
        return message;
    }
    static async deleteMessage(messageId) {
        const result = await MessageModel.findByIdAndDelete(messageId);
        if (!result) {
            throw new NotFoundError('Message not found.');
        }
        return result;
    }
    static async editMessage(messageId, updatedData) {
        const message = await MessageModel.findById(messageId);
        if (!message) {
            throw new NotFoundError('Message not found.');
        }
        Object.assign(message, updatedData);
        await message.save();

        return message;
    }
    static async searchMessage(msg_room_id, msg_content) {
        const messages = await MessageModel.find({
            msg_room_id,
            msg_content: RegExp(msg_content, 'i'),
        });
        return messages;
    }
    static async reactOnMessage(messageId, msg_reaction) {
        const message = await MessageModel.findById(messageId)
            .populate('msg_parent_id', 'msg_content _id msg_media_url')
            .populate('msg_sender_id', 'usr_name usr_avatar');

        if (!message) {
            throw new NotFoundError('Message not found.');
        }

        const existingReactionIndex = message.msg_reactions.findIndex(
            (reaction) => reaction.usr_react.toString() === msg_reaction.usr_react.toString(),
        );

        if (existingReactionIndex !== -1) {
            if (message.msg_reactions[existingReactionIndex].reaction !== msg_reaction.reaction) {
                message.msg_reactions.push(msg_reaction);
            }
            message.msg_reactions.splice(existingReactionIndex, 1);
        } else {
            // Otherwise, add the new reaction
            message.msg_reactions.push(msg_reaction);
        }
        await message.save();

        return message;
    }
}

module.exports = MessageService;

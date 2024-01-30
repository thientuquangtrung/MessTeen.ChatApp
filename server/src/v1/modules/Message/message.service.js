const express = require("express");
const MessageModel = require("./message.model");
const router = express.Router();
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
  InternalError,
  NotFoundError,
} = require("../../core/error.response");
class MessageService {
  static async getAllMessages(msg_room_id, limit = 20) {
    const messages = await MessageModel.find({ msg_room_id })
      .sort({ createdAt: -1 }) // Sort in descending order based on createdAt timestamp
      .limit(limit);

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
      throw new NotFoundError("Message not found.");
    }
    return result;
  }
  static async editMessage(messageId, updatedData) {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new NotFoundError("Message not found.");
    }
    Object.assign(message, updatedData);
    await message.save();

    return message;
  }
  static async searchMessage(msg_room_id, msg_content) {
    const messages = await MessageModel.find({
        msg_room_id,
        msg_content: RegExp(msg_content, 'i') 
      
    }); 
    return messages; 
}
}

module.exports = MessageService;
  
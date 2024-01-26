const express = require("express");
const MessageModel = require("./message.model");
const router = express.Router();

class MessageService {
  static async sendMessage(messageData) {
    const message = new MessageModel(messageData);
    await message.save();
    return message;
  }
  static async deleteMessage(messageId) {
    try {
      const result = await MessageModel.findByIdAndDelete(messageId);
      if (!result) {
        throw new Error("Message not found.");
      }
      return result;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }
  static async editMessage(messageId, updatedData) {
    try {
      const message = await MessageModel.findById(messageId);
      if (!message) {
        throw new Error("Message not found.");
      }
      Object.assign(message, updatedData);
      await message.save();

      return message;
    } catch (error) {
      throw new Error(`Failed to edit message: ${error.message}`);
    }
  }
  static async getAllMessage() {
    try {
      const messages = await MessageModel.find();

      return messages;
    } catch (error) {
      throw new Error(`Failed to retrieve all messages: ${error.message}`);
    }
  }
}

module.exports = MessageService;

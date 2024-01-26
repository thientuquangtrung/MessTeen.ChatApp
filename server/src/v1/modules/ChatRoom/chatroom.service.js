const Chatroom = require("./chatroom.model");
const {
  ConflictRequestError,
  NotFoundError,
} = require("../../core/error.response");

class ChatroomService {
  async createChatroom(chatroomData) {
    const chatroom = new Chatroom(chatroomData);
    await chatroom.save();
    return chatroom;
  }

  async deleteChatroom(roomId) {
    const result = await Chatroom.findByIdAndDelete(roomId);
    return result;
  }

  // Join chatroom
  async joinChatroom(roomId, userId) {
    const chatroom = await Chatroom.findById(roomId);

    if (!chatroom) {
      throw new NotFoundError("Chatroom not found.");
    }

    const isAdminJoining = chatroom.room_admins.includes(userId);

    if (chatroom.room_participant_ids.includes(userId)) {
      throw new ConflictRequestError("User has already joined the chatroom.");
    }
    // If the setting to approve new members is true and the user is not an admin,
    // add them to the pending list instead of the participant list.
    if (chatroom.room_settings.approve_new_members && !isAdminJoining) {
      chatroom.room_pending_members.push(userId);
      await chatroom.save();
      return { status: "pending", chatroom };
    } else {
      // If approval is not required or the user is an admin, join them to the chatroom.
      chatroom.room_participant_ids.push(userId);
      await chatroom.save();
      return { status: "joined", chatroom };
    }
  }

  async leaveChatroom(roomId, userId) {
    // Find the chatroom by ID
    const chatroom = await Chatroom.findById(roomId);
    // Check if the chatroom exists
    if (!chatroom) {
      throw new NotFoundError("Chatroom not found.");
    }
    // Check if the user is part of the chatroom
    const index = chatroom.room_participant_ids.indexOf(userId);
    if (index === -1) {
      throw new ConflictRequestError("User is not a member of the chatroom.");
    }
    // Remove the user from the chatroom participants
    chatroom.room_participant_ids.splice(index, 1);
    // Save the updated chatroom
    await chatroom.save();
    // Return the updated chatroom
    return chatroom;
  }
}

module.exports = new ChatroomService();

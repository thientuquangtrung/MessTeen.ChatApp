const Chatroom = require("./chatroom.model");
const UserService = require("../User/user.service");

const {
  ConflictRequestError,
  NotFoundError,
} = require("../../core/error.response");

class ChatroomService {
  async listChatrooms() {
    try {
      return await Chatroom.find({}); // Fetch all chatrooms
    } catch (error) {
      // Handle or throw the error
      throw NotFoundError;
    }
  }
  async createChatroom(chatroomData) {
    for (const participantId of chatroomData.room_participant_ids) {
      const userExists = await UserService.getUserById(participantId);
      if (!userExists) {
        // Handle the error appropriately
        throw new NotFoundError(
          `User with ID ${participantId} does not exist.`
        );
      }
    }
    const chatroom = new Chatroom(chatroomData);
    await chatroom.save();
    return chatroom;
  }

  async deleteChatroom(roomId) {
    const result = await Chatroom.findByIdAndDelete(roomId);
    if (!result) {
      throw new NotFoundError("Chatroom not found.");
    }
    return result;
  }

  // Join chatroom
  async joinChatroom(roomId, userId) {
    // First, check if the user exists
    const userExists = await UserService.getUserById(userId);
    if (!userExists) {
      throw new NotFoundError("User not found.");
    }

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

  async addMemberToChatroom(roomId, memberId) {
    const chatroom = await Chatroom.findById(roomId);
    if (!chatroom) {
      throw new NotFoundError("Chatroom not found.");
    }

    // Check if the member is already in the chatroom
    if (chatroom.room_participant_ids.includes(memberId)) {
      throw new ConflictRequestError("Member already exists in the chatroom.");
    }

    chatroom.room_participant_ids.push(memberId);
    await chatroom.save();
    return chatroom;
  }

  async listGroups() {
    const groups = await Chatroom.find({ room_type: 'GROUP' });
    if (!groups) {
        throw new Error("Failed to fetch groups.");
    }
    return groups;
}

}

module.exports = new ChatroomService();

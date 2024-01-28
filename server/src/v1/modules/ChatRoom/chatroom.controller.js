const ChatroomService = require("./chatroom.service");
const { CREATED, OK } = require("../../core/success.response");
const { ConflictRequestError } = require("../../core/error.response");

class ChatroomController {
  create = async (req, res, next) => {
    new CREATED({
      message: "Create chatroom success",
      metadata: await ChatroomService.createChatroom(req.body),
    }).send(res);
    // try {
    //   const chatroom = await ChatroomService.createChatroom(req.body);
    //   res.status(201).json(chatroom);
    // } catch (error) {
    //   res.status(500).json({ message: 'Failed to create chatroom', error });
    // }
  };

  // async delete(req, res) {
  //   try {
  //     const { roomId } = req.params;
  //     const result = await ChatroomService.deleteChatroom(roomId);
  //     if (result) {
  //       res.status(200).json({ message: 'Chatroom deleted successfully' });
  //     } else {
  //       res.status(404).json({ message: 'Chatroom not found' });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: 'Failed to delete chatroom', error });
  //   }
  // }

  delete = async (req, res, next) => {
    const { roomId } = req.params;
    new OK({
      message: "Delete chatroom success",
      metadata: await ChatroomService.deleteChatroom(roomId),
    }).send(res);
  };

  // async join(req, res) {
  //   try {
  //     const { roomId } = req.params;
  //     const { userId } = req.body;
  //     const result = await ChatroomService.joinChatroom(roomId, userId);

  //     // Check the status of the join operation
  //     if (result.status === "pending") {
  //       res
  //         .status(202)
  //         .json({
  //           message: "Join request sent. Waiting for admin approval.",
  //           chatroom: result.chatroom,
  //         });
  //     } else if (result.status === "joined") {
  //       res
  //         .status(200)
  //         .json({
  //           message: "Joined chatroom successfully",
  //           chatroom: result.chatroom,
  //         });
  //     }
  //   } catch (error) {
  //     // Handle specific error messages
  //     if (
  //       error.message === "User has already joined the chatroom." ||
  //       error.message === "User is already waiting for approval."
  //     ) {
  //       res.status(400).json({ message: error.message });
  //     } else if (error.message === "Chatroom not found.") {
  //       res.status(404).json({ message: error.message });
  //     } else {
  //       // Handle generic server errors
  //       res
  //         .status(500)
  //         .json({ message: "Failed to join chatroom", error: error.message });
  //     }
  //   }
  //}

  join = async (req, res, next) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    const result = await ChatroomService.joinChatroom(roomId, userId);
    new OK({
      message: "Join chatroom success",
      metadata: await ChatroomService.joinChatroom(roomId),
      chatroom: result.chatroom,
    }).send(res);
  };

  // async leave(req, res) {
  //   try {
  //     const { roomId } = req.params; // Extract roomId from URL parameters
  //     const { userId } = req.body; // Extract userId from request body
  //     await ChatroomService.leaveChatroom(roomId, userId);
  //     res.status(200).json({ message: "Left chatroom successfully" });
  //   } catch (error) {
  //     // Handle errors appropriately
  //     res
  //       .status(500)
  //       .json({ message: "Failed to leave chatroom", error: error.message });
  //   }
  // }

  leave = async (req, res, next) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    const result = await ChatroomService.leaveChatroom(roomId, userId);
    new OK({
      message: "Leave chatroom success",
      metadata: await ChatroomService.leaveChatroom(roomId),
      chatroom: result.chatroom,
    }).send(res);
  };

  // list = async (req, res, next) => {
  //   try {
  //     const chatrooms = await ChatroomService.listChatrooms();
  //     res.json(chatrooms);
  //   } catch (error) {
  //     next(error); // Handle errors appropriately
  //   }
  // };

  list = async (req, res, next) => {
    const results = await ChatroomService.listChatrooms();
    new OK({
      message: "List of all chatrooms",
      metadata: await ChatroomService.listChatrooms(),
      chatrooms: results.chatrooms,
    }).send(res);
  };

  // addMember = async (req, res, next) => {
  //   try {
  //     const { roomId, memberId } = req.body;
  //     const updatedChatroom = await ChatroomService.addMemberToChatroom(
  //       roomId,
  //       memberId
  //     );
  //     res.status(200).json({
  //       message: "Add member successfully",
  //       chatroom: updatedChatroom,
  //     });
  //   } catch (error) {
  //     //member already exists in the chatroom
  //     if (error instanceof ConflictRequestError) {
  //       res.status(409).json({ message: error.message }); // 409 Conflict
  //     } else {
  //       next(error);
  //     }
  //   }
  // };

  addMember = async (req, res, next) => {
    const { roomId, memberId } = req.body;
    const result = await ChatroomService.addMemberToChatroom(roomId, memberId);
    new OK({
      message: "Add member successfully",
      metadata: await ChatroomService.addMemberToChatroom(roomId),
      chatroom: result.chatroom,
    }).send(res);
  };
}

module.exports = new ChatroomController();

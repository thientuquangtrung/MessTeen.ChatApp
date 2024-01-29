const ChatroomService = require("./chatroom.service");
const { CREATED, OK } = require("../../core/success.response");
const { ConflictRequestError } = require("../../core/error.response");

class ChatroomController {
  create = async (req, res, next) => {
    new CREATED({
      message: "Create chatroom success",
      metadata: await ChatroomService.createChatroom(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    const { roomId } = req.params;
    new OK({
      message: "Delete chatroom success",
      metadata: await ChatroomService.deleteChatroom(roomId),
    }).send(res);
  };

  join = async (req, res, next) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    // chỗ này Mai gọi hàm này 2 lần nè
    new OK({
      message: "Join chatroom success",
      metadata: await ChatroomService.joinChatroom(roomId, userId),
    }).send(res);
  };

  leave = async (req, res, next) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    // tí chỉnh chỗ này luôn nha
    // const result = await ChatroomService.leaveChatroom(roomId, userId);
    new OK({
      message: "Leave chatroom success",
      metadata: await ChatroomService.leaveChatroom(roomId, userId),
      // chatroom: result.chatroom,
    }).send(res);
  };

  list = async (req, res, next) => {
    // đây cũng vậy
    // const results = await ChatroomService.listChatrooms();
    new OK({
      message: "List of all chatrooms",
      metadata: await ChatroomService.listChatrooms(),
      // chatrooms: results.chatrooms,
    }).send(res);
  };

  addMember = async (req, res, next) => {
    const { roomId, memberId } = req.body;
    // này lun
    // const result = await ChatroomService.addMemberToChatroom(roomId, memberId);
    new OK({
      message: "Add member successfully",
      metadata: await ChatroomService.addMemberToChatroom(roomId, memberId),
      // chatroom: result.chatroom,
    }).send(res);
  };
}

module.exports = new ChatroomController();

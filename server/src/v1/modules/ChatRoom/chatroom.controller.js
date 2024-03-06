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
    new OK({
      message: "Join chatroom success",
      metadata: await ChatroomService.joinChatroom(roomId, userId),
    }).send(res);
  };

  leave = async (req, res, next) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    new OK({
      message: "Leave chatroom success",
      metadata: await ChatroomService.leaveChatroom(roomId, userId),
    }).send(res);
  };

  list = async (req, res, next) => {
    new OK({
      message: "List of all chatrooms",
      metadata: await ChatroomService.listChatrooms(),
    }).send(res);
  };

  addMember = async (req, res, next) => {
    const { roomId, memberId } = req.body;
    new OK({
      message: "Add member successfully",
      metadata: await ChatroomService.addMemberToChatroom(roomId, memberId),
    }).send(res);
  };
  

  listGroups = async (req, res, next) => {
    new OK({
      message: "List of all groups",
      metadata: await ChatroomService.listGroups(),
    }).send(res);
  };
}

module.exports = new ChatroomController();

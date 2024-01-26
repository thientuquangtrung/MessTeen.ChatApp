const MessageService = require("./message.service");
const { CREATED, OK } = require("../../core/success.response");

class MessageController {
  send = async (req, res, next) => {
    new CREATED({
      message: "Send message success",
      metadata: await MessageService.sendMessage(req.body),
    }).send(res);
  };
  delete = async (req, res, next) => {
    const messageId = req.params.id;
    const metadata = await MessageService.deleteMessage(messageId);
    new OK({
      message: "Delete message success",
      metadata,
    }).send(res);
  };
  edit = async (req, res, next) => {
    const messageId = req.params.id;
    new OK({
      message: "Edit message success",
      metadata: await MessageService.editMessage(messageId, req.body),
    }).send(res);
  };
  getAllMessage = async (req, res, next) => {
    new OK({
      message: "Get all message success",
      metadata: await MessageService.getAllMessage(req.body),
    }).send(res);
  };
}
module.exports = new MessageController();

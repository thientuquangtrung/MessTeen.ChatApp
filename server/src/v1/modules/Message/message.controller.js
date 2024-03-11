const MessageService = require('./message.service');
const { CREATED, OK } = require('../../core/success.response');
const Chatroom = require('./../ChatRoom/chatroom.model');
const { BadRequestError, NotFoundError } = require('../../core/error.response');
class MessageController {
    send = async (req, res, next) => {
        new CREATED({
            message: 'Send message success',
            metadata: await MessageService.sendMessage(req.body),
        }).send(res);
    };
    delete = async (req, res, next) => {
        const messageId = req.params.id;
        const metadata = await MessageService.deleteMessage(messageId);
        new OK({
            message: 'Delete message success',
            metadata,
        }).send(res);
    };
    edit = async (req, res, next) => {
        const messageId = req.params.id;
        new OK({
            message: 'Edit message success',
            metadata: await MessageService.editMessage(messageId, req.body),
        }).send(res);
    };
    search = async (req, res, next) => {
        const msg_room_id = req.params.chatroomId;
        const msg_content = req.body.msg_content;
        const chatroom = await Chatroom.findOne({ _id: msg_room_id });

        if (!chatroom) {
            throw new NotFoundError('Chatroom not found.');
        } else if (!msg_content) {
            return new BadRequestError({
                message: 'Empty search content. Please provide a search term.',
            }).send(res);
        }

        const messages = await MessageService.searchMessage(msg_room_id, msg_content);

        new OK({
            message: 'Search message success',
            metadata: messages,
        }).send(res);
    };
    getAllMessage = async (req, res, next) => {
        const msg_room_id = req.params.chatroomId.toString();
        const messages = await MessageService.getAllMessages({ msg_room_id, page: req.query.page });
        new OK({
            message: 'Get all messages success',
            metadata: messages,
        }).send(res);
    };
    react = async (req, res, next) => {
        const messageId = req.params.id;
        new OK({
            message: 'React message success',
            metadata: await MessageService.reactOnMessage(messageId, req.body),
        }).send(res);
    };
}
module.exports = new MessageController();

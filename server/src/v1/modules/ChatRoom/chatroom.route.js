const express = require('express');
const router = express.Router();
const ChatroomController = require('./chatroom.controller');
const asyncHandler = require("../../helpers/async.handler");

router.get('/', asyncHandler(ChatroomController.list));
router.post('/create', asyncHandler(ChatroomController.create));
router.delete('/delete/:roomId', asyncHandler(ChatroomController.delete));
router.post('/join/:roomId', asyncHandler(ChatroomController.join));
router.post('/:roomId/leave', asyncHandler(ChatroomController.leave));
router.post('/member/add', asyncHandler(ChatroomController.addMember));

module.exports = router;

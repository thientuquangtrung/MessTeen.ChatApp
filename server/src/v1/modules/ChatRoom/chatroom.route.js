const express = require('express');
const router = express.Router();
const ChatroomController = require('./chatroom.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticate } = require('../Auth/auth.utils');

// authentication middleware //
router.use(authenticate);
// ========================

router.get('/', asyncHandler(ChatroomController.list));
router.post('/create', asyncHandler(ChatroomController.create));
router.delete('/delete/:roomId', asyncHandler(ChatroomController.delete));
router.post('/join/:roomId', asyncHandler(ChatroomController.join));
router.post('/leave/:roomId', asyncHandler(ChatroomController.leave));
router.post('/member/add', asyncHandler(ChatroomController.addMember));

module.exports = router;

const express = require('express'); 
const router = express.Router();
const MessageController = require('./message.controller');
const asyncHandler = require("../../helpers/async.handler");

router.post('/send', asyncHandler(MessageController.send));
router.delete('/delete/:id', asyncHandler(MessageController.delete));
router.put('/edit/:id', asyncHandler(MessageController.edit));
router.get('/get-all', asyncHandler( MessageController.getAllMessage));
router.get('/get-all/:chatroomId', asyncHandler( MessageController.getAllMessage));
module.exports = router;

const express = require('express');
const router = express.Router();
const MessageController = require('./message.controller');
const MessageStatisticController = require('./messageStatistic.controller');

const asyncHandler = require('../../helpers/asyncHandler');
const { authenticate, isAdmin } = require('../Auth/auth.utils');

// authentication middleware //
router.use(authenticate);
// ========================

router.post('/send', asyncHandler(MessageController.send));
router.delete('/delete/:id', asyncHandler(MessageController.delete));
router.get('/search/:chatroomId', asyncHandler(MessageController.search));
router.put('/edit/:id', asyncHandler(MessageController.edit));
router.put('/react/:id', asyncHandler(MessageController.react));
router.get('/get-all', asyncHandler(MessageController.getAllMessage));
router.get('/get-all/:chatroomId', asyncHandler(MessageController.getAllMessage));

router.use(isAdmin);

// GET MessageStatistic all and GET  MessageStatistic  by Date
router.get('/statistic/:receivedDate', asyncHandler(MessageStatisticController.getMessageStatisticByDate));
router.get('/statistics', asyncHandler(MessageStatisticController.getAllMessageStatistics));
module.exports = router;

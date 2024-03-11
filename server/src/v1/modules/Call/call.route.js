// mainRouter.js
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticate } = require('../Auth/auth.utils');
const callController = require('./call.controller');
const callStatisticController = require('./callStatistic.controller');
// const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

// authentication middleware //
router.use(authenticate);
// ========================

// GET CallStatistic all and GET  CallStatistic  by Date
router.get('/statistic/:receivedDate', asyncHandler(callStatisticController.getCallStatisticByDate));
router.get('/statistics', asyncHandler(callStatisticController.getAllCallStatistics));

// router.post('/start-audio-call', asyncHandler(callController.startAudioCall));
router.post('/start-video-call', asyncHandler(callController.startVideoCall));
router.get('/get-call-logs/:userId', asyncHandler(callController.getCallLogs));
module.exports = router;

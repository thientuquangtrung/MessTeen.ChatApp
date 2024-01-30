// mainRouter.js
const express = require("express");
const asyncHandler = require("../../helpers/async.handler");
const callStatisticController = require("./callStatistic.controller");
// const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

// GET CallStatistic all and GET  CallStatistic  by Date 
router.get('/statistic/:receivedDate', asyncHandler(callStatisticController.getCallStatisticByDate));
router.get('/statistics', asyncHandler(callStatisticController.getAllCallStatistics));
module.exports = router;

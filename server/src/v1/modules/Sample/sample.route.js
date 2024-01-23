const express = require("express");
const asyncHandler = require("../../helpers/async.handler");
const sampleController = require("./sample.controller");
const router = express.Router();

router.post("/sample-post", asyncHandler(sampleController.sampleFunction));

module.exports = router;

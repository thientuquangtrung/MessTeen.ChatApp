const express = require("express");
const asyncHandler = require("../../helpers/async.handler");
const userController = require("./user.controller");
const router = express.Router();

//addFriends
router.post("/add-friend", asyncHandler(userController.addFriends));
router.post("/accept-friend-request", asyncHandler(userController.acceptFriend));
router.post("/block-friend", asyncHandler(userController.blockFriend));
router.post("/unblock-friend", asyncHandler(userController.unBlockFriend));
router.delete("/remove-friend", asyncHandler(userController.removeFriend));

module.exports = router;

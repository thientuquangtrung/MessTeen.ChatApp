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
// CRUD User
router.post('/admin', asyncHandler(userController.createUser));
router.get('/admin', asyncHandler(userController.getAllUsers));
router.get('/admin/:userId', asyncHandler(userController.getUserById));
router.put('/admin/:userId', asyncHandler(userController.updateUserById));
router.delete('/admin/:userId', asyncHandler(userController.deleteUserById));

module.exports = router;








const express = require("express");
const asyncHandler = require("../../helpers/async.handler");
const userController = require("./user.controller");
const router = express.Router();

//addFriends
router.post(
    "/send-friend-request",
    asyncHandler(userController.sendFriendRequest)
);
router.post(
    "/accept-friend-request",
    asyncHandler(userController.acceptFriendRequest)
);
router.post("/reject-friend", asyncHandler(userController.rejectFriend));
router.post("/block-friend", asyncHandler(userController.blockFriend));
router.post("/unblock-friend", asyncHandler(userController.unBlockFriend));
router.delete("/remove-friend", asyncHandler(userController.removeFriend));
router.get("/friends-list/:userId", asyncHandler(userController.friendsList));
router.get("/pending-friend-requests/:userId", asyncHandler(userController.pendingFriendRequests));
router.put("/update-profile-user/:userId", asyncHandler(userController.updateProfileUser));


module.exports = router;

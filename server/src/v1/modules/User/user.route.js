// mainRouter.js
const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticate, isAdmin } = require('../Auth/auth.utils');
const userController = require('./user.controller');
const userStatisticController = require('./userStatistic.controller');
// const isAdmin = require("../../middlewares/isAdmin");

const router = express.Router();

// authentication middleware //
router.use(authenticate);
// ========================

//addFriends
router.post('/send-friend-request', asyncHandler(userController.sendFriendRequest));
router.post('/accept-friend-request', asyncHandler(userController.acceptFriendRequest));
router.post('/reject-friend', asyncHandler(userController.rejectFriend));
router.post('/block-friend', asyncHandler(userController.blockFriend));
router.post('/unblock-friend', asyncHandler(userController.unBlockFriend));
router.delete('/remove-friend', asyncHandler(userController.removeFriend));
router.get('/explore-users/:userId', asyncHandler(userController.getExploreUsers));
router.get('/friends-list/:userId', asyncHandler(userController.friendsList));
router.get('/pending-friend-requests/:userId', asyncHandler(userController.pendingFriendRequests));
router.get('/sent-friend-requests/:userId', asyncHandler(userController.sentFriendRequests));
router.put('/update-profile-user/:userId', asyncHandler(userController.updateProfileUser));

router.use(isAdmin);

// CRUD User
router.post('/admin', asyncHandler(userController.createUser));
router.get('/admin', asyncHandler(userController.getAllUsers));
router.get('/admin/:userId', asyncHandler(userController.getUserById));
router.put('/admin/:userId', asyncHandler(userController.updateUserById));
router.delete('/admin/:userId', asyncHandler(userController.deleteUserById));

// GET UserStatistic all and GET  UserStatistic  by Date
router.get('/statistic/:receivedDate', asyncHandler(userStatisticController.getUserStatisticByDate));
router.get('/statistics', asyncHandler(userStatisticController.getAllUserStatistics));
module.exports = router;

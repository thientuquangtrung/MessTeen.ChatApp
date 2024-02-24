const express = require("express");
const router = express.Router();

// test app api
router.get("/checkstatus", (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "api ok",
    });
});

router.use("/v1/api/auth", require("./modules/Auth/access.route"));
router.use("/v1/api/users", require("./modules/User/user.route"));
router.use("/v1/api/message", require("./modules/Message/message.route"));
router.use("/v1/api/chatrooms", require("./modules/ChatRoom/chatroom.route"));
router.use("/v1/api/calls", require("./modules/Call/call.route"));


module.exports = router;

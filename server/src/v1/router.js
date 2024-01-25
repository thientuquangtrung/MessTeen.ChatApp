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
router.use("/v1/api/chatroom", require("./modules/ChatRoom/chatroom.route"));

module.exports = router;

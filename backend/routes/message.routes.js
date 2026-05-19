const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
    sendMessage,
    getMessages
} = require("../controllers/message.controller");

// SEND MESSAGE
router.post(
    "/",
    protect,
    sendMessage
);

// GET MESSAGES
router.get(
    "/:conversationId",
    protect,
    getMessages
);

// FUTURE FEATURES
// router.put("/edit/:messageId")
// router.delete("/delete/:messageId")
// router.post("/forward")
// router.post("/react")
// router.post("/upload-media")

module.exports = router;
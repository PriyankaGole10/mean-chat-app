const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
    createOrOpenConversation,
    getUserConversations
} = require("../controllers/conversation.controller");

// CREATE/OPEN CHAT
router.post(
    "/create-conversation",
    protect,
    createOrOpenConversation
);

// GET USER CHATS
router.get(
    "/getUserConversations",
    protect,
    getUserConversations
);

module.exports = router;
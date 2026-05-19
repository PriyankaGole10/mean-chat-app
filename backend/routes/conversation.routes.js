const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
    createOrOpenConversation,
    getUserConversations
} = require("../controllers/conversation.controller");

// CREATE/OPEN CHAT
router.post(
    "/",
    protect,
    createOrOpenConversation
);

// GET USER CHATS
router.get(
    "/",
    protect,
    getUserConversations
);

module.exports = router;
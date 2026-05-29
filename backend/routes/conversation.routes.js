const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
    createOrOpenConversation,
    getUserConversations,createGroup
} = require("../controllers/conversation.controller");

// CREATE/OPEN CHAT
router.post(
    "/create-conversation",
    protect,
    createOrOpenConversation
);

//CREATE GROUP
router.post(
    "/create-group",
    protect,
    createGroup
);

// GET USER CHATS
router.get(
    "/getUserConversations",
    protect,
    getUserConversations
);

module.exports = router;
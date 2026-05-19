const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");

// SEND MESSAGE
async function sendMessage(req, res) {

    try {

        const {
            conversationId,
            text,
            messageType,
            mediaUrl,
            replyTo
        } = req.body;

        // CREATE MESSAGE
        const message = await Message.create({

            sender: req.user._id,
            conversation: conversationId,

            text,

            messageType: messageType || "text",

            mediaUrl: mediaUrl || "",

            replyTo: replyTo || null,

            seenBy: [req.user._id]
        });

        // UPDATE CONVERSATION
        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: message._id,
                lastActivity: new Date()
            }
        );

        // POPULATE
        const populatedMessage = await Message.findById(message._id)
            .populate(
                "sender",
                "username avatar online"
            )
            .populate(
                "replyTo"
            );

        res.status(201).json(populatedMessage);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

// GET MESSAGES
async function getMessages(req, res) {

    try {

        const { conversationId } = req.params;

        const messages = await Message.find({
            conversation: conversationId,
            isDeleted: false
        })
            .populate(
                "sender",
                "username avatar"
            )
            .populate("replyTo")
            .sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    sendMessage,
    getMessages
};
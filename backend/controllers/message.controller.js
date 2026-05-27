const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// SEND MESSAGE
async function sendMessage(req, res) {

    try {

        const {
            conversationId,
            text,
            messageType,
            replyTo
        } = req.body;

        let mediaUrl = "";
        let fileType  = "";
        let fileName  = "";

        //FILE UPLOAD
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            mediaUrl = result.secure_url;
            fileType = req.file.mimetype;
            fileName = req.file.originalname;
        }

        // CREATE MESSAGE
        const message = await Message.create({

            sender: req.user._id,
            conversation: conversationId,

            text,

            messageType: messageType || "text",

            mediaUrl: mediaUrl || "",
            fileType,
            fileName,

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
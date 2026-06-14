const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const axios = require("axios");

// SEND MESSAGE
async function sendMessage(req, res) {

  try {

    const {
      conversationId,
      text,
      messageType,
      replyTo
    } = req.body;

    let mediaUrls = [];

    // FILE UPLOAD
    if (req.files && req.files.length) {

      for (const file of req.files) {

        const result = await uploadToCloudinary(
          file.buffer,
          file.mimetype,
           file.originalname
        );

        mediaUrls.push({

          fileUrl: result.secure_url,

          fileType: file.mimetype,

          fileName: file.originalname, // FIXED

          resourceType: result.resource_type,

          publicId: result.public_id,

          format: result.format,

          bytes: result.bytes

        });

      }
    }

    // CREATE MESSAGE
    const message = await Message.create({

      sender: req.user._id,
      conversation: conversationId,
      text: text || "",
      messageType: messageType || "text",
      mediaUrls,
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
      .populate("sender", "username avatar online")
      .populate("replyTo");

    res.status(201).json(populatedMessage);

  } catch (error) {

  console.error("SEND MESSAGE ERROR:");
  console.error(error);

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
      .populate("sender", "username avatar")
      .populate("replyTo")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
}

async function downloadFile(req, res) {

  try {

    const { messageId, mediaIndex } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    const media =
      message.mediaUrls[Number(mediaIndex)];

    if (!media) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const response = await axios.get(
      media.fileUrl,
      {
        responseType: "stream"
      }
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${media.fileName}"`
    );

    res.setHeader(
      "Content-Type",
      media.fileType
    );

    response.data.pipe(res);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

}

module.exports = {
  sendMessage,
  getMessages,
  downloadFile
};
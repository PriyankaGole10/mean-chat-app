const Conversation = require("../models/conversation.model");

// CREATE OR OPEN PRIVATE CHAT
async function createOrOpenConversation(req, res) {

    try {

        const { receiverId } = req.body;

        let conversation = await Conversation.findOne({
            isGroup: false,

            participants: {
                $all: [
                    {
                        $elemMatch: {
                            user: req.user._id
                        }
                    },
                    {
                        $elemMatch: {
                            user: receiverId
                        }
                    }
                ]
            }
        });

        // CREATE NEW IF NOT EXISTS
        if (!conversation) {

            conversation = await Conversation.create({

                isGroup: false,

                participants: [
                    {
                        user: req.user._id,
                        role: "member"
                    },
                    {
                        user: receiverId,
                        role: "member"
                    }
                ],

                createdBy: req.user._id
            });
        }

        // POPULATE USERS
        conversation = await Conversation.findById(conversation._id)
            .populate(
                "participants.user",
                "username email avatar online"
            );

        res.status(200).json(conversation);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

// GET USER CONVERSATIONS
async function getUserConversations(req, res) {

    try {

        const conversations = await Conversation.find({
            "participants.user": req.user._id
        })
            .populate(
                "participants.user",
                "username email avatar online"
            )
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "username avatar"
                }
            })
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createOrOpenConversation,
    getUserConversations
};
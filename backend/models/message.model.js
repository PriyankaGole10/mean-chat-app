const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        text: {
            type: String,
            default: ""
        },

        messageType: {
            type: String,
            enum: [
                "text",
                "image",
                "video",
                "audio",
                "file"
            ],
            default: "text"
        },

        mediaUrl: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "sent",
                "delivered",
                "seen"
            ],
            default: "sent"
        },

        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

          deliveredTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        },

        forwarded: {
            type: Boolean,
            default: false
        },

        edited: {
            type: Boolean,
            default: false
        },

        editedAt: {
            type: Date,
            default: null
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        reactions: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                emoji: String
            }
        ],

        deletedFor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

// INDEXES
messageSchema.index({ conversation: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
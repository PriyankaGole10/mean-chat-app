const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        isGroup: {
            type: Boolean,
            default: false
        },

        groupName: {
            type: String,
            default: ""
        },

        groupImage: {
            type: String,
            default: ""
        },
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        groupDescription: {
            type: String,
            default: ""
        },

        participants: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                role: {
                    type: String,
                    enum: ["moderator", "member"],
                    default: "member"
                },

                joinedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        muteUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        pinnedMessages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message"
            }
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        messagePermission: {
            type: String,
            enum: [
                "everyone",
                "admins"
            ],
            default: "everyone"
        },
        editInfoPermission: {
            type: String,
            enum: [
                "creator",
                "admins"
            ],
            default: "admins"
        },
        addMemberPermission: {
            type: String,
            enum: [
                "creator",
                "admins"
            ],
            default: "admins"
        },
        inviteCode: {
            type: String,
            default: null
        },
        joinApprovalRequired: {
            type: Boolean,
            default: false
        },

        disappearingMessages: {
            type: Boolean,
            default: false
        },

        disappearingDuration: {
            type: Number,
            default: 24
        },

        lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// INDEXES
conversationSchema.index({ "participants.user": 1 });
conversationSchema.index({ updatedAt: -1 });

module.exports = mongoose.model(
    "Conversation",
    conversationSchema
);
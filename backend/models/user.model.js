const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        avatar: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: "Hey there! I am using Chat App"
        },

        online: {
            type: Boolean,
            default: false
        },

        lastSeen: {
            type: Date,
            default: Date.now
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        refreshToken: {
            type: String,
            default: ""
        },

        deviceTokens: [
            {
                type: String
            }
        ],

        blockedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        privacySettings: {
            lastSeen: {
                type: Boolean,
                default: true
            },

            profilePhoto: {
                type: Boolean,
                default: true
            }
        },

        notificationSettings: {
            messageNotification: {
                type: Boolean,
                default: true
            },

            groupNotification: {
                type: Boolean,
                default: true
            }
        },

        theme: {
            type: String,
            enum: ["light", "dark"],
            default: "dark"
        }
    },
    {
        timestamps: true
    }
);

// INDEXES
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// HASH PASSWORD
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

// COMPARE PASSWORD
userSchema.methods.matchPassword = async function (password) {

    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
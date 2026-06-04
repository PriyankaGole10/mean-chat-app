const { Server } = require("socket.io");
const initializeGroupSocket = require("./group.socket");
const Message = require("../models/message.model");
const jwt = require("jsonwebtoken");
const onlineUsers = new Map();

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });

      // SOCKET AUTH MIDDLEWARE
    io.use(async (socket, next) => {

        try {

            const token =
                socket.handshake.auth.token;

            if (!token) {
                return next(
                    new Error("Unauthorized")
                );
            }

            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            socket.userId =
                decoded.id;

            next();

        } catch (err) {

            next(
                new Error("Unauthorized")
            );

        }

    });

    // GLOBAL SOCKET ACCESS (FOR CONTROLLERS)
    global.io = io;

    io.on("connection", (socket) => {

        //  console.log("User Connected:",socket.id);

        // GROUP EVENTS
        initializeGroupSocket(io, socket);

        // USER ONLINE
        socket.on("user-connected", (userId) => {

            onlineUsers.set(socket.userId, socket.id);

            io.emit(
                "online-users",
                Array.from(onlineUsers.keys())
            );

        });

        // console.log('onlineUsers-2', onlineUsers)

        // JOIN ROOM (VERY IMPORTANT)
        socket.on("join-conversation", (conversationId) => {

            socket.join(conversationId);

            // console.log("JOINED ROOM:", conversationId);

        });


        // TYPING
        socket.on("typing", ({ conversationId, userId }) => {

            socket.to(conversationId).emit("typing", {
                userId,
                conversationId
            });

        });

        socket.on("stop-typing", ({ conversationId, userId }) => {

            socket.to(conversationId).emit("stop-typing", {
                conversationId,
                userId
            });

        });


        socket.on("send-message", (messageData) => {

            const room =
                messageData.conversation?._id ||
                messageData.conversation;

            io.to(room).emit(
                "receive-message",
                messageData
            );

        });


        socket.on("message-delivered", async ({ messageId, conversationId }) => {

            await Message.findByIdAndUpdate(
                messageId,
                {
                    status: "delivered"
                }
            );

            io.to(conversationId).emit("message-delivered", {
                messageId,
                status: "delivered"
            });

        });


        socket.on("leave-conversation", (conversationId) => {

            socket.leave(conversationId);

        });


        socket.on("message-seen", async ({ messageId, conversationId, userId }) => {

            await Message.findByIdAndUpdate(
                messageId,
                {
                    status: "seen",
                    $addToSet: {
                        seenBy: userId
                    }
                }
            );

            io.to(conversationId).emit("message-seen", {
                messageId,
                userId,
                status: "seen"
            });

        });

        socket.on("block-user", async ({ blockerId, blockedId }) => {

            const User = require("../models/user.model");

            await User.findByIdAndUpdate(blockerId, {
                $addToSet: { blockedUsers: blockedId }
            });

            io.emit("user-blocked", {
                blockerId,
                blockedId
            });
        });

        socket.on("unblock-user", async ({ blockerId, blockedId }) => {

            const User = require("../models/user.model");

            await User.findByIdAndUpdate(
                blockerId,
                {
                    $pull: {
                        blockedUsers: blockedId
                    }
                }
            );

            io.emit("user-unblocked", {
                blockerId,
                blockedId
            });

        });

        socket.on("mute-conversation", async ({ userId, conversationId }) => {

            const Conversation = require("../models/conversation.model");

            await Conversation.findByIdAndUpdate(conversationId, {
                $addToSet: { muteUsers: userId }
            });

            io.emit("conversation-muted", {
                userId,
                conversationId
            });
        });

        socket.on("unmute-conversation", async ({ userId, conversationId }) => {

            const Conversation = require("../models/conversation.model");

            await Conversation.findByIdAndUpdate(
                conversationId,
                {
                    $pull: {
                        muteUsers: userId
                    }
                }
            );

            io.emit("conversation-unmuted", {
                userId,
                conversationId
            });

        });

        socket.on("search-messages", async ({ conversationId, query }) => {

            const Message = require("../models/message.model");

            const results = await Message.find({
                conversation: conversationId,
                text: { $regex: query, $options: "i" }
            }).limit(20);

            socket.emit("search-results", {
                conversationId,
                results
            });
        });

        socket.on("request-media", async ({ conversationId }) => {

            const Message = require("../models/message.model");

            const media = await Message.find({
                conversation: conversationId,
                "mediaUrls.0": { $exists: true }
            });

            socket.emit("media-response", {
                conversationId,
                media
            });
        });


        // DISCONNECT
        socket.on("disconnect", () => {

            for (let [userId, socketId] of onlineUsers.entries()) {

                if (socketId === socket.id) {

                    onlineUsers.delete(userId);

                    break;

                }

            }

            io.emit(
                "online-users",
                Array.from(onlineUsers.keys())
            );

        });



    });

};

module.exports = initializeSocket;
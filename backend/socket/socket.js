const { Server } = require("socket.io");
const initializeGroupSocket = require("./group.socket");
const Message = require("../models/message.model");

const onlineUsers = new Map();

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
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

            onlineUsers.set(userId, socket.id);

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

        // console.log('onlineUsers-3', onlineUsers)

    });

};

module.exports = initializeSocket;
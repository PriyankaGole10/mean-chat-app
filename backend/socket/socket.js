const { Server } = require("socket.io");

const onlineUsers = new Map();

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200"
        }
    });

    io.on("connection", (socket) => {

        console.log("Connected:", socket.id);

        // USER ONLINE
        socket.on("user-connected", (userId) => {
            onlineUsers.set(userId, socket.id);

            io.emit("online-users", Array.from(onlineUsers.keys()));
        });

        // JOIN ROOM (VERY IMPORTANT)
        socket.on("joinConversation", (conversationId) => {
            socket.join(conversationId);
        });

        // SEND MESSAGE (CORE LOGIC)
        socket.on("send-message", (data) => {

            const { conversationId } = data;

            // broadcast only to that room
            io.to(conversationId).emit("receive-message", data);
        });

        // TYPING
        socket.on("typing", ({ conversationId, userId }) => {
            socket.to(conversationId).emit("typing", {
                userId,
                conversationId
            });
        });

        socket.on("stop-typing", ({ conversationId }) => {
            socket.to(conversationId).emit("stop-typing", {
                conversationId
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

            io.emit("online-users", Array.from(onlineUsers.keys()));
        });

    });
};

module.exports = initializeSocket;
const { Server } = require("socket.io");

//STORE ONLINE USERS
const onlineUsers = new Map();

//SOCKET INITIALIZATION
const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("NEW SOCKET CONNECTED", socket.id);

        //USER CONNECTED
        socket.on(
            "user-connected",
            async (userId) => {
                onlineUsers.set(
                    userId,
                    socket.id
                );

                io.emit(
                    "online-users",
                    Array.from(
                        onlineUsers.keys()
                    )
                )
            }
        );

        //JOIN CHAT ROOM
        socket.on(
            "send-message",
            (messageData) => {
                io.to(
                    messageData.conversationId
                ).emit(
                    "receive-message",
                    messageData
                )
            }
        );

        //TYPING
        socket.on(
            "typing",
            ({ conversationId, userId }) => {
                socket.to(conversationId).emit(
                    "typing",
                    userId
                );
            }
        );

        //STOP TYPING
        socket.on(
            "stop-typing",
            ({ conversationId, userId }) => {
                socket.to(conversationId).emit(
                    "stop-typing",
                    userId
                );
            }
        );

        //MESSAGE SEEN
        socket.on(
            "message-seen",
            ({ conversationId, messageId }) => {
                socket.to(conversationId).emit(
                    "message-seen",
                    messageId
                );
            }
        );

        // DISCONNECT
        socket.on("disconnect", () => {
            console.log("USER DISCONNECTED", socket.id);

            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }

            io.emit("online-users",
                Array.from(onlineUsers.keys()
                )
            )
        }
        )

    })
}


module.exports = initializeSocket;
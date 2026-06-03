require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const initializeSocket = require("./socket/socket");

// ROUTES
const authRoutes = require("./routes/auth.routes");
const conversationRoutes = require("./routes/conversation.routes");
const messageRoutes = require("./routes/message.routes");
const userRoutes = require("./routes/user.routes");
const groupMemberRoutes =
require("./routes/group-member.routes");
const groupRoleRoutes =
require("./routes/group-role.routes");
const groupSettingsRoutes =
require(
    "./routes/group-settings.routes"
);
const groupInviteRoutes =
require(
    "./routes/group-invite.routes"
);

const app = express();

const server = http.createServer(app);

// DATABASE
connectDB();

// SOCKET
initializeSocket(server);

// MIDDLEWARE
app.use(cors());

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/conversations",conversationRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);
app.use("/api/groups/member",groupMemberRoutes);
app.use("/api/groups/role",groupRoleRoutes);
app.use("/api/groups-settings/",groupSettingsRoutes);
app.use("/api/group-invite",groupInviteRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Backend Running...");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
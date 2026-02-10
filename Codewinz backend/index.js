const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cron = require("node-cron");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const main = require("./src/config/db");
const redisClient = require("./src/config/redis");
const { clearOldChatMessages } = require('./src/utils/fetchChat');

// --- Import Sockets module ---
const { initSockets } = require("./src/sockets");

// --- Import API Routes ---
const userAuth = require("./src/routes/userAuth");
const problemCreator = require("./src/routes/problemCreator");
const submit = require("./src/routes/submit");
const videoRouter = require('./src/routes/videoRouter');
const profileRouter = require("./src/routes/profile");
const aiRouter = require("./src/routes/aiChatting");
const contestRouter = require("./src/routes/contestRouter");
const codeCollaborationRouter = require('./src/routes/codeCollaboration');

const cors = require("cors");

// --- Main Express and Socket.IO setup ---
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));

app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.SOCKET_SERVER_URL, process.env.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
    },
});

// --- Your Existing API Routes ---
app.use("/user", userAuth);
app.use("/problem", problemCreator);
app.use("/submission", submit);
app.use("/video", videoRouter);
app.use("/profile", profileRouter);
app.use("/ai", aiRouter);
app.use("/contest", contestRouter);
app.use("/code", codeCollaborationRouter);

// --- Initialize Socket Handlers ---
initSockets(io);


// --- Initialize Database Connections and Start Server ---
const InitializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        server.listen(process.env.PORT, () => {
            console.log("Express server listening on port " + process.env.PORT);
            console.log("Socket.IO server is also running on the same port.");

            cron.schedule('0 0 * * *', async () => {
                console.log('Running scheduled chat cleanup...');
                try {
                    await clearOldChatMessages(24);
                } catch (error) {
                    console.error('Scheduled chat cleanup failed:', error);
                }
            }, {
                scheduled: true,
                timezone: "Asia/Kolkata"
            });
            console.log("Chat cleanup scheduled to run daily at midnight.");
        });
    } catch (err) {
        console.log("Error during server initialization: " + err);
        process.exit(1);
    }
};

InitializeConnection();
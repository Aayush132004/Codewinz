const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CodeSession = require('../models/codeSession');
const socketAuthMiddleware = require("../middleware/socketAuthMiddleware");

// Import chat utility functions (using the working names from old code)
const { fetchChatMessages, saveChatMessage, clearOldChatMessages } = require('../utils/fetchChat');

// Map to track active users in each namespaces
const onlineUsersMap = new Map(); // Map<userId, { userDetails, Set<socketId> }>
const codeSessionUsers = new Map(); // Map<sessionId, Map<userId, userDetails>>

// Concurrency optimization maps
const dbSaveTimeouts = new Map(); // sessionId -> timeoutId
const latestSessionCode = new Map(); // sessionId -> latestCodeString

function initSockets(io) {
    const cookieParserInstance = cookieParser(process.env.COOKIE_SECRET || 'your_cookie_secret_fallback');

    // --- Main Community Chat Logic (Root Namespace) ---
    const emitOnlineUsers = () => {
        const uniqueOnlineUsers = Array.from(onlineUsersMap.values()).map(userEntry => userEntry.userDetails);
        io.emit('online users', uniqueOnlineUsers);
        io.emit('users count', uniqueOnlineUsers.length);
        console.log(`Currently ${uniqueOnlineUsers.length} unique chat users online.`);
    };

    // Middleware to authenticate users for the main chat namespace
    io.use(socketAuthMiddleware);

    io.on('connection', async (socket) => {
        // This connection handler is for the main chat.
        // `socket.user` is populated by `socketAuthMiddleware`.
        const { id: userId, firstName, imageUrl } = socket.user;

        console.log(`User ${firstName} (${userId}) connected to main chat.`);

        if (!onlineUsersMap.has(userId)) {
            onlineUsersMap.set(userId, { userDetails: { id: userId, firstName, imageUrl }, socketIds: new Set() });
        }
        onlineUsersMap.get(userId).socketIds.add(socket.id);
        emitOnlineUsers();

        // Initial message load
        try {
            const initialMessages = await fetchChatMessages({ limit: 50 });
            socket.emit('load messages', initialMessages);
        } catch (dbError) {
            console.error("Error loading initial chat messages for new user:", dbError);
            socket.emit('chat error', 'Failed to load chat history.');
        }

        // Handle incoming chat messages
        socket.on('chat message', async (msg) => {
            if (typeof msg !== 'string' || msg.trim() === '') {
                console.log('Received empty or invalid message from', firstName);
                return;
            }

            const messageData = {
                user: { id: userId, firstName, imageUrl },
                text: msg.trim(),
                timestamp: new Date().toISOString()
            };

            try {
                const savedMessage = await saveChatMessage(messageData);
                io.emit('chat message', savedMessage);
                console.log(`[${firstName}] sent: "${msg}"`);
            } catch (dbError) {
                console.error("Error saving or broadcasting chat message:", dbError);
                socket.emit('chat error', 'Failed to send message. Please try again.');
            }
        });

        socket.on('disconnect', () => {
            const { id: userId, firstName } = socket.user;

            // Remove the specific socket.id from the user's set of active sockets
            if (onlineUsersMap.has(userId)) {
                onlineUsersMap.get(userId).socketIds.delete(socket.id);
                // If no more active sockets for this user, remove them from the map
                if (onlineUsersMap.get(userId).socketIds.size === 0) {
                    onlineUsersMap.delete(userId);
                }
            }
            console.log(`User ${firstName} disconnected from main chat.`);
            emitOnlineUsers(); // Update online users list for all clients
        });

        socket.on('connect_error', (err) => {
            console.error(`Socket.IO Connection Error for socket ${socket.id}: ${err.message}`);
        });
    });

    // --- Collaborative Coding Namespace (`/code`) ---
    const codeIo = io.of('/code');

    // Middleware for the '/code' namespace
    codeIo.use(async (socket, next) => {
        const sessionId = socket.handshake.query.sessionId || socket.handshake.auth?.sessionId;
        if (!sessionId) {
            return next(new Error("Collaboration error: Session ID missing."));
        }

        try {
            const session = await CodeSession.findOne({ sessionId });
            if (!session) {
                return next(new Error("Collaboration error: Invalid session ID."));
            }
            socket.codeSession = session;

            // Apply cookie-parser here to populate `socket.request.cookies` before using them
            cookieParserInstance(socket.request, {}, async (err) => {
                if (err) {
                    console.warn("Code Collab: Cookie parsing error:", err.message);
                }

                const token = socket.request.cookies?.token; // Use optional chaining for safety
                let authenticatedUser = null;

                if (token) {
                    try {
                        const payload = jwt.verify(token, process.env.JWT_KEY);
                        const user = await User.findById(payload.id);
                        if (user) {
                            authenticatedUser = {
                                id: user._id.toString(),
                                firstName: user.firstName,
                                imageUrl: user.profile?.url || null,
                                isAuthenticated: true
                            };
                            console.log(`Code Collab: Authenticated user ${authenticatedUser.firstName} joined session ${sessionId}`);
                        }
                    } catch (jwtErr) {
                        console.warn("Code Collab: JWT verification failed:", jwtErr.message);
                    }
                }

                if (authenticatedUser) {
                    socket.user = authenticatedUser;
                } else if (socket.handshake.auth?.userId && socket.handshake.auth?.firstName) {
                    // This branch handles anonymous users from the frontend's `auth` object.
                    socket.user = {
                        id: socket.handshake.auth.userId,
                        firstName: socket.handshake.auth.firstName,
                        imageUrl: socket.handshake.auth.imageUrl || null,
                        isAuthenticated: false
                    };
                    console.log(`Code Collab: Anonymous user ${socket.user.firstName} (${socket.user.id}) joined session ${sessionId}`);
                } else {
                    // Reject connections that are neither authenticated nor provide anonymous details.
                    return next(new Error("Collaboration error: User details missing."));
                }

                next(); // Crucial: Call `next()` to proceed to the connection handler.
            });
        } catch (error) {
            console.error("Code Collab: Error during session validation:", error.message);
            next(new Error("Collaboration error: " + error.message));
        }
    });

    const emitSessionUsersUpdate = (sessionId, targetSocket = null) => {
        const sessionMap = codeSessionUsers.get(sessionId);
        if (!sessionMap) return;

        const currentSessionUsers = Array.from(sessionMap.values()).map(userEntry => ({
            id: userEntry.userId,
            firstName: userEntry.firstName,
            imageUrl: userEntry.imageUrl,
            isAuthenticated: userEntry.isAuthenticated,
            socketCount: userEntry.socketIds.size
        }));

        const dataToEmit = {
            users: currentSessionUsers,
            usersCount: currentSessionUsers.length
        };

        console.log(`Code Collab: Emitting collaborators update for session ${sessionId}:`, dataToEmit);

        if (targetSocket) {
            targetSocket.emit('collaborators-update', dataToEmit);
        } else {
            codeIo.to(sessionId).emit('collaborators-update', dataToEmit);
        }
    };

    const addUserToSession = (sessionId, userId, userDetails, socketId) => {
        if (!codeSessionUsers.has(sessionId)) {
            codeSessionUsers.set(sessionId, new Map());
        }

        const sessionMap = codeSessionUsers.get(sessionId);

        if (sessionMap.has(userId)) {
            sessionMap.get(userId).socketIds.add(socketId);
        } else {
            sessionMap.set(userId, {
                userId: userId,
                firstName: userDetails.firstName,
                imageUrl: userDetails.imageUrl,
                isAuthenticated: userDetails.isAuthenticated,
                socketIds: new Set([socketId])
            });
        }
    };

    const removeUserFromSession = (sessionId, userId, socketId) => {
        if (!codeSessionUsers.has(sessionId)) return;

        const sessionMap = codeSessionUsers.get(sessionId);
        if (!sessionMap.has(userId)) return;

        const userEntry = sessionMap.get(userId);
        userEntry.socketIds.delete(socketId);

        if (userEntry.socketIds.size === 0) {
            sessionMap.delete(userId);
        }

        if (sessionMap.size === 0) {
            codeSessionUsers.delete(sessionId);
        }
    };

    codeIo.on('connection', async (socket) => {
        const { sessionId } = socket.codeSession;
        const userDetails = socket.user;

        console.log(`${userDetails.firstName} (${userDetails.id}) connected to code session: ${sessionId} with socket ${socket.id}`);

        socket.join(sessionId);

        addUserToSession(sessionId, userDetails.id, userDetails, socket.id);

        // --- FIX 1: Fetch fresh initial state from the database instead of using stale socket.codeSession ---
        try {
            const currentSession = await CodeSession.findOne({ sessionId });
            if (currentSession) {
                // A new user needs the code, language, and collaborator list as soon as they join.
                socket.emit('code-change', currentSession.codeContent); 
                socket.emit('language-change', {
                    language: currentSession.language,
                    codeContent: currentSession.codeContent
                });
                // Initialize the latest code in memory if not already present
                if (!latestSessionCode.has(sessionId)) {
                    latestSessionCode.set(sessionId, currentSession.codeContent);
                }
            }
        } catch (dbErr) {
            console.error("Code Collab: Error fetching fresh session state on connection:", dbErr);
        }
        
        // --- FIX 2: Emit the updated collaborator list to all clients in the room ---
        emitSessionUsersUpdate(sessionId);

        socket.on('user-joined', (userData) => {
            console.log(`Code Collab: Received user-joined event:`, userData);
            if (userData && userData.userId) {
                const updatedUserDetails = {
                    id: userData.userId,
                    firstName: userData.firstName || userDetails.firstName,
                    imageUrl: userData.imageUrl || userDetails.imageUrl,
                    isAuthenticated: userDetails.isAuthenticated
                };
                removeUserFromSession(sessionId, userDetails.id, socket.id);
                socket.user = updatedUserDetails;
                addUserToSession(sessionId, updatedUserDetails.id, updatedUserDetails, socket.id);
                emitSessionUsersUpdate(sessionId);
            }
        });

        // --- FIX 3: Load fresh session state from DB dynamically ---
        socket.on('load-code', async () => {
            try {
                const currentSession = await CodeSession.findOne({ sessionId });
                if (currentSession) {
                    socket.emit('load-code', {
                        code: currentSession.codeContent,
                        language: currentSession.language,
                        creatorName: currentSession.creatorName,
                    });
                }
            } catch (dbErr) {
                console.error("Code Collab: Error fetching fresh session on load-code:", dbErr);
            }
        });
        
        // Handle code changes from a client (Broadcasting instantly and debouncing MongoDB updates)
        socket.on('code-change', (newCode) => {
            // 1. Broadcast immediately to minimize latency
            socket.to(sessionId).emit('code-change', newCode);
            // 2. Track the latest state in memory for immediate flush on disconnect
            latestSessionCode.set(sessionId, newCode);

            // 3. Debounce database updates to prevent Mongo bottlenecks
            if (dbSaveTimeouts.has(sessionId)) {
                clearTimeout(dbSaveTimeouts.get(sessionId));
            }

            const timeoutId = setTimeout(async () => {
                try {
                    await CodeSession.updateOne({ sessionId }, { codeContent: newCode, lastModified: new Date() });
                    dbSaveTimeouts.delete(sessionId);
                } catch (error) {
                    console.error(`Error saving code to DB for session ${sessionId}:`, error);
                }
            }, 1500); // Save to DB after 1.5 seconds of user typing idle

            dbSaveTimeouts.set(sessionId, timeoutId);
        });

        // Handle language changes
        socket.on('language-change', async (languageData) => {
            try {
                // Cancel any pending debounced save to prevent writing old language code over new boilerplate
                if (dbSaveTimeouts.has(sessionId)) {
                    clearTimeout(dbSaveTimeouts.get(sessionId));
                    dbSaveTimeouts.delete(sessionId);
                }

                const session = await CodeSession.findOne({ sessionId });
                if (!session) {
                    return socket.emit('code-error', 'Session not found.');
                }
                let targetLanguage = languageData.language;
                if (targetLanguage === "cpp") {
                    targetLanguage = "c++";
                }
                console.log("Language change request:", languageData, "-> Target:", targetLanguage);
                const boilerplateEntry = session.startCode.find(entry => entry.language === targetLanguage);
                const updatedCodeContent = languageData.codeContent || (boilerplateEntry ? boilerplateEntry.initialCode : session.codeContent);
                
                await CodeSession.updateOne({ sessionId }, {
                    language: targetLanguage,
                    codeContent: updatedCodeContent,
                    lastModified: new Date()
                });
                
                latestSessionCode.set(sessionId, updatedCodeContent);

                codeIo.to(sessionId).emit('language-change', {
                    language: targetLanguage,
                    codeContent: updatedCodeContent
                });
            } catch (error) {
                console.error(`Error updating language for session ${sessionId}:`, error);
                socket.emit('code-error', 'Failed to update language.');
            }
        });

        // Handle cursor/selection changes
        socket.on('cursor-change', (cursorData) => {
            const enhancedCursorData = {
                userId: userDetails.id,
                userName: userDetails.firstName,
                userImageUrl: userDetails.imageUrl,
                socketId: socket.id,
                ...cursorData,
                timestamp: Date.now()
            };
            socket.to(sessionId).emit('cursor-change', enhancedCursorData);
        });

        // Handle user typing status
        socket.on('user-typing', (data) => {
            socket.to(sessionId).emit('user-typing', {
                userId: userDetails.id,
                userName: userDetails.firstName,
                isTyping: data.isTyping
            });
        });

        socket.on('disconnect', async () => {
            const { sessionId } = socket.codeSession;
            const { id: userId, firstName } = userDetails;
            console.log(`${firstName} (${userId}) disconnected from code session: ${sessionId} (socket: ${socket.id})`);
            
            const isHostDisconnect = socket.codeSession && socket.codeSession.creatorId && socket.codeSession.creatorId.toString() === userId.toString();

            if (isHostDisconnect) {
                console.log(`Host ${firstName} disconnected. Terminating session ${sessionId}...`);
                if (dbSaveTimeouts.has(sessionId)) {
                    clearTimeout(dbSaveTimeouts.get(sessionId));
                    dbSaveTimeouts.delete(sessionId);
                }
                
                try {
                    await CodeSession.deleteOne({ sessionId });
                } catch (error) {
                    console.error("Failed to delete session from DB on host disconnect:", error);
                }

                // Notify everyone in the room that the session has ended
                codeIo.to(sessionId).emit('session-ended');

                // Cleanup memory maps
                latestSessionCode.delete(sessionId);
                codeSessionUsers.delete(sessionId);
            } else {
                // Flush any pending save immediately
                if (dbSaveTimeouts.has(sessionId)) {
                    clearTimeout(dbSaveTimeouts.get(sessionId));
                    dbSaveTimeouts.delete(sessionId);
                    const pendingCode = latestSessionCode.get(sessionId);
                    if (pendingCode !== undefined) {
                        try {
                            await CodeSession.updateOne({ sessionId }, { codeContent: pendingCode, lastModified: new Date() });
                        } catch (error) {
                            console.error(`Error flushing pending code to DB:`, error);
                        }
                    }
                }

                removeUserFromSession(sessionId, userId, socket.id);
                emitSessionUsersUpdate(sessionId);
                
                // Clean up memory maps if the session is empty
                if (!codeSessionUsers.has(sessionId)) {
                    console.log(`Code session ${sessionId} is now empty.`);
                    latestSessionCode.delete(sessionId);
                }
            }
        });

        socket.on('connect_error', (err) => {
            console.error(`Socket.IO Connection Error for socket ${socket.id}: ${err.message}`);
        });
    });
}

module.exports = { initSockets };

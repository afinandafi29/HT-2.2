import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
    }
});

// Store waiting users by interest and mode
const waitingRooms = {
    text: {},
    audio: {},
    video: {}
};

// Store active connections
const activeConnections = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('find-match', ({ interest, interests, mode }) => {
        const userInterests = interests && interests.length > 0
            ? interests.map(i => i.toLowerCase().trim())
            : [interest?.toLowerCase().trim() || 'general'];

        console.log(`Finding match for ${socket.id} - Interests: ${userInterests.join(', ')}, Mode: ${mode}`);

        let partnerId = null;
        let matchedInterest = null;

        // Try to find a partner sharing ANY of the interests
        for (const interestItem of userInterests) {
            if (waitingRooms[mode][interestItem] && waitingRooms[mode][interestItem].length > 0) {
                matchedInterest = interestItem;
                partnerId = waitingRooms[mode][interestItem].shift();
                break;
            }
        }

        // If no interest match, try matching with anyone in 'general' if the user is okay with it
        // Or if the user has no interests, they are 'general'
        if (!partnerId && userInterests.includes('general')) {
            // This is already covered by the loop above if 'general' is in userInterests
        }

        if (partnerId) {
            const roomId = `${socket.id}-${partnerId}`;
            socket.join(roomId);
            io.sockets.sockets.get(partnerId)?.join(roomId);

            activeConnections.set(socket.id, { partnerId, roomId, mode });
            activeConnections.set(partnerId, { partnerId: socket.id, roomId, mode });

            socket.emit('match-found', { partnerId, roomId, isInitiator: true });
            io.to(partnerId).emit('match-found', { partnerId: socket.id, roomId, isInitiator: false });

            console.log(`Match created: ${socket.id} <-> ${partnerId} in room ${roomId} (Interest: ${matchedInterest})`);
        } else {
            // Add user to the waiting list for ALL their interests
            userInterests.forEach(interestItem => {
                if (!waitingRooms[mode][interestItem]) {
                    waitingRooms[mode][interestItem] = [];
                }
                waitingRooms[mode][interestItem].push(socket.id);
            });
            socket.emit('searching');
            console.log(`${socket.id} added to waiting rooms: ${mode}/${userInterests.join(',')}`);
        }
    });

    // WebRTC signaling
    socket.on('webrtc-offer', ({ offer, to }) => {
        console.log(`Forwarding offer from ${socket.id} to ${to}`);
        io.to(to).emit('webrtc-offer', { offer, from: socket.id });
    });

    socket.on('webrtc-answer', ({ answer, to }) => {
        console.log(`Forwarding answer from ${socket.id} to ${to}`);
        io.to(to).emit('webrtc-answer', { answer, from: socket.id });
    });

    socket.on('webrtc-ice-candidate', ({ candidate, to }) => {
        io.to(to).emit('webrtc-ice-candidate', { candidate, from: socket.id });
    });

    // Text chat messages
    socket.on('chat-message', ({ message, to }) => {
        io.to(to).emit('chat-message', { message, from: socket.id });
    });

    socket.on('typing', ({ to }) => {
        io.to(to).emit('typing', { from: socket.id });
    });

    socket.on('stop-typing', ({ to }) => {
        io.to(to).emit('stop-typing', { from: socket.id });
    });

    // Skip to next person
    socket.on('skip', () => {
        handleDisconnect(socket);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        handleDisconnect(socket);
    });

    function handleDisconnect(socket) {
        // Remove from waiting rooms
        Object.keys(waitingRooms).forEach(mode => {
            Object.keys(waitingRooms[mode]).forEach(interest => {
                waitingRooms[mode][interest] = waitingRooms[mode][interest].filter(id => id !== socket.id);
            });
        });

        // Notify partner if in active connection
        const connection = activeConnections.get(socket.id);
        if (connection) {
            io.to(connection.partnerId).emit('partner-disconnected');
            activeConnections.delete(connection.partnerId);
            activeConnections.delete(socket.id);
        }
    }
});

// API Routes (Mock for now)
app.use(express.json());

app.get('/api/posts', (req, res) => {
    const posts = [
        {
            id: 1,
            user: { full_name: "System Admin", avatar_url: "https://github.com/github.png" },
            username: "admin",
            image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            content: "Welcome to HappyyTalk! This is a post from the backend.",
            likes_count: 42,
            comments_count: 5
        },
        {
            id: 2,
            user: { full_name: "Demo User", avatar_url: "https://ui-avatars.com/api/?name=Demo+User" },
            username: "demo_user",
            image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
            content: "Testing the API integration. It works!",
            likes_count: 10,
            comments_count: 2
        }
    ];
    res.json(posts);
});

app.post('/api/posts', (req, res) => {
    const newPost = req.body;
    // In a real app, save to DB
    res.json({ message: "Post created", post: newPost });
});

app.get('/api/posts/:id', (req, res) => {
    res.json({ message: "Post details" });
});

// Start Server
const PORT = 5001;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Signaling server running on port ${PORT}`);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Attach io to the app so routes can use it
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('User connected via Socket.io:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded images

// Initialize static memory data stores
global.users = [];
global.foods = [];

// Routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Plate2Purpose API with Real-Time Sockets is running');
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

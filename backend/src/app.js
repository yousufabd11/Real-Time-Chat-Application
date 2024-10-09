const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Use CORS middleware
app.use(cors({
    origin: 'https://buble-chat-livid.vercel.app/', // Adjust this to your frontend URL
    credentials: true,
    methods: ["GET", "POST"],
  }));

// Middleware to parse JSON bodies
app.use(express.json());

// Example API route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chatroom', chatRoomRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;

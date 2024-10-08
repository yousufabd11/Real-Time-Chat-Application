const { Server } = require('socket.io');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // When a user joins a chat room
    socket.on('joinRoom', async (roomId) => {
      const userId = socket.handshake.query.userId; // Get userId from the query

      try {
        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);

        // Notify other users in the room
        io.to(roomId).emit('userStatusUpdate', { userId, action: 'joined' });

        // Add user to room participants in the database
        await ChatRoom.findByIdAndUpdate(roomId, { $addToSet: { participants: userId } });

        // Emit updated chat room list
        const updatedRooms = await ChatRoom.find().populate('participants', 'name email');
        io.emit('roomUpdated', updatedRooms);
      } catch (error) {
        console.error(`Error joining room: ${error.message}`);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // When a user leaves a chat room
    socket.on('leaveRoom', async (roomId) => {
      const userId = socket.handshake.query.userId; // Get userId from the query
      try {
        socket.leave(roomId);
        console.log(`User ${userId} left room: ${roomId}`);

        // Notify other users in the room
        io.to(roomId).emit('userStatusUpdate', { userId, action: 'left' });

        // Remove user from room participants in the database
        await ChatRoom.findByIdAndUpdate(roomId, { $pull: { participants: userId } });

        // Emit updated chat room list
        const updatedRooms = await ChatRoom.find().populate('participants', 'name email');
        io.emit('roomUpdated', updatedRooms);
      } catch (error) {
        console.error(`Error leaving room: ${error.message}`);
        socket.emit('error', { message: 'Failed to leave room' });
      }
    });

    // When a message is sent in a chat room
    socket.on('sendMessage', async (messageData) => {
      const { roomId, senderId, content } = messageData;
      const timestamp = new Date();

      try {
        // Optional: Save message to database
        const message = new Message({ roomId, sender: senderId, content, timestamp });
        await message.save();

        // Broadcast the message to the room with timestamp and sender info
        io.to(roomId).emit('receiveMessage', { senderId, content, timestamp });
      } catch (error) {
        console.error(`Error sending message: ${error.message}`);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // When a user is typing in a room
    socket.on('typing', (roomId, userId) => {
      io.to(roomId).emit('typing', { userId });
    });

    // When a user disconnects
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = setupSocket;

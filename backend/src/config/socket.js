//This sets up the WebSocket server and manages various events like connecting, disconnecting, messaging, and typing indicators.
const { Server } = require('socket.io');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Event when a message is sent
    socket.on('sendMessage', (messageData) => {
      const { chatRoomId, senderId, content } = messageData;
      io.to(chatRoomId).emit('receiveMessage', { senderId, content });
    });

    // Event when a user joins a chat room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Event when a user is typing
    socket.on('typing', (data) => {
      io.to(data.roomId).emit('typing', data.user);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = setupSocket;

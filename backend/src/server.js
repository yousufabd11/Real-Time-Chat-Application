const http = require('http');
const app = require('./app');
const setupSocket = require('./config/socket');

// Create an HTTP server
const server = http.createServer(app);

// Setup WebSocket server
const io = setupSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

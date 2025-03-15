import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

// Initialize the express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new socketIo.Server(server, {
  cors: {
    origin: '*', // You can set specific origins here
    methods: ['GET', 'POST'],
  },
});

// Serve a simple HTML page (optional, for testing purposes)
app.get('/', (req, res) => {
  res.send('Socket.IO API is running!');
});

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for a custom event from the client
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Emit a response back to the client
    socket.emit('response', `Server received: ${data}`);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

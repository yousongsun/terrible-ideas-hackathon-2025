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

// // Send a message to all clients every 5 seconds
// const intervalId = setInterval(() => {
//   io.emit('autoMessage', 'Hello from server!'); // Broadcast message to all clients
// }, 5000); // 5000 milliseconds = 5 seconds

// Start a counter at 0, send the counter value to all clients every 2 seconds
let counter = 0;
const intervalId = setInterval(() => {
  io.emit('autoMessage', counter); // Emit the current counter value (0, 2, 4, ...)
  counter += 2; // Increment the counter by 2
  // If the counter exceeds 48, reset it back to 0
  if (counter > 48) {
    counter = 0; // Reset the counter to 0
  }
}, 2000); // 2000 milliseconds = 2 seconds

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
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

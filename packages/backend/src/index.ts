import express from 'express';
import http from 'http';
import { Socket, Server } from 'socket.io';
import path from 'path';

// Initialize the express app
const app = express();
const server = http.createServer(app);

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // You can set specific origins here
    methods: ['GET', 'POST'],
  },
});

// To store all connected sockets
let clients: Socket[] = [];
let clickerRandomClients: { [key: string]: Socket[] } = {};

// Function to start sending messages to two random clients specific to a clicker
function sendToRandomClients(data: string, clicker: Socket) {
  // Ensure there are at least two clients to send messages
  if (clients.length >= 2) {
    const clickerId = clicker.id;

    // If there are no random clients for this clicker, initialize it
    if (!clickerRandomClients[clickerId]) {
      clickerRandomClients[clickerId] = [];
    }

    while (clickerRandomClients[clickerId].length < 2) {
      // Exclude the clicker itself from the random selection
      const availableClients = clients.filter((client) => client !== clicker);

      const randomIndex = Math.floor(Math.random() * availableClients.length);
      const selectedClient = availableClients[randomIndex];

      // Ensure the client is not already selected
      if (!clickerRandomClients[clickerId].includes(selectedClient)) {
        clickerRandomClients[clickerId].push(selectedClient);
      }

      console.log(availableClients.length);

      if (availableClients.length <= 1) {
        break;
      }
      console.log('end while');
    }

    // Send messages to the two random clients for this clicker
    clickerRandomClients[clickerId].forEach((client: Socket) => {
      client.emit(
        'response',
        `${data}`,
        // `You are selected to receive continuous messages from Clicker ${clickerId}: ${data}`,
      );
    });

    console.log(
      `Started sending continuous messages to:`,
      clickerRandomClients[clickerId].map((client) => client.id),
    );
  } else {
    console.log('Not enough clients to send to');
  }
}

// Optionally, you can also serve an index.html from the root of your public folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  if (counter > 82) {
    counter = 0; // Reset the counter to 0
  }
}, 2000); // 2000 milliseconds = 2 seconds

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  clients.push(socket);

  // Listen for a custom event from the client
  socket.on('message', (data) => {
    console.log('Message received:', data);

    // Call the function to start sending messages to two random clients
    sendToRandomClients(data, socket);

    console.log('end');
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    clients = clients.filter((client) => client !== socket);
    // Remove the disconnected socket from the clicker's random clients list
    const disconnectedId = socket.id;
    delete clickerRandomClients[disconnectedId]; // Remove the disconnected socket's random clients entry

    // Iterate over all clickers and remove the disconnected socket from their random clients
    for (const clickerId in clickerRandomClients) {
      clickerRandomClients[clickerId] = clickerRandomClients[clickerId].filter(
        (client) => client.id !== disconnectedId,
      );
    }
    console.log('A user disconnected');
  });
});

// Start the server
const port = 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

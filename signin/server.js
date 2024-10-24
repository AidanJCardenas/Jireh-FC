const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

// Dummy user data for demonstration
const users = {
  user1: { password: "password1", dashboardData: "Dashboard data for user1" },
  user2: { password: "password2", dashboardData: "Dashboard data for user2" },
};

// In-memory user session storage
let loggedInUser = null;

// In-memory messages storage
const messages = [];

// Serve the sign-in page when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main", "signin.html"));
});

// Sign-in endpoint
app.post("/api/signin", (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    loggedInUser = username; // Store logged-in user
    return res.status(200).json({ message: "Sign-in successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// Dashboard endpoint
app.get("/dashboard", (req, res) => {
  if (!loggedInUser) {
    return res.status(401).send("You are not logged in.");
  }

  const userData = users[loggedInUser].dashboardData; // Fetch user-specific data
  res.send(`<h1>Welcome to your Dashboard, ${loggedInUser}!</h1>
              <p>${userData}</p>
              <div id="chat">
                  <h2>Group Chat</h2>
                  <div id="messages"></div>
                  <input id="messageInput" placeholder="Type a message..." />
                  <button id="sendButton">Send</button>
              </div>
              <script src="/socket.io/socket.io.js"></script>
              <script>
                  const socket = io();
                  const messagesDiv = document.getElementById('messages');
                  const messageInput = document.getElementById('messageInput');
                  const sendButton = document.getElementById('sendButton');

                  // Load existing messages when connecting
                  socket.on('load messages', (msgs) => {
                      msgs.forEach(msg => {
                          const msgElement = document.createElement('div');
                          msgElement.textContent = \`\${msg.user}: \${msg.message}\`;
                          messagesDiv.appendChild(msgElement);
                      });
                  });

                  // Handle sending messages
                  sendButton.addEventListener('click', () => {
                      const message = messageInput.value;
                      if (message) {
                          socket.emit('chat message', { user: '${loggedInUser}', message });
                          messageInput.value = ''; // Clear input field
                      }
                  });

                  // Handle incoming messages
                  socket.on('chat message', (data) => {
                      const msgElement = document.createElement('div');
                      msgElement.textContent = \`\${data.user}: \${data.message}\`;
                      messagesDiv.appendChild(msgElement);
                  });
              </script>`);
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send existing messages to the newly connected user
  socket.emit("load messages", messages);

  socket.on("chat message", (data) => {
    messages.push(data); // Save the message in the array
    io.emit("chat message", data); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});

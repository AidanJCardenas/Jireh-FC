const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = createServer(app);
const io = new Server(server);

let messages = []; // Store messages in memory (not persistent)

// Serve static files
app.use(express.static('public'));

// API endpoint for messages
app.post('/api/messages', (req, res) => {
    const message = req.body;
    messages.push(message);
    io.emit('message', message); // Broadcast the new message
    res.status(200).send();
});

// Socket connection for real-time chat
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Vercel serverless function export
module.exports = (req, res) => {
    // Handle requests
    app(req, res);
};

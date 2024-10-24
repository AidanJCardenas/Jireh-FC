const express = require('express');
const app = express();
app.use(express.json());

const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

// Sign in endpoint
app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // You might want to set a session or token here
    res.status(200).send(); // Success
  } else {
    res.status(401).send(); // Unauthorized
  }
});

// Vercel serverless function export
module.exports = (req, res) => {
  app(req, res);
};

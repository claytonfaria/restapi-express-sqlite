// Create Express app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');

// Middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/users', usersRoute);

// Root endpoint
app.get('/', (req, res, next) => {
  res.json({ message: 'OK' });
});

// Server port
const HTTP_PORT = 3000;

// Start Server
app.listen(HTTP_PORT, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT));
});

// Default response for any other request
app.use(function(req, res) {
  res.status(404);
});

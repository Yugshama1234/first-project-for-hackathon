const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4750;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Use API routes
const apiRoutes = require('./apiRoutes'); // Ensure the correct path
app.use('/api', apiRoutes);

// Define a route for the root URL to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

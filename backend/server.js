require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const sosRoutes = require('./routes/sosRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-rescue';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Backend connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Enable CORS
app.use(cors());

// Enable JSON parsing
app.use(express.json());

// Load Routes
app.use('/api/sos', sosRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('Smart Rescue API Server is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

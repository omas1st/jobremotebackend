require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Basic “root” and “/api” handlers so you don’t get “Cannot GET /”:
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

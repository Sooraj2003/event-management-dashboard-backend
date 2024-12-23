const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const attendeeRoutes = require('./routes/attendeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

// Middleware
app.use(cookieParser());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend origin
    credentials: true, // Allow credentials (cookies)
  }));
app.use(express.json());



// Enable CORS with Credentials


// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/events', eventRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/tasks', taskRoutes);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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
// Define the allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-url.com']; // Add the appropriate origin here

// Use CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers you want to allow
}));


app.use(express.json());



// Enable CORS with Credentials


// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/events', authMiddleware, eventRoutes);
app.use('/api/attendees',authMiddleware, attendeeRoutes);
app.use('/api/tasks',authMiddleware, taskRoutes);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

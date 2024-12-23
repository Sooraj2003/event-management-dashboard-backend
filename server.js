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

// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-url.com']; // Update with your frontend URL

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from allowed origins and no-origin (for mobile apps/Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers)
};

// Use CORS middleware globally
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests globally (for all routes)
app.options('*', cors(corsOptions)); // Ensure preflight requests are handled correctly

// Enable express.json to parse JSON bodies
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes (protected with authMiddleware)
app.use('/api/events', authMiddleware, eventRoutes);
app.use('/api/attendees', authMiddleware, attendeeRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

// Connect to Database
connectDB();

// Setup the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

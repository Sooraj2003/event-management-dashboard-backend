const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User Registration (Token set in HTTP-only Cookie)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username, password });
    await user.save();

    // Generate token after successful registration
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: false,    // Prevent client-side JS access
      secure: true, // Use secure cookie in production
      sameSite: 'None',  // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({ message: 'User registered successfully and logged in!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login (Token set in HTTP-only Cookie)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Logout (Expire Token Cookie)
router.post('/logout', (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: false,
      expires: new Date(0),
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protected Route Example (Optional)
router.get('/protected', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'You have access to protected data!', user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
});

module.exports = router;

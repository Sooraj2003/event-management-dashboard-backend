const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('Cookies:', req.cookies); // Debug cookies

  const token = req.cookies.token;
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug decoded token
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message); // Debug error
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;

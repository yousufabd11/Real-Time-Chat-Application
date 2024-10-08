const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token); // Debug log to verify token presence

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, decoded payload:', decoded); // Debug log to verify decoding

      // Attach user to request object based on decoded token
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification error:', error.message); // Detailed error log
      res.status(401).json({
        message: error.name === 'TokenExpiredError' ? 'Token expired, please log in again' : 'Not authorized, token failed',
      });
    }
  } else {
    console.warn('No token provided in request'); // Warning if no token in request
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;

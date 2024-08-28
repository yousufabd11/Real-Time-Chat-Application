const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

//This middleware protects routes by ensuring that the user is authenticated via a valid JWT token. If the token is invalid or missing, the request is blocked:This middleware protects routes by ensuring that the user is authenticated via a valid JWT token. If the token is invalid or missing, the request is blocked:

dotenv.config();

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;

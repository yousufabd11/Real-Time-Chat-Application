const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if the token is present in the Authorization header and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using JWT and secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object based on the decoded token payload
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Handle invalid token
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token is provided, respond with an error
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;

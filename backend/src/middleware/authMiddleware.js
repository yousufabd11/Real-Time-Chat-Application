const jwt = require('jsonwebtoken');

// Authentication middleware function
const authMiddleware = (req, res, next) => {
  // Log the authorization header for debugging purposes
  console.log(req.headers.authorization); // Debugging
  
  let token;

  // Check if the authorization header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the authorization header by splitting the string
      token = req.headers.authorization.split(' ')[1];
      
      // Log the extracted token for debugging purposes
      console.log('Extracted Token:', token); // Debugging
      
      // Verify the token using the secret key stored in environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the decoded user information to the request object
      // This allows the user information to be accessed in subsequent middleware or routes
      req.user = decoded;
      
      // Call the next middleware function in the stack
      next();
    } catch (error) {
      // Log any error that occurs during token verification
      console.error(error);
      
      // If token verification fails, send a 401 status with an error message
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If the token is not present, send a 401 status with an error message
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;

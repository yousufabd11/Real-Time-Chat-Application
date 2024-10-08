const jwt = require('jsonwebtoken');

// Function to generate a token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expiration time (optional)
  });
};

module.exports = generateToken;
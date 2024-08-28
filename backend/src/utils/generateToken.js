const jwt = require('jsonwebtoken');

//Generate JWT tokens for user sessions:



const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;

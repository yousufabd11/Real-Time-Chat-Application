const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Signup logic
const signup = async (req, res) => {
  // Extract the name, email, and password from the request body
  const { name, email, password } = req.body;
  
  try {
    // Check if a user with the provided email already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      // If the user exists, send a 400 status with an error message
      return res.status(400).json({ message: 'User already exists' });
    }

    // If the user does not exist, hash the password using bcrypt with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the provided name, email, and hashed password
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await user.save();

    // Generate a JWT token for the user
    const token = generateToken(user);

    // Respond with a 201 status, token, and user details
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    // If there is an error during signup, respond with a 500 status and error message
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login logic
const login = async (req, res) => {
  // Extract the email and password from the request body
  const { email, password } = req.body;

  try {
    // Check if a user with the provided email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      // If the user does not exist, send a 400 status with an error message
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If the user exists, compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the passwords do not match, send a 400 status with an error message
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If the passwords match, generate a JWT token for the user
    const token = generateToken(user);

    // Respond with a success message, token, and user details
    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    // If there is an error during login, respond with a 500 status and error message
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout logic
const logout = (req, res) => {
  try {
    // Invalidate the token by instructing the client to delete it (no server-side action required here)
    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    // If there is an error during logout, respond with a 500 status and error message
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export the signup, login, and logout functions for use in other parts of the application
module.exports = { signup, login, logout };

const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;

const express = require('express');
const { sendMessage, getMessageHistory, updateMessageStatus } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/message/send
// @desc    Send a new message
// @access  Private
router.post('/send/:roomId', authMiddleware, sendMessage);

// @route   GET /api/message/history/:roomId
// @desc    Get message history for a specific room
// @access  Private
router.get('/history/:roomId', authMiddleware, getMessageHistory);

// @route   PUT /api/message/status
// @desc    Update message status
// @access  Private
router.put('/status', authMiddleware, updateMessageStatus);

module.exports = router;

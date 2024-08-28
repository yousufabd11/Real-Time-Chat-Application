const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/chat/send
// @desc    Send a message to a chat room
// @access  Private
router.post('/send', authMiddleware, sendMessage);

// @route   GET /api/chat/history/:roomId
// @desc    Get chat history for a specific room
// @access  Private
router.get('/history/:roomId', authMiddleware, getChatHistory);

module.exports = router;

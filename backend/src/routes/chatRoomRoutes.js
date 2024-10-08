const express = require('express');
const { createChatRoom, joinChatRoom, leaveChatRoom, getChatRooms } = require('../controllers/chatRoomController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/chatroom/create
// @desc    Create a new chat room
// @access  Private
router.post('/create', authMiddleware, createChatRoom);

// @route   POST /api/chatroom/join
// @desc    Join an existing chat room
// @access  Private
router.post('/join/:roomId', authMiddleware, joinChatRoom);

// @route   POST /api/chatroom/leave
// @desc    Leave a chat room
// @access  Private
router.post('/leave/:roomId', authMiddleware, leaveChatRoom);

// @route   GET /api/chatroom
// @desc    Get a list of all available chat rooms
// @access  Private
router.get('/', authMiddleware, getChatRooms);

module.exports = router;

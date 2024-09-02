const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

// Create a new chat room
const createChatRoom = async (req, res) => {
  const { name } = req.body;

  try {
    const chatRoom = new ChatRoom({
      name,
      participants: [req.user.id],
    });

    await chatRoom.save();
    res.status(201).json({ message: 'Chat room created successfully', chatRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join a chat room
const joinChatRoom = async (req, res) => {
  const { roomId } = req.body;

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (!chatRoom.participants.includes(req.user.id)) {
      chatRoom.participants.push(req.user.id);
      await chatRoom.save();
    }

    res.json({ message: 'Joined chat room successfully', chatRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Leave a chat room
const leaveChatRoom = async (req, res) => {
  const { roomId } = req.body;

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    chatRoom.participants = chatRoom.participants.filter(userId => userId.toString() !== req.user.id);
    await chatRoom.save();

    res.json({ message: 'Left chat room successfully', chatRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a list of all available chat rooms
const getChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find().populate('participants', 'name email');
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createChatRoom, joinChatRoom, leaveChatRoom, getChatRooms };

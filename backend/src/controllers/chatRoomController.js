const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

// Create a new chat room
const createChatRoom = async (req, res) => {
  const { name } = req.body;

  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if a chat room with the same name already exists
    const existingRoom = await ChatRoom.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: 'Chat room name already taken' });
    }

    // Create a new chat room
    const chatRoom = new ChatRoom({
      name,
      participants: [req.user.id], // Add the user as a participant
    });

    await chatRoom.save(); // Save the chat room to the database

    // Return the created chat room in the response
    res.status(201).json({ message: 'Chat room created successfully', chatRoom });
  } catch (error) {
    // Handle possible validation or database errors
    console.error('Error creating chat room:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid chat room data', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
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

// Get a list of chat rooms for the authenticated user
const getChatRooms = async (req, res) => {
  try {
    // Find chat rooms that include the current user as a participant
    const chatRooms = await ChatRoom.find({ participants: req.user.id }).populate('participants', 'name email');
    
    // Return the list of chat rooms
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createChatRoom, joinChatRoom, leaveChatRoom, getChatRooms };

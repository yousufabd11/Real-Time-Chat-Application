const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom'); // If you need to reference chat rooms for some reason

// Send message
const sendMessage = async (req, res) => {
  const { content, roomId } = req.body;

  try {
    // Find the chat room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Create a new message
    const message = new Message({
      content,
      sender: req.user.id,
      room: roomId, // Ensure your Message schema has a 'room' field
    });

    await message.save();

    // Add message to chat room
    chatRoom.messages.push(message._id);
    await chatRoom.save();

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get message history for a specific room
const getMessageHistory = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId).populate('messages');
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    res.json(chatRoom.messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update message status
const updateMessageStatus = async (req, res) => {
  const { messageId, status } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.status = status;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { sendMessage, getMessageHistory, updateMessageStatus };

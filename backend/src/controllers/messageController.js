const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

// Send message
const sendMessage = async (req, res) => {
  const { content } = req.body;
  const { roomId } = req.params; // Get roomId from URL parameter

  try {
    // Find the chat room by roomId
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Create a new message
    const message = new Message({
      content,
      sender: req.user.id,
      room: roomId
    });

    await message.save();

    // Populate sender name
    await message.populate('sender', 'name');

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
    // Find the chat room and populate messages with sender name
    const chatRoom = await ChatRoom.findById(roomId).populate({
      path: 'messages',
      populate: { path: 'sender', select: 'name' }
    }).exec();

    if (!chatRoom) {
      console.log('Chat room not found');
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Return messages from the populated chatRoom
    res.json(chatRoom.messages);
  } catch (error) {
    console.error('Error fetching message history:', error);  // Detailed error log
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

const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

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
      room: roomId,
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

// Fetch chat history
const getChatHistory = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId).populate('messages');
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    res.json({ messages: chatRoom.messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendMessage, getChatHistory };

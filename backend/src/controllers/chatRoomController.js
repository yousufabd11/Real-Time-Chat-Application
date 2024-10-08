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


// Join Chat Room 
const joinChatRoom = async (req, res) => {
  const { roomId } = req.body; // Extract roomId from the request body

  try {
    // Find the chat room by ID
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Check if the user is already a participant
    if (chatRoom.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'User is already in the chat room' });
    }

    // Add user to the participants list
    chatRoom.participants.push(req.user.id);
    await chatRoom.save();

    // Emit an event to update the room participants (if you are using Socket.IO)
    io.to(roomId).emit('roomUpdated', { roomId, updatedRoom: chatRoom });

    // Send success response
    res.status(200).json({ message: 'Successfully joined the chat room', chatRoom });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error joining chat room:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//leave chat room 
const leaveChatRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) return res.status(404).json({ message: 'Chat room not found' });

    // Ensure req.user.id is valid
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    // Remove the user from participants
    chatRoom.participants = chatRoom.participants.filter(
      userId => userId.toString() !== req.user.id
    );

    await chatRoom.save();

    // Emit an update event after leaving
    io.to(roomId).emit('roomUpdated', { roomId, updatedRoom: chatRoom });

    res.status(200).json({ message: 'Left chat room successfully' });
  } catch (error) {
    console.error('Error leaving chat room:', error); // Log detailed error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};





// Get a list of chat rooms for the authenticated user
const getChatRooms = async (req, res) => {
  try {
    // Fetch all chat rooms and populate participants
    const chatRooms = await ChatRoom.find().populate('participants', 'name email');

    // Find the current user's ID
    const userId = req.user.id;

    // Filter user rooms
    const userRooms = chatRooms.filter(room => 
      room.participants.some(participant => participant._id.toString() === userId)
    );

    // Filter available rooms (those not including the user)
    const availableRooms = chatRooms.filter(room => 
      !room.participants.some(participant => participant._id.toString() === userId)
    );

    // Return both userRooms and availableRooms
    res.json({ userRooms, availableRooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { createChatRoom, joinChatRoom, leaveChatRoom, getChatRooms };

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateChatRoomForm from './CreateChatRoomForm';
import ChatRoomList from './ChatRoomList';

const ChatDashboard = () => {
  const [rooms, setRooms] = useState([]);

  // Fetch chat rooms when component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/chatrooms');
        setRooms(response.data.rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  // Function to add a new room after creating it
  const handleAddRoom = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between">
      {/* Chat Room Creation Form */}
      <div className="md:w-1/2 p-4">
        <h2 className="text-xl mb-4">Create a Chat Room</h2>
        <CreateChatRoomForm onAddRoom={handleAddRoom} />
      </div>

      {/* Chat Room List */}
      <div className="md:w-1/2 p-4">
        <h2 className="text-xl mb-4">Available Chat Rooms</h2>
        <ChatRoomList rooms={rooms} />
      </div>
    </div>
  );
};

export default ChatDashboard;

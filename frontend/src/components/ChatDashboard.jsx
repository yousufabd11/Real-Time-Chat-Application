import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateChatRoomForm from './CreateChatRoomForm';
import ChatRoomList from './ChatRoomList';

const ChatDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null); // State to store user
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return; // No token, do not proceed further
      }

      try {
        // Fetch user data
        const userResponse = await axios.get('VITE_REACT_APP_BACKEND_BASEURL/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data); // Store user data

        // Fetch chat rooms
        const roomsResponse = await axios.get('VITE_REACT_APP_BACKEND_BASEURL/api/chatroom', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(roomsResponse.data.rooms); // Store chat rooms
      } catch (error) {
        console.error('Error fetching data:', error);
        setUser(null); // Handle user not found or other errors
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchData();
  }, []);

  const handleAddRoom = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User data is missing. Please login.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 p-4">
      {/* Chat Room Creation Form */}
      <div className="md:w-1/3 bg-white shadow-md rounded-lg p-4 mb-4 md:mb-0">
        <h2 className="text-xl mb-4 font-semibold">Create a Chat Room</h2>
        <CreateChatRoomForm onAddRoom={handleAddRoom} />
      </div>

      {/* Chat Room List */}
      <div className="md:w-2/3 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl mb-4 font-semibold">Available Chat Rooms</h2>
        <ChatRoomList user={user} rooms={rooms} setRooms={setRooms} />
      </div>
    </div>
  );
};

export default ChatDashboard;

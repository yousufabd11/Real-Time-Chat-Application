import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // Import Socket.IO client

const ChatRoomList = ({ user }) => {
  const [userRooms, setUserRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const socket = io('http://localhost:5000'); // Initialize socket connection

  useEffect(() => {
    const fetchChatRooms = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/chatroom', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserRooms(response.data.userRooms);
        setAvailableRooms(response.data.availableRooms);
      } catch (err) {
        setError('Error fetching chat rooms.');
        console.error(err);
      }
    };

    fetchChatRooms();

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]); // Add socket to dependency array

  const handleJoinRoom = async (roomId) => {
    const token = localStorage.getItem('token');
    try {
      // Send roomId in the request body
      const response = await axios.post(`http://localhost:5000/api/chatroom/join`, { roomId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Join room response:', response.data);
      fetchChatRooms(); // Refresh chat room list
    } catch (error) {
      console.error('Error joining the room:', error); // Log the full error object
      setError(error?.response?.data?.message || 'Could not join the room. Please try again.');
    }
  };
  
  

  const handleLeaveRoom = async (roomId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
        // Emit the leaveRoom event to the server via Socket.IO
        socket.emit('leaveRoom', roomId, userId);

        // Make an API call to leave the chat room in the database (if needed)
        const response = await axios.post(`http://localhost:5000/api/chatroom/leave/${roomId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the response indicates success
        if (response.status === 200) { // Adjust this based on your server's response
            console.log('Leave room response:', response.data);
            fetchChatRooms(); // Refresh chat room list
            setError(null); // Clear any previous error messages
            alert('Successfully left the chat room!'); // Show success message
        } else {
            // Handle unexpected response
            console.error('Unexpected response:', response);
            setError('Could not leave the room. Please try again.');
        }
    } catch (error) {
        console.error('Error leaving the room:', error?.response?.data || error.message);
        setError(error?.response?.data?.message || 'Could not leave the room. Please try again.');
    }
};


  const navigateToChat = (roomId) => {
    navigate(`/chatroom/${roomId}`);
  };

  return (
    <div className="p-4">
      {error && <p className="error text-red-500">{error}</p>}
      <h2 className="text-xl font-bold mb-4">My Chat Rooms</h2>
      {userRooms.length === 0 ? (
        <p>No chat rooms available.</p>
      ) : (
        userRooms.map(room => (
          <div key={room._id} className="bg-gray-100 p-4 rounded mb-4 shadow">
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p>Participants: {room.participants.map(part => part.name).join(', ')}</p>
            <button 
              onClick={() => handleLeaveRoom(room._id)} 
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Leave
            </button>
            <button 
              onClick={() => navigateToChat(room._id)} 
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2 ml-2"
            >
              Go to Chat
            </button>
          </div>
        ))
      )}

      <h2 className="text-xl font-bold mb-4">Available Chat Rooms</h2>
      {availableRooms.length === 0 ? (
        <p>All rooms are joined.</p>
      ) : (
        availableRooms.map(room => (
          <div key={room._id} className="bg-gray-100 p-4 rounded mb-4 shadow">
            <h3 className="text-lg font-semibold">
              <a 
                href={`/chatroom/${room._id}`} 
                className="text-blue-500 underline"
                onClick={(e) => { 
                  e.preventDefault(); 
                  navigateToChat(room._id); 
                }}
              >
                {room.name}
              </a>
            </h3>
            <p>Participants: {room.participants.map(part => part.name).join(', ')}</p>
            <button 
              onClick={() => handleJoinRoom(room._id)} 
              className="bg-green-500 text-white px-3 py-1 rounded mt-2"
            >
              Join
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatRoomList;

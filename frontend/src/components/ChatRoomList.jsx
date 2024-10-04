import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);

  // Fetch chat rooms from backend API
  useEffect(() => {
    const fetchRooms = async () => {
        try {
          const token = localStorage.getItem('token'); // or however you're storing the token
          const response = await axios.get('http://localhost:5000/api/chatroom', {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the header
            },
          });
          console.log(response.data);  // Log the data to see what's being returned
          setRooms(response.data);      // Use response.data directly
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };
    fetchRooms();
  }, []);

  return (
    <div>
      {rooms.length === 0 ? (
        <p>No chat rooms available. Create one!</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room._id}>
              <Link to={`/chatroom/${room._id}`} className="text-blue-500">
                {room.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatRoomList;

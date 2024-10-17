import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateChatRoomForm = ({ onAddRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You need to be logged in to create a chat room.');
        return;
      }

      // Send a POST request to create a new chat room with the token in headers
      const response = await axios.post(
        'VITE_REACT_APP_BACKEND_BASEURL/api/chatroom/create',
        { name: roomName },
        { headers: { Authorization: `Bearer ${token}` } } // Include token in headers
      );

      const newRoom = response.data.chatRoom;

      // Call onAddRoom to update the list of rooms in the parent component
      onAddRoom(newRoom);
      setRoomName(''); // Clear the input after successful submission
      setErrorMessage(''); // Clear any error message
      setSuccessMessage('Chat room created successfully!'); // Set success message

      // Navigate to the newly created chat room
      navigate(`/chatroom/${newRoom._id}`); // Redirect to the chat room page
    } catch (error) {
      console.error('Error creating chat room:', error);

      // Set specific error messages based on backend response
      if (error.response && error.response.status === 400) {
        setErrorMessage('Chat room name already taken. Please choose a different name.');
      } else if (error.response && error.response.status === 401) {
        setErrorMessage('You need to be logged in to create a chat room.');
      } else {
        setErrorMessage('Failed to create chat room. Please try again.');
      }

      setSuccessMessage(''); // Clear success message if there's an error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Enter chat room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Create Chat Room
        </button>
      </form>
      {/* Display error message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {/* Display success message */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  );
};

export default CreateChatRoomForm;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import MessageForm from './MessageForm';
import axios from 'axios';

const socket = io('VITE_REACT_APP_BACKEND_BASEURL/'); // Replace with your backend URL

const ChatRoom = () => {
  const { id: roomId } = useParams(); // Extract roomId from URL
  const [messages, setMessages] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch logged-in user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('VITE_REACT_APP_BACKEND_BASEURL/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInUserId(response.data.id);
        setLoggedInUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    socket.emit('joinRoom', roomId);

    // Fetch message history
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`VITE_REACT_APP_BACKEND_BASEURL/api/message/history/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data); // Set messages array from response data directly
      } catch (error) {
        console.error('Error fetching message history:', error);
      }
    };

    fetchMessages();

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off();
    };
  }, [roomId]);

  const sendMessage = async (content) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(`VITE_REACT_APP_BACKEND_BASEURL/api/message/send/${roomId}`, 
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit('message', response.data.data);
      setMessages((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-room p-4">
      <div className="messages mb-20">
        {messages.map((msg, index) => (
          <div key={index} className={`message my-2 p-3 rounded-lg max-w-xs ${msg.sender._id === loggedInUserId ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black'}`}>
            <div className="flex justify-between">
              <span className="font-bold">
                {msg.sender._id === loggedInUserId ? 'You' : msg.sender.name}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1">{msg.content}</p>
          </div>
        ))}
      </div>
      <MessageForm roomId={roomId} sendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;

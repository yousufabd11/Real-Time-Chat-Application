import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import MessageForm from './MessageForm';

const socket = io('http://localhost:5000'); // Replace with backend URL

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', roomId);
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off();
    };
  }, [roomId]);

  const sendMessage = (text) => {
    const message = { text, timestamp: new Date(), user: 'You' };
    socket.emit('sendMessage', { roomId, message });
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div>
      <div className="messages p-4">
        {messages.map((msg, index) => (
          <div key={index} className="message my-2">
            <span>{msg.user} ({new Date(msg.timestamp).toLocaleTimeString()}): </span>
            {msg.text}
          </div>
        ))}
      </div>
      <MessageForm sendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;

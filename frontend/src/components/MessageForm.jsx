import { useState } from 'react';

const MessageForm = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="p-2 border flex-grow"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Send</button>
    </form>
  );
};

export default MessageForm;

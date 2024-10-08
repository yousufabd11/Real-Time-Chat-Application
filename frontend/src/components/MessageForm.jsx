import { useState } from 'react';

const MessageForm = ({ roomId, sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage(''); // Clear the input field after sending
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-2 bg-gray-100 rounded-lg shadow-md fixed bottom-4 left-4 right-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-r-lg transition duration-300 ease-in-out hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
};

export default MessageForm;

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background.jpg)' }}>
      <div className="bg-white bg-opacity-80 rounded-lg p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Buble Chat!</h1>
        <p className="mb-6 text-lg">Connect with your friends and family in real-time. Start chatting now!</p>
        <div className="flex justify-center space-x-4">
          <Link to="/login">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

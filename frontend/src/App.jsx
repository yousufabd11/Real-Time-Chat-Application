import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChatRoom from './components/ChatRoom';
import ChatDashboard from './components/ChatDashboard';
import MessageForm from './components/MessageForm';
import Home from './components/Home.jsx';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/chatrooms" element={<ChatDashboard />} />
          <Route path="/chatroom/:id" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
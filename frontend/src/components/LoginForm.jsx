import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call backend API for login
      const response = await axios.post("https://real-time-chat-application-ys7u.onrender.com//api/auth/login", { email, password });
      console.log(response.data); // Check the response structure

      // Check for the token in the response
      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('token', response.data.token); // Store the token

        // Navigate to the chatrooms page
        navigate("/chatrooms");
      } else {
        setErrorMessage("Login failed: " + response.data.message);
      }
    } catch (error) {
      setErrorMessage("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4 max-w-md mx-auto">
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="mb-4 p-2 border"
        required
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="mb-4 p-2 border"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Show error message if any */}
    </form>
  );
};

export default LoginForm;

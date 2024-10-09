import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState(""); // State for the name input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("VITE_API_BASE_URL/api/auth/signup", { name, email, password });
      console.log(response.data); // Log the response to check its structure
      if (response.data.success) {
        navigate("/login");
      } else {
        setErrorMessage("Registration failed: " + response.data.message);
      }
    } catch (error) {
      setErrorMessage("Registration failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4 max-w-md mx-auto">
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="mb-4 p-2 border"
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="mb-4 p-2 border"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="mb-4 p-2 border"
      />
      <button type="submit" className="bg-green-500 text-white p-2">Register</button>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>} {/* Error message */}
    </form>
  );
};

export default RegisterForm;

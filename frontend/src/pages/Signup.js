import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../api"; // ✅ NEW

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/signup`, {
        email,
        password,
      });

      setMessage("Signup successful 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>GVS Signup</h2>

      {/* Email */}
      <input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        placeholder="Create password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <p className="hint">
        Must be 8+ chars, include uppercase, lowercase & number
      </p>

      {/* Button */}
      <button 
        onClick={handleSignup}
        disabled={isLoading}
        style={{ 
          opacity: isLoading ? 0.7 : 1, 
          cursor: isLoading ? "not-allowed" : "pointer" 
        }}
      >
        {isLoading ? "Creating..." : "Create Account"}
      </button>

      {/* Message */}
      {message && (
        <p className={message.includes("successful") ? "success" : "error"}>
          {message}
        </p>
      )}

      <br />

      {/* Navigation */}
      <p className="link" onClick={() => navigate("/")}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // 🔐 FRONTEND PASSWORD VALIDATION
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      });

      alert("Signup successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container">
      <h2>GVS Signup</h2>

      {/* Email */}
      <input
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        placeholder="Create password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ✅ Use class instead of inline style */}
      <p className="hint">
        Must be 8+ chars, include uppercase, lowercase & number
      </p>

      {/* Button */}
      <button onClick={handleSignup}>Create Account</button>

      {/* Navigation */}
      <p
        className="link"
        onClick={() => navigate("/")}
      >
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;

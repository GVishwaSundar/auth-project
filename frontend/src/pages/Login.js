import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✨ NEW: Loading state

  const navigate = useNavigate();

  // 🔐 AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // ✨ NEW: Auto-clear error messages when the user starts typing again
  useEffect(() => {
    if (message && !message.includes("successful")) {
      setMessage("");
    }
  }, [email, password]);

  // 🔐 LOGIN FUNCTION
  const handleLogin = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true); // ✨ Lock the button

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
      setIsLoading(false); // ✨ Unlock the button on failure
    }
  };

  // ✨ NEW: Listen for "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <h2>GVS Login</h2>

      {/* Email */}
      <input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Password */}
      <input
        placeholder="Enter password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <p className="hint">Minimum 8 characters required</p>

      {/* Button (With dynamic loading state) */}
      <button 
        onClick={handleLogin} 
        disabled={isLoading}
        style={{ 
          opacity: isLoading ? 0.7 : 1, 
          cursor: isLoading ? "not-allowed" : "pointer" 
        }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {/* Message */}
      {message && (
        <p className={message.includes("successful") ? "success" : "error"}>
          {message}
        </p>
      )}

      <br />

      {/* Google Login (Centered perfectly) */}
      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
        <GoogleLogin
          onSuccess={async (res) => {
            try {
              const response = await axios.post(
                "http://localhost:5000/api/auth/google-login",
                { token: res.credential }
              );

              localStorage.setItem("token", response.data.token);
              navigate("/dashboard");
            } catch (error) {
              setMessage("Google login failed");
            }
          }}
          onError={() => setMessage("Google login failed")}
        />
      </div>

      <br />

      {/* Navigation */}
      <p className="link" onClick={() => navigate("/signup")}>
        Don't have an account? Signup
      </p>

      <p className="link" onClick={() => navigate("/forgot")}>
        Forgot Password?
      </p>
    </div>
  );
}

export default Login;

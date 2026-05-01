import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // ✨ FIXED: Clear error message when typing (ESLint handled)
  useEffect(() => {
    if (message && !message.includes("successful")) {
      setMessage("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, {
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
      setIsLoading(false);
    }
  };

  // Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <h2>GVS Login</h2>

      <input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <input
        placeholder="Enter password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <p className="hint">Minimum 8 characters required</p>

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

      {message && (
        <p className={message.includes("successful") ? "success" : "error"}>
          {message}
        </p>
      )}

      <br />

      {/* Google Login */}
      <div className="google-btn">
        <GoogleLogin
          onSuccess={async (res) => {
            try {
              const response = await axios.post(
                `${API_URL}/google-login`,
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

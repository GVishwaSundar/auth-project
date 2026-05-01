import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✨ NEW: Loading state

  const navigate = useNavigate();

  // ✨ NEW: Auto-clear error messages when the user starts typing again
  useEffect(() => {
    if (message && !message.includes("sent")) {
      setMessage("");
    }
  }, [email, message]);

  const handleForgot = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setIsLoading(true); // ✨ Lock the button

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      setMessage("If this email exists, a reset link has been sent. 📧");
      setEmail(""); // ✨ NEW: Clear the input after success
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // ✨ Unlock the button whether success or fail
    }
  };

  // ✨ NEW: Listen for "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleForgot();
    }
  };

  return (
    <div className="container">
      <h2>GVS Password Reset</h2>

      {/* Email */}
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Button (With dynamic loading state) */}
      <button 
        onClick={handleForgot}
        disabled={isLoading}
        style={{ 
          opacity: isLoading ? 0.7 : 1, 
          cursor: isLoading ? "not-allowed" : "pointer",
          marginTop: "10px"
        }}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      {/* Message */}
      {message && (
        <p className={message.includes("sent") ? "success" : "error"}>
          {message}
        </p>
      )}

      <br />

      {/* Back */}
      <p className="link" onClick={() => navigate("/")}>
        Back to Login
      </p>
    </div>
  );
}

export default ForgotPassword;

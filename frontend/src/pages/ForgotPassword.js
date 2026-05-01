import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // ✨ FIXED: Clear error message when typing (ESLint handled)
  useEffect(() => {
    if (message && !message.includes("sent")) {
      setMessage("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleForgot = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/forgot-password`, {
        email,
      });

      setMessage("If this email exists, a reset link has been sent. 📧");
      setEmail("");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleForgot();
    }
  };

  return (
    <div className="container">
      <h2>GVS Password Reset</h2>

      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleForgot}
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      {message && (
        <p className={message.includes("sent") ? "success" : "error"}>
          {message}
        </p>
      )}

      <br />

      <p className="link" onClick={() => navigate("/")}>
        Back to Login
      </p>
    </div>
  );
}

export default ForgotPassword;

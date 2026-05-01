import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✨ NEW: Loading state

  const navigate = useNavigate();
  const token = searchParams.get("token");

  // 🔐 Check for token on load
  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing reset link");
    }
  }, [token]);

  // ✨ NEW: Auto-clear error messages when the user starts typing again
  useEffect(() => {
    if (message && !message.includes("successful") && token) {
      setMessage("");
    }
  }, [newPassword, message, token]);

  const handleReset = async () => {
    if (!token) return; // Prevent submission if no token

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "Password must be 8+ chars, include uppercase, lowercase & number"
      );
      return;
    }

    setIsLoading(true); // ✨ Lock the button

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage("Password reset successful 🎉");
      setNewPassword(""); // ✨ NEW: Clear input on success

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // ✨ Unlock the button whether success or fail
    }
  };

  // ✨ NEW: Listen for "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  return (
    <div className="container">
      <h2>GVS Reset Password</h2>

      {/* Password */}
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!token || isLoading} // ✨ NEW: Disable input if no token or loading
      />

      <p className="hint">
        Must be 8+ chars, include uppercase, lowercase & number
      </p>

      {/* Button (With dynamic loading state) */}
      <button 
        onClick={handleReset} 
        disabled={!token || isLoading}
        style={{ 
          opacity: (!token || isLoading) ? 0.7 : 1, 
          cursor: (!token || isLoading) ? "not-allowed" : "pointer",
          marginTop: "10px"
        }}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>

      {/* Message */}
      {message && (
        <p className={message.includes("successful") ? "success" : "error"}>
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

export default ResetPassword;

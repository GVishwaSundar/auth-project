import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_URL from "../api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const token = searchParams.get("token");

  // 🔐 Check token
  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing reset link");
    }
  }, [token]);

  // ✨ FIXED: Clear error when typing (ESLint handled)
  useEffect(() => {
    if (message && !message.includes("successful") && token) {
      setMessage("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword]);

  const handleReset = async () => {
    if (!token) return;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "Password must be 8+ chars, include uppercase, lowercase & number"
      );
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/reset-password`, {
        token,
        newPassword,
      });

      setMessage("Password reset successful 🎉");
      setNewPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);

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
      handleReset();
    }
  };

  return (
    <div className="container">
      <h2>GVS Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!token || isLoading}
      />

      <p className="hint">
        Must be 8+ chars, include uppercase, lowercase & number
      </p>

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

      {message && (
        <p className={message.includes("successful") ? "success" : "error"}>
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

export default ResetPassword;

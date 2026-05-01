import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false); // ✨ NEW: Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔐 Protect route
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    setIsLoading(true); // ✨ Lock the button

    // ✨ NEW: Add a slight delay for a smooth, premium exit feel
    setTimeout(() => {
      googleLogout();
      localStorage.removeItem("token");
      navigate("/");
    }, 600); 
  };

  return (
    <div className="container">
      <h2>Welcome to GVS Dashboard 🚀</h2>

      <p className="hint" style={{ fontSize: "14px", color: "white", marginBottom: "25px" }}>
        You are successfully logged in.
      </p>

      {/* Logout Button (With dynamic loading state) */}
      <button 
        onClick={handleLogout}
        disabled={isLoading}
        style={{ 
          opacity: isLoading ? 0.7 : 1, 
          cursor: isLoading ? "not-allowed" : "pointer",
          background: "linear-gradient(135deg, #ff4b2b, #ff416c)" // Keeping logout red for danger/exit action
        }}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>

      <br /><br />

      {/* Optional message */}
      <p className="hint">
        Secure session using JWT & Google OAuth
      </p>
    </div>
  );
}

export default Dashboard;

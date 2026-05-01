import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 🔹 Normal Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login successful");

      navigate("/"); // you can change to dashboard later
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      {/* Email Input */}
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      {/* Password Input */}
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      {/* Login Button */}
      <button onClick={handleLogin}>Login</button>

      <br /><br />

      {/* Google Login */}
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const res = await axios.post(
              "http://localhost:5000/api/auth/google-login",
              { token: credentialResponse.credential }
            );

            localStorage.setItem("token", res.data.token);
            alert("Google login successful");

            navigate("/");
          } catch (error) {
            console.log(error);
          }
        }}
        onError={() => console.log("Login Failed")}
      />

      <br /><br />

      {/* Navigation Links */}
      <p>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Signup
        </span>
      </p>

      <p
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => navigate("/forgot")}
      >
        Forgot Password?
      </p>
    </div>
  );
}

export default Login;

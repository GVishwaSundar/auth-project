const express = require("express");
const router = express.Router();

// controllers
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  googleLogin
} = require("../controllers/authController");

// 🔍 DEBUG (remove later)
console.log("forgotPassword:", typeof forgotPassword);
console.log("resetPassword:", typeof resetPassword);
console.log("googleLogin:", typeof googleLogin);

// middleware
const authMiddleware = require("../config/authMiddleware");

// routes
router.post("/signup", signup);
router.post("/login", login);

// 🔥 PASSWORD ROUTES
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// 🔥 GOOGLE LOGIN
router.post("/google-login", googleLogin);

// 🔐 PROTECTED ROUTE
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data accessed",
    user: req.user
  });
});

module.exports = router;

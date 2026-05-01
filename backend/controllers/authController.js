const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ✅ RESEND (REPLACE NODEMAILER)
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// Google OAuth
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Password regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be strong",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.log("❌ SIGNUP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.log("❌ LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= FORGOT PASSWORD (🔥 FINAL FIX) =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📩 Forgot request for:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("⚠️ User not found");
      return res.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetLink = `https://auth-project-orcin.vercel.app/reset?token=${token}`;

    console.log("🔗 Reset Link:", resetLink);

    // ✅ SEND EMAIL USING RESEND
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    console.log("✅ EMAIL SENT:", response);

    res.json({
      message: "If this email exists, a reset link has been sent",
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be strong",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.log("❌ RESET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= GOOGLE LOGIN =================
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, password: "google_auth" });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Google login successful",
      token: jwtToken,
    });

  } catch (error) {
    console.log("❌ GOOGLE LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

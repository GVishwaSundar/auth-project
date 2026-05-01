const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ FIXED CORS CONFIG
const allowedOrigins = [
  "http://localhost:3000",
  "https://auth-project-orcin.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 GVS Backend API is running...");
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ CONNECT DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB Error:", err.message));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

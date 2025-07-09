require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");

const app = express();

// -----------------------------
// 🔐 Security & Middleware
// -----------------------------

// CORS: Allow only trusted origins (tighten in prod)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));

// Helmet: Secures headers
app.use(helmet());

// JSON Body Parser
app.use(express.json());

// Logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate Limiting (protects login/register)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// -----------------------------
// 📦 Routes
// -----------------------------
app.use("/api", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend connected!" });
});

// -----------------------------
// 🚀 Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

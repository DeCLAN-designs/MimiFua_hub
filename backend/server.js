// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// Middleware
const {
  authenticateToken, // verifies JWT and attaches `req.user`
} = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/auth.routes");
const salesRoutes = require("./routes/sales");
const restockRoutes = require("./routes/restocks");
const leaveRoutes = require("./routes/leaves");
const employeeDashboardRoutes = require("./routes/dashboard");

const app = express();

// === Global Middleware ===
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// === Health Check ===
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", time: new Date().toISOString() });
});

// === Public Routes ===
app.use("/api", authRoutes); // /api/login, /api/register, etc.
app.use("/api/sales", salesRoutes); // /api/sales/
app.use("/api/restocks", restockRoutes); 
app.use("/api/leaves", leaveRoutes);
app.use("/api/dashboard", employeeDashboardRoutes);

// === Protected Routes ===
// Routes under this layer require a valid JWT (req.user is available)
// app.use("/api/leaves", authenticateToken, leaveRequestRoutes);

// === 404 Handler ===
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// === Centralized Error Handler ===
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

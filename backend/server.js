require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const app = express();

// Middleware
app.use(cors({ 
              origin: "http://localhost:5173", 
              credentials: true 
}));
app.use(express.json());

// Routes
app.use("/api", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

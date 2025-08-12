const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// =====================================
// ✅ REGISTER - Supports email or phone
// =====================================
router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email = null,
    phone = null,
    password,
    role = "employee",
  } = req.body;

  if (!first_name || !last_name || (!email && !phone) || !password) {
    return res.status(400).json({
      error:
        "First name, last name, password, and email or phone are required.",
    });
  }

  try {
    // Check if email or phone already exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        error: "An account with that email or phone already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(
      `INSERT INTO users (first_name, last_name, email, phone, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, hashedPassword, role]
    );

    res.status(201).json({ message: "✅ Registration successful" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// ✅ LOGIN - email or phone
// ==========================
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Email or phone and password are required" });
  }

  try {
    const [users] = await db.query(
      `SELECT * FROM users WHERE email = ? OR phone = ?`,
      [identifier, identifier]
    );

    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 📊 Record access log
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                     (req.connection.socket ? req.connection.socket.remoteAddress : null) || 
                     req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    try {
      // Set previous sessions to inactive
      await db.query(
        "UPDATE access_logs SET status = 'inactive', logout_time = NOW(), session_duration = TIMESTAMPDIFF(MINUTE, login_time, NOW()) WHERE user_id = ? AND status = 'active'",
        [user.id]
      );

      // Create new access log entry
      await db.query(
        "INSERT INTO access_logs (user_id, login_time, ip_address, user_agent, status) VALUES (?, NOW(), ?, ?, 'active')",
        [user.id, clientIP, userAgent]
      );
    } catch (logError) {
      console.error("🔴 Access Log Error:", logError.message);
      // Don't fail login if logging fails
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ========================
// ✅ PROFILE (protected)
// ========================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?`,
      [req.user.id]
    );

    const user = rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

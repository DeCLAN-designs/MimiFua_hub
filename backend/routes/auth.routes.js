// routes/auth.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);router.post("/register", async (req, res) => {
        try {
          console.log("BODY:", req.body);
      
          if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Missing fields" });
          }
      
          // Try a basic insert
          const { name, email, password } = req.body;
          const hashed = await bcrypt.hash(password, 10);
      
          await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
            name,
            email,
            hashed,
          ]);
      
          res.status(201).json({ message: "Registered" });
        } catch (err) {
          console.error("REGISTER FAIL:", err.message);
          res.status(500).json({ error: err.message }); // <-- TEMP: return actual error to frontend
        }
      });
      
    const user = users[0];

    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    // ✅ Login success
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

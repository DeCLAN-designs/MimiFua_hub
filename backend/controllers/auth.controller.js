const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-fallback-secret"; // 🔐 Use strong secret in prod
const TOKEN_EXPIRES_IN = "18h";

// 🔐 Generate JWT token payload
const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

// 🔸 REGISTER
exports.register = async (req, res) => {
  const { name, email, password, phone = "", role = "employee" } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "All required fields must be filled" });
  }

  try {
    // Check if user already exists
    const [existing] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
        [
          name.trim(),
          email.toLowerCase().trim(),
          hashedPassword,
          phone.trim(),
          role,
        ]
      );

    const userId = result.insertId;

    // Fetch user (omit password)
    const [rows] = await db
      .promise()
      .query("SELECT id, name, email, phone, role FROM users WHERE id = ?", [
        userId,
      ]);

    const user = rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user,
    });
  } catch (err) {
    console.error("🔴 Registration Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 🔸 LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find user
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [
        email.toLowerCase().trim(),
      ]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Remove sensitive fields
    delete user.password;

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("🔴 Login Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

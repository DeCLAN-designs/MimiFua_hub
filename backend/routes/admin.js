const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { verifyToken, isAdmin } = require("../middleware/auth");
const db = require("../config/db");

// Ensure middleware functions exist
if (typeof verifyToken !== "function" || typeof isAdmin !== "function") {
  throw new Error("verifyToken and isAdmin middleware functions are required");
}

/**
 * ==========================
 * Get all users (admin only)
 * ==========================
 */
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, first_name, last_name, email, phone, role, status, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

/**
 * ==========================
 * Create a new user
 * ==========================
 */
router.post("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, role, status } =
      req.body;

    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: phone format check (basic)
    if (phone && !/^\+?[0-9]{7,20}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Prevent duplicate email
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (first_name, last_name, email, phone, password, role, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        first_name,
        last_name,
        email,
        phone || null,
        hashedPassword,
        role,
        status || "active",
      ]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

/**
 * ==========================
 * Update user details
 * ==========================
 */
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role, status } = req.body;

    if (!first_name || !last_name || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (phone && !/^\+?[0-9]{7,20}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Prevent email conflicts
    const [conflict] = await db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id]
    );
    if (conflict.length > 0) {
      return res
        .status(409)
        .json({ message: "Email already in use by another user" });
    }

    await db.query(
      `UPDATE users
       SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, status = ?
       WHERE id = ?`,
      [first_name, last_name, email, phone || null, role, status, id]
    );

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

/**
 * ==========================
 * Delete a user
 * ==========================
 */
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

/**
 * ==========================
 * Get access logs (admin only)
 * ==========================
 */
router.get("/access-logs", verifyToken, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    let query = `
      SELECT al.*, u.first_name, u.last_name, u.email, u.phone, u.role
      FROM access_logs al
      JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += " AND al.login_time >= ?";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND al.login_time <= ?";
      params.push(`${endDate} 23:59:59`);
    }
    if (userId) {
      query += " AND al.user_id = ?";
      params.push(userId);
    }

    query += " ORDER BY al.login_time DESC LIMIT 1000";
    const [logs] = await db.query(query, params);

    res.json(logs);
  } catch (error) {
    console.error("Error fetching access logs:", error);
    res.status(500).json({ message: "Error fetching access logs" });
  }
});

/**
 * ==========================
 * Get system metrics
 * ==========================
 */
router.get("/metrics", verifyToken, isAdmin, async (req, res) => {
  try {
    const [userCount] = await db.query("SELECT COUNT(*) as count FROM users");

    const [activeSessions] = await db.query(
      'SELECT COUNT(DISTINCT user_id) as count FROM access_logs WHERE status = "active" AND logout_time IS NULL'
    );

    const [activityData] = await db.query(`
      SELECT DATE(login_time) as date, COUNT(DISTINCT user_id) as count
      FROM access_logs
      WHERE login_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(login_time)
      ORDER BY date
    `);

    const [roleDistribution] = await db.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    res.json({
      userCount: userCount[0].count,
      activeSessions: activeSessions[0]?.count || 0,
      activityData: activityData || [],
      roleDistribution: roleDistribution || [],
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ message: "Error fetching metrics" });
  }
});

/**
 * ==========================
 * Update user status
 * ==========================
 */
router.patch("/users/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
});

/**
 * ==========================
 * Get system settings
 * ==========================
 */
router.get("/settings", verifyToken, isAdmin, async (req, res) => {
  try {
    const [settings] = await db.query("SELECT * FROM system_settings");
    const settingsMap = settings.reduce((acc, { key, value }) => {
      try {
        acc[key] = JSON.parse(value);
      } catch {
        acc[key] = value;
      }
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Error fetching settings" });
  }
});

/**
 * ==========================
 * Update system settings
 * ==========================
 */
router.put("/settings", verifyToken, isAdmin, async (req, res) => {
  let connection;
  try {
    // Get a connection from the pool
    connection = await db.getConnection();

    await connection.beginTransaction();

    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : value;

      await connection.query(
        `INSERT INTO system_settings (\`key\`, value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = ?`,
        [key, stringValue, stringValue]
      );
    }

    await connection.commit();
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Error updating settings" });
  } finally {
    if (connection) connection.release();
  }
});


module.exports = router;

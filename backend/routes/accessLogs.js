// routes/accessLogs.routes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

/**
 * 📊 POST /api/access-logs/login
 * Employee self-login (resume or create session)
 */
router.post("/login", authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"] || "unknown";

    // 1. Check if user already has an active session
    const [active] = await db.query(
      `SELECT id FROM access_logs
       WHERE user_id = ? AND status = 'active'
       ORDER BY login_time DESC LIMIT 1`,
      [userId]
    );

    if (active.length > 0) {
      return res.json({
        success: true,
        message: "Session already active",
        sessionId: active[0].id,
      });
    }

    // 2. Check if user has an inactive session today (resume it)
    const [inactive] = await db.query(
      `SELECT id FROM access_logs
       WHERE user_id = ? AND DATE(login_time) = CURDATE()
       ORDER BY login_time DESC LIMIT 1`,
      [userId]
    );

    if (inactive.length > 0) {
      await db.query(
        `UPDATE access_logs
         SET status = 'active', logout_time = NULL
         WHERE id = ?`,
        [inactive[0].id]
      );

      return res.json({
        success: true,
        message: "Session resumed",
        sessionId: inactive[0].id,
      });
    }

    // 3. Otherwise create a new session
    const [insertResult] = await db.query(
      `INSERT INTO access_logs (user_id, ip_address, user_agent, status)
       VALUES (?, ?, ?, 'active')`,
      [userId, ipAddress, userAgent]
    );

    res.json({
      success: true,
      message: "New session created",
      sessionId: insertResult.insertId,
    });
  } catch (error) {
    console.error("🔴 Login Record Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📊 POST /api/access-logs/logout
 * Employee self-logout (last active session)
 */
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    const [result] = await db.query(
      `UPDATE access_logs 
       SET status = 'inactive', 
           logout_time = NOW(), 
           session_duration = TIMESTAMPDIFF(MINUTE, login_time, NOW())
       WHERE user_id = ? AND status = 'active'
       ORDER BY login_time DESC LIMIT 1`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No active session found.",
      });
    }

    res.json({
      success: true,
      message: "Logout recorded successfully",
    });
  } catch (error) {
    console.error("🔴 Logout Record Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📊 POST /api/access-logs/logout/:userId
 * Manager: Force logout of a specific user
 */
router.post("/logout/:userId", authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    const { userId } = req.params;

    if (role !== "manager") {
      return res
        .status(403)
        .json({ error: "Access denied. Manager role required." });
    }

    const [result] = await db.query(
      `UPDATE access_logs 
       SET status = 'inactive', 
           logout_time = NOW(), 
           session_duration = TIMESTAMPDIFF(MINUTE, login_time, NOW())
       WHERE user_id = ? AND status = 'active'
       ORDER BY login_time DESC LIMIT 1`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No active session found for this user.",
      });
    }

    res.json({
      success: true,
      message: `User ${userId} logged out successfully`,
    });
  } catch (error) {
    console.error("🔴 Force Logout Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📊 GET /api/access-logs
 * Manager: Fetch paginated access logs with filters
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "manager") {
      return res
        .status(403)
        .json({ error: "Access denied. Manager role required." });
    }

    const { limit = 50, offset = 0, status = "all", userId } = req.query;

    let query = `
      SELECT 
        al.id, al.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        u.email, u.role,
        al.login_time, al.logout_time,
        al.ip_address, al.status,
        al.session_duration,
        CASE 
          WHEN al.status = 'active' AND al.login_time >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) THEN 'online'
          WHEN al.status = 'active' THEN 'away'
          ELSE 'offline'
        END as current_status
      FROM access_logs al
      JOIN users u ON al.user_id = u.id
    `;

    const queryParams = [];
    const conditions = [];

    if (status !== "all") {
      conditions.push("al.status = ?");
      queryParams.push(status);
    }

    if (userId) {
      conditions.push("al.user_id = ?");
      queryParams.push(userId);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY al.login_time DESC LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), parseInt(offset));

    const [accessLogs] = await db.query(query, queryParams);

    // summary stats
    const [summaryResult] = await db.query(`
      SELECT 
        COUNT(DISTINCT al.user_id) as total_users,
        COUNT(CASE WHEN al.status = 'active' THEN 1 END) as active_sessions,
        COUNT(CASE WHEN al.login_time >= CURDATE() THEN 1 END) as today_logins,
        AVG(al.session_duration) as avg_session_duration
      FROM access_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.login_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    const summary = summaryResult[0] || {};

    res.json({
      success: true,
      data: {
        logs: accessLogs,
        summary: {
          totalUsers: summary.total_users || 0,
          activeSessions: summary.active_sessions || 0,
          todayLogins: summary.today_logins || 0,
          avgSessionDuration: Math.round(summary.avg_session_duration || 0),
        },
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: accessLogs.length,
        },
      },
    });
  } catch (error) {
    console.error("🔴 Access Logs Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📊 GET /api/access-logs/active
 * Manager: List currently active users
 */
router.get("/active", authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "manager") {
      return res
        .status(403)
        .json({ error: "Access denied. Manager role required." });
    }

    const [activeUsers] = await db.query(`
      SELECT 
        al.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        u.email, u.role,
        al.login_time,
        TIMESTAMPDIFF(MINUTE, al.login_time, NOW()) as minutes_online,
        CASE 
          WHEN al.login_time >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) THEN 'online'
          WHEN al.login_time >= DATE_SUB(NOW(), INTERVAL 60 MINUTE) THEN 'away'
          ELSE 'idle'
        END as status
      FROM access_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.status = 'active'
      ORDER BY al.login_time DESC
    `);

    res.json({
      success: true,
      data: {
        activeUsers,
        count: activeUsers.length,
      },
    });
  } catch (error) {
    console.error("🔴 Active Users Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📊 GET /api/access-logs/user/:userId
 * Manager: Fetch access logs for a specific user
 */
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    if (role !== "manager") {
      return res
        .status(403)
        .json({ error: "Access denied. Manager role required." });
    }

    const [userLogs] = await db.query(
      `SELECT al.id, al.login_time, al.logout_time,
              al.ip_address, al.status, al.session_duration,
              CONCAT(u.first_name, ' ', u.last_name) as full_name, u.email
       FROM access_logs al
       JOIN users u ON al.user_id = u.id
       WHERE al.user_id = ?
       ORDER BY al.login_time DESC
       LIMIT ?`,
      [userId, parseInt(limit)]
    );

    res.json({
      success: true,
      data: {
        logs: userLogs,
        userId: parseInt(userId),
      },
    });
  } catch (error) {
    console.error("🔴 User Access Logs Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📊 GET /api/access-logs/my-activity
 * Employee: View own activity
 */
router.get("/my-activity", authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { limit = 5 } = req.query;

    const [currentSession] = await db.query(
      `SELECT login_time,
              TIMESTAMPDIFF(MINUTE, login_time, NOW()) as session_minutes,
              ip_address, status
       FROM access_logs 
       WHERE user_id = ? AND status = 'active'
       ORDER BY login_time DESC 
       LIMIT 1`,
      [userId]
    );

    const [recentSessions] = await db.query(
      `SELECT login_time, logout_time, session_duration,
              ip_address, status,
              CASE 
                WHEN logout_time IS NULL THEN 'Active'
                ELSE 'Completed'
              END as session_status
       FROM access_logs 
       WHERE user_id = ?
       ORDER BY login_time DESC 
       LIMIT ?`,
      [userId, parseInt(limit)]
    );

    const [todayStats] = await db.query(
      `SELECT COUNT(*) as today_logins,
              MIN(login_time) as first_login_today,
              SUM(CASE WHEN session_duration IS NOT NULL THEN session_duration ELSE 0 END) as total_time_today
       FROM access_logs 
       WHERE user_id = ? AND DATE(login_time) = CURDATE()`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        currentSession: currentSession[0] || null,
        recentSessions,
        todayStats: {
          loginCount: todayStats[0]?.today_logins || 0,
          firstLogin: todayStats[0]?.first_login_today || null,
          totalTimeToday: Math.round(todayStats[0]?.total_time_today || 0),
        },
      },
    });
  } catch (error) {
    console.error("🔴 Personal Activity Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

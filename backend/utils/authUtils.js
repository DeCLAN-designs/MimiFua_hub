const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // already promise-based from mysql2/promise

/**
 * Logs a user logout event in the database
 * @param {number} userId - The ID of the user who logged out
 * @param {string} logoutReason - Reason for logout
 */
const logLogoutEvent = async (userId, logoutReason = "manual") => {
  try {
    const details = {
      reason: logoutReason,
      timestamp: new Date().toISOString(),
    };

    await pool.execute(
      `INSERT INTO access_logs (user_id, action, details) 
       VALUES (?, 'logout', ?)`,
      [userId, JSON.stringify(details)]
    );
  } catch (error) {
    console.error("Error logging logout event:", error.message);
    // Fail silently — do not block logout flow
  }
};

/**
 * Adds a token to the blacklist until its expiry
 * @param {string} token - The JWT token to invalidate
 */
const invalidateToken = async (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return;

    const expiresAt = new Date(decoded.exp * 1000); // convert exp to ms

    await pool.execute(
      `INSERT INTO token_blacklist (token, expires_at) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE expires_at = VALUES(expires_at)`,
      [token, expiresAt]
    );
  } catch (error) {
    console.error("Error invalidating token:", error.message);
    // Fail silently — do not block logout flow
  }
};

/**
 * Performs a complete server-side logout
 * @param {object} user - The user object (must contain at least id)
 * @param {string} token - The JWT token to invalidate
 * @param {string} [reason='manual'] - Reason for logout
 */
const performServerSideLogout = async (user, token, reason = "manual") => {
  try {
    if (user?.id) {
      await logLogoutEvent(user.id, reason);
    }
    if (token) {
      await invalidateToken(token);
    }
  } catch (error) {
    console.error("Error during server-side logout:", error.message);
    // Fail silently to avoid blocking client logout
  }
};

/**
 * Middleware to check if a token is blacklisted
 */
const checkTokenBlacklist = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res
        .status(400)
        .json({ message: "Invalid Authorization header format" });
    }

    const token = parts[1];
    if (!token) return next();

    const [rows] = await pool.execute(
      "SELECT 1 FROM token_blacklist WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    if (rows.length > 0) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    next();
  } catch (error) {
    console.error("Error checking token blacklist:", error.message);
    // Continue the request even if blacklist check fails
    next();
  }
};

module.exports = {
  logLogoutEvent,
  invalidateToken,
  performServerSideLogout,
  checkTokenBlacklist,
};

const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate and validate JWT token from Authorization header.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Validate presence and format of Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info (id, role, etc.) to request object
    req.user = decoded;

    return next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

/**
 * Middleware to ensure a user is present (used after authenticateToken).
 */
const verify = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

/**
 * Middleware to restrict route access to only managers.
 */
const requireManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res
      .status(403)
      .json({ error: "Access restricted to managers only." });
  }
  next();
};

/**
 * Middleware to restrict route access to only employees.
 */
const requireEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res
      .status(403)
      .json({ error: "Access restricted to employees only." });
  }
  next();
};

module.exports = {
  authenticateToken,
  verify,
  requireManager,
  requireEmployee,
};

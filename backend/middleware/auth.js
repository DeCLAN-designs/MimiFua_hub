const jwt = require("jsonwebtoken");

/**
 * Centralized unauthorized response helper.
 */
const unauthorized = (res, message = "Unauthorized access") =>
  res.status(401).json({ error: message });

/**
 * Middleware to authenticate JWT from Authorization header.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(res, "Access denied. No token provided.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Example: { id, role, email, etc. }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

/**
 * Middleware to ensure user is present after authentication.
 */
const verify = (req, res, next) => {
  if (!req.user) return unauthorized(res);
  next();
};

/**
 * Role-based access control middleware generator.
 * @param {'manager'|'employee'|...} role
 */
const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res
      .status(403)
      .json({ error: `Access restricted to ${role}s only.` });
  }
  next();
};

/**
 * Middleware to ensure user is an admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return unauthorized(res, 'Authentication required');
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Predefined role middlewares for convenience
const requireManager = requireRole("manager");
const requireEmployee = requireRole("employee");

module.exports = {
  authenticateToken,
  verifyToken: authenticateToken, // Alias for backward compatibility
  verify,
  requireRole,
  isAdmin,
  requireManager,
  requireEmployee,
};

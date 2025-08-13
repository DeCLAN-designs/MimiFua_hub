const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = process.env;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const [users] = await db.query(
      'SELECT role FROM users WHERE id = ?', 
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (users[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin check failed:', error);
    return res.status(500).json({ message: 'Error verifying admin status' });
  }
};

// Middleware to log admin actions
const logAdminAction = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    try {
      if (req.user && req.user.id) {
        const action = {
          user_id: req.user.id,
          action: `${req.method} ${req.originalUrl}`,
          method: req.method,
          path: req.path,
          status_code: res.statusCode,
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.headers['user-agent'],
          request_body: JSON.stringify(req.body),
          response_body: typeof data === 'string' ? data : JSON.stringify(data)
        };

        // Log to database asynchronously without waiting
        db.query(
          `INSERT INTO admin_audit_logs SET ?`,
          action
        ).catch(err => console.error('Error logging admin action:', err));
      }
    } catch (err) {
      console.error('Error in admin action logger:', err);
    }
    
    return originalSend.apply(res, arguments);
  };
  
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  logAdminAction
};

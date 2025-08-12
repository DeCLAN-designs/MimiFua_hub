const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// 📊 GET /api/access-logs - Get access logs for managers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    
    // Only managers can view access logs
    if (role !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Manager role required.' });
    }

    const { limit = 50, offset = 0, status = 'all', userId } = req.query;

    let query = `
      SELECT 
        al.id,
        al.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        u.email,
        u.role,
        al.login_time,
        al.logout_time,
        al.ip_address,
        al.status,
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

    // Filter conditions
    const conditions = [];
    
    if (status !== 'all') {
      conditions.push('al.status = ?');
      queryParams.push(status);
    }

    if (userId) {
      conditions.push('al.user_id = ?');
      queryParams.push(userId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY al.login_time DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [accessLogs] = await db.query(query, queryParams);

    // Get summary statistics
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

    const summary = summaryResult[0] || {
      total_users: 0,
      active_sessions: 0,
      today_logins: 0,
      avg_session_duration: 0
    };

    res.json({
      success: true,
      data: {
        logs: accessLogs,
        summary: {
          totalUsers: summary.total_users,
          activeSessions: summary.active_sessions,
          todayLogins: summary.today_logins,
          avgSessionDuration: Math.round(summary.avg_session_duration || 0)
        },
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: accessLogs.length
        }
      }
    });

  } catch (error) {
    console.error('🔴 Access Logs Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📊 GET /api/access-logs/active - Get currently active users
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Manager role required.' });
    }

    const [activeUsers] = await db.query(`
      SELECT 
        al.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        u.email,
        u.role,
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
        count: activeUsers.length
      }
    });

  } catch (error) {
    console.error('🔴 Active Users Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📊 GET /api/access-logs/user/:userId - Get access logs for specific user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    
    if (role !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Manager role required.' });
    }

    const [userLogs] = await db.query(`
      SELECT 
        al.id,
        al.login_time,
        al.logout_time,
        al.ip_address,
        al.status,
        al.session_duration,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        u.email
      FROM access_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.user_id = ?
      ORDER BY al.login_time DESC
      LIMIT ?
    `, [userId, parseInt(limit)]);

    res.json({
      success: true,
      data: {
        logs: userLogs,
        userId: parseInt(userId)
      }
    });

  } catch (error) {
    console.error('🔴 User Access Logs Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📊 POST /api/access-logs/logout - Record logout time
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    await db.query(`
      UPDATE access_logs 
      SET 
        status = 'inactive', 
        logout_time = NOW(), 
        session_duration = TIMESTAMPDIFF(MINUTE, login_time, NOW())
      WHERE user_id = ? AND status = 'active'
    `, [userId]);

    res.json({
      success: true,
      message: 'Logout recorded successfully'
    });

  } catch (error) {
    console.error('🔴 Logout Record Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

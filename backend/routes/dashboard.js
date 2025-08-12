const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// =============================================
// EMPLOYEE DASHBOARD LOGIC
// =============================================

// Helper: Fetch total sales and count for employees
async function getEmployeeDashboardSummary(userId) {
  const [[salesSummary]] = await pool.query(
    `SELECT COUNT(*) AS count, IFNULL(SUM(amount), 0) AS total
     FROM sales WHERE user_id = ?`,
    [userId]
  );

  const [[pendingLeaves]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM leaves
     WHERE user_id = ? AND status = 'pending'`,
    [userId]
  );

  return {
    salesCount: salesSummary.count,
    totalSalesAmount: salesSummary.total,
    pendingLeaveCount: pendingLeaves.count,
  };
}

// =============================================
// MANAGER DASHBOARD LOGIC
// =============================================

// Helper: Fetch comprehensive dashboard summary for managers
async function getManagerDashboardSummary(userId) {
  // Get user role first
  const [[userInfo]] = await pool.query(
    `SELECT role FROM users WHERE id = ?`,
    [userId]
  );

  const isManager = userInfo?.role === 'manager';

  // Sales metrics - aggregate from all employees if manager
  const salesQuery = isManager 
    ? `SELECT COUNT(*) AS count, IFNULL(SUM(amount), 0) AS total
       FROM sales s 
       JOIN users u ON s.user_id = u.id 
       WHERE u.role = 'employee' OR s.user_id = ?`
    : `SELECT COUNT(*) AS count, IFNULL(SUM(amount), 0) AS total
       FROM sales WHERE user_id = ?`;
  
  const [[salesSummary]] = await pool.query(salesQuery, [userId]);

  const todaySalesQuery = isManager
    ? `SELECT IFNULL(SUM(amount), 0) AS todayTotal
       FROM sales s 
       JOIN users u ON s.user_id = u.id 
       WHERE (u.role = 'employee' OR s.user_id = ?) AND DATE(s.created_at) = CURDATE()`
    : `SELECT IFNULL(SUM(amount), 0) AS todayTotal
       FROM sales 
       WHERE user_id = ? AND DATE(created_at) = CURDATE()`;
  
  const [[todaySales]] = await pool.query(todaySalesQuery, [userId]);

  const yesterdaySalesQuery = isManager
    ? `SELECT IFNULL(SUM(amount), 0) AS yesterdayTotal
       FROM sales s 
       JOIN users u ON s.user_id = u.id 
       WHERE (u.role = 'employee' OR s.user_id = ?) AND DATE(s.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`
    : `SELECT IFNULL(SUM(amount), 0) AS yesterdayTotal
       FROM sales 
       WHERE user_id = ? AND DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
  
  const [[yesterdaySales]] = await pool.query(yesterdaySalesQuery, [userId]);

  // This week's sales - aggregate from all employees if manager
  const thisWeekSalesQuery = isManager
    ? `SELECT IFNULL(SUM(amount), 0) AS weekTotal
       FROM sales s 
       JOIN users u ON s.user_id = u.id 
       WHERE (u.role = 'employee' OR s.user_id = ?) 
       AND YEARWEEK(s.created_at, 1) = YEARWEEK(CURDATE(), 1)`
    : `SELECT IFNULL(SUM(amount), 0) AS weekTotal
       FROM sales 
       WHERE user_id = ? AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)`;
  
  const [[thisWeekSales]] = await pool.query(thisWeekSalesQuery, [userId]);

  // Leave requests - aggregate from all employees if manager
  const leaveQuery = isManager
    ? `SELECT COUNT(*) AS count
       FROM leaves l
       JOIN users u ON l.user_id = u.id
       WHERE (u.role = 'employee' OR l.user_id = ?) AND l.status = 'pending'`
    : `SELECT COUNT(*) AS count
       FROM leaves
       WHERE user_id = ? AND status = 'pending'`;
  
  const [[pendingLeaves]] = await pool.query(leaveQuery, [userId]);

  // Restock alerts - aggregate from all employees if manager
  const restockQuery = isManager
    ? `SELECT COUNT(*) AS count
       FROM restocks r 
       JOIN users u ON r.user_id = u.id
       WHERE (u.role = 'employee' OR r.user_id = ?) AND r.status = 'pending'`
    : `SELECT COUNT(*) AS count
       FROM restocks 
       WHERE user_id = ? AND status = 'pending'`;
  
  const [[restockAlerts]] = await pool.query(restockQuery, [userId]);

  // Employee metrics - show all employees if manager
  const employeeQuery = isManager
    ? `SELECT 
         COUNT(*) AS total,
         SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) AS employees,
         SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) AS managers
       FROM users`
    : `SELECT 
         1 AS total,
         CASE WHEN role = 'employee' THEN 1 ELSE 0 END AS employees,
         CASE WHEN role = 'manager' THEN 1 ELSE 0 END AS managers
       FROM users WHERE id = ?`;
  
  const employeeParams = isManager ? [] : [userId];
  const [[employeeStats]] = await pool.query(employeeQuery, employeeParams);

  // Calculate sales growth
  const salesGrowth =
    yesterdaySales.yesterdayTotal > 0
      ? ((todaySales.todayTotal - yesterdaySales.yesterdayTotal) /
          yesterdaySales.yesterdayTotal) *
        100
      : 0;

  return {
    salesMetrics: {
      todayTotal: todaySales.todayTotal,
      weekTotal: thisWeekSales.weekTotal,
      salesGrowth: salesGrowth,
      totalSales: salesSummary.total,
      salesCount: salesSummary.count,
    },
    leaveRequests: {
      pending: pendingLeaves.count,
    },
    inventory: {
      alerts: restockAlerts.count,
    },
    employees: {
      total: employeeStats.total || 0,
      employees: employeeStats.employees || 0,
      managers: employeeStats.managers || 0,
    },
  };
}

// Helper: Fetch recent activities for managers
async function getManagerRecentActivities(userId) {
  // Check if user is a manager
  const [[userInfo]] = await pool.query(
    `SELECT role FROM users WHERE id = ?`,
    [userId]
  );
  
  const isManager = userInfo?.role === 'manager';
  
  // For managers: show activities from all employees + manager
  // For employees: show only their own activities
  const salesQuery = isManager
    ? `SELECT 'sale' as type, CONCAT('Sale by ', u.first_name, ' ', u.last_name, ': ', s.item) as description, 
              s.amount as value, s.created_at
       FROM sales s 
       JOIN users u ON s.user_id = u.id 
       WHERE u.role = 'employee' OR s.user_id = ?`
    : `SELECT 'sale' as type, CONCAT('Sale: ', item) as description, 
              amount as value, created_at
       FROM sales WHERE user_id = ?`;
  
  const restockQuery = isManager
    ? `SELECT 'restock' as type, CONCAT('Restock by ', u.first_name, ' ', u.last_name, ': ', r.item) as description, 
              r.quantity as value, r.created_at
       FROM restocks r 
       JOIN users u ON r.user_id = u.id 
       WHERE u.role = 'employee' OR r.user_id = ?`
    : `SELECT 'restock' as type, CONCAT('Restock: ', item) as description, 
              quantity as value, created_at
       FROM restocks WHERE user_id = ?`;
  
  const [activities] = await pool.query(
    `(${salesQuery})
     UNION ALL
     (${restockQuery})
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId, userId]
  );
  return activities;
}

// Helper: Fetch pending leave requests for managers
async function getManagerPendingLeaveRequests(userId) {
  // Check if user is a manager
  const [[userInfo]] = await pool.query(
    `SELECT role FROM users WHERE id = ?`,
    [userId]
  );
  
  const isManager = userInfo?.role === 'manager';
  
  // For managers: show all pending leave requests from employees
  // For employees: show only their own pending requests
  const leaveQuery = isManager
    ? `SELECT l.id, u.first_name, u.last_name, 
              DATE_FORMAT(l.start_date, '%Y-%m-%d') as start_date,
              DATE_FORMAT(l.end_date, '%Y-%m-%d') as end_date,
              l.reason, l.created_at
       FROM leaves l
       JOIN users u ON l.user_id = u.id
       WHERE (u.role = 'employee' OR l.user_id = ?) AND l.status = 'pending'
       ORDER BY l.created_at DESC
       LIMIT 10`
    : `SELECT l.id, u.first_name, u.last_name, 
              DATE_FORMAT(l.start_date, '%Y-%m-%d') as start_date,
              DATE_FORMAT(l.end_date, '%Y-%m-%d') as end_date,
              l.reason, l.created_at
       FROM leaves l
       JOIN users u ON l.user_id = u.id
       WHERE l.user_id = ? AND l.status = 'pending'
       ORDER BY l.created_at DESC
       LIMIT 5`;
  
  const [leaves] = await pool.query(leaveQuery, [userId]);
  return leaves;
}

// Helper: Fetch urgent alerts for managers
async function getManagerUrgentAlerts(userId) {
  // Check if user is a manager
  const [[userInfo]] = await pool.query(
    `SELECT role FROM users WHERE id = ?`,
    [userId]
  );
  
  const isManager = userInfo?.role === 'manager';
  
  // For managers: show alerts from all employees + manager
  // For employees: show only their own alerts
  const alertQuery = isManager
    ? `SELECT 'restock' as type, 
              CONCAT('Pending restock by ', u.first_name, ' ', u.last_name, ': ', r.item) as message,
              'urgent' as priority,
              r.created_at
       FROM restocks r
       JOIN users u ON r.user_id = u.id
       WHERE (u.role = 'employee' OR r.user_id = ?) AND r.status = 'pending'
       ORDER BY r.created_at DESC
       LIMIT 10`
    : `SELECT 'restock' as type, 
              CONCAT('Pending restock: ', item) as message,
              'urgent' as priority,
              created_at
       FROM restocks 
       WHERE user_id = ? AND status = 'pending'
       ORDER BY created_at DESC
       LIMIT 5`;
  
  const [alerts] = await pool.query(alertQuery, [userId]);
  return alerts;
}

// =============================================
// UNIFIED DASHBOARD LOGIC
// =============================================

// Main helper: Determine user role and call appropriate functions
async function getDashboardSummary(userId) {
  // Get user role
  const [[userInfo]] = await pool.query(
    `SELECT role FROM users WHERE id = ?`,
    [userId]
  );

  const isManager = userInfo?.role === 'manager';
  
  // Call appropriate function based on role
  if (isManager) {
    return await getManagerDashboardSummary(userId);
  } else {
    return await getEmployeeDashboardSummary(userId);
  }
}

// Helper: Fetch 5 latest sales
async function getRecentSales(userId) {
  const [sales] = await pool.query(
    `SELECT item, amount, DATE_FORMAT(created_at, '%Y-%m-%d') AS date
     FROM sales
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  );
  return sales;
}

// Helper: Fetch 5 latest restocks
async function getRecentRestocks(userId) {
  const [restocks] = await pool.query(
    `SELECT item, quantity, DATE_FORMAT(created_at, '%Y-%m-%d') AS date
     FROM restocks
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  );
  return restocks;
}

// GET /api/dashboard/manager - Manager dashboard endpoint
router.get("/manager", async (req, res) => {
  const userId = req.user?.id || req.query.userId; // Support both auth middleware and query param

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const summary = await getManagerDashboardSummary(userId);
    const recentActivities = await getManagerRecentActivities(userId);
    const pendingLeaveRequests = await getManagerPendingLeaveRequests(userId);
    const urgentAlerts = await getManagerUrgentAlerts(userId);

    res.json({
      ...summary,
      recentActivities,
      pendingLeaveRequests,
      urgentAlerts,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Manager dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/dashboard?userId=... (legacy endpoint for backward compatibility)
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const summary = await getDashboardSummary(userId);
    const recentSales = await getRecentSales(userId);
    const recentRestocks = await getRecentRestocks(userId);

    res.json({ summary, recentSales, recentRestocks });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/dashboard/leave/approve/:id - Approve leave request
router.post("/leave/approve/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // Check if user is a manager
    const [[userInfo]] = await pool.query(
      `SELECT role FROM users WHERE id = ?`,
      [userId]
    );
    
    const isManager = userInfo?.role === 'manager';
    
    // Managers can approve any employee leave request, employees can only approve their own
    const updateQuery = isManager
      ? `UPDATE leaves l 
         JOIN users u ON l.user_id = u.id 
         SET l.status = 'approved', l.updated_at = NOW() 
         WHERE l.id = ? AND (u.role = 'employee' OR l.user_id = ?)`
      : `UPDATE leaves SET status = 'approved', updated_at = NOW() 
         WHERE id = ? AND user_id = ?`;
    
    const result = await pool.query(updateQuery, [id, userId]);
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "Leave request not found or not authorized" });
    }

    res.json({ message: "Leave request approved successfully" });
  } catch (err) {
    console.error("Leave approval error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/dashboard/leave/reject/:id - Reject leave request
router.post("/leave/reject/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // Check if user is a manager
    const [[userInfo]] = await pool.query(
      `SELECT role FROM users WHERE id = ?`,
      [userId]
    );
    
    const isManager = userInfo?.role === 'manager';
    
    // Managers can reject any employee leave request, employees can only reject their own
    const updateQuery = isManager
      ? `UPDATE leaves l 
         JOIN users u ON l.user_id = u.id 
         SET l.status = 'rejected', l.updated_at = NOW() 
         WHERE l.id = ? AND (u.role = 'employee' OR l.user_id = ?)`
      : `UPDATE leaves SET status = 'rejected', updated_at = NOW() 
         WHERE id = ? AND user_id = ?`;
    
    const result = await pool.query(updateQuery, [id, userId]);
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "Leave request not found or not authorized" });
    }

    res.json({ message: "Leave request rejected successfully" });
  } catch (err) {
    console.error("Leave rejection error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

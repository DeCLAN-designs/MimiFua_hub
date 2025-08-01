const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Helper: Fetch total sales and count
async function getDashboardSummary(userId) {
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

// GET /api/dashboard?userId=...
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

module.exports = router;

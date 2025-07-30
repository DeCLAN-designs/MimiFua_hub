const express = require("express");
const router = express.Router();
const db = require("../config/db"); // mysql2/promise
const {
  authenticateToken,
  verify,
  requireManager,
  requireEmployee,
} = require("../middleware/auth");

// @desc    Employee submits leave request
// @route   POST /api/leaves
router.post(
  "/",
  authenticateToken,
  verify,
  requireEmployee,
  async (req, res) => {
    const { reason, start_date, end_date } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!reason?.trim() || !start_date || !end_date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date." });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO leaves (user_id, reason, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?)`,
        [userId, reason.trim(), start_date, end_date, "pending"]
      );

      return res.status(201).json({
        message: "Leave request submitted.",
        leaveId: result.insertId,
      });
    } catch (err) {
      console.error("[LEAVE SUBMIT ERROR]", err);
      return res
        .status(500)
        .json({ error: "Server error while submitting leave request." });
    }
  }
);

// @desc    Employee gets their leave requests
// @route   GET /api/leaves/my
router.get(
  "/my",
  authenticateToken,
  verify,
  requireEmployee,
  async (req, res) => {
    const userId = req.user.id;

    try {
      const [rows] = await db.query(
        `SELECT id, reason, start_date, end_date, status, created_at
       FROM leaves
       WHERE user_id = ?
       ORDER BY created_at DESC`,
        [userId]
      );

      return res.json(rows);
    } catch (err) {
      console.error("[LEAVE FETCH MY ERROR]", err);
      return res
        .status(500)
        .json({ error: "Failed to retrieve leave history." });
    }
  }
);

// @desc    Manager gets all leave requests
// @route   GET /api/leaves
router.get("/", authenticateToken, verify, requireManager, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT leaves.id, users.full_name, reason, start_date, end_date, status, leaves.created_at
       FROM leaves
       JOIN users ON users.id = leaves.user_id
       ORDER BY leaves.created_at DESC
       LIMIT 100`
    );

    return res.json(rows);
  } catch (err) {
    console.error("[LEAVE FETCH ALL ERROR]", err);
    return res
      .status(500)
      .json({ error: "Failed to retrieve leave requests." });
  }
});

// @desc    Manager updates leave request status
// @route   PATCH /api/leaves/:id/status
router.patch(
  "/:id/status",
  authenticateToken,
  verify,
  requireManager,
  async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    try {
      const [result] = await db.query(
        `UPDATE leaves
       SET status = ?, updated_at = NOW()
       WHERE id = ?`,
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Leave request not found." });
      }

      return res.json({
        message: "Leave request status updated successfully.",
      });
    } catch (err) {
      console.error("[LEAVE STATUS UPDATE ERROR]", err);
      return res
        .status(500)
        .json({ error: "Server error updating leave status." });
    }
  }
);

module.exports = router;

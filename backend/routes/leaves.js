const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { body, validationResult } = require("express-validator");
const {
  authenticateToken,
  verify,
  requireEmployee,
  requireManager,
} = require("../middleware/auth");

// Validators
const validateLeaveRequest = [
  body("leave_type")
    .isIn([
      "Sick Leave",
      "Vacation",
      "Emergency",
      "Family Obligation",
      "Medical Appointment",
      "Mental Health",
      "Personal Development",
      "Bereavement",
      "Jury Duty",
      "Other",
    ])
    .withMessage("Invalid leave type"),
  body("start_date")
    .isISO8601()
    .withMessage("Start date must be in YYYY-MM-DD format")
    .custom((value, { req }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    })
    .withMessage("Start date cannot be in the past"),
  body("end_date")
    .isISO8601()
    .withMessage("End date must be in YYYY-MM-DD format")
    .custom((value, { req }) => {
      if (!req.body.start_date) return true;
      return new Date(value) >= new Date(req.body.start_date);
    })
    .withMessage("End date must be on or after start date"),
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ max: 1000 })
    .withMessage("Reason cannot exceed 1000 characters"),
];

const validateStatusUpdate = [
  body("status")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Invalid status value"),
];

// Helper function to prevent caching
const noCache = (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

/**
 * @route POST /api/leaves
 * @desc Submit a new leave request
 * @access Private (Employee)
 */
router.post(
  "/",
  authenticateToken,
  verify,
  requireEmployee,
  validateLeaveRequest,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { leave_type, start_date, end_date, reason } = req.body;
    const user_id = req.user.id;

    try {
      // Check for overlapping leaves
      const [overlapping] = await db.execute(
        `SELECT id FROM leaves 
         WHERE user_id = ? 
         AND status IN ('pending', 'approved')
         AND (
           (start_date <= ? AND end_date >= ?) OR
           (start_date <= ? AND end_date >= ?) OR
           (start_date >= ? AND end_date <= ?)
         )`,
        [
          user_id,
          end_date,
          start_date,
          start_date,
          end_date,
          start_date,
          end_date,
        ]
      );

      if (overlapping.length > 0) {
        return res.status(409).json({
          error: "Leave conflict",
          message:
            "You already have an approved or pending leave for this period",
        });
      }

      const [result] = await db.execute(
        `INSERT INTO leaves 
         (user_id, leave_type, start_date, end_date, reason, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [user_id, leave_type, start_date, end_date, reason.trim()]
      );

      // Fetch the newly created leave with all details
      const [newLeave] = await db.execute(`SELECT * FROM leaves WHERE id = ?`, [
        result.insertId,
      ]);

      return res.status(201).json({
        success: true,
        message: "Leave request submitted successfully",
        leave: newLeave[0],
      });
    } catch (err) {
      console.error("Leave submission error:", err);
      return res.status(500).json({
        error: "Server error",
        message: "Failed to submit leave request",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
      });
    }
  }
);

/**
 * @route GET /api/leaves/my
 * @desc Get current user's leave requests
 * @access Private (Employee)
 */
router.get(
  "/my",
  noCache,
  authenticateToken,
  verify,
  requireEmployee,
  async (req, res) => {
    try {
      const [leaves] = await db.execute(
        `SELECT id, leave_type, start_date, end_date, reason, status, 
                created_at, updated_at
         FROM leaves 
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [req.user.id]
      );

      return res.json({
        success: true,
        count: leaves.length,
        leaves,
      });
    } catch (err) {
      console.error("Error fetching leaves:", err);
      return res.status(500).json({
        error: "Server error",
        message: "Failed to fetch leave requests",
      });
    }
  }
);

/**
 * @route GET /api/leaves/:id
 * @desc Get specific leave request
 * @access Private (Employee or Manager for their subordinates)
 */
router.get("/:id", noCache, authenticateToken, verify, async (req, res) => {
  try {
    const [leave] = await db.execute(
      `SELECT l.id, l.user_id, u.full_name, l.leave_type, l.start_date, l.end_date, 
              l.reason, l.status, l.created_at, l.updated_at
       FROM leaves l
       JOIN users u ON l.user_id = u.id
       WHERE l.id = ?`,
      [req.params.id]
    );

    if (leave.length === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "Leave request not found",
      });
    }

    // Check if the requesting user owns the leave or is a manager
    if (req.user.id !== leave[0].user_id && req.user.role !== "manager") {
      return res.status(403).json({
        error: "Forbidden",
        message: "You don't have permission to access this leave request",
      });
    }

    return res.json({
      success: true,
      leave: leave[0],
    });
  } catch (err) {
    console.error("Error fetching leave:", err);
    return res.status(500).json({
      error: "Server error",
      message: "Failed to fetch leave request",
    });
  }
});

/**
 * @route PUT /api/leaves/:id
 * @desc Update a leave request
 * @access Private (Employee for their own pending leaves)
 */
router.put(
  "/:id",
  authenticateToken,
  verify,
  requireEmployee,
  validateLeaveRequest,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { leave_type, start_date, end_date, reason } = req.body;
    const user_id = req.user.id;

    try {
      // Verify the leave exists and belongs to the user
      const [existingLeave] = await db.execute(
        `SELECT id, status FROM leaves WHERE id = ? AND user_id = ?`,
        [req.params.id, user_id]
      );

      if (existingLeave.length === 0) {
        return res.status(404).json({
          error: "Not found",
          message: "Leave request not found",
        });
      }

      // Only allow updates for pending leaves
      if (existingLeave[0].status !== "pending") {
        return res.status(400).json({
          error: "Bad request",
          message: "Only pending leaves can be updated",
        });
      }

      // Check for overlapping leaves (excluding current leave)
      const [overlapping] = await db.execute(
        `SELECT id FROM leaves 
         WHERE user_id = ? 
         AND id != ?
         AND status IN ('pending', 'approved')
         AND (
           (start_date <= ? AND end_date >= ?) OR
           (start_date <= ? AND end_date >= ?) OR
           (start_date >= ? AND end_date <= ?)
         )`,
        [
          user_id,
          req.params.id,
          end_date,
          start_date,
          start_date,
          end_date,
          start_date,
          end_date,
        ]
      );

      if (overlapping.length > 0) {
        return res.status(409).json({
          error: "Leave conflict",
          message:
            "You already have an approved or pending leave for this period",
        });
      }

      const [result] = await db.execute(
        `UPDATE leaves 
         SET leave_type = ?, start_date = ?, end_date = ?, reason = ?, updated_at = NOW()
         WHERE id = ?`,
        [leave_type, start_date, end_date, reason.trim(), req.params.id]
      );

      if (result.affectedRows === 0) {
        throw new Error("No rows were updated");
      }

      // Fetch the updated leave
      const [updatedLeave] = await db.execute(
        `SELECT * FROM leaves WHERE id = ?`,
        [req.params.id]
      );

      return res.json({
        success: true,
        message: "Leave request updated successfully",
        leave: updatedLeave[0],
      });
    } catch (err) {
      console.error("Leave update error:", err);
      return res.status(500).json({
        error: "Server error",
        message: "Failed to update leave request",
      });
    }
  }
);

/**
 * @route DELETE /api/leaves/:id
 * @desc Delete a leave request
 * @access Private (Employee for their own pending leaves)
 */
router.delete(
  "/:id",
  authenticateToken,
  verify,
  requireEmployee,
  async (req, res) => {
    try {
      // Verify the leave exists and belongs to the user
      const [existingLeave] = await db.execute(
        `SELECT id, status FROM leaves WHERE id = ? AND user_id = ?`,
        [req.params.id, req.user.id]
      );

      if (existingLeave.length === 0) {
        return res.status(404).json({
          error: "Not found",
          message: "Leave request not found",
        });
      }

      // Only allow deletion for pending leaves
      if (existingLeave[0].status !== "pending") {
        return res.status(400).json({
          error: "Bad request",
          message: "Only pending leaves can be deleted",
        });
      }

      const [result] = await db.execute(`DELETE FROM leaves WHERE id = ?`, [
        req.params.id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("No rows were deleted");
      }

      return res.json({
        success: true,
        message: "Leave request deleted successfully",
      });
    } catch (err) {
      console.error("Leave deletion error:", err);
      return res.status(500).json({
        error: "Server error",
        message: "Failed to delete leave request",
      });
    }
  }
);

/**
 * @route GET /api/leaves
 * @desc Get all leave requests (for managers)
 * @access Private (Manager)
 */
router.get(
  "/",
  noCache,
  authenticateToken,
  verify,
  requireManager,
  async (req, res) => {
    try {
      const [leaves] = await db.execute(
        `SELECT l.id, l.user_id, u.first_name, u.last_name, u.email, l.leave_type, l.start_date, l.end_date, 
              l.reason, l.status, l.created_at, l.updated_at
       FROM leaves l
       JOIN users u ON l.user_id = u.id
       ORDER BY l.created_at DESC
       LIMIT 100`
      );

      return res.json({
        success: true,
        count: leaves.length,
        leaves,
      });
    } catch (err) {
      console.error("Error fetching leaves:", err);
      return res.status(500).json({
        error: "Server error",
        message: "Failed to fetch leave requests",
      });
    }
  }
);

/**
 * @route PATCH /api/leaves/:id/status
 * @desc Update leave request status (approve/reject)
 * @access Private (Manager)
 */
router.patch(
  "/:id/status",
  authenticateToken,
  verify,
  requireManager,
  validateStatusUpdate,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { status } = req.body;

    try {
      const [result] = await db.execute(
        `UPDATE leaves 
         SET status = ?, updated_at = NOW()
         WHERE id = ?`,
        [status, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Not found",
          message: "Leave request not found",
        });
      }

      // Fetch the updated leave
      const [updatedLeave] = await db.execute(
        `SELECT * FROM leaves WHERE id = ?`,
        [req.params.id]
      );

      return res.json({
        success: true,
        message: "Leave request status updated successfully",
        leave: updatedLeave[0],
      });
    } catch (err) {
      console.error("Status update error:", err);
      return res.status(500).json({
        error: "Server error",
        message: "Failed to update leave status",
      });
    }
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { body, validationResult } = require("express-validator");
const {
  authenticateToken,
  verify,
  requireEmployee,
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

      return res.status(201).json({
        success: true,
        message: "Leave request submitted successfully",
        leave_id: result.insertId,
        leave: {
          id: result.insertId,
          user_id,
          leave_type,
          start_date,
          end_date,
          reason: reason.trim(),
          status: "pending",
        },
      });
    } catch (err) {
      console.error("Leave submission error:", err);

      // Handle specific database errors
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          error: "Invalid user",
          message: "User not found",
        });
      }

      if (err.code === "ER_TRUNCATED_WRONG_VALUE") {
        return res.status(400).json({
          error: "Invalid date format",
          message: "Please use YYYY-MM-DD format for dates",
        });
      }

      return res.status(500).json({
        error: "Server error",
        message: "Failed to submit leave request",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
      });
    }
  }
);

module.exports = router;

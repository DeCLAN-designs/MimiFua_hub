// routes/leaves.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { body, validationResult } = require("express-validator");

// Validators
const validateLeaveRequest = [
  body("user_id").isInt().withMessage("User ID must be an integer"),
  body("leave_type").notEmpty().withMessage("Leave type is required"),
  body("start_date").isDate().withMessage("Start date must be a valid date"),
  body("end_date").isDate().withMessage("End date must be a valid date"),
  body("reason").notEmpty().withMessage("Reason is required"),
];

// POST /api/leaves
router.post("/", validateLeaveRequest, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { user_id, leave_type, start_date, end_date, reason } = req.body;

  try {
    const sql = `
      INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    const [result] = await db.execute(sql, [
      user_id,
      leave_type,
      start_date,
      end_date,
      reason,
    ]);
    res
      .status(201)
      .json({ message: "Leave request submitted", leave_id: result.insertId });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

// routes/sales.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { body, query, validationResult } = require("express-validator");

// Utils
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /api/sales
router.post(
  "/",
  [
    body("item").isString().trim().notEmpty().withMessage("Item is required."),
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a number greater than 0."),
    body("user_id").isInt({ gt: 0 }).withMessage("Valid user ID is required."),
  ],
  validate,
  async (req, res) => {
    const { item, amount, user_id } = req.body;

    try {
      const [result] = await db.execute(
        `INSERT INTO sales (user_id, item, amount) VALUES (?, ?, ?)`,
        [user_id, item, amount]
      );

      res.status(201).json({
        message: "Sale recorded",
        sale: {
          id: result.insertId,
          user_id,
          item,
          amount,
          date: new Date().toISOString().split("T")[0],
        },
      });
    } catch (err) {
      console.error("DB Insert Error:", err);
      res.status(500).json({ error: "Server error. Could not save sale." });
    }
  }
);

// GET /api/sales?userId=#
router.get(
  "/",
  [query("userId").isInt({ gt: 0 }).withMessage("Valid userId required")],
  validate,
  async (req, res) => {
    const userId = req.query.userId;

    try {
      const [rows] = await db.execute(
        `SELECT id, item, amount, date FROM sales WHERE user_id = ? ORDER BY date DESC`,
        [userId]
      );

      if (!rows.length)
        return res.status(404).json({ error: "No sales found for user" });

      res.json({ sales: rows });
    } catch (err) {
      console.error("DB Fetch Error:", err);
      res.status(500).json({ error: "Could not fetch sales" });
    }
  }
);

module.exports = router;

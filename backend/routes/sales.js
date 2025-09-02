// routes/sales.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { body, query, validationResult } = require("express-validator");

// === Utility: Validation handler ===
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// === POST /api/sales ===
// Record a new sale
router.post(
  "/",
  [
    body("item").isString().trim().notEmpty().withMessage("Item is required."),
    body("quantity").isFloat({ gt: 0 }).withMessage("Quantity must be > 0"),
    body("unit_id").isInt({ gt: 0 }).withMessage("Valid unit_id required"),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be > 0"),
    body("user_id").isInt({ gt: 0 }).withMessage("Valid user_id required"),
  ],
  validate,
  async (req, res) => {
    const { item, quantity, unit_id, amount, user_id } = req.body;

    try {
      // Insert sale
      const [result] = await db.execute(
        `INSERT INTO sales (user_id, item, quantity, unit_id, amount) 
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, item, quantity, unit_id, amount]
      );

      // Fetch unit metadata
      const [unitRows] = await db.execute(
        `SELECT name, symbol FROM units WHERE id = ?`,
        [unit_id]
      );
      const unit = unitRows[0] || {};

      // Response object matches frontend expectation
      res.status(201).json({
        message: "Sale recorded",
        sale: {
          id: result.insertId,
          user_id,
          item,
          quantity,
          unit_id,
          unit_name: unit.name || null,
          unit_symbol: unit.symbol || null,
          amount,
          created_at: new Date().toISOString(), // ✅ Consistent field name
        },
      });
    } catch (err) {
      console.error("DB Insert Error:", err);
      res.status(500).json({ error: "Server error. Could not save sale." });
    }
  }
);

// === GET /api/sales/all ===
// Fetch all sales (manager dashboard)
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT s.id, s.item, s.quantity, s.amount, 
              s.created_at, 
              u.first_name, u.last_name, u.email,
              un.name AS unit_name, un.symbol AS unit_symbol
       FROM sales s 
       JOIN users u ON s.user_id = u.id 
       JOIN units un ON s.unit_id = un.id
       ORDER BY s.created_at DESC`
    );

    res.json({ sales: rows });
  } catch (err) {
    console.error("DB Fetch Error:", err);
    res.status(500).json({ error: "Could not fetch all sales" });
  }
});

// === GET /api/sales?userId=123 ===
// Fetch sales for a specific user
router.get(
  "/",
  [query("userId").isInt({ gt: 0 }).withMessage("Valid userId required")],
  validate,
  async (req, res) => {
    const userId = req.query.userId;

    try {
      const [rows] = await db.execute(
        `SELECT s.id, s.item, s.quantity, s.amount, 
                s.created_at,
                un.name AS unit_name, un.symbol AS unit_symbol
         FROM sales s
         JOIN units un ON s.unit_id = un.id
         WHERE s.user_id = ?
         ORDER BY s.created_at DESC`,
        [userId]
      );

      // ✅ Always return array (avoid 404 breaking client)
      res.json({ sales: rows });
    } catch (err) {
      console.error("DB Fetch Error:", err);
      res.status(500).json({ error: "Could not fetch sales" });
    }
  }
);

module.exports = router;

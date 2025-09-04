const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { body, query, validationResult } = require("express-validator");

// === Kenya Time Formatter ===
const formatKenyaDateTime = (date) => {
  return new Date(date.getTime() + 3 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
};

// === Validation handler ===
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
    body("item").isString().trim().notEmpty(),
    body("amount").isFloat({ gt: 0 }),
  ],
  validate,
  async (req, res) => {
    try {
      const { item, amount, user_id, quantity, unit_id } = req.body;
      const createdAt = new Date();

      const [result] = await db.execute(
        `INSERT INTO sales (item, amount, user_id, quantity, unit_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item,
          amount,
          user_id,
          quantity || null,
          unit_id || null,
          createdAt,
          createdAt,
        ]
      );

      const [sale] = await db.execute(
        `SELECT s.*, u.first_name, u.last_name, u.email, CONCAT(u.first_name, ' ', u.last_name) AS employee,
                un.name AS unit_name, un.symbol AS unit_symbol
         FROM sales s
         JOIN users u ON s.user_id = u.id
         LEFT JOIN units un ON s.unit_id = un.id
         WHERE s.id = ?`,
        [result.insertId]
      );

      const saleData = sale[0];
      return res.status(201).json({
        ...saleData,
        created_at: saleData.created_at
          ? formatKenyaDateTime(new Date(saleData.created_at))
          : null,
        updated_at: saleData.updated_at
          ? formatKenyaDateTime(new Date(saleData.updated_at))
          : null,
      });
    } catch (err) {
      console.error("Error creating sale:", err);
      res.status(500).json({ error: "Failed to create sale" });
    }
  }
);

// GET /api/sales?userId=123
router.get(
  "/",
  [query("userId").isInt({ gt: 0 })],
  validate,
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        `SELECT s.id, s.item, s.quantity, s.amount, s.created_at,
                CONCAT(u.first_name, ' ', u.last_name) AS employee,
                u.email,
                un.name AS unit_name, un.symbol AS unit_symbol
         FROM sales s
         JOIN users u ON s.user_id = u.id
         LEFT JOIN units un ON s.unit_id = un.id
         WHERE s.user_id = ?
         ORDER BY s.created_at DESC`,
        [req.query.userId]
      );

      const sales = rows.map((row) => ({
        ...row,
        created_at: row.created_at
          ? formatKenyaDateTime(new Date(row.created_at))
          : null,
      }));

      res.json(sales);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  }
);

// GET /api/sales/all (manager)
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT s.id, s.item, s.quantity, s.amount, s.created_at, s.updated_at, s.user_id,
              u.first_name, u.last_name, CONCAT(u.first_name, ' ', u.last_name) AS employee,
              u.email, un.name AS unit_name, un.symbol AS unit_symbol
       FROM sales s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN units un ON s.unit_id = un.id
       ORDER BY s.created_at DESC`
    );

    const sales = rows.map((sale) => ({
      ...sale,
      amount: parseFloat(sale.amount) || 0,
      created_at: sale.created_at
        ? formatKenyaDateTime(new Date(sale.created_at))
        : null,
      updated_at: sale.updated_at
        ? formatKenyaDateTime(new Date(sale.updated_at))
        : null,
    }));

    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
});

module.exports = router;

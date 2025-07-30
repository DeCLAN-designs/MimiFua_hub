const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/restocks/:userId
// Get all restock requests for a specific employee (most recent first)
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  try {
    const [restocks] = await db.query(
      `
        SELECT 
          r.id,
          r.item,
          r.quantity,
          r.status,
          r.created_at,
          u.id AS user_id,
          CONCAT(u.first_name, ' ', u.last_name) AS full_name
        FROM restocks r
        JOIN users u ON r.user_id = u.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
      `,
      [userId]
    );

    res.status(200).json(restocks);
  } catch (err) {
    console.error("Error fetching restocks:", err);
    res.status(500).json({ error: "Server error fetching restocks" });
  }
});

// POST /api/restocks
// Create a new restock request
router.post("/", async (req, res) => {
  const { user_id, item, quantity } = req.body;

  if (!user_id || !item || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (isNaN(user_id) || isNaN(quantity)) {
    return res.status(400).json({ error: "Invalid user_id or quantity" });
  }

  try {
    // Insert new restock
    const [insertResult] = await db.query(
      `
        INSERT INTO restocks (user_id, item, quantity)
        VALUES (?, ?, ?)
      `,
      [parseInt(user_id), item.trim(), parseInt(quantity)]
    );

    const insertedId = insertResult.insertId;

    // Return the newly created row
    const [newRestockRows] = await db.query(
      `
        SELECT 
          r.id,
          r.item,
          r.quantity,
          r.status,
          r.created_at,
          u.id AS user_id,
          CONCAT(u.first_name, ' ', u.last_name) AS full_name
        FROM restocks r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
      `,
      [insertedId]
    );

    res.status(201).json(newRestockRows[0]);
  } catch (err) {
    console.error("Error creating restock:", err);
    res.status(500).json({ error: "Server error creating restock" });
  }
});

module.exports = router;

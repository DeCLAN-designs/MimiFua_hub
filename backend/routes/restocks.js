const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * GET /api/restocks/all
 * Fetch all restocks across all users
 */
router.get("/all", async (req, res) => {
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
          u.first_name,
          u.last_name,
          u.email,
          un.symbol AS unit_symbol
        FROM restocks r
        JOIN users u ON r.user_id = u.id
        LEFT JOIN units un ON r.unit_id = un.id
        ORDER BY r.created_at DESC
      `
    );

    res.status(200).json({ restocks });
  } catch (err) {
    console.error("Error fetching all restocks:", err);
    res.status(500).json({ error: "Server error fetching restocks" });
  }
});

/**
 * GET /api/restocks/:userId
 * Fetch all restocks for a specific user
 */
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
          CONCAT(u.first_name, ' ', u.last_name) AS full_name,
          u.email,
          un.symbol AS unit_symbol
        FROM restocks r
        JOIN users u ON r.user_id = u.id
        LEFT JOIN units un ON r.unit_id = un.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
      `,
      [parseInt(userId)]
    );

    res.status(200).json({ restocks });
  } catch (err) {
    console.error("Error fetching restocks:", err);
    res.status(500).json({ error: "Server error fetching restocks" });
  }
});

/**
 * POST /api/restocks
 * Create a new restock request
 */
router.post("/", async (req, res) => {
  const { user_id, item, quantity, unit_id } = req.body;

  if (!user_id || !item || !quantity || !unit_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (isNaN(user_id) || isNaN(quantity) || isNaN(unit_id)) {
    return res
      .status(400)
      .json({ error: "Invalid user_id, quantity, or unit_id" });
  }

  try {
    // Insert new restock
    const [insertResult] = await db.query(
      `
        INSERT INTO restocks (user_id, item, quantity, unit_id)
        VALUES (?, ?, ?, ?)
      `,
      [parseInt(user_id), item.trim(), parseFloat(quantity), parseInt(unit_id)]
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
          CONCAT(u.first_name, ' ', u.last_name) AS full_name,
          u.email,
          un.symbol AS unit_symbol
        FROM restocks r
        JOIN users u ON r.user_id = u.id
        LEFT JOIN units un ON r.unit_id = un.id
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

/**
 * PUT /api/restocks/:id/approve
 * Approve a restock request
 */
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid restock ID" });
  }

  try {
    const [result] = await db.query(
      "UPDATE restocks SET status = 'approved' WHERE id = ?",
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Restock request not found" });
    }

    res.status(200).json({ message: "Restock request approved successfully" });
  } catch (err) {
    console.error("Error approving restock:", err);
    res.status(500).json({ error: "Server error approving restock" });
  }
});

/**
 * PUT /api/restocks/:id/reject
 * Reject a restock request
 */
router.put("/:id/reject", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid restock ID" });
  }

  try {
    const [result] = await db.query(
      "UPDATE restocks SET status = 'rejected' WHERE id = ?",
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Restock request not found" });
    }

    res.status(200).json({ message: "Restock request rejected successfully" });
  } catch (err) {
    console.error("Error rejecting restock:", err);
    res.status(500).json({ error: "Server error rejecting restock" });
  }
});

module.exports = router;

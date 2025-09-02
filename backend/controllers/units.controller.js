const db = require("../config/db");

exports.getAllUnits = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, symbol, description FROM units ORDER BY name ASC"
    );
    res.set("Cache-Control", "no-store"); // 🔑 prevent caching
    res.json(rows);
  } catch (err) {
    console.error("Error fetching units:", err);
    res.status(500).json({ message: "Server error while fetching units" });
  }
};

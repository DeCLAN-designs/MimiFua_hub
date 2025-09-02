// services/units.service.js
const pool = require("../config/db");

exports.fetchUnits = async () => {
  // Map symbol → abbreviation so frontend sees "abbreviation"
  const [rows] = await pool.query(
    "SELECT id, name, symbol AS abbreviation FROM units ORDER BY name ASC"
  );
  return rows;
};

exports.createUnit = async (unitData) => {
  const { name, symbol, description } = unitData;
  const [result] = await pool.query(
    "INSERT INTO units (name, symbol, description) VALUES (?, ?, ?)",
    [name, symbol, description || null]
  );
  return result.insertId;
};

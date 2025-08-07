const db = require("../config/db"); // Using mysql2/promise

const fetchAllEmployees = async () => {
  const [rows] = await db.query(
    `SELECT id, first_name, last_name, email, phone, role FROM users ORDER BY created_at DESC`
  );
  return rows;
};

module.exports = {
  fetchAllEmployees,
};

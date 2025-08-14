// services/employees.service.js
const db = require("../config/db");

exports.createEmployee = async ({
  first_name,
  last_name,
  email,
  phone,
  password,
  role,
}) => {
  const sql = `
    INSERT INTO users (first_name, last_name, email, phone, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [first_name, last_name, email, phone, password, role];

  const [result] = await db.query(sql, params);
  return result.insertId;
};

exports.getAllEmployees = async () => {
  const [rows] = await db.query(
    `SELECT id, first_name, last_name, email, phone, role FROM users`
  );
  return rows;
};

exports.updateEmployee = async (
  id,
  { first_name, last_name, email, phone, password, role }
) => {
  const fields = [];
  const values = [];

  if (first_name !== undefined) {
    fields.push("first_name = ?");
    values.push(first_name);
  }
  if (last_name !== undefined) {
    fields.push("last_name = ?");
    values.push(last_name);
  }
  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email);
  }
  if (phone !== undefined) {
    fields.push("phone = ?");
    values.push(phone);
  }
  if (password !== undefined) {
    fields.push("password = ?");
    values.push(password);
  }
  if (role !== undefined) {
    fields.push("role = ?");
    values.push(role);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  const [result] = await db.query(sql, values);

  return result.affectedRows > 0;
};

exports.deleteEmployee = async (id) => {
  const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

exports.updateEmployeeStatus = async (id, status) => {
  // First check if user exists
  const [user] = await db.query(
    `SELECT id, first_name, last_name, email, status FROM users WHERE id = ?`,
    [id]
  );
  
  if (user.length === 0) return null;

  // Update the status
  const [result] = await db.query(
    `UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?`,
    [status, id]
  );

  if (result.affectedRows === 0) return null;

  // Return the updated user data
  return {
    id: user[0].id,
    first_name: user[0].first_name,
    last_name: user[0].last_name,
    email: user[0].email,
    status: status
  };
};

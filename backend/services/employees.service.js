const db = require("../config/db");

exports.getEmployees = async () => {
  const [rows] = await db.execute(
    "SELECT id, first_name, last_name, email, phone, role FROM users"
  );
  return rows;
};

exports.insertEmployee = async ({
  first_name,
  last_name,
  email,
  phone,
  password,
  role,
}) => {
  await db.execute(
    "INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)",
    [first_name, last_name, email, phone, password, role]
  );
};

exports.modifyEmployee = async (
  id,
  { first_name, last_name, email, phone, password, role }
) => {
  const fields = [];
  const values = [];

  if (first_name) fields.push("first_name = ?"), values.push(first_name);
  if (last_name) fields.push("last_name = ?"), values.push(last_name);
  if (email) fields.push("email = ?"), values.push(email);
  if (phone) fields.push("phone = ?"), values.push(phone);
  if (password) fields.push("password = ?"), values.push(password);
  if (role) fields.push("role = ?"), values.push(role);

  values.push(id);

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  await db.execute(sql, values);
};

exports.removeEmployee = async (id) => {
  await db.execute("DELETE FROM users WHERE id = ?", [id]);
};

const {
  getEmployees,
  insertEmployee,
  modifyEmployee,
  removeEmployee,
} = require("../services/employees.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.getAllEmployees = async (req, res) => {
  try {
    const data = await getEmployees();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching employees." });
  }
};

exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0].msg });

  const { first_name, last_name, email, phone, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await insertEmployee({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "Employee created" });
  } catch (err) {
    res.status(500).json({ message: "Error creating employee" });
  }
};

exports.updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0].msg });

  const { id } = req.params;
  const { first_name, last_name, email, phone, password, role } = req.body;

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    await modifyEmployee(id, {
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    res.status(200).json({ message: "Employee updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating employee" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await removeEmployee(id);
    res.status(200).json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee" });
  }
};

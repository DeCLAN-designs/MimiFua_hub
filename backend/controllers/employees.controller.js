// controllers/employees.controller.js
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const employeeService = require("../services/employees.service");

exports.createEmployee = async (req, res) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, phone, password, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee via service
    const newEmployeeId = await employeeService.createEmployee({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ message: "Employee created", id: newEmployeeId });
  } catch (err) {
    console.error("Error creating employee:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", detail: err.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    return res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", detail: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      password, // may be undefined if not updating
      role,
    } = req.body;

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updated = await employeeService.updateEmployee(id, {
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee updated" });
  } catch (err) {
    console.error("Error updating employee:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", detail: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await employeeService.deleteEmployee(id);
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", detail: err.message });
  }
};

exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Must be one of: 'active', 'inactive', 'suspended'" 
      });
    }

    const updated = await employeeService.updateEmployeeStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.status(200).json({ 
      message: `Employee status updated to ${status}`,
      employee: updated
    });
  } catch (err) {
    console.error("Error updating employee status:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", detail: err.message });
  }
};

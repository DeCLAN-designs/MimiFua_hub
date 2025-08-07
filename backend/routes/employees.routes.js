const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.controller");
const { body } = require("express-validator");

// Validation Middleware
const employeeValidation = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Min 6 characters"),
  body("role").isIn(["employee", "manager"]).withMessage("Invalid role"),
];

// Routes
router.get("/", getAllEmployees);
router.post("/", employeeValidation, createEmployee);
router.put("/:id", employeeValidation, updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;

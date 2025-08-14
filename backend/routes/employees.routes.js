const express = require("express");
const router = express.Router();
const employeesController = require("../controllers/employees.controller");
const { body } = require("express-validator");

const validateEmployee = [
  body("first_name").notEmpty(),
  body("last_name").notEmpty(),
  body("email").isEmail(),
  body("phone").notEmpty(),
  body("password").optional().isLength({ min: 6 }),
  body("role").isIn(["employee", "manager"]),
];

router.post("/", validateEmployee, employeesController.createEmployee);
router.get("/", employeesController.getAllEmployees);
router.put("/:id", validateEmployee, employeesController.updateEmployee);
router.delete("/:id", employeesController.deleteEmployee);
router.patch(
  "/:id/status",
  [
    body("status")
      .isIn(["active", "inactive", "suspended"])
      .withMessage("Status must be one of: active, inactive, suspended"),
  ],
  employeesController.updateEmployeeStatus
);

module.exports = router;

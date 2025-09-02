const express = require("express");
const router = express.Router();
const unitsController = require("../controllers/units.controller");

// Define the route correctly
router.get("/", unitsController.getAllUnits); // <-- don't call with ()

module.exports = router;

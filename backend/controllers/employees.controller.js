const { fetchAllEmployees } = require("../services/employees.service");

const getAllEmployees = async (req, res) => {
  try {
    const employees = await fetchAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

module.exports = {
  getAllEmployees,
};

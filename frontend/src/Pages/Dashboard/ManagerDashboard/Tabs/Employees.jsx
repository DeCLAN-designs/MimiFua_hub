import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeModal from "../../../../../src/UI/EmployeesModal";
import "./Employees.css";

const defaultForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  role: "employee",
};

const Employees = () => {
  const [tab, setTab] = useState("manage");
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      const employeeOnly = res.data.filter((emp) => emp.role === "employee");
      setEmployees(employeeOnly);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const handleTabChange = (newTab) => setTab(newTab);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    if (!showModal) {
      setFormData(defaultForm);
      setFormErrors({});
      setShowPassword(false);
      setEditMode(false);
      setEditId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim())
      errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!editMode && !formData.password.trim())
      errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editMode) {
        const payload = { ...formData };
        if (!payload.password.trim()) delete payload.password;
        await axios.put(
          `http://localhost:5000/api/employees/${editId}`,
          payload
        );
      } else {
        const payload = { ...formData, role: "employee" };
        await axios.post("http://localhost:5000/api/employees", payload);
      }
      fetchEmployees();
      toggleModal();
    } catch (err) {
      console.error("Error saving employee:", err);
      setFormErrors({
        api: err.response?.data?.message || "Unexpected error occurred.",
      });
    }
  };

  const handleEdit = (employee) => {
    setFormData({ ...employee, password: "" });
    setEditMode(true);
    setEditId(employee.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  return (
    <div className="employees-container">
      <h2>👥 Employee Management</h2>

      <div className="employee-tabs">
        <button
          className={tab === "manage" ? "active" : ""}
          onClick={() => handleTabChange("manage")}
        >
          🛠️ Manage Employees
        </button>
        <button
          className={tab === "roles" ? "active" : ""}
          onClick={() => handleTabChange("roles")}
        >
          🧑‍💼 Assign Roles
        </button>
      </div>

      {tab === "manage" && (
        <div className="manage-employees">
          <div className="employees-header">
            <h2>📋 Employee List</h2>
            <button className="add-btn" onClick={toggleModal}>
              ➕ Add Employee
            </button>
          </div>

          <table className="employees-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}</td>
                  <td>{`${emp.first_name} ${emp.last_name}`}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.role}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(emp)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(emp.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "roles" && (
        <div className="assign-roles">
          <h2>🚧 Assign Roles (Coming Soon)</h2>
        </div>
      )}

      {showModal && (
        <EmployeeModal closeModal={toggleModal}>
          <div className="employee-form-wrapper">
            <h3>{editMode ? "✏️ Edit Employee" : "➕ Add New Employee"}</h3>
            {formErrors.api && <p className="error">{formErrors.api}</p>}

            <form className="employee-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {formErrors.first_name && (
                  <span className="error">{formErrors.first_name}</span>
                )}
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {formErrors.last_name && (
                  <span className="error">{formErrors.last_name}</span>
                )}
              </div>
              <div className="form-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <span className="error">{formErrors.email}</span>
                )}
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {formErrors.phone && (
                  <span className="error">{formErrors.phone}</span>
                )}
              </div>
              <div className="form-row">
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={
                      editMode
                        ? "Leave blank to keep current password"
                        : "Password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
                {!editMode && formErrors.password && (
                  <span className="error">{formErrors.password}</span>
                )}
              </div>
              <div className="form-row">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled
                >
                  <option value="employee">👷 Employee</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">{editMode ? "Update" : "Create"}</button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </EmployeeModal>
      )}
    </div>
  );
};

export default Employees;

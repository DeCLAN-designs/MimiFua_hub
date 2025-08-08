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
  status: "active",
};

const Employees = () => {
  const [tab, setTab] = useState("manage");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("first_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // table or cards

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get(
        `http://localhost:5000/api/employees`,
        config
      );
      const employeeOnly = res.data.filter((emp) => emp.role === "employee");
      setEmployees(employeeOnly);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
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
    
    // Name validation
    if (!formData.first_name.trim())
      errors.first_name = "First name is required";
    if (!formData.last_name.trim()) 
      errors.last_name = "Last name is required";
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else {
      const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Please enter a valid phone number";
      }
    }
    
    // Password validation
    if (!editMode && !formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!editMode && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      if (editMode) {
        const payload = { ...formData };
        if (!payload.password.trim()) delete payload.password;
        await axios.put(
          `http://localhost:5000/api/employees/${editId}`,
          payload,
          config
        );
      } else {
        const payload = { ...formData, role: "employee" };
        await axios.post(
          `http://localhost:5000/api/employees`,
          payload,
          config
        );
      }
      fetchEmployees();
      toggleModal();
    } catch (err) {
      console.error("Error saving employee:", err);
      setFormErrors({
        api: err.response?.data?.message || "Unexpected error occurred.",
      });
    } finally {
      setLoading(false);
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
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://localhost:5000/api/employees/${id}`, config);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError(err.response?.data?.message || "Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = 
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === "full_name") {
        aValue = `${a.first_name} ${a.last_name}`;
        bValue = `${b.first_name} ${b.last_name}`;
      }
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Handle status toggle
  const handleStatusToggle = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.patch(
        `http://localhost:5000/api/employees/${employeeId}/status`,
        { status: newStatus },
        config
      );
      fetchEmployees();
    } catch (err) {
      console.error("Error updating employee status:", err);
      setError(err.response?.data?.message || "Failed to update employee status");
    } finally {
      setLoading(false);
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
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
            <div className="header-title">
              <h2>📋 Employee List</h2>
              <div className="employee-stats">
                <span className="stat">Total: {employees.length}</span>
                <span className="stat">Active: {employees.filter(e => e.status === 'active').length}</span>
                <span className="stat">Inactive: {employees.filter(e => e.status === 'inactive').length}</span>
              </div>
            </div>
            <div className="header-controls">
              <div className="search-filters">
                <input
                  type="text"
                  placeholder="🔍 Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  📊
                </button>
                <button
                  className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Card View"
                >
                  🃏
                </button>
                <button className="add-btn" onClick={toggleModal}>
                  ➕ Add Employee
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
              <button onClick={fetchEmployees} className="retry-btn">
                🔄 Retry
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-message">
              ⏳ Loading employees...
            </div>
          )}

          {viewMode === 'table' ? (
            <div className="table-container">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('full_name')}
                      title="Click to sort"
                    >
                      Full Name {getSortIcon('full_name')}
                    </th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('email')}
                      title="Click to sort"
                    >
                      Email {getSortIcon('email')}
                    </th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee, index) => (
                      <tr key={employee.id}>
                        <td>{startIndex + index + 1}</td>
                        <td className="employee-name">
                          <div className="name-with-avatar">
                            <div className="avatar">
                              {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                            </div>
                            <span>{`${employee.first_name} ${employee.last_name}`}</span>
                          </div>
                        </td>
                        <td>{employee.email}</td>
                        <td>{employee.phone}</td>
                        <td>
                          <span className="role-badge">{employee.role}</span>
                        </td>
                        <td>
                          <button
                            className={`status-toggle ${employee.status || 'active'}`}
                            onClick={() => handleStatusToggle(employee.id, employee.status || 'active')}
                            disabled={loading}
                            title={`Click to ${employee.status === 'active' ? 'deactivate' : 'activate'}`}
                          >
                            {employee.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                          </button>
                        </td>
                        <td className="actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(employee)}
                            disabled={loading}
                            title="Edit employee"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(employee.id)}
                            disabled={loading}
                            title="Delete employee"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        {searchTerm || statusFilter !== 'all' 
                          ? `No employees found matching current filters` 
                          : "No employees found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="employees-cards">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <div key={employee.id} className="employee-card">
                    <div className="card-header">
                      <div className="avatar-large">
                        {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                      </div>
                      <div className="employee-info">
                        <h3>{`${employee.first_name} ${employee.last_name}`}</h3>
                        <p className="employee-email">{employee.email}</p>
                        <p className="employee-phone">{employee.phone}</p>
                      </div>
                      <div className="card-status">
                        <span className={`status-badge ${employee.status || 'active'}`}>
                          {employee.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button
                        className="status-toggle-card"
                        onClick={() => handleStatusToggle(employee.id, employee.status || 'active')}
                        disabled={loading}
                      >
                        {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="edit-btn-card"
                        onClick={() => handleEdit(employee)}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn-card"
                        onClick={() => handleDelete(employee.id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-cards">
                  {searchTerm || statusFilter !== 'all' 
                    ? `No employees found matching current filters` 
                    : "No employees found"}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
              
              <div className="pagination-info">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
              </div>
            </div>
          )}
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
                    {showPassword ? "🙈 " : "👁️ "}
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
              <div className="form-row">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">🟢 Active</option>
                  <option value="inactive">🔴 Inactive</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "⏳ Processing..." : (editMode ? "Update" : "Create")}
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="cancel-btn"
                  disabled={loading}
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

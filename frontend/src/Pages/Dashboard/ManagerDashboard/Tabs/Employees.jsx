import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  EmployeeStats,
  EmployeeFilters,
  EmployeeTable,
  EmployeeCardGrid,
  EmployeePagination,
  EmployeeModal,
  defaultForm,
  validateForm,
  filterEmployees,
  sortEmployees,
  paginateEmployees
} from "./EmployeeComponents";
import "./Employees.css";

const Employees = () => {
  const [tab, setTab] = useState("manage");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
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
      setEditMode(false);
      setEditId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData, editMode);
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

  // Filter, sort, and paginate employees using utility functions
  const filteredEmployees = filterEmployees(employees, searchTerm, statusFilter);
  const sortedEmployees = sortEmployees([...filteredEmployees], sortField, sortDirection);
  const { paginatedEmployees, totalPages, startIndex } = paginateEmployees(sortedEmployees, currentPage, itemsPerPage);

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
              <EmployeeStats employees={employees} />
            </div>
            <EmployeeFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onAddEmployee={toggleModal}
            />
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
            <EmployeeTable
              employees={paginatedEmployees}
              startIndex={startIndex}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          ) : (
            <EmployeeCardGrid
              employees={paginatedEmployees}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          )}

          <EmployeePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedEmployees.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
          />
        </div>
      )}

      {tab === "roles" && (
        <div className="assign-roles">
          <h2>🚧 Assign Roles (Coming Soon)</h2>
        </div>
      )}

      <EmployeeModal
        showModal={showModal}
        onClose={toggleModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editMode={editMode}
        loading={loading}
        formErrors={formErrors}
      />
    </div>
  );
};

export default Employees;

import React, { useEffect, useState } from "react";
import "./ManagerDashboard.css";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // TODO: Fetch employee list from backend
    setEmployees([
      { id: 1, name: "Jane Doe", role: "employee" },
      { id: 2, name: "John Smith", role: "employee" },
    ]);
  }, []);

  return (
    <div className="manage-employees-view">
      <h2>👥 Manage Employees</h2>
      <table className="manager-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEmployees;

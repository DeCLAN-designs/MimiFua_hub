import React from 'react';
import './EmployeeTable.css';
import { getSortIcon } from './employeeUtils';

const EmployeeTable = ({
  employees,
  startIndex,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onStatusToggle
}) => {
  const handleSort = (field) => {
    onSort(field);
  };

  return (
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
              Full Name {getSortIcon('full_name', sortField, sortDirection)}
            </th>
            <th 
              className="sortable" 
              onClick={() => handleSort('email')}
              title="Click to sort"
            >
              Email {getSortIcon('email', sortField, sortDirection)}
            </th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
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
                    onClick={() => onStatusToggle(employee.id, employee.status || 'active')}
                    title={`Click to ${employee.status === 'active' ? 'deactivate' : 'activate'}`}
                  >
                    {employee.status === 'active' ? '✅ Active' : '❌ Inactive'}
                  </button>
                </td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(employee)}
                    title="Edit employee"
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(employee.id)}
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
                📭 No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;

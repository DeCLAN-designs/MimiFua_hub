import React from 'react';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onEdit, onDelete, onStatusToggle }) => {
  return (
    <div className="employee-card">
      <div className="card-header">
        <div className="employee-avatar">
          {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
        </div>
        <div className="employee-info">
          <h3>{`${employee.first_name} ${employee.last_name}`}</h3>
          <span className="role-badge">{employee.role}</span>
        </div>
        <button
          className={`status-toggle ${employee.status || 'active'}`}
          onClick={() => onStatusToggle(employee.id, employee.status || 'active')}
          title={`Click to ${employee.status === 'active' ? 'deactivate' : 'activate'}`}
        >
          {employee.status === 'active' ? '✅' : '❌'}
        </button>
      </div>
      
      <div className="card-body">
        <div className="contact-info">
          <div className="info-item">
            <span className="label">📧 Email:</span>
            <span className="value">{employee.email}</span>
          </div>
          <div className="info-item">
            <span className="label">📞 Phone:</span>
            <span className="value">{employee.phone}</span>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button
          className="edit-btn"
          onClick={() => onEdit(employee)}
          title="Edit employee"
        >
          ✏️ Edit
        </button>
        <button
          className="delete-btn"
          onClick={() => onDelete(employee.id)}
          title="Delete employee"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

const EmployeeCardGrid = ({ employees, onEdit, onDelete, onStatusToggle }) => {
  return (
    <div className="employee-cards-grid">
      {employees.length > 0 ? (
        employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusToggle={onStatusToggle}
          />
        ))
      ) : (
        <div className="no-data-card">
          📭 No employees found
        </div>
      )}
    </div>
  );
};

export default EmployeeCardGrid;

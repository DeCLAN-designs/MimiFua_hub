import React from 'react';
import './EmployeeStats.css';

const EmployeeStats = ({ employees }) => {
  const activeCount = employees.filter(e => e.status === 'active').length;
  const inactiveCount = employees.filter(e => e.status === 'inactive').length;

  return (
    <div className="employee-stats">
      <span className="stat">Total: {employees.length}</span>
      <span className="stat">Active: {activeCount}</span>
      <span className="stat">Inactive: {inactiveCount}</span>
    </div>
  );
};

export default EmployeeStats;

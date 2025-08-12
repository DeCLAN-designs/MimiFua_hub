import React from 'react';
import './EmployeeFilters.css';

const EmployeeFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  onAddEmployee
}) => {
  return (
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
        <button className="add-btn" onClick={onAddEmployee}>
          ➕ Add Employee
        </button>
      </div>
    </div>
  );
};

export default EmployeeFilters;

import React from 'react';
import './SalesFilters.css';

const SalesFilters = ({
  employees,
  selectedEmployee,
  onEmployeeFilter,
  startDate,
  endDate,
  onDateFilter,
  onApplyDatePreset,
  onClearFilters
}) => {
  return (
    <div className="filters-section">
      <div className="filter-group">
        <label className="filter-label">Filter by Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => onEmployeeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Employees</option>
          {employees.map((employee, index) => (
            <option key={index} value={`${employee.first_name} ${employee.last_name}`}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">From Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onDateFilter("start", e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">To Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onDateFilter("end", e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Quick Presets:</label>
        <select
          className="preset-dropdown"
          onChange={(e) => {
            if (e.target.value) {
              onApplyDatePreset(e.target.value);
              e.target.value = ""; // Reset dropdown after selection
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Select a preset...</option>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="last30Days">Last 30 Days</option>
        </select>
      </div>

      <div className="filter-group">
        <button onClick={onClearFilters} className="clear-filters-button">
          Clear All Filters
        </button>
      </div>

      {/* Filter Status */}
      {(selectedEmployee || startDate || endDate) && (
        <div className="filter-status">
          <span className="filter-status-label">Active Filters:</span>
          {selectedEmployee && (
            <span className="filter-tag">
              Employee: {selectedEmployee}
              <button
                onClick={() => onEmployeeFilter("")}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          )}
          {startDate && (
            <span className="filter-tag">
              From: {new Date(startDate).toLocaleDateString()}
              <button
                onClick={() => onDateFilter("start", "")}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          )}
          {endDate && (
            <span className="filter-tag">
              To: {new Date(endDate).toLocaleDateString()}
              <button
                onClick={() => onDateFilter("end", "")}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesFilters;

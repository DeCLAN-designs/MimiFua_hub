import React from 'react';
import './ViewModeButtons.css';

const ViewModeButtons = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="view-mode-section">
      <button
        onClick={() => onViewModeChange("all")}
        className={`view-mode-button ${viewMode === "all" ? "active" : ""}`}
      >
        📊 All Sales
      </button>
      <button
        onClick={() => onViewModeChange("reports")}
        className={`view-mode-button ${viewMode === "reports" ? "active" : ""}`}
      >
        📈 Sales Reports
      </button>
    </div>
  );
};

export default ViewModeButtons;

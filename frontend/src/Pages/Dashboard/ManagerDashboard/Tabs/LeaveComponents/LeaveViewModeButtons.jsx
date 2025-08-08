import React from 'react';
import './LeaveViewModeButtons.css';

const LeaveViewModeButtons = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="leave-view-mode-section">
      <button 
        className={`leave-view-mode-button ${viewMode === "requests" ? "active" : ""}`}
        onClick={() => onViewModeChange("requests")}
      >
        📝 Leave Requests
      </button>
      <button 
        className={`leave-view-mode-button ${viewMode === "calendar" ? "active" : ""}`}
        onClick={() => onViewModeChange("calendar")}
      >
        📅 Leave Calendar
      </button>
    </div>
  );
};

export default LeaveViewModeButtons;

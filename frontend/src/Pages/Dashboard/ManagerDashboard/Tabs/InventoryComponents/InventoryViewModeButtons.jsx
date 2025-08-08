import React from 'react';
import './InventoryViewModeButtons.css';

const InventoryViewModeButtons = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="inventory-view-mode-section">
      <button 
        className={`inventory-view-mode-button ${viewMode === "requests" ? "active" : ""}`}
        onClick={() => onViewModeChange("requests")}
      >
        📋 Restock Requests
      </button>
      <button 
        className={`inventory-view-mode-button ${viewMode === "status" ? "active" : ""}`}
        onClick={() => onViewModeChange("status")}
      >
        📊 Inventory Status
      </button>
    </div>
  );
};

export default InventoryViewModeButtons;

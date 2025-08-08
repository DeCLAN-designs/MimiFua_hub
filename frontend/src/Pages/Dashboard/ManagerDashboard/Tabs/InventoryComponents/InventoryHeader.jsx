import React from 'react';
import './InventoryHeader.css';

const InventoryHeader = ({ onRefresh, loading }) => {
  return (
    <div className="inventory-header">
      <h1 className="inventory-title">📦 Inventory Management</h1>
      <div className="header-actions">
        <button 
          className="refresh-button" 
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>
    </div>
  );
};

export default InventoryHeader;

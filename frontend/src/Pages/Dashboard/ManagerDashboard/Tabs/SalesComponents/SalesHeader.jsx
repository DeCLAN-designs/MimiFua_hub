import React from 'react';
import './SalesHeader.css';

const SalesHeader = ({ onRefresh, loading }) => {
  return (
    <div className="sales-header">
      <h1 className="sales-title">Sales Dashboard</h1>
      <div className="header-actions">
        <button onClick={onRefresh} className="refresh-button" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};

export default SalesHeader;

import React from 'react';
import './LeaveHeader.css';

const LeaveHeader = ({ onRefresh, loading }) => {
  return (
    <div className="leave-header">
      <h1 className="leave-title">🏖️ Leave Management</h1>
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

export default LeaveHeader;

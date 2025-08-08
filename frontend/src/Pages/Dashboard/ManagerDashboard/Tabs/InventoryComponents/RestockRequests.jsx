import React from 'react';
import './RestockRequests.css';

const RestockRequests = ({ 
  restockData, 
  formatDate, 
  onApproveRequest, 
  onRejectRequest,
  loading 
}) => {
  if (loading) {
    return <div className="restock-loading">Loading restock requests...</div>;
  }

  if (!restockData || restockData.length === 0) {
    return (
      <div className="no-restock-data">
        📋 No restock requests found
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { emoji: '⏳', class: 'pending', label: 'Pending' },
      approved: { emoji: '✅', class: 'approved', label: 'Approved' },
      rejected: { emoji: '❌', class: 'rejected', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.emoji} {config.label}
      </span>
    );
  };

  return (
    <div className="restock-requests-container">
      <h2 className="restock-title">📋 Restock Requests</h2>
      
      <div className="restock-table-container">
        <table className="restock-table">
          <thead className="restock-table-header">
            <tr>
              <th className="restock-header-cell">ID</th>
              <th className="restock-header-cell">Employee</th>
              <th className="restock-header-cell">Item</th>
              <th className="restock-header-cell">Quantity</th>
              <th className="restock-header-cell">Status</th>
              <th className="restock-header-cell">Date</th>
              <th className="restock-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restockData.map((request) => (
              <tr key={request.id} className="restock-table-row">
                <td className="restock-table-cell">{request.id}</td>
                <td className="restock-table-cell">
                  {request.first_name} {request.last_name}
                </td>
                <td className="restock-table-cell item-cell">{request.item}</td>
                <td className="restock-table-cell quantity-cell">{request.quantity}</td>
                <td className="restock-table-cell">
                  {getStatusBadge(request.status)}
                </td>
                <td className="restock-table-cell date-cell">
                  {formatDate(request.created_at)}
                </td>
                <td className="restock-table-cell actions-cell">
                  {request.status === 'pending' && (
                    <div className="action-buttons">
                      <button 
                        className="approve-btn"
                        onClick={() => onApproveRequest(request.id)}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => onRejectRequest(request.id)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestockRequests;

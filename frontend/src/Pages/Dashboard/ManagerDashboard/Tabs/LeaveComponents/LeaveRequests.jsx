import React from 'react';
import './LeaveRequests.css';

const LeaveRequests = ({ 
  leaveData, 
  formatDate, 
  onApproveRequest, 
  onRejectRequest,
  loading 
}) => {
  if (loading) {
    return <div className="leave-loading">Loading leave requests...</div>;
  }

  if (!leaveData || leaveData.length === 0) {
    return (
      <div className="no-leave-data">
        📝 No leave requests found
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

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="leave-requests-container">
      <h2 className="leave-title">📝 Leave Requests</h2>
      
      <div className="leave-table-container">
        <table className="leave-table">
          <thead className="leave-table-header">
            <tr>
              <th className="leave-header-cell">ID</th>
              <th className="leave-header-cell">Employee</th>
              <th className="leave-header-cell">Reason</th>
              <th className="leave-header-cell">Start Date</th>
              <th className="leave-header-cell">End Date</th>
              <th className="leave-header-cell">Duration</th>
              <th className="leave-header-cell">Status</th>
              <th className="leave-header-cell">Applied</th>
              <th className="leave-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((request) => (
              <tr key={request.id} className="leave-table-row">
                <td className="leave-table-cell">{request.id}</td>
                <td className="leave-table-cell">
                  {request.first_name} {request.last_name}
                </td>
                <td className="leave-table-cell reason-cell">
                  <div className="reason-text" title={request.reason}>
                    {request.reason.length > 50 ? 
                      `${request.reason.substring(0, 50)}...` : 
                      request.reason
                    }
                  </div>
                </td>
                <td className="leave-table-cell date-cell">
                  {new Date(request.start_date).toLocaleDateString()}
                </td>
                <td className="leave-table-cell date-cell">
                  {new Date(request.end_date).toLocaleDateString()}
                </td>
                <td className="leave-table-cell duration-cell">
                  {calculateDuration(request.start_date, request.end_date)} days
                </td>
                <td className="leave-table-cell">
                  {getStatusBadge(request.status)}
                </td>
                <td className="leave-table-cell date-cell">
                  {formatDate(request.created_at)}
                </td>
                <td className="leave-table-cell actions-cell">
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

export default LeaveRequests;

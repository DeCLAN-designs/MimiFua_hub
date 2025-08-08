import React, { useState, useEffect } from 'react';
import {
  LeaveHeader,
  LeaveViewModeButtons,
  LeaveRequests,
  LeaveCalendar
} from './LeaveComponents';
import './Leave.css';

const Leave = () => {
  const [viewMode, setViewMode] = useState("requests");
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock leave data - replace with API call later
  const mockLeaveData = [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      reason: "Annual vacation to spend time with family",
      start_date: "2024-08-15",
      end_date: "2024-08-20",
      status: "pending",
      created_at: "2024-08-01T10:00:00Z"
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      reason: "Medical appointment and recovery",
      start_date: "2024-08-10",
      end_date: "2024-08-12",
      status: "approved",
      created_at: "2024-07-28T14:30:00Z"
    },
    {
      id: 3,
      first_name: "Mike",
      last_name: "Johnson",
      reason: "Personal emergency - family matters",
      start_date: "2024-08-25",
      end_date: "2024-08-27",
      status: "pending",
      created_at: "2024-08-05T09:15:00Z"
    },
    {
      id: 4,
      first_name: "Sarah",
      last_name: "Wilson",
      reason: "Wedding ceremony attendance",
      start_date: "2024-08-08",
      end_date: "2024-08-09",
      status: "approved",
      created_at: "2024-07-25T16:45:00Z"
    },
    {
      id: 5,
      first_name: "David",
      last_name: "Brown",
      reason: "Sick leave - flu symptoms",
      start_date: "2024-08-05",
      end_date: "2024-08-07",
      status: "rejected",
      created_at: "2024-08-04T11:20:00Z"
    },
    {
      id: 6,
      first_name: "Emily",
      last_name: "Davis",
      reason: "Maternity leave continuation",
      start_date: "2024-09-01",
      end_date: "2024-09-30",
      status: "approved",
      created_at: "2024-07-20T13:00:00Z"
    }
  ];

  // Fetch leave data from database
  const fetchLeaveData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch('http://localhost:5000/api/leaves', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Manager privileges required.');
        }
        throw new Error(`Failed to fetch leave data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.leaves && Array.isArray(data.leaves)) {
        // Transform the data to match our component's expected format
        const transformedData = data.leaves.map(leave => ({
          id: leave.id,
          first_name: leave.first_name || 'Unknown',
          last_name: leave.last_name || '',
          email: leave.email || '',
          reason: leave.reason || 'No reason provided',
          start_date: leave.start_date,
          end_date: leave.end_date,
          status: leave.status,
          created_at: leave.created_at
        }));
        
        setLeaveData(transformedData);
        console.log(`Successfully fetched ${transformedData.length} leave requests from database`);
      } else {
        throw new Error('Invalid data format received from server');
      }
      
    } catch (err) {
      console.error('Error fetching leave data:', err);
      setError(err.message || 'Failed to fetch leave data. Please try again.');
      setLeaveData([]); // Set empty array instead of mock data
    } finally {
      setLoading(false);
    }
  };

  // Handle approve leave request
  const handleApproveRequest = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5000/api/leaves/${leaveId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Manager privileges required.');
        } else if (response.status === 404) {
          throw new Error('Leave request not found.');
        }
        throw new Error('Failed to approve leave request');
      }
      
      // Refresh data to get updated information from database
      await fetchLeaveData();
      console.log(`Leave request ${leaveId} approved successfully`);
      
    } catch (err) {
      console.error('Error approving leave request:', err);
      setError(err.message || 'Failed to approve leave request');
    }
  };

  // Handle reject leave request
  const handleRejectRequest = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5000/api/leaves/${leaveId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Manager privileges required.');
        } else if (response.status === 404) {
          throw new Error('Leave request not found.');
        }
        throw new Error('Failed to reject leave request');
      }
      
      // Refresh data to get updated information from database
      await fetchLeaveData();
      console.log(`Leave request ${leaveId} rejected successfully`);
      
    } catch (err) {
      console.error('Error rejecting leave request:', err);
      setError(err.message || 'Failed to reject leave request');
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchLeaveData();
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Load data on component mount
  useEffect(() => {
    fetchLeaveData();
  }, []);

  return (
    <div className="leave-container">
      <LeaveHeader 
        onRefresh={handleRefresh}
        loading={loading}
      />
      
      <LeaveViewModeButtons 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {error && (
        <div className="error-message">
          ⚠️ Error: {error}
        </div>
      )}

      {viewMode === "requests" && (
        <LeaveRequests 
          leaveData={leaveData}
          formatDate={formatDate}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
          loading={loading}
        />
      )}

      {viewMode === "calendar" && (
        <LeaveCalendar 
          leaveData={leaveData}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Leave;

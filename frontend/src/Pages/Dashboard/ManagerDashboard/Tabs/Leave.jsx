import React, { useState, useEffect } from "react";
import {
  LeaveHeader,
  LeaveViewModeButtons,
  LeaveRequests,
  LeaveCalendar,
} from "./LeaveComponents";
import "./Leave.css";

const Leave = () => {
  const [viewMode, setViewMode] = useState("requests");
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false); // global loading (fetch + actions)
  const [error, setError] = useState(null);

  // Fetch leave data from backend
  const fetchLeaveData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authentication token found. Please log in.");

      const response = await fetch("http://localhost:5000/api/leaves", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Authentication failed. Please log in again.");
        if (response.status === 403)
          throw new Error("Access denied. Manager privileges required.");
        throw new Error(`Failed to fetch leave data: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.leaves)) {
        const transformed = data.leaves.map((leave) => ({
          id: leave.id,
          first_name: leave.first_name || "Unknown",
          last_name: leave.last_name || "",
          email: leave.email || "",
          reason: leave.reason || "No reason provided",
          start_date: leave.start_date,
          end_date: leave.end_date,
          status: leave.status,
          created_at: leave.created_at,
        }));
        setLeaveData(transformed);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching leave data:", err);
      setError(err.message || "Failed to fetch leave data.");
      setLeaveData([]);
    } finally {
      setLoading(false);
    }
  };

  // Update leave request status
  const updateLeaveStatus = async (leaveId, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authentication token found. Please log in.");

      const response = await fetch(
        `http://localhost:5000/api/leaves/${leaveId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Authentication failed. Please log in again.");
        if (response.status === 403)
          throw new Error("Access denied. Manager privileges required.");
        if (response.status === 404)
          throw new Error("Leave request not found.");
        throw new Error(`Failed to update leave request: ${response.status}`);
      }

      await fetchLeaveData(); // Refresh with latest data
    } catch (err) {
      console.error(`Error updating leave request ${leaveId}:`, err);
      setError(err.message || "Failed to update leave request");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = (id) => updateLeaveStatus(id, "approved");
  const handleRejectRequest = (id) => updateLeaveStatus(id, "rejected");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    fetchLeaveData();
  }, []);

  // ⬇️ Render loading screen before anything else
  if (loading) {
    return (
      <div className="loading-leave">
        <span className="loader"></span>
        <p>Loading leave data...</p>
      </div>
    );
  }

  return (
    <div className="leave-container">
      <LeaveHeader onRefresh={fetchLeaveData} loading={loading} />

      <LeaveViewModeButtons
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {error && <div className="error-message">⚠️ {error}</div>}

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
        <LeaveCalendar leaveData={leaveData} loading={loading} />
      )}
    </div>
  );
};

export default Leave;

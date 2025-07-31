// src/Pages/Dashboard/Employee/LeaveRequestForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./LeaveRequest.css";

const LeaveRequest= () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const isValid = () =>
    leaveType && startDate && endDate && reason && storedUser?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return setStatus("❌ Please fill in all required fields.");

    setLoading(true);
    setStatus(null);

    try {
      const payload = {
        user_id: storedUser.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/leaves",
        payload
      );
      if (response.status === 201) {
        setStatus("✅ Leave request submitted successfully.");
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
      }
    } catch (err) {
      console.error("Leave request error:", err);
      setStatus("❌ Failed to submit request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-form">
      <h2>Leave Request</h2>
      <form onSubmit={handleSubmit}>
        <label>Leave Type</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="Sick">Sick</option>
          <option value="Vacation">Vacation</option>
          <option value="Emergency">Emergency</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <label>Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
};

export default LeaveRequest;

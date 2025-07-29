import React, { useState } from "react";
// import axios from "axios"; // Uncomment when backend ready

const LeaveRequest = ({ user }) => { // eslint-disable-line no-unused-vars
  const [form, setForm] = useState({ reason: "", days: "" });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reason = form.reason.trim();
    const days = parseInt(form.days, 10);

    if (!reason || isNaN(days) || days <= 0) {
      setStatus({ ...status, error: "Invalid input" });
      return;
    }

    try {
      setStatus({ loading: true, error: "", success: "" });

      // Future:
      // await axios.post("/api/leaves", {
      //   user_id: user.id,
      //   reason,
      //   days,
      // }, {
      //   headers: { Authorization: `Bearer ${user.token}` },
      // });

      setForm({ reason: "", days: "" });
      setStatus({ loading: false, success: "✅ Leave request submitted." });
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, error: "❌ Failed to submit request." });
    }
  };

  return (
    <div className="employee-leave-view">
      <h2>📅 Leave Request</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <textarea
          placeholder="Reason for leave"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Number of days"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
          required
        />
        <button type="submit" disabled={status.loading}>
          {status.loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {status.error && <p className="error-message">{status.error}</p>}
      {status.success && <p className="success-message">{status.success}</p>}
    </div>
  );
};

export default LeaveRequest;

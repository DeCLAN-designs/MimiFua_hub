import React, { useState } from "react";
import axios from "axios";
import "./LeaveRequest.css";

const leaveReasons = [
  "Sick Leave",
  "Vacation",
  "Emergency",
  "Family Obligation",
  "Medical Appointment",
  "Mental Health",
  "Personal Development",
  "Bereavement",
  "Jury Duty",
  "Other",
];

const LeaveRequest = ({ user }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });

  const resetForm = () => {
    setReason("");
    setCustomReason("");
    setDays("");
  };

  const validateInput = () => {
    const parsedDays = parseInt(days.trim(), 10);
    const finalReason =
      reason === "Other" ? customReason.trim() : reason.trim();

    if (!finalReason || isNaN(parsedDays) || parsedDays <= 0) {
      return {
        valid: false,
        error: "⚠️ Provide a valid reason and a positive number of leave days.",
      };
    }

    return {
      valid: true,
      data: { reason: finalReason, days: parsedDays },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateInput();
    if (!validation.valid) {
      setFeedback({ error: validation.error, success: "" });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ error: "", success: "" });

      const payload = {
        user_id: user.id,
        reason: validation.data.reason,
        days: validation.data.days,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post("/api/leaves", payload, config);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error("Unexpected response from server.");
      }

      setFeedback({ success: "✅ Leave request submitted.", error: "" });
      resetForm();
    } catch (err) {
      console.error("Leave request error:", err.response?.data || err.message);
      setFeedback({
        error: "❌ Failed to submit request. Please try again later.",
        success: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-request-container">
      <h2>📅 Submit Leave Request</h2>

      <form
        onSubmit={handleSubmit}
        className="leave-request-form"
        autoComplete="on"
      >
        <label htmlFor="reason">Leave Reason:</label>
        <select
          id="reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        >
          <option value="">-- Select Reason --</option>
          {leaveReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {reason === "Other" && (
          <>
            <label htmlFor="customReason">Custom Reason:</label>
            <input
              type="text"
              id="customReason"
              name="customReason"
              placeholder="Enter custom reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              required
              autoComplete="off"
            />
          </>
        )}

        <label htmlFor="days">Number of Days:</label>
        <input
          type="number"
          id="days"
          name="days"
          placeholder="Number of leave days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min="1"
          required
          autoComplete="off"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {feedback.error && <p className="error-message">{feedback.error}</p>}
        {feedback.success && (
          <p className="success-message">{feedback.success}</p>
        )}
      </form>
    </div>
  );
};

export default LeaveRequest;

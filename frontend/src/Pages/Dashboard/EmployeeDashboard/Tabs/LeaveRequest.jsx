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

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    reason: "",
    customReason: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInput = () => {
    const { reason, customReason, startDate, endDate } = formData;
    const finalReason =
      reason === "Other" ? customReason.trim() : reason.trim();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!finalReason || !startDate || !endDate) {
      return { valid: false, error: "⚠️ All fields are required." };
    }

    if (isNaN(start) || isNaN(end)) {
      return { valid: false, error: "⚠️ Invalid date format." };
    }

    if (start < today) {
      return { valid: false, error: "⚠️ Start date cannot be in the past." };
    }

    if (start > end) {
      return { valid: false, error: "⚠️ Start date must be before end date." };
    }

    return {
      valid: true,
      data: {
        leave_type: reason === "Other" ? "Other" : reason,
        start_date: startDate,
        end_date: endDate,
        reason: finalReason,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: "", success: "" });

    const validation = validateInput();
    if (!validation.valid) {
      setFeedback({ error: validation.error, success: "" });
      return;
    }

    try {
      setLoading(true);

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        "http://localhost:5000/api/leaves",
        validation.data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setFeedback({
          success: "✅ Leave request submitted successfully!",
          error: "",
        });
        setFormData({
          reason: "",
          customReason: "",
          startDate: "",
          endDate: "",
        });
      } else {
        throw new Error(response.data?.message || "Unexpected response");
      }
    } catch (err) {
      console.error("Submission error:", {
        error: err,
        response: err.response,
      });

      let errorMessage = "Failed to submit request. Please try again later.";
      if (err.response) {
        errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          `Server error: ${err.response.status}`;
      }

      if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = "Session expired. Please login again.";
        // Optionally redirect to login here
      }

      setFeedback({
        error: `❌ ${errorMessage}`,
        success: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-request-container">
      <h2>📅 Submit Leave Request</h2>

      <form onSubmit={handleSubmit} className="leave-request-form">
        <div className="form-group">
          <label htmlFor="reason">Leave Reason:</label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Reason --</option>
            {leaveReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {formData.reason === "Other" && (
          <div className="form-group">
            <label htmlFor="customReason">Custom Reason:</label>
            <textarea
              id="customReason"
              name="customReason"
              placeholder="Enter custom reason"
              value={formData.customReason}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>
        )}

        <div className="date-range">
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        </div>

        {feedback.error && (
          <div className="error-message">
            {feedback.error}
            <button
              onClick={() => setFeedback({ error: "", success: "" })}
              className="close-btn"
            >
              ×
            </button>
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {feedback.success && (
          <div className="success-message">{feedback.success}</div>
        )}
      </form>
    </div>
  );
};

export default LeaveRequest;

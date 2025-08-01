import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [view, setView] = useState("form"); // form | requests
  const [formData, setFormData] = useState({
    reason: "",
    customReason: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [submittedLeaves, setSubmittedLeaves] = useState([]);
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        };

        if (id) {
          const { data } = await axios.get(
            `http://localhost:5000/api/leaves/${id}`,
            config
          );

          const leave = data.leave || data;
          setFormData({
            reason: leave.leave_type === "Other" ? "Other" : leave.leave_type,
            customReason: leave.leave_type === "Other" ? leave.reason : "",
            startDate: leave.start_date.split("T")[0],
            endDate: leave.end_date.split("T")[0],
          });
          setIsEditMode(true);
        }

        const leavesRes = await axios.get(
          "http://localhost:5000/api/leaves/my",
          config
        );
        setSubmittedLeaves(leavesRes.data.leaves || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setFeedback({
            error: "❌ Failed to load data. Please try again.",
            success: "",
          });
        }
      } finally {
        setLoading(false);
        setIsLoadingLeaves(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const validateForm = () => {
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

    if (start < today && !isEditMode) {
      return { valid: false, error: "⚠️ Start date cannot be in the past." };
    }

    if (start > end) {
      return { valid: false, error: "⚠️ Start date must be before end date." };
    }

    return {
      valid: true,
      data: {
        leave_type: reason === "Other" ? "Other" : reason,
        reason: finalReason,
        start_date: startDate,
        end_date: endDate,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: "", success: "" });

    const validation = validateForm();
    if (!validation.valid) {
      return setFeedback({ error: validation.error, success: "" });
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      };

      const url = isEditMode
        ? `http://localhost:5000/api/leaves/${id}`
        : "http://localhost:5000/api/leaves";
      const method = isEditMode ? axios.put : axios.post;

      await method(url, validation.data, config);

      setFeedback({
        success: `✅ Leave request ${
          isEditMode ? "updated" : "submitted"
        } successfully!`,
        error: "",
      });

      if (!isEditMode) {
        setFormData({
          reason: "",
          customReason: "",
          startDate: "",
          endDate: "",
        });
      }

      const { data } = await axios.get(
        "http://localhost:5000/api/leaves/my",
        config
      );
      setSubmittedLeaves(data.leaves || []);

      if (isEditMode) {
        setTimeout(() => navigate("/leaves"), 2000);
      }
    } catch (err) {
      console.error("Submission error:", err);
      let message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        `Server error: ${err.response?.status}`;
      setFeedback({ error: `❌ ${message}`, success: "" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "status-pending",
      approved: "status-approved",
      rejected: "status-rejected",
    };
    return (
      <span className={`status-badge ${statusMap[status] || ""}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="leave-request-container">
      <div className="leave-tabs">
        <button
          className={view === "form" ? "active" : ""}
          onClick={() => setView("form")}
        >
          📝 Submit Request
        </button>
        <button
          className={view === "requests" ? "active" : ""}
          onClick={() => setView("requests")}
        >
          📋 My Requests
        </button>
      </div>

      {view === "form" ? (
        <>
          <h2>
            {isEditMode ? "✏️ Edit Leave Request" : "📅 Submit Leave Request"}
          </h2>
          <form onSubmit={handleSubmit} className="leave-request-form">
            <div className="form-group">
              <label htmlFor="reason">Leave Reason:</label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                disabled={isEditMode && formData.reason !== "Other"}
                required
              >
                <option value="">-- Select Reason --</option>
                {leaveReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {(formData.reason === "Other" || isEditMode) && (
              <div className="form-group">
                <label htmlFor="customReason">Details:</label>
                <textarea
                  id="customReason"
                  name="customReason"
                  rows="3"
                  placeholder="Enter details..."
                  value={formData.customReason}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="date-range">
              {["startDate", "endDate"].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>
                    {field === "startDate" ? "Start Date:" : "End Date:"}
                  </label>
                  <input
                    type="date"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    min={
                      field === "startDate"
                        ? isEditMode
                          ? undefined
                          : new Date().toISOString().split("T")[0]
                        : formData.startDate ||
                          new Date().toISOString().split("T")[0]
                    }
                  />
                </div>
              ))}
            </div>

            {feedback.error && (
              <div className="error-message">
                {feedback.error}
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setFeedback({ error: "", success: "" })}
                >
                  ×
                </button>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Submitting..."
                  : isEditMode
                  ? "Update Request"
                  : "Submit Request"}
              </button>
            </div>

            {feedback.success && (
              <div className="success-message">{feedback.success}</div>
            )}
          </form>
        </>
      ) : (
        <div className="submitted-leaves">
          <h3>📋 Your Leave Requests</h3>
          {isLoadingLeaves ? (
            <div className="loading-message">
              Loading your leave requests...
            </div>
          ) : submittedLeaves.length === 0 ? (
            <div className="no-leaves-message">
              No leave requests submitted yet
            </div>
          ) : (
            <div className="leaves-list">
              {submittedLeaves.map((leave) => (
                <div className="leave-card" key={leave.id}>
                  <div className="leave-header">
                    <span className="leave-type">{leave.leave_type}</span>
                    {getStatusBadge(leave.status)}
                    {leave.status === "pending" && (
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/leaves/${leave.id}`)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="leave-dates">
                    {formatDate(leave.start_date)} to{" "}
                    {formatDate(leave.end_date)}
                  </div>
                  <div className="leave-reason">{leave.reason}</div>
                  <div className="leave-meta">
                    Submitted on {formatDate(leave.created_at)}
                    {leave.updated_at !== leave.created_at && (
                      <span>
                        {" "}
                        • Last updated {formatDate(leave.updated_at)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;

import React, { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { FaSpinner, FaDownload } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import adminService from "../../../../../services/adminService";
import { toast } from "react-toastify";
import "./AccessLogs.css";

const AccessLogs = ({ logs: propLogs }) => {
  const [logs, setLogs] = useState(propLogs || []);
  const [loading, setLoading] = useState(!propLogs);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [presetRange, setPresetRange] = useState("30");

  useEffect(() => {
    if (propLogs) {
      setLogs(propLogs);
      setLoading(false);
    }
  }, [propLogs]);

  useEffect(() => {
    if (!propLogs) {
      fetchLogs();
    }
  }, [dateRange, propLogs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        startDate: dateRange.start,
        endDate: dateRange.end,
      };
      const logsData = await adminService.accessLogs.get(filters);
      setLogs(logsData);
    } catch (err) {
      console.error("Error fetching access logs:", err);
      setError("Failed to load access logs. Please try again.");
      toast.error("Failed to load access logs");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon!");
  };

  const handlePresetChange = (e) => {
    const value = e.target.value;
    setPresetRange(value);

    let startDate;
    switch (value) {
      case "1":
        startDate = subDays(new Date(), 1);
        break;
      case "7":
        startDate = subDays(new Date(), 7);
        break;
      case "30":
        startDate = subDays(new Date(), 30);
        break;
      case "45":
        startDate = subDays(new Date(), 45);
        break;
      case "90":
        startDate = subDays(new Date(), 90);
        break;
      default:
        startDate = subDays(new Date(), 30);
    }

    setDateRange({
      start: format(startDate, "yyyy-MM-dd"),
      end: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "PPpp");
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "success":
        return "success";
      case "inactive":
      case "failed":
        return "danger";
      default:
        return "info";
    }
  };

  if (loading) {
    return (
      <div className="logs-loading">
        <FaSpinner className="spinner" />
        <span>Loading access logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logs-error">
        <h3>Error Loading Access Logs</h3>
        <p>{error}</p>
        <button onClick={fetchLogs} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-access-logs">
      <div className="admin-card">
        <div className="card-header">
          <h3>Access Logs</h3>
          <div className="logs-stats">
            <span className="stat-item">
              Total Logs: <strong>{logs.length}</strong>
            </span>
            <span className="stat-item">
              Date Range:{" "}
              <strong>
                {dateRange.start} to {dateRange.end}
              </strong>
            </span>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters">
            <div className="date-inputs">
              <div className="date-field">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div className="date-field">
                <label>End Date:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="preset-range">
              <label>Preset Range:</label>
              <select value={presetRange} onChange={handlePresetChange}>
                <option value="1">Last 24 Hours</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="45">Last 45 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>

            <div className="filter-actions">
              <button
                onClick={handleRefresh}
                className="btn btn-refresh"
                disabled={loading}
              >
                {loading ? (
                  <FaSpinner className="spin" />
                ) : (
                  <FiRefreshCw />
                )}
                Refresh
              </button>
              <button onClick={handleExport} className="btn btn-export">
                <FaDownload />
                Export
              </button>
            </div>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="no-logs">
            <p>No access logs found for the selected date range.</p>
          </div>
        ) : (
          <div className="logs-table">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Login Time</th>
                  <th>Logout Time</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Session Duration</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const userName =
                    log.first_name && log.last_name
                      ? `${log.first_name} ${log.last_name}`
                      : log.email || "Unknown User";
                  const sessionDuration = log.session_duration
                    ? `${log.session_duration} min`
                    : "N/A";

                  return (
                    <tr key={log.id}>
                      <td>#{log.id}</td>
                      <td className="user-cell">
                        <div className="user-info">
                          <strong>{userName}</strong>
                          {log.email && (
                            <small className="user-email">{log.email}</small>
                          )}
                          {log.role && (
                            <span className="user-role-badge">{log.role}</span>
                          )}
                        </div>
                      </td>

                      <td className="timestamp">
                        {formatDateTime(log.login_time)}
                      </td>
                      <td className="timestamp">
                        {log.logout_time
                          ? formatDateTime(log.logout_time)
                          : "Active"}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {log.status || "Unknown"}
                        </span>
                      </td>
                      <td className="ip-address">{log.ip_address || "N/A"}</td>
                      <td className="duration">{sessionDuration}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessLogs;

import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiClock,
  FiActivity,
  FiWifi,
  FiWifiOff,
  FiRefreshCw,
  FiEye,
  FiFilter,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";
import "./AccessLogs.css";

const MAX_SESSION_MINUTES = 14 * 60; // 14 hours

const AccessLogs = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Helpers
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString("en-KE", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  useEffect(() => {
    fetchAccessLogs();
    fetchActiveUsers();

    const activeUsersInterval = setInterval(() => {
      fetchActiveUsers();
    }, 10000);

    const accessLogsInterval = setInterval(() => {
      fetchAccessLogs();
    }, 15000);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(activeUsersInterval);
      clearInterval(accessLogsInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [filter]);

  const handleVisibilityChange = () => {
    if (document.hidden) return;
    fetchAccessLogs();
    fetchActiveUsers();
  };

  const fetchAccessLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/access-logs?status=${filter}&limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccessLogs(data.data.logs);
        setSummary(data.data.summary);
      } else {
        setError("Failed to fetch access logs");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Access logs fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/access-logs/active",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const users = data.data.activeUsers || [];

        // Auto-logout enforcement
        users.forEach((user) => {
          if (user.minutes_online > MAX_SESSION_MINUTES) {
            handleLogoutUser(user.user_id, true);
          }
        });

        setActiveUsers(users);
      }
    } catch (err) {
      console.error("Active users fetch error:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAccessLogs(), fetchActiveUsers()]);
    setRefreshing(false);
  };

  const handleLogoutUser = async (userId, auto = false) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/access-logs/logout/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log(
          auto
            ? `Auto-logged out user ${userId}`
            : `Manually logged out user ${userId}`
        );
        fetchActiveUsers();
        fetchAccessLogs();
      } else {
        console.error("Failed to logout user");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getStatusBadge = (status, currentStatus) => {
    const statusClass = currentStatus || status;
    return (
      <span className={`status-badge ${statusClass}`}>
        {statusClass === "online" && <FiWifi />}
        {statusClass === "away" && <FiClock />}
        {statusClass === "offline" && <FiWifiOff />}
        {statusClass === "active" && <FiActivity />}
        {statusClass === "inactive" && <FiWifiOff />}
        {statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="access-logs-container">
        <div className="loading-state">
          <span className="loader"></span>
          <p>Loading access logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="access-logs-container">
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchAccessLogs} className="retry-btn">
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="access-logs-container">
      {/* Header */}
      <div className="access-logs-header">
        <div className="header-title">
          <h2>
            <FiActivity /> Access Logs & User Activity
          </h2>
          <p>Monitor employee login activity and current status</p>
        </div>
        <button
          onClick={handleRefresh}
          className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? "spinning" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon users">
            <FiUsers />
          </div>
          <div className="card-content">
            <h3>{summary.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon active">
            <FiWifi />
          </div>
          <div className="card-content">
            <h3>{activeUsers.length}</h3>
            <p>Currently Online</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon today">
            <FiCalendar />
          </div>
          <div className="card-content">
            <h3>{summary.todayLogins || 0}</h3>
            <p>Today's Logins</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon duration">
            <FiClock />
          </div>
          <div className="card-content">
            <h3>{formatDuration(summary.avgSessionDuration)}</h3>
            <p>Avg Session</p>
          </div>
        </div>
      </div>

      {/* Active Users Section */}
      <div className="active-users-section">
        <h3>
          <FiWifi /> Currently Active Users ({activeUsers.length})
        </h3>
        <div className="active-users-grid">
          {activeUsers.length === 0 ? (
            <div className="no-active-users">
              <FiWifiOff />
              <p>No users currently online</p>
            </div>
          ) : (
            activeUsers.map((user) => {
              const isOverLimit = user.minutes_online > MAX_SESSION_MINUTES;
              return (
                <div
                  key={user.user_id}
                  className={`active-user-card ${
                    isOverLimit ? "over-limit" : ""
                  }`}
                >
                  <div className="user-avatar">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h4>{user.full_name}</h4>
                    <p>{user.email}</p>
                    <div className="user-status">
                      {getStatusBadge(null, user.status)}
                      <span className="online-duration">
                        {formatDuration(user.minutes_online)} online
                      </span>
                    </div>
                    <button
                      className="logout-btn"
                      onClick={() => handleLogoutUser(user.user_id, false)}
                    >
                      <FiLogOut /> Logout
                    </button>
                    {isOverLimit && (
                      <p className="session-warning">
                        ⚠ Auto-logout enforced after 14h
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <FiFilter />
          <label>Status Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Sessions</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Access Logs Table */}
      <div className="access-logs-table-section">
        <h3>
          <FiEye /> Recent Access Logs
        </h3>
        <div className="table-container">
          <table className="access-logs-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No access logs found
                  </td>
                </tr>
              ) : (
                accessLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={
                      log.session_duration > MAX_SESSION_MINUTES
                        ? "over-limit-row"
                        : ""
                    }
                  >
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {log.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{log.full_name}</span>
                      </div>
                    </td>
                    <td>{log.email}</td>
                    <td>
                      <span className={`role-badge ${log.role}`}>
                        {log.role}
                      </span>
                    </td>
                    <td>{formatDateTime(log.login_time)}</td>
                    <td>{formatDateTime(log.logout_time)}</td>
                    <td>{formatDuration(log.session_duration)}</td>
                    <td>{getStatusBadge(log.status, log.current_status)}</td>
                    <td className="ip-address">{log.ip_address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccessLogs;

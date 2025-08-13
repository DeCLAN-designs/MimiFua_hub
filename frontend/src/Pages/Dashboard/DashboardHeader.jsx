// Pages/Dashboard/DashboardHeader.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiBell,
  FiAlertCircle,
  FiEye,
  FiX,
} from "react-icons/fi";
import { performLogout, setupLogoutOnPageClose } from "../../utils/authUtils";
import "./DashboardHeader.css";

const DashboardHeader = ({ name, role, onLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  // Load theme on mount
  useEffect(() => {
    const savedThemeColor = localStorage.getItem("themeColor");
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedThemeColor) {
      document.documentElement.style.setProperty(
        "--primary-color",
        savedThemeColor
      );
    }
    if (savedFontSize) {
      document.documentElement.style.fontSize = savedFontSize;
    }
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchRoleSpecificData();
  }, [role]);

  useEffect(() => {
    const cleanup = setupLogoutOnPageClose();
    return cleanup;
  }, []);

  const fetchRoleSpecificData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId =
        localStorage.getItem("userId") || localStorage.getItem("user_id");
      if (!userId) {
        await performLogout(navigate);
        return;
      }
      
      setDashboardStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const generateNotifications = (data) => {
    const newNotifications = [];
    if (role === "manager") {
      const leaveCount = data.pendingLeaveRequests?.length ?? 0;
      if (leaveCount > 0) {
        newNotifications.push({
          id: "leave-requests",
          type: "warning",
          message: `${leaveCount} leave request(s) pending approval`,
          icon: FiCalendar,
        });
      }
      const urgentCount = data.urgentAlerts?.length ?? 0;
      if (urgentCount > 0) {
        newNotifications.push({
          id: "urgent-alerts",
          type: "danger",
          message: `${urgentCount} urgent alert(s) require attention`,
          icon: FiAlertCircle,
        });
      }
      if (data.salesMetrics?.salesGrowth < -10) {
        newNotifications.push({
          id: "sales-decline",
          type: "warning",
          message: "Sales declined significantly today",
          icon: FiTrendingUp,
        });
      }
    } else {
      if ((data.recentSales?.length ?? 0) === 0) {
        newNotifications.push({
          id: "no-sales",
          type: "info",
          message: "No sales recorded today - consider adding some!",
          icon: FiTrendingUp,
        });
      }
      const pendingRestocks =
        data.recentRestocks?.filter((r) => r.status === "pending") ?? [];
      if (pendingRestocks.length > 0) {
        newNotifications.push({
          id: "pending-restocks",
          type: "info",
          message: `${pendingRestocks.length} restock request(s) pending approval`,
          icon: FiClock,
        });
      }
    }
    setNotifications(newNotifications);
  };

  // Actions
  const handleProfile = () => {
    closeDropdown();
    navigate("/profile");
  };

  const handleSettings = () => {
    closeDropdown();
    setShowSettingsModal(true);
  };

  const handleTeamManagement = () => {
    closeDropdown();
    navigate("/team");
  };

  const handleAccessibility = () => {
    closeDropdown();
    setShowAccessibilityModal(true);
  };

  const handleLogout = async () => {
    closeDropdown();
    await performLogout(navigate);
    onLogout?.();
  };

  // Accessibility changes
  const applyTheme = (color) => {
    document.documentElement.style.setProperty("--primary-color", color);
    localStorage.setItem("themeColor", color);
  };

  const applyFontSize = (size) => {
    document.documentElement.style.fontSize = size;
    localStorage.setItem("fontSize", size);
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-message">
            <h1>
              {role === "admin"
                ? "👑 Admin Dashboard"
                : role === "manager"
                ? "👨‍💼 Manager Dashboard"
                : "👨‍💻 Employee Dashboard"}
            </h1>
            <p>Welcome back, {name}!</p>
            <div className="current-time">
              <FiClock className="time-icon" />
              <span>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          {role && (
            <div className="quick-stats">
              <div className="stat-item">
                <FiClock className="stat-icon" />
                <span>
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {role === "admin" && (
                <div className="stat-item admin-indicator">
                  <span className="admin-badge">System Administrator</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="role-badge">
            <span className={`role-indicator ${role}`}>
              {role === "admin" ? "👑 Admin" : role === "manager" ? "👔 Manager" : "👤 Employee"}
            </span>
          </div>

          <div className="profile-section">
            <div className="avatar-dropdown" onClick={toggleDropdown}>
              <div className="avatar-circle">
                {name?.charAt(0).toUpperCase()}
              </div>
              <FiChevronDown className="dropdown-icon" />
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-close-btn" onClick={closeDropdown}>
                  <FiX />
                </button>

                <div className="menu-header">
                  <div className="user-info">
                    <div className="avatar-large">
                      {name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{name}</span>
                      <span className="user-role">{role?.charAt(0).toUpperCase() + role?.slice(1)}</span>
                      <span className="user-status">Online</span>
                    </div>
                  </div>
                </div>

                {notifications.length > 0 && (
                  <div className="dropdown-notifications">
                    <div className="notifications-header">
                      <FiBell className="bell-icon" />
                      <span>Notifications ({notifications.length})</span>
                    </div>
                    <div className="notifications-list">
                      {notifications.map((n) => {
                        const IconComponent = n.icon;
                        return (
                          <div
                            key={n.id}
                            className={`notification-item ${n.type}`}
                          >
                            <IconComponent className="notification-icon" />
                            <span className="notification-text">
                              {n.message}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <ul>
                  <li onClick={handleProfile}>
                    <FiUser className="icon" /> Profile
                  </li>
                  <li onClick={handleSettings}>
                    <FiSettings className="icon" /> Settings
                  </li>
                  {(role === "manager" || role === "admin") && (
                    <li onClick={handleTeamManagement}>
                      <FiUsers className="icon" /> {role === "admin" ? "User Management" : "Team Management"}
                    </li>
                  )}
                  <li onClick={handleAccessibility}>
                    <FiEye className="icon" /> Accessibility
                  </li>
                  <li onClick={handleLogout} className="logout">
                    <FiLogOut className="icon" /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Settings</h2>
            <p>Here you can update your preferences.</p>
            <button onClick={() => setShowSettingsModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showAccessibilityModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Accessibility Settings</h2>
            <div>
              <label>Theme Color:</label>
              <div className="color-options">
                {["#48AECC", "#8FCF68", "#00370F", "#A7BAAC", "#2c3e50"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => applyTheme(color)}
                      style={{ background: color }}
                    />
                  )
                )}
              </div>
            </div>
            <div>
              <label>Font Size:</label>
              <select
                onChange={(e) => applyFontSize(e.target.value)}
                defaultValue={localStorage.getItem("fontSize") || "16px"}
              >
                <option value="14px">Small</option>
                <option value="16px">Default</option>
                <option value="18px">Large</option>
              </select>
            </div>
            <button onClick={() => setShowAccessibilityModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;

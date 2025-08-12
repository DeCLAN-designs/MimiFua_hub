// Pages/Dashboard/DashboardHeader.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FiShield,
  FiEye
} from 'react-icons/fi';
import { performLogout, setupLogoutOnPageClose } from '../../utils/authUtils';
import './DashboardHeader.css';

const DashboardHeader = ({ name, role, onLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch role-specific data
  useEffect(() => {
    fetchRoleSpecificData();
  }, [role]);

  useEffect(() => {
    // Set up logout on page close/refresh
    const cleanup = setupLogoutOnPageClose();
    return cleanup;
  }, []);

  const fetchRoleSpecificData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id') || '1';
      
      // Fetch dashboard summary for quick stats
      const dashboardUrl = role === 'manager' 
        ? `http://localhost:5000/api/dashboard/manager?userId=${userId}`
        : `http://localhost:5000/api/dashboard?userId=${userId}`;
      
      const response = await fetch(dashboardUrl, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
        
        // Generate role-specific notifications
        generateNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const generateNotifications = (data) => {
    const newNotifications = [];
    
    if (role === 'manager') {
      // Manager notifications
      if (data.pendingLeaveRequests && data.pendingLeaveRequests.length > 0) {
        newNotifications.push({
          id: 'leave-requests',
          type: 'warning',
          message: `${data.pendingLeaveRequests.length} leave request(s) pending approval`,
          icon: FiCalendar
        });
      }
      
      if (data.urgentAlerts && data.urgentAlerts.length > 0) {
        newNotifications.push({
          id: 'urgent-alerts',
          type: 'danger',
          message: `${data.urgentAlerts.length} urgent alert(s) require attention`,
          icon: FiAlertCircle
        });
      }
      
      if (data.salesMetrics && data.salesMetrics.salesGrowth < -10) {
        newNotifications.push({
          id: 'sales-decline',
          type: 'warning',
          message: 'Sales declined significantly today',
          icon: FiTrendingUp
        });
      }
    } else {
      // Employee notifications
      if (data.recentSales && data.recentSales.length === 0) {
        newNotifications.push({
          id: 'no-sales',
          type: 'info',
          message: 'No sales recorded today - consider adding some!',
          icon: FiTrendingUp
        });
      }
      
      if (data.recentRestocks && data.recentRestocks.some(r => r.status === 'pending')) {
        const pendingCount = data.recentRestocks.filter(r => r.status === 'pending').length;
        newNotifications.push({
          id: 'pending-restocks',
          type: 'info',
          message: `${pendingCount} restock request(s) pending approval`,
          icon: FiClock
        });
      }
    }
    
    setNotifications(newNotifications);
  };

  const handleProfile = () => {
    console.log("🔧 Profile clicked");
    closeDropdown();
  };

  const handleSettings = () => {
    console.log("⚙️ Settings clicked");
    closeDropdown();
  };

  const handleAccessibility = () => {
    console.log("👁️ Accessibility clicked");
    closeDropdown();
  };

  const handleLogout = async () => {
    closeDropdown();
    await performLogout(navigate);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="dashboard-header">
      {/* Left: Simple greeting and time for employees */}
      <div className="welcome-section">
        <div className="welcome-message">
          <h1>
            {role === 'manager' ? '👨‍💼 Manager Dashboard' : '👨‍💻 Employee Dashboard'}
          </h1>
          <p>Welcome back, {name}!</p>
        </div>
        
        {/* Show time only for employees */}
        {role === 'employee' && (
          <div className="quick-stats">
            <div className="stat-item">
              <FiClock className="stat-icon" />
              <span>{currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
          </div>
        )}
      </div>



      {/* Right: Role badge and Profile */}
      <div className="header-right">
        <div className="role-badge">
          <span className={`role-indicator ${role}`}>
            {role === 'manager' ? '👑 Manager' : '👤 Employee'}
          </span>
        </div>

        <div className="profile-section">
          <div className="avatar-dropdown" onClick={toggleDropdown}>
            <div className="avatar-circle">{name?.charAt(0).toUpperCase()}</div>
            <FiChevronDown className="dropdown-icon" />
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-close-btn"
                onClick={closeDropdown}
                title="Close"
              >
                <FiX />
              </button>
              
              {/* Role-specific menu items */}
              <div className="menu-header">
                <div className="user-info">
                  <div className="avatar-large">{name?.charAt(0).toUpperCase()}</div>
                  <div className="user-details">
                    <span className="user-name">{name}</span>
                    <span className="user-role-text">{role?.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Notifications in dropdown */}
              {notifications.length > 0 && (
                <div className="dropdown-notifications">
                  <div className="notifications-header">
                    <FiBell className="bell-icon" />
                    <span>Notifications ({notifications.length})</span>
                  </div>
                  <div className="notifications-list">
                    {notifications.map((notification) => {
                      const IconComponent = notification.icon;
                      return (
                        <div key={notification.id} className={`notification-item ${notification.type}`}>
                          <IconComponent className="notification-icon" />
                          <span className="notification-text">{notification.message}</span>
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
                {role === 'manager' && (
                  <li onClick={() => console.log('Team management clicked')}>
                    <FiUsers className="icon" /> Team Management
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
  );
};

export default DashboardHeader;

import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaCalendarAlt,
  FaBox,
  FaHome,
  FaArrowRight,
  FaUserClock,
  FaExclamationTriangle,
  FaClipboardList,
  FaCheck,
  FaTimes,
  FaClock,
  FaArrowDown,
  FaArrowUp,
  FaWifi,
} from "react-icons/fa";
import AccessLogs from "./Tabs/AccessLogs";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    salesMetrics: {
      todayTotal: 0,
      salesGrowth: 0,
      totalSales: 0,
      salesCount: 0,
    },
    leaveRequests: { pending: 0 },
    inventory: { alerts: 0 },
    employees: { total: 0, employees: 0, managers: 0 },
    recentActivities: [],
    pendingLeaveRequests: [],
    urgentAlerts: [],
  });
  const [, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userId =
          localStorage.getItem("userId") ||
          localStorage.getItem("user_id") ||
          "1"; // Fallback userId

        let url = "http://localhost:5000/api/dashboard/manager";
        // Always add userId as query param for now (until backend auth middleware is properly set up)
        url += `?userId=${userId}`;

        const response = await fetch(url, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          setError(null);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(`Failed to load dashboard data: ${err.message}`);
        // Set empty data structure instead of mock data
        setDashboardData({
          salesMetrics: {
            todayTotal: 0,
            salesGrowth: 0,
            totalSales: 0,
            salesCount: 0,
          },
          leaveRequests: { pending: 0 },
          inventory: { alerts: 0 },
          employees: { total: 0, employees: 0, managers: 0 },
          recentActivities: [],
          pendingLeaveRequests: [],
          urgentAlerts: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);



  // Format currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <span className="loader"></span>
        </div>
      </div>
    );
  }

  // Overview content
  const renderOverview = () => (
    <>
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card sales-card">
          <div className="card-icon">
            <FaShoppingCart />
          </div>
          <div className="card-content">
            <h3>Sales Today</h3>
            <p className="value">
              {formatAmount(dashboardData.salesMetrics.todayTotal || 0)}
            </p>
            <div className="card-footer">
              <span
                className={`trend ${
                  dashboardData.salesMetrics.salesGrowth >= 0
                    ? "positive"
                    : "negative"
                }`}
              >
                {dashboardData.salesMetrics.salesGrowth >= 0 ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}
                {Math.abs(dashboardData.salesMetrics.salesGrowth || 0)}% from
                yesterday
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card week-sales-card">
          <div className="card-icon">
            <FaShoppingCart />
          </div>
          <div className="card-content">
            <h3>Sales This Week</h3>
            <p className="value">
              {formatAmount(dashboardData.salesMetrics.weekTotal || 0)}
            </p>
            <p className="subtitle">Weekly performance</p>
          </div>
        </div>

        <div className="summary-card leave-card">
          <div className="card-icon">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <h3>Pending Leave Requests</h3>
            <p className="value">{dashboardData.leaveRequests.pending || 0}</p>
            <p className="subtitle">Awaiting approval</p>
          </div>
        </div>

        <div className="summary-card inventory-card">
          <div className="card-icon">
            <FaExclamationTriangle />
          </div>
          <div className="card-content">
            <h3>Restock Alerts</h3>
            <p className="value">{dashboardData.inventory.alerts || 0}</p>
            <p className="subtitle">Pending restocks</p>
          </div>
        </div>

        <div className="summary-card staff-card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Staff Management</h3>
            <p className="value">{dashboardData.employees.total || 0}</p>
            <p className="subtitle">
              {dashboardData.employees.employees || 0} employees
            </p>
          </div>
        </div>
      </div>



      {/* Recent Activity & Alerts */}
      <div className="panels-grid">
        <div className="panel recent-activity">
          <h2>
            <FaUserClock /> Recent Activity
          </h2>
          <ul>
            {dashboardData.recentActivities &&
            dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <li key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === "sale" && <FaShoppingCart />}
                    {activity.type === "restock" && <FaBox />}
                    {activity.type === "employee" && <FaUsers />}
                  </div>
                  <div className="activity-details">
                    <p className="activity-title">{activity.description}</p>
                    <div className="activity-meta">
                      {activity.value && (
                        <p className="activity-value">
                          {formatAmount(activity.value)}
                        </p>
                      )}
                      <p className="activity-time">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="no-activity">No recent activity</li>
            )}
          </ul>
        </div>

        <div className="panel urgent-alerts">
          <h2>
            <FaExclamationTriangle /> Urgent Alerts
          </h2>
          <ul>
            {dashboardData.urgentAlerts &&
            dashboardData.urgentAlerts.length > 0 ? (
              dashboardData.urgentAlerts.map((alert, index) => (
                <li key={index} className="alert-item">
                  <div className="alert-icon">
                    <FaExclamationTriangle />
                  </div>
                  <div className="alert-details">
                    <p className="alert-title">{alert.message}</p>
                    <div className="alert-meta">
                      <p className="alert-priority">
                        Priority: {alert.priority}
                      </p>
                      <p className="alert-time">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="no-alert">No urgent alerts</li>
            )}
          </ul>
        </div>
      </div>

      {/* Pending Leave Requests */}
      <div className="leave-requests-section">
        <h2>
          <FaClipboardList /> Pending Leave Approvals
        </h2>
        <div className="requests-grid">
          {dashboardData.pendingLeaveRequests &&
          dashboardData.pendingLeaveRequests.length > 0 ? (
            dashboardData.pendingLeaveRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="request-card">
                <div className="employee-info">
                  <div className="avatar">
                    {request.first_name.charAt(0)}
                    {request.last_name.charAt(0)}
                  </div>
                  <div>
                    <p className="employee-name">
                      {request.first_name} {request.last_name}
                    </p>
                    <p className="leave-type">{request.leave_type}</p>
                  </div>
                </div>
                <div className="leave-details">
                  <p className="leave-reason">{request.reason}</p>
                  <p className="leave-dates">
                    {request.start_date} to {request.end_date}
                  </p>
                </div>
                <div className="request-status">
                  <span className="status-pending">
                    <FaClock /> Pending Review
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-requests">No pending leave requests</div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Main Content */}
        <div className="dashboard-main">
          {/* Dashboard Title */}
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">
              <FaChartLine /> Manager Dashboard
            </h1>
            <p>Business Operations & Team Management</p>
          </div>

          {/* Tab Navigation */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartLine /> Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'access-logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('access-logs')}
            >
              <FaWifi /> Access Logs
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Loading dashboard data...</span>
                </div>
              ) : (
                renderOverview()
              )
            )}
            
            {activeTab === 'access-logs' && <AccessLogs />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

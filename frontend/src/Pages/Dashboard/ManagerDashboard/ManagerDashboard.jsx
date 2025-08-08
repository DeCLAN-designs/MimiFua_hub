import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaCalendarAlt,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaClipboardList,
  FaExclamationTriangle,
  FaUserClock,
} from "react-icons/fa";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    salesMetrics: {},
    leaveRequests: [],
    inventoryAlerts: [],
    employeeStats: {},
    recentActivities: [],
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/dashboard/manager",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("KES", "KSh");
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <FaChartLine /> Manager Dashboard
        </h1>
        <p>Overview of business operations and key metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card sales-card">
          <div className="card-icon">
            <FaShoppingCart />
          </div>
          <div className="card-content">
            <h3>Sales Today</h3>
            <p className="value">
              {formatAmount(dashboardData.salesMetrics.todaySales || 0)}
            </p>
            <div className="card-footer">
              <span
                className={`trend ${
                  dashboardData.salesMetrics.salesGrowth >= 0
                    ? "positive"
                    : "negative"
                }`}
              >
                {dashboardData.salesMetrics.salesGrowth >= 0 ? "↑" : "↓"}
                {Math.abs(dashboardData.salesMetrics.salesGrowth || 0)}% from
                yesterday
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card leave-card">
          <div className="card-icon">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <h3>Pending Leave Requests</h3>
            <p className="value">{dashboardData.leaveRequests.length}</p>
            <div className="card-footer">
              <span>
                {dashboardData.employeeStats.onLeave || 0} employees currently
                on leave
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card inventory-card">
          <div className="card-icon">
            <FaBox />
          </div>
          <div className="card-content">
            <h3>Inventory Alerts</h3>
            <p className="value">{dashboardData.inventoryAlerts.length}</p>
            <div className="card-footer">
              <span>
                {
                  dashboardData.inventoryAlerts.filter(
                    (item) => item.quantity === 0
                  ).length
                }{" "}
                out of stock items
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card staff-card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Staff Management</h3>
            <p className="value">
              {dashboardData.employeeStats.totalEmployees || 0}
            </p>
            <div className="card-footer">
              <span>
                {dashboardData.employeeStats.activeEmployees || 0} active,{" "}
                {dashboardData.employeeStats.newHires || 0} new hires
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <a href="/sales" className="action-card">
            <FaShoppingCart className="action-icon" />
            <span>Sales Management</span>
          </a>
          <a href="/leave" className="action-card">
            <FaCalendarAlt className="action-icon" />
            <span>Leave Approvals</span>
          </a>
          <a href="/inventory" className="action-card">
            <FaBox className="action-icon" />
            <span>Inventory Control</span>
          </a>
          <a href="/employees" className="action-card">
            <FaUsers className="action-icon" />
            <span>Employee Management</span>
          </a>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="panels-grid">
        <div className="panel recent-activity">
          <h2>
            <FaUserClock /> Recent Activity
          </h2>
          <ul>
            {dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <li key={index} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-details">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-meta">
                      <span className="employee">{activity.employee}</span> •
                      <span className="time">{activity.time}</span>
                    </p>
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
            {dashboardData.inventoryAlerts.filter(
              (item) => item.priority === "high"
            ).length > 0 ? (
              dashboardData.inventoryAlerts
                .filter((item) => item.priority === "high")
                .map((alert, index) => (
                  <li key={index} className="alert-item">
                    <div className="alert-icon">
                      <FaExclamationTriangle />
                    </div>
                    <div className="alert-details">
                      <p className="alert-title">
                        {alert.item} -{" "}
                        {alert.quantity === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                      </p>
                      <p className="alert-meta">
                        Only {alert.quantity} units left • {alert.lastUpdated}
                      </p>
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
          {dashboardData.leaveRequests.length > 0 ? (
            dashboardData.leaveRequests.map((request) => (
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
                    <p className="employee-email">{request.email}</p>
                  </div>
                </div>
                <div className="leave-details">
                  <p className="leave-reason">{request.reason}</p>
                  <p className="leave-dates">
                    {request.start_date} to {request.end_date} •{" "}
                    {request.duration} days
                  </p>
                </div>
                <div className="request-actions">
                  <button className="btn-approve">Approve</button>
                  <button className="btn-reject">Reject</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-requests">No pending leave requests</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

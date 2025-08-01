// frontend/src/Pages/Dashboard/EmployeeDashboard/EmployeeDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [recentRestocks, setRecentRestocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard?userId=${user.id}`
        );
        setSummary(res.data.summary);
        setRecentSales(res.data.recentSales);
        setRecentRestocks(res.data.recentRestocks);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar would be rendered by parent component */}

      <div className="dashboard-content">
        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-title">Total Revenue</div>
            <div className="summary-value">
              KES {summary?.totalSalesAmount?.toLocaleString() ?? "0"}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-title">Total Sales</div>
            <div className="summary-value">{summary?.salesCount ?? 0}</div>
          </div>

          <div className="summary-card">
            <div className="summary-title">Pending Leave Requests</div>
            <div className="summary-value">
              {summary?.pendingLeaveCount ?? 0}
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="tables-grid">
          <div className="table-card">
            <h3>Recent Sales</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.length > 0 ? (
                  recentSales.map((sale, idx) => (
                    <tr key={idx}>
                      <td>{sale.item}</td>
                      <td>KES {sale.amount}</td>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No sales found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <h3>Recent Restocks</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRestocks.length > 0 ? (
                  recentRestocks.map((restock, idx) => (
                    <tr key={idx}>
                      <td>{restock.item}</td>
                      <td>{restock.quantity}</td>
                      <td>{new Date(restock.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No restocks found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

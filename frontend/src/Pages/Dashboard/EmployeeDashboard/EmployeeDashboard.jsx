// frontend/src/Pages/Dashboard/EmployeeDashboard/EmployeeDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [recentRestocks, setRecentRestocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard?userId=${user.id}`
        );
        setSummary(res.data.summary || {});
        setRecentSales(res.data.recentSales || []);
        setRecentRestocks(res.data.recentRestocks || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  const formatCurrency = (amount) =>
    amount ? `KES ${Number(amount).toLocaleString()}` : "KES 0";

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      // Handles both MySQL date strings ("2025-09-02") and JS Date objects
      const date = new Date(value);
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        {/* === Summary Cards === */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-title">Total Revenue</div>
            <div className="summary-value">
              {formatCurrency(summary?.totalSalesAmount)}
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

        {/* === Tables Section === */}
        <div className="tables-grid">
          {/* Recent Sales */}
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
                  recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.item}</td>
                      <td>{formatCurrency(sale.amount)}</td>
                      <td>{formatDate(sale.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">🚫 No sales found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Restocks */}
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
                  recentRestocks.map((restock) => (
                    <tr key={restock.id}>
                      <td>{restock.item}</td>
                      <td>
                        {restock.quantity} {restock.unit_symbol ?? ""}
                      </td>
                      <td>{formatDate(restock.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">🚫No restocks found</td>
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

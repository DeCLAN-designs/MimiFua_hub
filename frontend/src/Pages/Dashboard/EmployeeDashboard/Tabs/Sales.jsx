// src/Pages/Dashboard/Views/SalesView.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import "./Sales.css";

const Sales = () => {
  const [view, setView] = useState("form");
  const [user, setUser] = useState(null);
  const [sale, setSale] = useState({ item: "", amount: "" });
  const [sales, setSales] = useState([]);
  const [groupedSales, setGroupedSales] = useState({});
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || stored.role !== "employee") {
      window.location.href = "/login";
      return;
    }
    setUser(stored);
    fetchSales(stored.id);
  }, []);

  const fetchSales = useCallback(async (userId) => {
    setStatus((s) => ({ ...s, loading: true }));
    try {
      const res = await axios.get("http://localhost:5000/api/sales", {
        params: { userId },
      });
      const backendSales = res.data.sales || [];
      setSales(backendSales);
      groupSalesByTime(backendSales);
    } catch (err) {
      console.error("Sales fetch error:", err);
      setStatus((s) => ({
        ...s,
        error: "",
      }));
      setSales([]); // Clear sales to show 'No entries found'
    } finally {
      setStatus((s) => ({ ...s, loading: false }));
    }
  }, []);

  const groupSalesByTime = (sales) => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const yesterdayStr = moment(now).subtract(1, "day").format("YYYY-MM-DD");
    const startOfWeek = moment().startOf("week");

    const grouped = {
      "📅 Today": [],
      "📆 Yesterday": [],
      "📊 This Week": [],
      "📦 Older": [],
    };

    sales.forEach((s) => {
      const saleDate = moment(s.date);
      const formatted = saleDate.format("YYYY-MM-DD");

      if (formatted === todayStr) {
        grouped["📅 Today"].push(s);
      } else if (formatted === yesterdayStr) {
        grouped["📆 Yesterday"].push(s);
      } else if (saleDate.isAfter(startOfWeek)) {
        grouped["📊 This Week"].push(s);
      } else {
        const label = saleDate.format("MMMM YYYY");
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(s);
      }
    });

    setGroupedSales(grouped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedItem = sale.item.trim();
    const amount = parseFloat(sale.amount);
    if (!trimmedItem || isNaN(amount) || amount <= 0) {
      setStatus({
        loading: false,
        error: "❌ Invalid item or amount.",
        success: "",
      });
      return;
    }

    const newSale = {
      item: trimmedItem,
      amount,
      user_id: user.id,
    };

    setStatus({ loading: true, error: "", success: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/sales", newSale);
      const recorded = res.data.sale;

      const updatedSales = [recorded, ...sales];
      setSales(updatedSales);
      groupSalesByTime(updatedSales);
      setSale({ item: "", amount: "" });
      setStatus({ loading: false, error: "", success: "✅ Sale recorded." });
    } catch (err) {
      console.error("Submit error:", err);
      setStatus({
        loading: false,
        error: "❌ Failed to record sale.",
        success: "",
      });
    }
  };

  return (
    <div className="sales-container">
      <div className="sales-tabs">
        <button
          className={view === "form" ? "active" : ""}
          onClick={() => setView("form")}
        >
          ➕ Add Sale
        </button>
        <button
          className={view === "summary" ? "active" : ""}
          onClick={() => setView("summary")}
        >
          📊 My Sales Summary
        </button>
      </div>

      {view === "form" ? (
        <>
          <form onSubmit={handleSubmit} className="employee-form">
            <h3>➕ Add a New Sale</h3>
            <input
              type="text"
              placeholder="Item Sold"
              value={sale.item}
              onChange={(e) => setSale({ ...sale, item: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount (KES)"
              value={sale.amount}
              onChange={(e) => setSale({ ...sale, amount: e.target.value })}
              required
            />
            <button type="submit" disabled={status.loading}>
              {status.loading ? "Submitting..." : "Submit Sale"}
            </button>
          </form>

          {status.error && <p className="error-message">{status.error}</p>}
          {status.success && (
            <p className="success-message">{status.success}</p>
          )}
        </>
      ) : (
        <>
          <h2 className="sales-title">💰 My Sales</h2>
          {status.loading ? (
            <p className="loading-message">Loading your sales data...</p>
          ) : sales.length === 0 ? (
            <div className="no-sales-message">
              <p className="no-sales-icon">📊</p>
              <h3>No Sales Recorded Yet</h3>
              <p>Get started by recording your first sale using the "Add Sale" tab above.</p>
            </div>
          ) : (
            Object.entries(groupedSales).map(([label, records]) => (
              <div key={label} className="sales-section">
                <h3 className="section-header">{label}</h3>
                {records.length === 0 ? (
                  <p className="no-sales-entry">🚫 No entries found.</p>
                ) : (
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Item</th>
                        <th>Amount (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((s, i) => (
                        <tr key={i}>
                          <td>{moment(s.date).format("YYYY-MM-DD")}</td>
                          <td>{s.item}</td>
                          <td>{s.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Sales;

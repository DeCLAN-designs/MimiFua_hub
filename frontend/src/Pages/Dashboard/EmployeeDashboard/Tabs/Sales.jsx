// src/Pages/Dashboard/Views/SalesView.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import "./Sales.css";

const Sales = () => {
  const [view, setView] = useState("form");
  const [user, setUser] = useState(null);
  const [sale, setSale] = useState({
    item: "",
    quantity: "",
    unit_id: "",
    amount: "",
  });
  const [sales, setSales] = useState([]);
  const [groupedSales, setGroupedSales] = useState({});
  const [units, setUnits] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  // === Bootstrapping ===
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || stored.role !== "employee") {
      window.location.href = "/login";
      return;
    }
    setUser(stored);
    fetchUnits();
    fetchSales(stored.id);
  }, []);

  // === Fetch Units ===
  const fetchUnits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/units");
      setUnits(res.data || []); // ✅ backend returns array, not { units }
    } catch (err) {
      console.error("Units fetch error:", err);
      setUnits([]);
    }
  };

  // === Fetch Sales ===
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
      setSales([]);
      setStatus((s) => ({ ...s, error: "❌ Failed to fetch sales" }));
    } finally {
      setStatus((s) => ({ ...s, loading: false }));
    }
  }, []);

  // === Group Sales by Time Buckets ===
  const groupSalesByTime = (sales) => {
    const now = new Date();
    const todayStr = moment(now).format("YYYY-MM-DD");
    const yesterdayStr = moment(now).subtract(1, "day").format("YYYY-MM-DD");
    const startOfWeek = moment().startOf("week");

    const grouped = {
      "📅 Today": [],
      "📆 Yesterday": [],
      "📊 This Week": [],
    };

    sales.forEach((s) => {
      const saleDate = moment(s.created_at);
      const formatted = saleDate.format("YYYY-MM-DD");

      if (formatted === todayStr) {
        grouped["📅 Today"].push(s);
      } else if (formatted === yesterdayStr) {
        grouped["📆 Yesterday"].push(s);
      } else if (saleDate.isSameOrAfter(startOfWeek)) {
        grouped["📊 This Week"].push(s);
      } else {
        const label = saleDate.format("MMMM YYYY");
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(s);
      }
    });

    setGroupedSales(grouped);
  };

  // === Submit Sale ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { item, quantity, unit_id, amount } = sale;

    if (!item.trim() || !quantity || !unit_id || !amount) {
      setStatus({
        loading: false,
        error: "❌ Please fill in all fields correctly.",
        success: "",
      });
      return;
    }

    const newSale = {
      item: item.trim(),
      quantity: parseFloat(quantity),
      unit_id: parseInt(unit_id, 10),
      amount: parseFloat(amount),
      user_id: user.id,
    };

    setStatus({ loading: true, error: "", success: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/sales", newSale);
      const recorded = res.data.sale;

      const updatedSales = [recorded, ...sales];
      setSales(updatedSales);
      groupSalesByTime(updatedSales);

      setSale({ item: "", quantity: "", unit_id: "", amount: "" });
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

  // === Resolve Unit Name/Symbol ===
  const getUnitDisplay = (unitId) => {
    const u = units.find((x) => x.id === unitId);
    return u ? `${u.name} (${u.symbol})` : "—";
  };

  // === Render ===
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
              step="0.01"
              placeholder="Quantity"
              value={sale.quantity}
              onChange={(e) => setSale({ ...sale, quantity: e.target.value })}
              required
            />
            <select
              value={sale.unit_id}
              onChange={(e) => setSale({ ...sale, unit_id: e.target.value })}
              required
            >
              <option value="">-- Select Unit --</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
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
              <p>
                Get started by recording your first sale using the "Add Sale"
                tab above.
              </p>
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
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Amount (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((s, i) => (
                        <tr key={i}>
                          <td>{moment(s.created_at).format("YYYY-MM-DD")}</td>
                          <td>{s.item}</td>
                          <td>{s.quantity}</td>
                          <td>{getUnitDisplay(s.unit_id)}</td>
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

// src/Pages/Dashboard/Views/SalesView.jsx
import React, { useState, useEffect } from "react";
import "./Sales.css";

const Sales = () => {
  const [view, setView] = useState("form");
  const [inventory, setInventory] = useState([]);
  const [sale, setSale] = useState({ item: "", amount: "" });
  const [sales, setSales] = useState([]);
  const [groupedSales, setGroupedSales] = useState({});
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "employee") {
      window.location.href = "/login";
      return;
    }

    const mockSales = [
      { id: 1, item: "Airtime", amount: 100, date: "2025-07-09" },
      { id: 2, item: "Data", amount: 250, date: "2025-07-08" },
      { id: 3, item: "Bundle", amount: 150, date: "2025-07-07" },
      { id: 4, item: "Sim Card", amount: 200, date: "2025-07-03" },
      { id: 5, item: "SMS Pack", amount: 80, date: "2025-06-15" },
      { id: 6, item: "Minutes", amount: 300, date: "2025-05-22" },
    ];

    setInventory([
      { item: "Airtime", quantity: 100 },
      { item: "Bundles", quantity: 50 },
    ]);

    setSales(mockSales);
    groupSalesByTime(mockSales);
  }, []);

  const groupSalesByTime = (sales) => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const grouped = {
      "📅 Today": [],
      "📆 Yesterday": [],
      "📊 This Week": [],
      "📦 Older": [],
    };

    sales.forEach((sale) => {
      const saleDate = new Date(sale.date);

      if (sale.date === todayStr) {
        grouped["📅 Today"].push(sale);
      } else if (sale.date === yesterdayStr) {
        grouped["📆 Yesterday"].push(sale);
      } else if (saleDate >= startOfWeek && saleDate < new Date(todayStr)) {
        grouped["📊 This Week"].push(sale);
      } else if (
        saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear()
      ) {
        grouped["📦 Older"].push(sale);
      } else {
        const monthYear = saleDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        if (!grouped[monthYear]) grouped[monthYear] = [];
        grouped[monthYear].push(sale);
      }
    });

    setGroupedSales(grouped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedItem = sale.item.trim();
    const amount = parseFloat(sale.amount);
    if (!trimmedItem || isNaN(amount) || amount <= 0) {
      setStatus({
        loading: false,
        error: "Invalid item or amount.",
        success: "",
      });
      return;
    }

    const newSale = {
      id: sales.length + 1,
      item: trimmedItem,
      amount,
      date: new Date().toISOString().split("T")[0],
    };

    setStatus({ loading: true, error: "", success: "" });

    // Simulate API delay
    setTimeout(() => {
      const updated = [newSale, ...sales];
      setSales(updated);
      groupSalesByTime(updated);
      setSale({ item: "", amount: "" });
      setStatus({
        loading: false,
        error: "",
        success: "✅ Sale recorded successfully.",
      });
    }, 500);
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
          <h2>📦 Remaining Inventory</h2>
          <ul className="inventory-list">
            {inventory.map((inv, i) => (
              <li key={i}>
                <strong>{inv.item}</strong>: {inv.quantity}
              </li>
            ))}
          </ul>

          <h3>➕ Add a New Sale</h3>
          <form onSubmit={handleSubmit} className="employee-form">
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
          {Object.entries(groupedSales).map(([section, sales]) => (
            <div key={section} className="sales-section">
              <h3 className="section-header">{section}</h3>
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Amount (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.date}</td>
                      <td>{sale.item}</td>
                      <td>{sale.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Sales;

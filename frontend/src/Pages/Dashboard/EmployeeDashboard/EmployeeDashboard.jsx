import React, { useState, useEffect } from "react";
// import axios from "axios"; // Uncomment when backend integration is ready
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [sale, setSale] = useState({ item: "", amount: "" });
  const [sales, setSales] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "employee") {
      window.location.href = "/login"; // Force logout for invalid session or role
      return;
    }

    // Placeholder — use API integration here
    setInventory([
      { item: "Airtime", quantity: 100 },
      { item: "Bundles", quantity: 50 },
    ]);

    setSales([
      { item: "Airtime", amount: 100, date: "2025-07-09" },
      { item: "Data", amount: 250, date: "2025-07-08" },
    ]);

    // Future:
    // fetchInventory(storedUser.token);
    // fetchSales(storedUser.token, storedUser.id);
  }, []);

  // Future enhancement
  /*
  const fetchInventory = async (token) => {
    try {
      const res = await axios.get("/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    }
  };

  const fetchSales = async (token, userId) => {
    try {
      const res = await axios.get(`/api/sales/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data);
    } catch (err) {
      console.error("Failed to fetch sales", err);
    }
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedItem = sale.item.trim();
    const amount = parseFloat(sale.amount);

    if (!trimmedItem || isNaN(amount) || amount <= 0) {
      setStatus({ loading: false, error: "Invalid item or amount.", success: "" });
      return;
    }

    const newSale = {
      item: trimmedItem,
      amount,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      setStatus({ loading: true, error: "", success: "" });

      // Future:
      // await axios.post("/api/sales", {
      //   user_id: userId,
      //   ...newSale
      // }, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      setSales([newSale, ...sales]);
      setSale({ item: "", amount: "" });
      setStatus({ loading: false, error: "", success: "✅ Sale recorded successfully." });
    } catch (err) {
      console.error("Sale submission failed", err);
      setStatus({ loading: false, error: "❌ Failed to record sale.", success: "" });
    }
  };

  return (
    <div className="employee-dashboard-view">
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
      {status.success && <p className="success-message">{status.success}</p>}

      <h3>🧾 Recent Sales</h3>
      <ul className="sales-list">
        {sales.map((s, i) => (
          <li key={i}>
            {s.date} - {s.item} - KES {s.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDashboard;

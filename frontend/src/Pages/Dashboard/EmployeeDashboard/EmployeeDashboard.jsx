import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
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

    fetchInventory(storedUser.token);
    fetchSales(storedUser.token, storedUser.id);
  }, []);

  const fetchInventory = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/restocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
      setStatus((prev) => ({ ...prev, error: "❌ Could not load inventory." }));
    }
  };

  const fetchSales = async (token, userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sales/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data);
    } catch (err) {
      console.error("Failed to fetch sales", err);
      setStatus((prev) => ({ ...prev, error: "❌ Could not load sales." }));
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

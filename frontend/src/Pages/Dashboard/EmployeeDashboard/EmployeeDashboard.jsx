import React, { useState, useEffect } from "react";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [sale, setSale] = useState({ item: "", amount: "" });
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // TODO: Fetch inventory and sales from backend
    setInventory([
      { item: "Airtime", quantity: 100 },
      { item: "Bundles", quantity: 50 },
    ]);

    setSales([
      { item: "Airtime", amount: 100, date: "2025-07-09" },
      { item: "Data", amount: 250, date: "2025-07-08" },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSale = {
      item: sale.item.trim(),
      amount: parseFloat(sale.amount),
      date: new Date().toISOString().split("T")[0],
    };
    // TODO: Send to backend
    setSales([newSale, ...sales]);
    setSale({ item: "", amount: "" });
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
        <button type="submit">Submit Sale</button>
      </form>

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

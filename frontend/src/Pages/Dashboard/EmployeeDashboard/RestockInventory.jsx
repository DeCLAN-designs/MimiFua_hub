import React, { useState } from "react";
import "./EmployeeDashboard.css";

const RestockInventory = () => {
  const [restock, setRestock] = useState({ item: "", quantity: "" });
  const [requests, setRequests] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      item: restock.item.trim(),
      quantity: parseInt(restock.quantity),
      date: new Date().toISOString().split("T")[0],
    };
    // TODO: Send to backend
    setRequests([newRequest, ...requests]);
    setRestock({ item: "", quantity: "" });
  };

  return (
    <div className="employee-restock-view">
      <h2>📦 Restock Inventory</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <input
          type="text"
          placeholder="Item Name"
          value={restock.item}
          onChange={(e) => setRestock({ ...restock, item: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={restock.quantity}
          onChange={(e) => setRestock({ ...restock, quantity: e.target.value })}
          required
        />
        <button type="submit">Submit Request</button>
      </form>

      <h3>📄 Submitted Requests</h3>
      <ul className="restock-list">
        {requests.map((req, i) => (
          <li key={i}>
            {req.date} - {req.item} ({req.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestockInventory;

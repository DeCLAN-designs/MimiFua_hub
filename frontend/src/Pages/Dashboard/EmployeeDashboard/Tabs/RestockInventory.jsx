import React, { useState, useEffect } from "react";
// import axios from "axios"; // Uncomment when backend is ready

const RestockInventory = ({ user }) => { // eslint-disable-line no-unused-vars
  const [restocks, setRestocks] = useState([]);
  const [form, setForm] = useState({ item: "", quantity: "" });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    // Placeholder - Replace with real backend call
    setRestocks([
      { item: "Airtime", quantity: 50, date: "2025-07-10" },
      { item: "Data", quantity: 20, date: "2025-07-08" },
    ]);

    // Future:
    // fetchRestocks(user.token, user.id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedItem = form.item.trim();
    const quantity = parseInt(form.quantity, 10);

    if (!trimmedItem || isNaN(quantity) || quantity <= 0) {
      setStatus({ ...status, error: "Invalid restock entry." });
      return;
    }

    const newRestock = {
      item: trimmedItem,
      quantity,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      setStatus({ loading: true, error: "", success: "" });

      // Future: backend API integration
      // await axios.post("/api/restocks", {
      //   user_id: user.id,
      //   ...newRestock,
      // }, {
      //   headers: { Authorization: `Bearer ${user.token}` },
      // });

      setRestocks([newRestock, ...restocks]);
      setForm({ item: "", quantity: "" });
      setStatus({ loading: false, success: "✅ Restock submitted." });
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, error: "❌ Failed to submit restock." });
    }
  };

  return (
    <div className="employee-restock-view">
      <h2>🔄 Restock Inventory</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <input
          type="text"
          placeholder="Item to restock"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit" disabled={status.loading}>
          {status.loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {status.error && <p className="error-message">{status.error}</p>}
      {status.success && <p className="success-message">{status.success}</p>}

      <h3>📋 Restock History</h3>
      <ul className="sales-list">
        {restocks.map((r, i) => (
          <li key={i}>
            {r.date} - {r.item} - Qty: {r.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestockInventory;

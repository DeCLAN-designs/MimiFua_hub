import React, { useState } from "react";
import "./Employee.css";
// import axios from "axios"; // Uncomment when backend is ready

const Employee = () => {
  const [sale, setSale] = useState({ item: "", amount: "" });
  const [restock, setRestock] = useState({ item: "", quantity: "" });
  const [leave, setLeave] = useState({ reason: "", days: "" });
  const [submitting, setSubmitting] = useState(false); // form lock state

  // Util: Sanitizes & validates inputs
  const sanitizeSale = () => ({
    item: sale.item.trim(),
    amount: parseFloat(sale.amount),
  });

  const sanitizeRestock = () => ({
    item: restock.item.trim(),
    quantity: parseInt(restock.quantity, 10),
  });

  const sanitizeLeave = () => ({
    reason: leave.reason.trim(),
    days: parseInt(leave.days, 10),
  });

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    const { item, amount } = sanitizeSale();
    if (!item || isNaN(amount) || amount <= 0)
      return alert("Invalid sale input");

    try {
      setSubmitting(true);
      // await axios.post("/api/sales", { item, amount });
      console.log("✅ Sale submitted:", { item, amount });
      setSale({ item: "", amount: "" });
    } catch (err) {
      console.error("❌ Sale submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    const { item, quantity } = sanitizeRestock();
    if (!item || isNaN(quantity) || quantity <= 0)
      return alert("Invalid restock input");

    try {
      setSubmitting(true);
      // await axios.post("/api/restocks", { item, quantity });
      console.log("✅ Restock submitted:", { item, quantity });
      setRestock({ item: "", quantity: "" });
    } catch (err) {
      console.error("❌ Restock failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    const { reason, days } = sanitizeLeave();
    if (!reason || isNaN(days) || days <= 0)
      return alert("Invalid leave input");

    try {
      setSubmitting(true);
      // await axios.post("/api/leaves", { reason, days });
      console.log("✅ Leave submitted:", { reason, days });
      setLeave({ reason: "", days: "" });
    } catch (err) {
      console.error("❌ Leave application failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="employee-view">
      {/* ➕ Record a Sale */}
      <section className="card">
        <h3>➕ Record a Sale</h3>
        <form onSubmit={handleSaleSubmit}>
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
            min="1"
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Sale"}
          </button>
        </form>
      </section>

      {/* 📦 Restock Inventory */}
      <section className="card">
        <h3>📦 Restock Inventory</h3>
        <form onSubmit={handleRestockSubmit}>
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
            onChange={(e) =>
              setRestock({ ...restock, quantity: e.target.value })
            }
            min="1"
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Request Restock"}
          </button>
        </form>
      </section>

      {/* 📝 Apply for Leave */}
      <section className="card">
        <h3>📝 Apply for Leave</h3>
        <form onSubmit={handleLeaveSubmit}>
          <textarea
            placeholder="Reason for Leave"
            value={leave.reason}
            onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Number of Days"
            value={leave.days}
            onChange={(e) => setLeave({ ...leave, days: e.target.value })}
            min="1"
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Employee;

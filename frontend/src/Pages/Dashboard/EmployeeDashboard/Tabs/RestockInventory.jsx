import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./RestockInventory.css";

const RestockInventory = () => {
  const [restockItem, setRestockItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("form");

  const user = JSON.parse(localStorage.getItem("user"));

  const groupRestocksByDate = useCallback((restocks) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const grouped = { Today: [], Yesterday: [], "This Week": [], Older: [] };

    restocks.forEach((r) => {
      const d = new Date(r.created_at);
      const dateOnly = d.toDateString();
      if (dateOnly === today.toDateString()) grouped["Today"].push(r);
      else if (dateOnly === yesterday.toDateString())
        grouped["Yesterday"].push(r);
      else if (d >= startOfWeek) grouped["This Week"].push(r);
      else grouped["Older"].push(r);
    });

    setGrouped(grouped);
  }, []);

  const fetchRestocks = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/restocks/${user.id}`
      );
      groupRestocksByDate(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load restock requests.");
    }
  }, [groupRestocksByDate, user.id]);

  useEffect(() => {
    if (user?.id) fetchRestocks();
  }, [fetchRestocks, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!restockItem.trim() || !quantity.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/restocks", {
        item: restockItem.trim(),
        quantity: parseInt(quantity),
        user_id: user.id,
      });

      if (res.status === 201) {
        setSuccess("Restock request submitted.");
        setRestockItem("");
        setQuantity("");
        fetchRestocks();
      } else {
        setError("Submission failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  const sectionIcon = (label) => {
    switch (label) {
      case "Today":
        return "📅";
      case "Yesterday":
        return "📆";
      case "This Week":
        return "📊";
      case "Older":
        return "📦";
      default:
        return "📁";
    }
  };

  const renderGroupedRows = () => {
    return Object.entries(grouped).map(([section, entries]) => (
      <div key={section} className="group-section">
        <h3 className="group-heading">
          {sectionIcon(section)} {section}
        </h3>
        <div className="group-table-wrapper">
          <table className="group-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.length > 0 ? (
                entries.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>{r.item}</td>
                    <td>{r.quantity}</td>
                    <td>{r.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No entries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    ));
  };

  return (
    <div className="restock-container">
      <div className="restock-tabs">
        <button
          className={activeTab === "form" ? "active-tab" : ""}
          onClick={() => setActiveTab("form")}
        >
          🛒 Restock Inventory
        </button>
        <button
          className={activeTab === "requests" ? "active-tab" : ""}
          onClick={() => setActiveTab("requests")}
        >
          📋 My Restock Requests
        </button>
      </div>

      {activeTab === "form" && (
        <form className="restock-form" onSubmit={handleSubmit}>
          <h2 className="section-heading">🔄 Submit Restock Request</h2>
          <input
            type="text"
            placeholder="Item to Restock"
            value={restockItem}
            onChange={(e) => setRestockItem(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </form>
      )}

      {activeTab === "requests" && (
        <div className="restock-requests">
          <h2 className="section-heading">Your Restock Requests</h2>
          {renderGroupedRows()}
        </div>
      )}
    </div>
  );
};

export default RestockInventory;

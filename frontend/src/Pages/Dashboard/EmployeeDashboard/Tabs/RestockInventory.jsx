// Pages/Dashboard/EmployeeDashboard/RestockInventory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RestockInventory.css";

const RestockInventory = () => {
  const [restockItem, setRestockItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [restocks, setRestocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // auth should validate before access

  useEffect(() => {
    fetchRestocks();
  }, []);

  const fetchRestocks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/restocks/${user.id}`
      );
      setRestocks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load restocks");
    }
  };

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
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-view">
      <h2 className="employee-heading">🔄 Restock Inventory</h2>

      <form className="employee-form_restocks" onSubmit={handleSubmit}>
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
          {loading ? "Submitting..." : "Submit Restock"}
        </button>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </form>

      <h3 className="employee-subheading">Your Restock Requests</h3>
      <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Item</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {restocks.length > 0 ? (
              restocks.map((restock) => (
                <tr key={restock.id}>
                  {/* <td>{restock.id}</td> */}
                  <td>{restock.item}</td>
                  <td>{restock.quantity}</td>
                  <td>{restock.status}</td>
                  <td>{new Date(restock.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No restock requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestockInventory;

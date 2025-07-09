// Pages/Dashboard/Sidebar.jsx
import React from "react";
import "./Sidebar.css";

const Sidebar = ({ user, onLogout }) => {
  return (
    <aside className="sidebar">
      <h2>MiMi Fua Hub</h2>
      <nav>
        <ul>
          <li>📊 Dashboard</li>
          {user.role === "manager" && (
            <>
              <li>👥 Manage Employees</li>
              <li>📈 View All Sales</li>
              <li>🧾 Reports</li>
            </>
          )}
          {user.role === "employee" && (
            <>
              <li>🛒 My Sales</li>
              <li>📦 Restock Inventory</li>
            </>
          )}
          <li onClick={onLogout} className="logout-btn">
            🚪 Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

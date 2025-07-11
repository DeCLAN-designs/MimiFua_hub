import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = ({ user, onLogout, onNavigate, activeView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (view) => {
    onNavigate(view);
    setIsOpen(false); // close sidebar on mobile
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">MiMi Fua Hub</h2>
        <ul className="sidebar-menu">
          <li
            className={activeView === "dashboard" ? "active" : ""}
            onClick={() => handleNavigate("dashboard")}
          >
            📊 Dashboard
          </li>

          {user?.role === "manager" && (
            <>
              <li
                className={activeView === "manage-employees" ? "active" : ""}
                onClick={() => handleNavigate("manage-employees")}
              >
                👥 Manage Employees
              </li>
              <li
                className={activeView === "all-sales" ? "active" : ""}
                onClick={() => handleNavigate("all-sales")}
              >
                📈 View All Sales
              </li>
              <li
                className={activeView === "reports" ? "active" : ""}
                onClick={() => handleNavigate("reports")}
              >
                🧾 Reports
              </li>
            </>
          )}

          {user?.role === "employee" && (
            <>
              <li
                className={activeView === "my-sales" ? "active" : ""}
                onClick={() => handleNavigate("my-sales")}
              >
                🛒 My Sales
              </li>
              <li
                className={activeView === "restock" ? "active" : ""}
                onClick={() => handleNavigate("restock")}
              >
                📦 Restock Inventory
              </li>
            </>
          )}

          <li className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;

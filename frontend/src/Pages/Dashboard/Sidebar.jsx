// src/Pages/Dashboard/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import PropTypes from "prop-types";
import "./Sidebar.css";

const EMPLOYEE_NAV = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "my-sales", label: "🛒 My Sales" },
  { key: "restock", label: "📦 Restock Inventory" },
  { key: "summary", label: "📃 Summary" },
  { key: "leave", label: "📝 Leave" },
];

const MANAGER_NAV = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "employees", label: "👥 Employees" },
  { key: "sales", label: "📈 Sales" },
  { key: "inventory", label: "🧾 Inventory" },
  { key: "leave", label: "📜 Leave" },
];

const Sidebar = ({ user, onLogout, onNavigate, activeView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = useMemo(() => {
    return user?.role === "manager" ? MANAGER_NAV : EMPLOYEE_NAV;
  }, [user?.role]);

  const handleNavigate = (key) => {
    onNavigate(key);
    setIsOpen(false); // Close sidebar on mobile
  };

  return (
    <>
      {/* Hamburger toggle for mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar drawer */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} role="complementary">
        <h2 className="sidebar-title">MiMi Fua Hub</h2>

        <ul className="sidebar-nav">
          {navItems.map(({ key, label }) => (
            <li
              key={key}
              className={`nav-item ${activeView === key ? "active" : ""}`}
              onClick={() => handleNavigate(key)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === "Enter" && handleNavigate(key)}
              aria-current={activeView === key ? "page" : undefined}
            >
              {label}
            </li>
          ))}
          <li
            className="nav-item logout"
            onClick={onLogout}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === "Enter" && onLogout()}
          >
            🚪 Logout
          </li>
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

Sidebar.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
};

export default Sidebar;

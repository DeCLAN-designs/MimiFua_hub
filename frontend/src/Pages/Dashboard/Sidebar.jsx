// src/Pages/Dashboard/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Sidebar.css";

const EMPLOYEE_NAV = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "my-sales", label: "🛒 My Sales" },
  { key: "restock", label: "📦 Restock Inventory" },
  { key: "summary", label: "📃 Summary" },
  { key: "leave", label: "📝 Leave" },
  { key: "personal-activity", label: "👤 My Activity" },
];

const MANAGER_NAV = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "employees", label: "👥 Employees" },
  { key: "sales", label: "📈 Sales" },
  { key: "inventory", label: "🧾 Inventory" },
  { key: "leave", label: "📜 Leave" },
];

const ADMIN_NAV = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "users", label: "👥 User Management" },
  { key: "access-logs", label: "📝 Access Logs" },
  { key: "analytics", label: "📊 Analytics" },
  { key: "settings", label: "⚙️ Settings" },
  // Admin can access manager views too
  { key: "employees", label: "👨‍💼 Employees (Manager)" },
  { key: "sales", label: "💰 Sales (Manager)" },
  { key: "inventory", label: "📦 Inventory (Manager)" },
  { key: "leave", label: "📜 Leave (Manager)" },
];

const Sidebar = ({ user, onLogout, onNavigate, activeView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    if (user?.role === "admin") return ADMIN_NAV;
    if (user?.role === "manager") return MANAGER_NAV;
    return EMPLOYEE_NAV;
  }, [user?.role]);

  const getRouteForView = (key, role) => {
    if (role === "admin") {
      return key === "dashboard" ? "/admindashboard" : `/admindashboard/${key}`;
    } else if (role === "manager") {
      return key === "dashboard" ? "/managerdashboard" : `/managerdashboard/${key}`;
    } else {
      return key === "dashboard" ? "/employeedashboard" : `/employeedashboard/${key}`;
    }
  };

  const handleNavigate = (key) => {
    const route = getRouteForView(key, user?.role);
    navigate(route);
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

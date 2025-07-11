// Pages/Dashboard/DashboardHeader.jsx
import React, { useState } from "react";
import {
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiSettings,
  FiEye,
  FiX,
} from "react-icons/fi";
import "./DashboardHeader.css";

const DashboardHeader = ({ name, role, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const handleProfile = () => {
    console.log("🔧 Profile clicked");
    closeDropdown();
  };

  const handleSettings = () => {
    console.log("⚙️ Settings clicked");
    closeDropdown();
  };

  const handleAccessibility = () => {
    console.log("👁️ Accessibility clicked");
    closeDropdown();
  };

  const handleLogout = () => {
    closeDropdown();
    onLogout();
  };

  return (
    <header className="dashboard-header">
      {/* Left: Greeting */}
      <div className="welcome-message">
        <h1>Welcome, {name}</h1>
      </div>

      {/* Right: Role and Profile */}
      <div className="header-right">
        <span className="user-role">Role: {role?.toUpperCase()}</span>

        <div className="profile-section">
          <div className="avatar-dropdown" onClick={toggleDropdown}>
            <div className="avatar-circle">{name?.charAt(0).toUpperCase()}</div>
            <FiChevronDown className="dropdown-icon" />
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-close-btn"
                onClick={closeDropdown}
                title="Close"
              >
                <FiX />
              </button>
              <ul>
                <li onClick={handleProfile}>
                  <FiUser className="icon" /> Profile
                </li>
                <li onClick={handleSettings}>
                  <FiSettings className="icon" /> Settings
                </li>
                <li onClick={handleAccessibility}>
                  <FiEye className="icon" /> Accessibility
                </li>
                <li onClick={handleLogout} className="logout">
                  <FiLogOut className="icon" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

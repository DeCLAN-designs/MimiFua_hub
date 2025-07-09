// Pages/Dashboard/DashboardHeader.jsx
import React from "react";
import "./DashboardHeader.css";

const DashboardHeader = ({ name, role }) => {
  return (
    <header className="dashboard-header">
      <h1>Welcome, {name}</h1>
      <p className="user-role">Role: {role?.toUpperCase()}</p>
    </header>
  );
};

export default DashboardHeader;

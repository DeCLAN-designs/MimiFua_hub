// Pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

// Manager Views
import ManagerDashboard from "./ManagerDashboard/ManagerDashboard";
import ManageEmployees from "./ManagerDashboard/ManageEmployees";
import AllSales from "./ManagerDashboard/AllSales";
import Reports from "./ManagerDashboard/Reports";

// Employee Views
import EmployeeDashboard from "./EmployeeDashboard/EmployeeDashboard";
import MySales from "./EmployeeDashboard/MySales";
import RestockInventory from "./EmployeeDashboard/RestockInventory";

import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      window.location.href = "/login";
    } else {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const renderView = () => {
    if (!user) return null;

    const { role } = user;

    if (role === "manager") {
      switch (activeView) {
        case "dashboard":
          return <ManagerDashboard />;
        case "manage-employees":
          return <ManageEmployees />;
        case "all-sales":
          return <AllSales />;
        case "reports":
          return <Reports />;
        default:
          return <ManagerDashboard />;
      }
    }

    if (role === "employee") {
      switch (activeView) {
        case "dashboard":
          return <EmployeeDashboard />;
        case "my-sales":
          return <MySales />;
        case "restock":
          return <RestockInventory />;
        default:
          return <EmployeeDashboard />;
      }
    }

    return <div>Access Denied</div>;
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        onNavigate={setActiveView}
        activeView={activeView}
      />
      <div className="dashboard-content">
        <DashboardHeader name={user?.name} role={user?.role} />
        <main className="dashboard-main">{renderView()}</main>
      </div>
    </div>
  );
};

export default Dashboard;

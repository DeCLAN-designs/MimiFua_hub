import React, { useEffect, useState } from "react";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const [overview, setOverview] = useState({ employees: 0, totalSales: 0 });

  useEffect(() => {
    // TODO: Fetch real stats from backend
    setOverview({ employees: 5, totalSales: 120000 });
  }, []);

  return (
    <div className="manager-dashboard-view">
      <h2>📊 Manager Overview</h2>
      <div className="stat-cards">
        <div className="stat-card">
          <h4>Total Employees</h4>
          <p>{overview.employees}</p>
        </div>
        <div className="stat-card">
          <h4>Total Sales</h4>
          <p>KES {overview.totalSales}</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

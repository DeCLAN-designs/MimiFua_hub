import React from "react";
import StatCard from "./StatCard";

const Manager = () => (
  <div className="card-grid">
    <StatCard title="Total Sales" value="KES 456,000" />
    <StatCard title="Active Employees" value="14" />
    <StatCard title="Pending Reports" value="3" />
  </div>
);

export default Manager;

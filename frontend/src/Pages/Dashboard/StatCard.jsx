import React from "react";

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default StatCard;

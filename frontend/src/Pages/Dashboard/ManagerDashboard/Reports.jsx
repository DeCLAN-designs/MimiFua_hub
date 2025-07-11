import React from "react";
import "./ManagerDashboard.css";

const Reports = () => {
  const handleDownload = () => {
    // TODO: Trigger actual report generation and download
    alert("🔄 Downloading report (TODO: implement backend)");
  };

  return (
    <div className="reports-view">
      <h2>🧾 Reports</h2>
      <p>Generate and download monthly/weekly reports.</p>
      <button onClick={handleDownload} className="btn-download">
        ⬇️ Download Report
      </button>
    </div>
  );
};

export default Reports;

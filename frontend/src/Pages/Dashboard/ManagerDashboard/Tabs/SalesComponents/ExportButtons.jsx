import React from 'react';
import './ExportButtons.css';

const ExportButtons = ({ 
  onExportCSV, 
  onExportPDF, 
  disabled = false,
  showAnalyticsToggle = false,
  showAnalytics = false,
  onToggleAnalytics
}) => {
  return (
    <div className="reports-actions">
      <button
        onClick={onExportCSV}
        className="export-button"
        disabled={disabled}
      >
        📄 Export CSV
      </button>
      <button
        onClick={onExportPDF}
        className="export-button pdf-button"
        disabled={disabled}
      >
        📋 Export PDF
      </button>
      {showAnalyticsToggle && (
        <button
          onClick={onToggleAnalytics}
          className={`analytics-toggle ${showAnalytics ? "active" : ""}`}
        >
          {showAnalytics ? "📊 Hide Analytics" : "📊 Show Analytics"}
        </button>
      )}
    </div>
  );
};

export default ExportButtons;

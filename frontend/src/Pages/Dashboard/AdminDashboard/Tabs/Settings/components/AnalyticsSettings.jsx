import React from 'react';
import { FaChartBar, FaEye, FaUserSecret, FaDownload, FaClock } from 'react-icons/fa';
import './AnalyticsSettings.css';

const AnalyticsSettings = ({ settings, onSettingsChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'number') {
      processedValue = parseInt(value) || 0;
    }
    
    onSettingsChange({
      [name]: processedValue
    });
  };

  return (
    <div className="settings-section analytics-settings">
      <div className="section-header">
        <h3><FaChartBar /> Analytics & Reporting Settings</h3>
        <p>Configure data collection, reporting, and analytics preferences</p>
      </div>

      {/* Data Collection */}
      <div className="subsection">
        <h4><FaEye /> Data Collection</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enable_analytics"
              checked={settings.enable_analytics || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable Analytics Collection</strong>
              <small>Collect user activity data for insights and reporting</small>
            </div>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="track_user_sessions"
              checked={settings.track_user_sessions || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Track User Sessions</strong>
              <small>Monitor user login times, session duration, and activity patterns</small>
            </div>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="track_page_views"
              checked={settings.track_page_views || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Track Page Views</strong>
              <small>Record which pages users visit and how often</small>
            </div>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="track_performance_metrics"
              checked={settings.track_performance_metrics || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Track Performance Metrics</strong>
              <small>Monitor system performance, load times, and error rates</small>
            </div>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="subsection">
        <h4><FaUserSecret /> Privacy & Anonymization</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="anonymize_user_data"
              checked={settings.anonymize_user_data || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Anonymize User Data</strong>
              <small>Remove personally identifiable information from analytics</small>
            </div>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="respect_do_not_track"
              checked={settings.respect_do_not_track || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Respect "Do Not Track"</strong>
              <small>Honor user browser settings for tracking preferences</small>
            </div>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="data_retention_days">Data Retention Period</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="data_retention_days"
              name="data_retention_days"
              value={settings.data_retention_days || 365}
              onChange={handleChange}
              min="30"
              max="2555"
            />
            <span className="unit">days</span>
          </div>
          <small>How long to keep analytics data before automatic deletion</small>
        </div>
      </div>

      {/* Reporting Configuration */}
      <div className="subsection">
        <h4><FaDownload /> Automated Reports</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enable_automated_reports"
              checked={settings.enable_automated_reports || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable Automated Reports</strong>
              <small>Generate and email regular analytics reports</small>
            </div>
          </label>
        </div>

        {settings.enable_automated_reports && (
          <div className="report-config">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="report_frequency">Report Frequency</label>
                <select
                  id="report_frequency"
                  name="report_frequency"
                  value={settings.report_frequency || 'weekly'}
                  onChange={handleChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <small>How often to generate automated reports</small>
              </div>

              <div className="form-group">
                <label htmlFor="report_recipients">Report Recipients</label>
                <input
                  type="email"
                  id="report_recipients"
                  name="report_recipients"
                  value={settings.report_recipients || ''}
                  onChange={handleChange}
                  placeholder="admin@mimifuahub.com, manager@mimifuahub.com"
                />
                <small>Email addresses to receive reports (comma-separated)</small>
              </div>
            </div>

            <div className="report-types">
              <h5>Report Types</h5>
              <div className="checkbox-grid">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="include_user_activity"
                    checked={settings.include_user_activity || false}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  <span>User Activity Report</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="include_system_performance"
                    checked={settings.include_system_performance || false}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  <span>System Performance Report</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="include_security_summary"
                    checked={settings.include_security_summary || false}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  <span>Security Summary Report</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="include_usage_statistics"
                    checked={settings.include_usage_statistics || false}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  <span>Usage Statistics Report</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Customization */}
      <div className="subsection">
        <h4>Dashboard Customization</h4>
        
        <div className="form-group">
          <label htmlFor="default_chart_type">Default Chart Type</label>
          <select
            id="default_chart_type"
            name="default_chart_type"
            value={settings.default_chart_type || 'line'}
            onChange={handleChange}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
            <option value="doughnut">Doughnut Chart</option>
          </select>
          <small>Default visualization type for analytics dashboards</small>
        </div>

        <div className="form-group">
          <label htmlFor="dashboard_refresh_interval">Dashboard Refresh Interval</label>
          <select
            id="dashboard_refresh_interval"
            name="dashboard_refresh_interval"
            value={settings.dashboard_refresh_interval || 300}
            onChange={handleChange}
          >
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="900">15 minutes</option>
            <option value="1800">30 minutes</option>
            <option value="3600">1 hour</option>
            <option value="0">Manual only</option>
          </select>
          <small>How often to refresh dashboard data automatically</small>
        </div>
      </div>

      {/* Current Analytics Status */}
      <div className="subsection">
        <h4>Current Analytics Status</h4>
        
        <div className="analytics-status-grid">
          <div className="status-card">
            <div className="status-icon active">📊</div>
            <div className="status-info">
              <h5>Data Collection</h5>
              <span className={settings.enable_analytics ? 'status-active' : 'status-inactive'}>
                {settings.enable_analytics ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">👥</div>
            <div className="status-info">
              <h5>Active Users (24h)</h5>
              <span className="status-number">42</span>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">📈</div>
            <div className="status-info">
              <h5>Page Views (24h)</h5>
              <span className="status-number">1,247</span>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">⚡</div>
            <div className="status-info">
              <h5>Avg Load Time</h5>
              <span className="status-number">1.2s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="subsection">
        <h4>Data Export</h4>
        
        <div className="export-options">
          <div className="export-item">
            <div className="export-info">
              <h5>User Activity Data</h5>
              <p>Export user login patterns, session data, and activity logs</p>
            </div>
            <button className="btn btn-secondary">
              <FaDownload /> Export CSV
            </button>
          </div>

          <div className="export-item">
            <div className="export-info">
              <h5>System Performance Data</h5>
              <p>Export performance metrics, load times, and error rates</p>
            </div>
            <button className="btn btn-secondary">
              <FaDownload /> Export CSV
            </button>
          </div>

          <div className="export-item">
            <div className="export-info">
              <h5>Usage Statistics</h5>
              <p>Export feature usage, page views, and user engagement data</p>
            </div>
            <button className="btn btn-secondary">
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Compliance */}
      <div className="subsection">
        <h4>Privacy Compliance</h4>
        
        <div className="compliance-info">
          <div className="compliance-item">
            <div className="compliance-status good">✅</div>
            <div className="compliance-details">
              <h5>Data Anonymization</h5>
              <p>{settings.anonymize_user_data ? 'Enabled - User data is anonymized' : 'Disabled - Consider enabling for better privacy'}</p>
            </div>
          </div>

          <div className="compliance-item">
            <div className="compliance-status good">✅</div>
            <div className="compliance-details">
              <h5>Data Retention</h5>
              <p>Data automatically deleted after {settings.data_retention_days || 365} days</p>
            </div>
          </div>

          <div className="compliance-item">
            <div className="compliance-status good">✅</div>
            <div className="compliance-details">
              <h5>User Consent</h5>
              <p>Analytics collection requires user consent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSettings;

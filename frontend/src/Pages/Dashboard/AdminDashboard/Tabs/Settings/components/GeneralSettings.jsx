import React from 'react';
import { FaCog, FaExclamationTriangle } from 'react-icons/fa';
import "./GeneralSettings.css"

const GeneralSettings = ({ settings, onSettingsChange }) => {
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
    <div className="settings-section general-settings">
      <div className="section-header">
        <h3><FaCog /> General Settings</h3>
        <p>Configure basic system settings and appearance</p>
      </div>
      
      {/* Site Information */}
      <div className="subsection">
        <h4>Site Information</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="site_name">Site Name *</label>
            <input
              type="text"
              id="site_name"
              name="site_name"
              value={settings.site_name || ''}
              onChange={handleChange}
              required
              placeholder="Enter site name"
            />
            <small>This will appear in the browser title and throughout the system</small>
          </div>

          <div className="form-group">
            <label htmlFor="site_description">Site Description</label>
            <input
              type="text"
              id="site_description"
              name="site_description"
              value={settings.site_description || ''}
              onChange={handleChange}
              placeholder="Brief description of your system"
            />
            <small>Optional description for your organization</small>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="subsection">
        <h4>Localization</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={settings.timezone || 'Africa/Nairobi'}
              onChange={handleChange}
            >
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
            <small>Default timezone for all users and system operations</small>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={settings.language || 'en'}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
            <small>Default language for the system interface</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_format">Date Format</label>
            <select
              id="date_format"
              name="date_format"
              value={settings.date_format || 'dd/MM/yyyy'}
              onChange={handleChange}
            >
              <option value="dd/MM/yyyy">DD/MM/YYYY (31/12/2024)</option>
              <option value="MM/dd/yyyy">MM/DD/YYYY (12/31/2024)</option>
              <option value="yyyy-MM-dd">YYYY-MM-DD (2024-12-31)</option>
              <option value="dd-MM-yyyy">DD-MM-YYYY (31-12-2024)</option>
            </select>
            <small>How dates are displayed throughout the system</small>
          </div>

          <div className="form-group">
            <label htmlFor="time_format">Time Format</label>
            <select
              id="time_format"
              name="time_format"
              value={settings.time_format || '12h'}
              onChange={handleChange}
            >
              <option value="12h">12 Hour (2:30 PM)</option>
              <option value="24h">24 Hour (14:30)</option>
            </select>
            <small>Time display format preference</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={settings.currency || 'KES'}
            onChange={handleChange}
          >
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="ZAR">South African Rand (ZAR)</option>
            <option value="UGX">Ugandan Shilling (UGX)</option>
            <option value="TZS">Tanzanian Shilling (TZS)</option>
          </select>
          <small>Default currency for financial displays and calculations</small>
        </div>
      </div>

      {/* System Maintenance */}
      <div className="subsection">
        <h4>System Maintenance</h4>
        <div className="maintenance-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="maintenance_mode"
                checked={settings.maintenance_mode || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>Maintenance Mode</strong>
                <small>When enabled, only administrators can access the system</small>
              </div>
            </label>
          </div>

          {settings.maintenance_mode && (
            <div className="maintenance-message-section">
              <div className="form-group">
                <label htmlFor="maintenance_message">Maintenance Message</label>
                <textarea
                  id="maintenance_message"
                  name="maintenance_message"
                  value={settings.maintenance_message || ''}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Message to display to users during maintenance"
                />
                <small>This message will be shown to users when they try to access the system</small>
              </div>
              
              <div className="maintenance-warning">
                <FaExclamationTriangle />
                <span>
                  <strong>Warning:</strong> Maintenance mode will prevent all non-admin users from accessing the system.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Information Display */}
      <div className="subsection">
        <h4>System Information</h4>
        <div className="system-info-grid">
          <div className="info-item">
            <label>Current Timezone</label>
            <span>{settings.timezone || 'Africa/Nairobi'}</span>
          </div>
          <div className="info-item">
            <label>Date Format Preview</label>
            <span>
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: settings.timezone || 'Africa/Nairobi'
              })}
            </span>
          </div>
          <div className="info-item">
            <label>Time Format Preview</label>
            <span>
              {new Date().toLocaleTimeString('en-US', {
                hour12: settings.time_format === '12h',
                timeZone: settings.timezone || 'Africa/Nairobi'
              })}
            </span>
          </div>
          <div className="info-item">
            <label>System Status</label>
            <span className={`status-badge ${settings.maintenance_mode ? 'maintenance' : 'operational'}`}>
              {settings.maintenance_mode ? 'Maintenance Mode' : 'Operational'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="subsection">
        <h4>Quick Actions</h4>
        <div className="quick-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              const currentTime = new Date().toLocaleString('en-US', {
                timeZone: settings.timezone || 'Africa/Nairobi'
              });
              alert(`Current time in ${settings.timezone || 'Africa/Nairobi'}: ${currentTime}`);
            }}
          >
            Test Timezone
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              const testDate = new Date();
              const formattedDate = testDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              alert(`Date format preview: ${formattedDate}`);
            }}
          >
            Preview Date Format
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;

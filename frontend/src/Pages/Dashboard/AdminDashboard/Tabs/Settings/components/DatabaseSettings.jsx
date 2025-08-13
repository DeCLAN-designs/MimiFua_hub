import React, { useState } from 'react';
import { FaDatabase, FaDownload, FaUpload, FaSpinner, FaServer, FaTrash, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import "./DatabaseSettings.css"

const DatabaseSettings = ({ settings, onSettingsChange }) => {
  const [loading, setLoading] = useState(false);

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

  const createBackup = async () => {
    try {
      setLoading(true);
      // Mock backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const filename = `backup_${new Date().toISOString().split('T')[0]}.sql`;
      toast.success(`Backup created successfully! File: ${filename}`);
    } catch (err) {
      toast.error('Backup creation failed');
    } finally {
      setLoading(false);
    }
  };

  const runDatabaseOptimization = async () => {
    try {
      setLoading(true);
      // Mock database optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Database optimized! Cleaned 1.2MB of unused data.');
    } catch (err) {
      toast.error('Database optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const cleanupOldBackups = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Old backups cleaned up. Freed 45MB of storage.');
    } catch (err) {
      toast.error('Backup cleanup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-section database-settings">
      <div className="section-header">
        <h3><FaDatabase /> Database & Backup Settings</h3>
        <p>Manage database optimization, backups, and maintenance</p>
      </div>

      {/* Backup Settings */}
      <div className="subsection">
        <h4>Backup Configuration</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="auto_backup_enabled"
              checked={settings.auto_backup_enabled || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable Automatic Backups</strong>
              <small>Automatically create database backups on schedule</small>
            </div>
          </label>
        </div>

        {settings.auto_backup_enabled && (
          <div className="backup-config">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="backup_frequency">Backup Frequency</label>
                <select
                  id="backup_frequency"
                  name="backup_frequency"
                  value={settings.backup_frequency || 'daily'}
                  onChange={handleChange}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily (Recommended)</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <small>How often to create automatic backups</small>
              </div>

              <div className="form-group">
                <label htmlFor="backup_retention_days">Retention Period</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="backup_retention_days"
                    name="backup_retention_days"
                    value={settings.backup_retention_days || 30}
                    onChange={handleChange}
                    min="1"
                    max="365"
                  />
                  <span className="unit">days</span>
                </div>
                <small>How long to keep backup files</small>
              </div>
            </div>

            <div className="backup-schedule-info">
              <h5>Current Schedule</h5>
              <div className="schedule-details">
                <span><strong>Frequency:</strong> {settings.backup_frequency || 'daily'}</span>
                <span><strong>Retention:</strong> {settings.backup_retention_days || 30} days</span>
                <span><strong>Next Backup:</strong> {new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="backup-actions">
          <button
            type="button"
            onClick={createBackup}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaDownload />}
            Create Backup Now
          </button>

          <button
            type="button"
            onClick={cleanupOldBackups}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaTrash />}
            Cleanup Old Backups
          </button>
        </div>
      </div>

      {/* Database Optimization */}
      <div className="subsection">
        <h4>Database Optimization</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="database_optimization"
              checked={settings.database_optimization || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable Automatic Optimization</strong>
              <small>Automatically optimize database performance weekly</small>
            </div>
          </label>
        </div>

        <div className="optimization-info">
          <div className="info-grid">
            <div className="info-item">
              <label>Database Size</label>
              <span>24.7 MB</span>
            </div>
            <div className="info-item">
              <label>Last Optimized</label>
              <span>2 days ago</span>
            </div>
            <div className="info-item">
              <label>Tables</label>
              <span>8 tables</span>
            </div>
            <div className="info-item">
              <label>Total Records</label>
              <span>1,247 records</span>
            </div>
          </div>
        </div>

        <div className="optimization-actions">
          <button
            type="button"
            onClick={runDatabaseOptimization}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaServer />}
            Optimize Database Now
          </button>
        </div>
      </div>

      {/* Storage Management */}
      <div className="subsection">
        <h4>Storage Management</h4>
        
        <div className="storage-overview">
          <div className="storage-item">
            <div className="storage-icon database">
              <FaDatabase />
            </div>
            <div className="storage-details">
              <h5>Database</h5>
              <div className="storage-bar">
                <div className="storage-fill" style={{width: '35%'}}></div>
              </div>
              <span>24.7 MB / 100 MB</span>
            </div>
          </div>

          <div className="storage-item">
            <div className="storage-icon backups">
              <FaDownload />
            </div>
            <div className="storage-details">
              <h5>Backups</h5>
              <div className="storage-bar">
                <div className="storage-fill" style={{width: '60%'}}></div>
              </div>
              <span>156 MB / 500 MB</span>
            </div>
          </div>

          <div className="storage-item">
            <div className="storage-icon logs">
              <FaClock />
            </div>
            <div className="storage-details">
              <h5>Logs</h5>
              <div className="storage-bar">
                <div className="storage-fill" style={{width: '20%'}}></div>
              </div>
              <span>8.3 MB / 50 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Backups */}
      <div className="subsection">
        <h4>Recent Backups</h4>
        
        <div className="backup-list">
          <div className="backup-item">
            <div className="backup-info">
              <span className="backup-name">backup_2025-08-13.sql</span>
              <span className="backup-size">24.7 MB</span>
            </div>
            <div className="backup-actions">
              <button className="btn-icon" title="Download">
                <FaDownload />
              </button>
              <button className="btn-icon danger" title="Delete">
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="backup-item">
            <div className="backup-info">
              <span className="backup-name">backup_2025-08-12.sql</span>
              <span className="backup-size">24.5 MB</span>
            </div>
            <div className="backup-actions">
              <button className="btn-icon" title="Download">
                <FaDownload />
              </button>
              <button className="btn-icon danger" title="Delete">
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="backup-item">
            <div className="backup-info">
              <span className="backup-name">backup_2025-08-11.sql</span>
              <span className="backup-size">24.3 MB</span>
            </div>
            <div className="backup-actions">
              <button className="btn-icon" title="Download">
                <FaDownload />
              </button>
              <button className="btn-icon danger" title="Delete">
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Health */}
      <div className="subsection">
        <h4>Database Health</h4>
        
        <div className="health-metrics">
          <div className="metric-card good">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <h5>Connection</h5>
              <span>Healthy</span>
            </div>
          </div>

          <div className="metric-card good">
            <div className="metric-icon">⚡</div>
            <div className="metric-info">
              <h5>Performance</h5>
              <span>Optimal</span>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">⚠️</div>
            <div className="metric-info">
              <h5>Storage</h5>
              <span>60% Used</span>
            </div>
          </div>

          <div className="metric-card good">
            <div className="metric-icon">🔒</div>
            <div className="metric-info">
              <h5>Security</h5>
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="subsection">
        <h4>Maintenance Schedule</h4>
        
        <div className="maintenance-schedule">
          <div className="schedule-item">
            <div className="schedule-icon">
              <FaServer />
            </div>
            <div className="schedule-details">
              <h5>Database Optimization</h5>
              <span>Every Sunday at 2:00 AM</span>
            </div>
            <div className="schedule-status enabled">Enabled</div>
          </div>

          <div className="schedule-item">
            <div className="schedule-icon">
              <FaDownload />
            </div>
            <div className="schedule-details">
              <h5>Automatic Backup</h5>
              <span>Daily at 3:00 AM</span>
            </div>
            <div className="schedule-status enabled">Enabled</div>
          </div>

          <div className="schedule-item">
            <div className="schedule-icon">
              <FaTrash />
            </div>
            <div className="schedule-details">
              <h5>Cleanup Old Logs</h5>
              <span>Monthly on 1st at 1:00 AM</span>
            </div>
            <div className="schedule-status enabled">Enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSettings;

import React, { useState, useEffect } from 'react';
import { 
  FaSpinner, FaSave, FaUndo, FaCog, FaShieldAlt, FaEnvelope, 
  FaDatabase, FaChartBar, FaBell, FaUsers, FaServer,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminService } from '../../../../../services/adminService';
import SecuritySettings from './components/SecuritySettings';
import GeneralSettings from './components/GeneralSettings';
import EmailSettings from './components/EmailSettings';
import UserManagementSettings from './components/UserManagementSettings';
import DatabaseSettings from './components/DatabaseSettings';
import AnalyticsSettings from './components/AnalyticsSettings';
import NotificationsSettings from './components/NotificationsSettings';

import './SettingsContainer.css';

const SettingsContainer = ({ settings: propSettings, onSave }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(propSettings || {
    // General Settings
    site_name: 'MimiFua Hub',
    site_description: 'Employee Management System',
    timezone: 'Africa/Nairobi',
    date_format: 'dd/MM/yyyy',
    time_format: '12h',
    language: 'en',
    currency: 'KES',
    maintenance_mode: false,
    maintenance_message: 'System under maintenance. Please check back later.',
    
    // Security Settings
    session_lifetime: 120,
    password_reset_timeout: 60,
    max_login_attempts: 5,
    lockout_time: 15,
    require_2fa: false,
    password_min_length: 8,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_symbols: false,
    auto_logout_inactive: true,
    session_concurrent_limit: 3,
    ip_whitelist_enabled: false,
    ip_whitelist: '',
    login_notification_email: true,
    suspicious_activity_alerts: true,
    force_password_change_days: 90,
    
    // User Management
    enable_registration: true,
    enable_email_verification: true,
    default_user_role: 'employee',
    max_users_per_manager: 50,
    allow_profile_editing: true,
    require_manager_approval: false,
    
    // Email Settings
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    email_from_address: 'noreply@mimifuahub.com',
    email_from_name: 'MimiFua Hub',
    
    // Database & Backup
    auto_backup_enabled: true,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    database_optimization: true,
    
    // Analytics & Reporting
    analytics_enabled: true,
    track_user_activity: true,
    generate_reports: true,
    report_frequency: 'weekly',
    
    // Notifications
    email_notifications: true,
    system_alerts: true,
    security_alerts: true,
    performance_alerts: false
  });

  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(!propSettings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: FaCog, component: GeneralSettings },
    { id: 'security', label: 'Security', icon: FaShield, component: SecuritySettings },
    { id: 'users', label: 'User Management', icon: FaUsers, component: UserManagementSettings },
    { id: 'email', label: 'Email', icon: FaEnvelope, component: EmailSettings },
    { id: 'database', label: 'Database & Backup', icon: FaDatabase, component: DatabaseSettings },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar, component: AnalyticsSettings },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: NotificationsSettings }
  ];

  // Update settings when props change
  useEffect(() => {
    if (propSettings) {
      setSettings(propSettings);
      setOriginalSettings(propSettings);
      setLoading(false);
    }
  }, [propSettings]);

  // Fetch settings if not provided via props
  useEffect(() => {
    if (!propSettings) {
      fetchSettings();
    }
  }, [propSettings]);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await adminService.settings.get();
      setSettings(settingsData);
      setOriginalSettings(settingsData);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Please try again.');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const validateSettings = () => {
    const errors = [];
    
    if (!settings.site_name?.trim()) {
      errors.push('Site name is required');
    }
    
    if (settings.password_min_length < 6) {
      errors.push('Password minimum length should be at least 6 characters');
    }
    
    if (settings.session_lifetime < 15) {
      errors.push('Session lifetime should be at least 15 minutes');
    }
    
    if (settings.smtp_host && !settings.smtp_username) {
      errors.push('SMTP username is required when SMTP host is set');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate settings before saving
    const validationErrors = validateSettings();
    if (validationErrors.length > 0) {
      toast.error(`Validation failed: ${validationErrors.join(', ')}`);
      return;
    }
    
    try {
      setSaving(true);
      if (onSave) {
        await onSave(settings);
      } else {
        await adminService.settings.update(settings);
        await fetchSettings(); // Refresh data
        toast.success('Settings saved successfully!');
      }
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast.info('Settings reset to original values');
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <FaSpinner className="spinner" />
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-error">
        <FaExclamationTriangle className="error-icon" />
        <p>{error}</p>
        <button onClick={fetchSettings} className="btn btn-primary">
          <FaUndo /> Retry
        </button>
      </div>
    );
  }

  // Get the active tab component
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2><FaCog /> System Settings</h2>
        <div className="settings-actions">
          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={saving}
            >
              <FaUndo /> Reset
            </button>
          )}
          <button
            type="submit"
            form="settings-form"
            className="btn btn-primary"
            disabled={saving || !hasChanges}
          >
            {saving ? <FaSpinner className="spinner" /> : <FaSave />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent /> {tab.label}
            </button>
          );
        })}
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="settings-form">
        {ActiveComponent && (
          <ActiveComponent
            settings={settings}
            onSettingsChange={handleSettingsChange}
            loading={loading}
            saving={saving}
          />
        )}
      </form>
    </div>
  );
};

export default SettingsContainer;

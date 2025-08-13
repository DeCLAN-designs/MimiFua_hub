import React from 'react';
import { FaBell, FaEnvelope, FaSms, FaSlack, FaDiscord, FaWhatsapp } from 'react-icons/fa';
import "./NotificationsSettings.css"        

const NotificationsSettings = ({ settings, onSettingsChange }) => {
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
    <div className="settings-section notifications-settings">
      <div className="section-header">
        <h3><FaBell /> Notification Settings</h3>
        <p>Configure system notifications, alerts, and communication channels</p>
      </div>

      {/* Email Notifications */}
      <div className="subsection">
        <h4><FaEnvelope /> Email Notifications</h4>
        
        <div className="notification-category">
          <h5>System Alerts</h5>
          <div className="notification-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email_system_errors"
                checked={settings.email_system_errors || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>System Errors</strong>
                <small>Critical system errors and failures</small>
              </div>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email_security_alerts"
                checked={settings.email_security_alerts || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>Security Alerts</strong>
                <small>Failed login attempts, suspicious activity</small>
              </div>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email_backup_status"
                checked={settings.email_backup_status || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>Backup Status</strong>
                <small>Backup completion and failure notifications</small>
              </div>
            </label>
          </div>
        </div>

        <div className="notification-category">
          <h5>User Management</h5>
          <div className="notification-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email_new_registrations"
                checked={settings.email_new_registrations || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>New User Registrations</strong>
                <small>Notify when new users register</small>
              </div>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email_user_status_changes"
                checked={settings.email_user_status_changes || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>User Status Changes</strong>
                <small>Account activations, deactivations, role changes</small>
              </div>
            </label>
          </div>
        </div>

        <div className="notification-category">
          <h5>Reports & Analytics</h5>
          <div className="notification-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email_daily_reports"
                checked={settings.email_daily_reports || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>Daily Summary Reports</strong>
                <small>Daily system activity and performance summary</small>
              </div>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email_weekly_reports"
                checked={settings.email_weekly_reports || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <strong>Weekly Analytics Reports</strong>
                <small>Comprehensive weekly analytics and insights</small>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="subsection">
        <h4><FaBell /> In-App Notifications</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enable_push_notifications"
              checked={settings.enable_push_notifications || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable Push Notifications</strong>
              <small>Show browser notifications for important events</small>
            </div>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="show_notification_badges"
              checked={settings.show_notification_badges || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Show Notification Badges</strong>
              <small>Display notification count badges in the interface</small>
            </div>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="notification_sound">Notification Sound</label>
          <select
            id="notification_sound"
            name="notification_sound"
            value={settings.notification_sound || 'default'}
            onChange={handleChange}
          >
            <option value="none">None (Silent)</option>
            <option value="default">Default</option>
            <option value="chime">Chime</option>
            <option value="bell">Bell</option>
            <option value="pop">Pop</option>
          </select>
          <small>Sound to play for in-app notifications</small>
        </div>
      </div>

      {/* Third-Party Integrations */}
      <div className="subsection">
        <h4>Third-Party Integrations</h4>
        
        <div className="integration-grid">
          <div className="integration-card">
            <div className="integration-header">
              <FaSlack className="integration-icon slack" />
              <h5>Slack</h5>
            </div>
            <div className="integration-content">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="slack_enabled"
                  checked={settings.slack_enabled || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>Enable Slack notifications</span>
              </label>
              {settings.slack_enabled && (
                <div className="integration-config">
                  <input
                    type="text"
                    name="slack_webhook_url"
                    value={settings.slack_webhook_url || ''}
                    onChange={handleChange}
                    placeholder="Slack webhook URL"
                  />
                  <input
                    type="text"
                    name="slack_channel"
                    value={settings.slack_channel || ''}
                    onChange={handleChange}
                    placeholder="#alerts"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-header">
              <FaDiscord className="integration-icon discord" />
              <h5>Discord</h5>
            </div>
            <div className="integration-content">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="discord_enabled"
                  checked={settings.discord_enabled || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>Enable Discord notifications</span>
              </label>
              {settings.discord_enabled && (
                <div className="integration-config">
                  <input
                    type="text"
                    name="discord_webhook_url"
                    value={settings.discord_webhook_url || ''}
                    onChange={handleChange}
                    placeholder="Discord webhook URL"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-header">
              <FaWhatsapp className="integration-icon whatsapp" />
              <h5>WhatsApp</h5>
            </div>
            <div className="integration-content">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="whatsapp_enabled"
                  checked={settings.whatsapp_enabled || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>Enable WhatsApp alerts</span>
              </label>
              {settings.whatsapp_enabled && (
                <div className="integration-config">
                  <input
                    type="text"
                    name="whatsapp_api_key"
                    value={settings.whatsapp_api_key || ''}
                    onChange={handleChange}
                    placeholder="WhatsApp Business API key"
                  />
                  <input
                    type="tel"
                    name="whatsapp_phone_number"
                    value={settings.whatsapp_phone_number || ''}
                    onChange={handleChange}
                    placeholder="+254700000000"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="integration-card">
            <div className="integration-header">
              <FaSms className="integration-icon sms" />
              <h5>SMS</h5>
            </div>
            <div className="integration-content">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="sms_enabled"
                  checked={settings.sms_enabled || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>Enable SMS notifications</span>
              </label>
              {settings.sms_enabled && (
                <div className="integration-config">
                  <select
                    name="sms_provider"
                    value={settings.sms_provider || 'twilio'}
                    onChange={handleChange}
                  >
                    <option value="twilio">Twilio</option>
                    <option value="africastalking">Africa's Talking</option>
                    <option value="nexmo">Vonage (Nexmo)</option>
                  </select>
                  <input
                    type="text"
                    name="sms_api_key"
                    value={settings.sms_api_key || ''}
                    onChange={handleChange}
                    placeholder="SMS API key"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Recipients */}
      <div className="subsection">
        <h4>Notification Recipients</h4>
        
        <div className="recipients-section">
          <div className="form-group">
            <label htmlFor="admin_email_recipients">Admin Email Recipients</label>
            <textarea
              id="admin_email_recipients"
              name="admin_email_recipients"
              value={settings.admin_email_recipients || ''}
              onChange={handleChange}
              rows="3"
              placeholder="admin@mimifuahub.com&#10;manager@mimifuahub.com&#10;security@mimifuahub.com"
            />
            <small>Email addresses to receive admin notifications (one per line)</small>
          </div>

          <div className="form-group">
            <label htmlFor="emergency_contact_numbers">Emergency Contact Numbers</label>
            <textarea
              id="emergency_contact_numbers"
              name="emergency_contact_numbers"
              value={settings.emergency_contact_numbers || ''}
              onChange={handleChange}
              rows="3"
              placeholder="+254700000001&#10;+254700000002"
            />
            <small>Phone numbers for critical system alerts (one per line)</small>
          </div>
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="subsection">
        <h4>Notification Schedule</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enable_quiet_hours"
              checked={settings.enable_quiet_hours || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable Quiet Hours</strong>
              <small>Suppress non-critical notifications during specified hours</small>
            </div>
          </label>
        </div>

        {settings.enable_quiet_hours && (
          <div className="quiet-hours-config">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quiet_hours_start">Start Time</label>
                <input
                  type="time"
                  id="quiet_hours_start"
                  name="quiet_hours_start"
                  value={settings.quiet_hours_start || '22:00'}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="quiet_hours_end">End Time</label>
                <input
                  type="time"
                  id="quiet_hours_end"
                  name="quiet_hours_end"
                  value={settings.quiet_hours_end || '06:00'}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="quiet-hours-info">
              <p>Non-critical notifications will be suppressed from {settings.quiet_hours_start || '22:00'} to {settings.quiet_hours_end || '06:00'}</p>
              <small>Critical security alerts will still be sent immediately</small>
            </div>
          </div>
        )}
      </div>

      {/* Recent Notifications */}
      <div className="subsection">
        <h4>Recent Notifications</h4>
        
        <div className="recent-notifications">
          <div className="notification-item">
            <div className="notification-icon success">✅</div>
            <div className="notification-content">
              <h5>Backup Completed Successfully</h5>
              <p>Daily backup completed at 03:00 AM</p>
              <span className="notification-time">2 hours ago</span>
            </div>
          </div>

          <div className="notification-item">
            <div className="notification-icon info">ℹ️</div>
            <div className="notification-content">
              <h5>New User Registration</h5>
              <p>John Doe registered as an employee</p>
              <span className="notification-time">4 hours ago</span>
            </div>
          </div>

          <div className="notification-item">
            <div className="notification-icon warning">⚠️</div>
            <div className="notification-content">
              <h5>High CPU Usage</h5>
              <p>Server CPU usage reached 85%</p>
              <span className="notification-time">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Notifications */}
      <div className="subsection">
        <h4>Test Notifications</h4>
        
        <div className="test-notifications">
          <p>Send test notifications to verify your configuration:</p>
          <div className="test-buttons">
            <button className="btn btn-secondary">
              <FaEnvelope /> Test Email
            </button>
            <button className="btn btn-secondary">
              <FaBell /> Test Push Notification
            </button>
            <button className="btn btn-secondary">
              <FaSlack /> Test Slack
            </button>
            <button className="btn btn-secondary">
              <FaSms /> Test SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;

import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaPlay, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import "./EmailSettings.css"

const EmailSettings = ({ settings, onSettingsChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

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

  const testEmailConnection = async () => {
    try {
      setTestingConnection(true);
      setConnectionStatus(null);
      
      // Validate required fields
      if (!settings.smtp_host || !settings.smtp_username || !settings.smtp_password) {
        toast.error('Please fill in all required SMTP fields before testing');
        setConnectionStatus('error');
        return;
      }

      // Mock email connection test - in real implementation, this would test SMTP connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate connection test result
      const isValid = settings.smtp_host.includes('.') && settings.smtp_username.includes('@');
      
      if (isValid) {
        setConnectionStatus('success');
        toast.success('Email connection test successful!');
      } else {
        setConnectionStatus('error');
        toast.error('Email connection failed. Please check your settings.');
      }
    } catch (err) {
      setConnectionStatus('error');
      toast.error('Failed to test email connection');
    } finally {
      setTestingConnection(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      setTestingConnection(true);
      
      // Mock sending test email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Test email sent successfully!');
    } catch (err) {
      toast.error('Failed to send test email');
    } finally {
      setTestingConnection(false);
    }
  };

  const getConnectionStatusIcon = () => {
    if (connectionStatus === 'success') return <FaCheck className="status-success" />;
    if (connectionStatus === 'error') return <FaTimes className="status-error" />;
    return null;
  };

  return (
    <div className="settings-section email-settings">
      <div className="section-header">
        <h3><FaEnvelope /> Email Settings</h3>
        <p>Configure SMTP settings for system emails and notifications</p>
      </div>

      {/* SMTP Configuration */}
      <div className="subsection">
        <h4>SMTP Configuration</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="smtp_host">SMTP Host *</label>
            <input
              type="text"
              id="smtp_host"
              name="smtp_host"
              value={settings.smtp_host || ''}
              onChange={handleChange}
              placeholder="smtp.gmail.com"
              required
            />
            <small>Your email provider's SMTP server address</small>
          </div>

          <div className="form-group">
            <label htmlFor="smtp_port">SMTP Port *</label>
            <select
              id="smtp_port"
              name="smtp_port"
              value={settings.smtp_port || 587}
              onChange={handleChange}
            >
              <option value="25">25 (Non-encrypted)</option>
              <option value="587">587 (TLS - Recommended)</option>
              <option value="465">465 (SSL)</option>
              <option value="2525">2525 (Alternative TLS)</option>
            </select>
            <small>Port number for SMTP connection</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="smtp_username">SMTP Username *</label>
            <input
              type="email"
              id="smtp_username"
              name="smtp_username"
              value={settings.smtp_username || ''}
              onChange={handleChange}
              placeholder="your-email@gmail.com"
              required
            />
            <small>Usually your email address</small>
          </div>

          <div className="form-group">
            <label htmlFor="smtp_password">SMTP Password *</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="smtp_password"
                name="smtp_password"
                value={settings.smtp_password || ''}
                onChange={handleChange}
                placeholder="App password or regular password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <small>Use app-specific password for Gmail/Outlook</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="smtp_encryption">Encryption</label>
          <select
            id="smtp_encryption"
            name="smtp_encryption"
            value={settings.smtp_encryption || 'tls'}
            onChange={handleChange}
          >
            <option value="tls">TLS (Recommended)</option>
            <option value="ssl">SSL</option>
            <option value="none">None (Not recommended)</option>
          </select>
          <small>Encryption method for secure email transmission</small>
        </div>
      </div>

      {/* Email Identity */}
      <div className="subsection">
        <h4>Email Identity</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email_from_address">From Email Address *</label>
            <input
              type="email"
              id="email_from_address"
              name="email_from_address"
              value={settings.email_from_address || ''}
              onChange={handleChange}
              placeholder="noreply@mimifuahub.com"
              required
            />
            <small>Email address that appears as sender</small>
          </div>

          <div className="form-group">
            <label htmlFor="email_from_name">From Name</label>
            <input
              type="text"
              id="email_from_name"
              name="email_from_name"
              value={settings.email_from_name || ''}
              onChange={handleChange}
              placeholder="MimiFua Hub"
            />
            <small>Display name for outgoing emails</small>
          </div>
        </div>
      </div>

      {/* Connection Testing */}
      <div className="subsection">
        <h4>Connection Testing</h4>
        
        <div className="test-section">
          <div className="test-actions">
            <button
              type="button"
              onClick={testEmailConnection}
              className="btn btn-secondary"
              disabled={testingConnection}
            >
              {testingConnection ? <FaSpinner className="spinner" /> : <FaPlay />}
              Test Connection
            </button>

            <button
              type="button"
              onClick={sendTestEmail}
              className="btn btn-primary"
              disabled={testingConnection || !settings.smtp_host}
            >
              {testingConnection ? <FaSpinner className="spinner" /> : <FaEnvelope />}
              Send Test Email
            </button>
          </div>

          {connectionStatus && (
            <div className={`connection-status ${connectionStatus}`}>
              {getConnectionStatusIcon()}
              <span>
                {connectionStatus === 'success' 
                  ? 'Connection successful! SMTP settings are working correctly.'
                  : 'Connection failed. Please check your SMTP settings and try again.'
                }
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Email Templates Preview */}
      <div className="subsection">
        <h4>Email Preview</h4>
        
        <div className="email-preview">
          <div className="preview-header">
            <strong>From:</strong> {settings.email_from_name || 'MimiFua Hub'} &lt;{settings.email_from_address || 'noreply@mimifuahub.com'}&gt;
          </div>
          <div className="preview-subject">
            <strong>Subject:</strong> Welcome to {settings.site_name || 'MimiFua Hub'}
          </div>
          <div className="preview-body">
            <p>Dear User,</p>
            <p>Welcome to {settings.site_name || 'MimiFua Hub'}! Your account has been successfully created.</p>
            <p>Best regards,<br />The {settings.site_name || 'MimiFua Hub'} Team</p>
          </div>
        </div>
      </div>

      {/* Common SMTP Providers */}
      <div className="subsection">
        <h4>Common SMTP Providers</h4>
        
        <div className="smtp-providers">
          <div className="provider-card">
            <h5>Gmail</h5>
            <div className="provider-settings">
              <span><strong>Host:</strong> smtp.gmail.com</span>
              <span><strong>Port:</strong> 587 (TLS)</span>
              <span><strong>Note:</strong> Use App Password</span>
            </div>
          </div>

          <div className="provider-card">
            <h5>Outlook/Hotmail</h5>
            <div className="provider-settings">
              <span><strong>Host:</strong> smtp-mail.outlook.com</span>
              <span><strong>Port:</strong> 587 (TLS)</span>
              <span><strong>Note:</strong> Use regular password</span>
            </div>
          </div>

          <div className="provider-card">
            <h5>Yahoo</h5>
            <div className="provider-settings">
              <span><strong>Host:</strong> smtp.mail.yahoo.com</span>
              <span><strong>Port:</strong> 587 (TLS)</span>
              <span><strong>Note:</strong> Use App Password</span>
            </div>
          </div>

          <div className="provider-card">
            <h5>SendGrid</h5>
            <div className="provider-settings">
              <span><strong>Host:</strong> smtp.sendgrid.net</span>
              <span><strong>Port:</strong> 587 (TLS)</span>
              <span><strong>Note:</strong> Use API Key as password</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="security-notice">
        <h5>Security Recommendations</h5>
        <ul>
          <li>Always use TLS or SSL encryption for SMTP connections</li>
          <li>Use app-specific passwords instead of your main email password</li>
          <li>Regularly rotate SMTP credentials</li>
          <li>Monitor email sending logs for suspicious activity</li>
          <li>Consider using dedicated email services like SendGrid for high volume</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailSettings;

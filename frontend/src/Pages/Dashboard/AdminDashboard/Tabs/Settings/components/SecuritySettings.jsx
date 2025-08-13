import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, FaLock, FaEye, FaExclamationTriangle, 
  FaCheck, FaServer 
} from 'react-icons/fa';
import "./SecuritySettings.css"

const SecuritySettings = ({ settings, onSettingsChange }) => {
  const [passwordStrength, setPasswordStrength] = useState('medium');
  const [securityScore, setSecurityScore] = useState(0);

  // Calculate password strength based on requirements
  const calculatePasswordStrength = () => {
    let score = 0;
    const requirements = [
      settings.password_require_uppercase,
      settings.password_require_lowercase, 
      settings.password_require_numbers,
      settings.password_require_symbols
    ];
    
    // Length scoring
    if (settings.password_min_length >= 12) score += 30;
    else if (settings.password_min_length >= 8) score += 20;
    else score += 10;
    
    // Requirements scoring
    const activeReqs = requirements.filter(Boolean).length;
    score += activeReqs * 15;
    
    // Additional security features
    if (settings.require_2fa) score += 20;
    if (settings.auto_logout_inactive) score += 10;
    if (settings.max_login_attempts <= 3) score += 5;
    
    return Math.min(score, 100);
  };

  // Calculate overall security score
  const calculateSecurityScore = () => {
    let score = calculatePasswordStrength();
    
    // Session security
    if (settings.session_lifetime <= 60) score += 5;
    if (settings.session_concurrent_limit <= 2) score += 5;
    
    // Monitoring and alerts
    if (settings.login_notification_email) score += 5;
    if (settings.suspicious_activity_alerts) score += 5;
    
    // IP restrictions
    if (settings.ip_whitelist_enabled && settings.ip_whitelist) score += 10;
    
    return Math.min(score, 100);
  };

  const getPasswordStrengthColor = () => {
    const strength = calculatePasswordStrength();
    if (strength >= 80) return '#28a745'; // Green
    if (strength >= 60) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  const getSecurityScoreColor = () => {
    if (securityScore >= 80) return '#28a745';
    if (securityScore >= 60) return '#ffc107'; 
    return '#dc3545';
  };

  // Update security metrics when settings change
  useEffect(() => {
    const pwdStrength = calculatePasswordStrength();
    setPasswordStrength(
      pwdStrength >= 80 ? 'strong' : 
      pwdStrength >= 60 ? 'medium' : 'weak'
    );
    setSecurityScore(calculateSecurityScore());
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'number' || type === 'range') {
      processedValue = parseInt(value) || 0;
    }
    
    onSettingsChange({
      [name]: processedValue
    });
  };

  const handleStepperChange = (name, delta) => {
    const currentValue = settings[name] || 0;
    const newValue = Math.max(1, Math.min(10, currentValue + delta));
    onSettingsChange({
      [name]: newValue
    });
  };

  return (
    <div className="settings-section security-settings">
      <div className="security-header">
        <h3><FaShieldAlt /> Security Settings</h3>
        <div className="security-score">
          <div className="score-circle">
            <div 
              className="score-fill" 
              style={{ 
                background: `conic-gradient(${getSecurityScoreColor()} ${securityScore * 3.6}deg, #e9ecef 0deg)` 
              }}
            >
              <span className="score-text">{securityScore}%</span>
            </div>
          </div>
          <div className="score-label">Security Score</div>
        </div>
      </div>

      {/* Session Management */}
      <div className="security-subsection">
        <h4><FaLock /> Session Management</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label>Session Lifetime</label>
            <div className="range-input">
              <input
                type="range"
                name="session_lifetime"
                value={settings.session_lifetime}
                onChange={handleChange}
                min="15"
                max="480"
                step="15"
              />
              <div className="range-labels">
                <span>15min</span>
                <span className="current-value">{settings.session_lifetime} minutes</span>
                <span>8hrs</span>
              </div>
            </div>
            <small>How long users stay logged in without activity</small>
          </div>

          <div className="form-group">
            <label>Concurrent Sessions</label>
            <select
              name="session_concurrent_limit"
              value={settings.session_concurrent_limit}
              onChange={handleChange}
            >
              <option value="1">1 session (Most secure)</option>
              <option value="2">2 sessions</option>
              <option value="3">3 sessions</option>
              <option value="5">5 sessions</option>
              <option value="0">Unlimited (Least secure)</option>
            </select>
            <small>Maximum simultaneous logins per user</small>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="auto_logout_inactive"
              checked={settings.auto_logout_inactive}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Auto-logout Inactive Users</strong>
              <small>Automatically log out users when session expires</small>
            </div>
          </label>
        </div>
      </div>

      {/* Login Security */}
      <div className="security-subsection">
        <h4><FaExclamationTriangle /> Login Security</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label>Max Login Attempts</label>
            <div className="number-stepper">
              <button 
                type="button" 
                onClick={() => handleStepperChange('max_login_attempts', -1)}
                className="stepper-btn"
              >
                -
              </button>
              <input
                type="number"
                name="max_login_attempts"
                value={settings.max_login_attempts}
                onChange={handleChange}
                min="1"
                max="10"
                readOnly
              />
              <button 
                type="button" 
                onClick={() => handleStepperChange('max_login_attempts', 1)}
                className="stepper-btn"
              >
                +
              </button>
            </div>
            <small>Failed attempts before account lockout</small>
          </div>

          <div className="form-group">
            <label>Lockout Duration</label>
            <div className="input-with-unit">
              <input
                type="number"
                name="lockout_time"
                value={settings.lockout_time}
                onChange={handleChange}
                min="5"
                max="1440"
              />
              <span className="unit">minutes</span>
            </div>
            <small>How long accounts remain locked</small>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="require_2fa"
              checked={settings.require_2fa}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Require Two-Factor Authentication</strong>
              <small>Force all users to enable 2FA for enhanced security</small>
            </div>
          </label>
        </div>
      </div>

      {/* Password Policy */}
      <div className="security-subsection">
        <h4><FaLock /> Password Policy</h4>
        
        <div className="password-strength-indicator">
          <div className="strength-header">
            <span>Password Strength Policy</span>
            <span className={`strength-badge ${passwordStrength}`}>
              {passwordStrength.toUpperCase()}
            </span>
          </div>
          <div className="strength-bar">
            <div 
              className="strength-fill" 
              style={{ 
                backgroundColor: getPasswordStrengthColor(),
                width: `${calculatePasswordStrength()}%`
              }}
            ></div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Minimum Password Length</label>
            <div className="range-input">
              <input
                type="range"
                name="password_min_length"
                value={settings.password_min_length}
                onChange={handleChange}
                min="6"
                max="32"
              />
              <div className="range-labels">
                <span>6</span>
                <span className="current-value">{settings.password_min_length} characters</span>
                <span>32</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Password Reset Timeout</label>
            <div className="input-with-unit">
              <input
                type="number"
                name="password_reset_timeout"
                value={settings.password_reset_timeout}
                onChange={handleChange}
                min="15"
                max="1440"
              />
              <span className="unit">minutes</span>
            </div>
            <small>Password reset link validity</small>
          </div>
        </div>

        <div className="password-requirements">
          <h5>Password Requirements</h5>
          <div className="requirements-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="password_require_uppercase"
                checked={settings.password_require_uppercase}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Uppercase letters (A-Z)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="password_require_lowercase"
                checked={settings.password_require_lowercase}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Lowercase letters (a-z)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="password_require_numbers"
                checked={settings.password_require_numbers}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Numbers (0-9)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="password_require_symbols"
                checked={settings.password_require_symbols}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Special characters (!@#$)
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Force Password Change</label>
          <select
            name="force_password_change_days"
            value={settings.force_password_change_days}
            onChange={handleChange}
          >
            <option value="0">Never</option>
            <option value="30">Every 30 days</option>
            <option value="60">Every 60 days</option>
            <option value="90">Every 90 days</option>
            <option value="180">Every 180 days</option>
            <option value="365">Every year</option>
          </select>
          <small>Require users to change passwords periodically</small>
        </div>
      </div>

      {/* Security Monitoring */}
      <div className="security-subsection">
        <h4><FaEye /> Security Monitoring</h4>
        
        <div className="monitoring-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="login_notification_email"
              checked={settings.login_notification_email}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Login Notification Emails</strong>
              <small>Send email alerts for new login sessions</small>
            </div>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="suspicious_activity_alerts"
              checked={settings.suspicious_activity_alerts}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Suspicious Activity Alerts</strong>
              <small>Monitor and alert on unusual login patterns</small>
            </div>
          </label>
        </div>
      </div>

      {/* IP Restrictions */}
      <div className="security-subsection">
        <h4><FaServer /> IP Access Control</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="ip_whitelist_enabled"
              checked={settings.ip_whitelist_enabled}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable IP Whitelist</strong>
              <small>Restrict access to specific IP addresses</small>
            </div>
          </label>
        </div>

        {settings.ip_whitelist_enabled && (
          <div className="form-group">
            <label>Allowed IP Addresses</label>
            <textarea
              name="ip_whitelist"
              value={settings.ip_whitelist}
              onChange={handleChange}
              placeholder="Enter IP addresses, one per line&#10;192.168.1.1&#10;10.0.0.0/24&#10;203.0.113.0/24"
              rows="4"
            />
            <small>Enter IP addresses or CIDR blocks, one per line</small>
          </div>
        )}
      </div>

      {/* Security Recommendations */}
      <div className="security-recommendations">
        <h4><FaCheck /> Security Recommendations</h4>
        <div className="recommendations-list">
          {securityScore < 60 && (
            <div className="recommendation warning">
              <FaExclamationTriangle />
              <span>Your security score is below 60%. Consider enabling 2FA and strengthening password requirements.</span>
            </div>
          )}
          {!settings.require_2fa && (
            <div className="recommendation info">
              <FaShieldAlt />
              <span>Enable Two-Factor Authentication for all users to significantly improve security.</span>
            </div>
          )}
          {settings.session_lifetime > 240 && (
            <div className="recommendation info">
              <FaLock />
              <span>Consider reducing session lifetime to 4 hours or less for better security.</span>
            </div>
          )}
          {settings.password_min_length < 10 && (
            <div className="recommendation info">
              <FaLock />
              <span>Increase minimum password length to 10+ characters for stronger security.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;

import React from 'react';
import { FaUsers, FaUserCheck, FaUserPlus, FaShieldAlt } from 'react-icons/fa';
import "./UserManagementSettings.css"

const UserManagementSettings = ({ settings, onSettingsChange }) => {
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
    <div className="settings-section user-management-settings">
      <div className="section-header">
        <h3><FaUsers /> User Management Settings</h3>
        <p>Configure user registration, roles, and management policies</p>
      </div>

      {/* Registration Settings */}
      <div className="subsection">
        <h4><FaUserPlus /> Registration & Onboarding</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enable_registration"
              checked={settings.enable_registration || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Enable User Registration</strong>
              <small>Allow new users to register accounts</small>
            </div>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="enable_email_verification"
              checked={settings.enable_email_verification || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Require Email Verification</strong>
              <small>Users must verify their email before accessing the system</small>
            </div>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="default_user_role">Default User Role</label>
          <select
            id="default_user_role"
            name="default_user_role"
            value={settings.default_user_role || 'employee'}
            onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
          <small>Default role assigned to new users upon registration</small>
        </div>
      </div>

      {/* User Permissions */}
      <div className="subsection">
        <h4><FaShieldAlt /> User Permissions</h4>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="allow_profile_editing"
              checked={settings.allow_profile_editing || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Allow Profile Editing</strong>
              <small>Users can edit their own profile information</small>
            </div>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="require_manager_approval"
              checked={settings.require_manager_approval || false}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <div className="checkbox-content">
              <strong>Require Manager Approval</strong>
              <small>New registrations need manager approval before activation</small>
            </div>
          </label>
        </div>
      </div>

      {/* Manager Settings */}
      <div className="subsection">
        <h4><FaUserCheck /> Manager Configuration</h4>
        
        <div className="form-group">
          <label htmlFor="max_users_per_manager">Maximum Users per Manager</label>
          <div className="range-input">
            <input
              type="range"
              id="max_users_per_manager"
              name="max_users_per_manager"
              value={settings.max_users_per_manager || 50}
              onChange={handleChange}
              min="5"
              max="200"
              step="5"
            />
            <div className="range-labels">
              <span>5</span>
              <span className="current-value">{settings.max_users_per_manager || 50} users</span>
              <span>200</span>
            </div>
          </div>
          <small>Maximum number of users a single manager can supervise</small>
        </div>
      </div>

      {/* Role Hierarchy Display */}
      <div className="subsection">
        <h4>Role Hierarchy</h4>
        
        <div className="role-hierarchy">
          <div className="role-level admin">
            <div className="role-icon">👑</div>
            <div className="role-info">
              <h5>Administrator</h5>
              <p>Full system access, manages all users and settings</p>
              <ul>
                <li>Manage all users and managers</li>
                <li>Configure system settings</li>
                <li>Access all reports and analytics</li>
                <li>System maintenance and backups</li>
              </ul>
            </div>
          </div>

          <div className="role-level manager">
            <div className="role-icon">👨‍💼</div>
            <div className="role-info">
              <h5>Manager</h5>
              <p>Manages employees and departmental operations</p>
              <ul>
                <li>Manage assigned employees</li>
                <li>Approve leave requests</li>
                <li>View team reports</li>
                <li>Manage restocks and sales</li>
              </ul>
            </div>
          </div>

          <div className="role-level employee">
            <div className="role-icon">👤</div>
            <div className="role-info">
              <h5>Employee</h5>
              <p>Standard user with basic system access</p>
              <ul>
                <li>Submit leave requests</li>
                <li>Record sales and restocks</li>
                <li>View personal dashboard</li>
                <li>Update profile information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="subsection">
        <h4>Current User Statistics</h4>
        
        <div className="user-stats-grid">
          <div className="stat-card">
            <div className="stat-icon admin">👑</div>
            <div className="stat-info">
              <span className="stat-number">1</span>
              <span className="stat-label">Administrators</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon manager">👨‍💼</div>
            <div className="stat-info">
              <span className="stat-number">5</span>
              <span className="stat-label">Managers</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon employee">👤</div>
            <div className="stat-info">
              <span className="stat-number">42</span>
              <span className="stat-label">Employees</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <span className="stat-number">3</span>
              <span className="stat-label">Pending Approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Flow Preview */}
      <div className="subsection">
        <h4>Registration Flow</h4>
        
        <div className="flow-diagram">
          <div className="flow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h5>User Registration</h5>
              <p>{settings.enable_registration ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h5>Email Verification</h5>
              <p>{settings.enable_email_verification ? 'Required' : 'Optional'}</p>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h5>Manager Approval</h5>
              <p>{settings.require_manager_approval ? 'Required' : 'Automatic'}</p>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h5>Account Activation</h5>
              <p>Role: {settings.default_user_role || 'employee'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="subsection">
        <h4>Quick Actions</h4>
        
        <div className="quick-actions">
          <button type="button" className="btn btn-secondary">
            <FaUsers /> View All Users
          </button>
          
          <button type="button" className="btn btn-secondary">
            <FaUserPlus /> Add New User
          </button>
          
          <button type="button" className="btn btn-secondary">
            <FaUserCheck /> Pending Approvals
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSettings;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AccessLogs from './Tabs/AccessLogs/AccessLogs';
import Users from './Tabs/Users/Users';
import Analytics from './Tabs/Analytics/Analytics';
import Settings from './Tabs/Settings/Settings';
import adminService from '../../../services/adminService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    analytics: null,
    settings: null,
    users: null,
    accessLogs: null,
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem('user'));

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle hash-based navigation from sidebar
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['analytics', 'users', 'access-logs', 'settings'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab from hash
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load data for active tab
  useEffect(() => {
    const loadTabData = async () => {
      if (!user || user.role !== 'admin') return;
      
      // Don't reload if data already exists for this tab
      if (data[getDataKey(activeTab)] !== null) return;

      try {
        setIsLoading(true);
        setError(null);
        
        let tabData = null;
        const dataKey = getDataKey(activeTab);
        
        switch (activeTab) {
          case 'analytics':
            tabData = await adminService.analytics.get(timeRange);
            break;
          case 'users':
            tabData = await adminService.users.get();
            break;
          case 'access-logs':
            tabData = await adminService.accessLogs.get();
            break;
          case 'settings':
            tabData = await adminService.settings.get();
            break;
          default:
            return;
        }
        
        setData(prev => ({ ...prev, [dataKey]: tabData }));
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
        setError(`Failed to load ${activeTab} data`);
        toast.error(`Failed to load ${activeTab} data`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTabData();
  }, [activeTab, timeRange, user?.id]);

  const getDataKey = (tab) => {
    switch (tab) {
      case 'access-logs': return 'accessLogs';
      default: return tab;
    }
  };

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await adminService.users.updateStatus(userId, status);
      // Refresh users data
      const users = await adminService.users.get();
      setData(prev => ({ ...prev, users }));
      toast.success(`User status updated to ${status}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleUpdateSettings = async (updatedSettings) => {
    try {
      await adminService.settings.update(updatedSettings);
      // Refresh settings data
      const settings = await adminService.settings.get();
      setData(prev => ({ ...prev, settings }));
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="admin-loading">
          <FaSpinner className="spinner" />
          <span>Loading {activeTab} data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-error">
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setData(prev => ({ ...prev, [getDataKey(activeTab)]: null }));
            }}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      );
    }

    const dataKey = getDataKey(activeTab);
    const tabData = data[dataKey];

    switch (activeTab) {
      case 'analytics':
        return (
          <div className="tab-content">
            <Analytics
              data={tabData}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>
        );
      case 'users':
        return (
          <div className="tab-content">
            <Users 
              users={tabData || []} 
              onStatusChange={handleUpdateUserStatus} 
            />
          </div>
        );
      case 'access-logs':
        return (
          <div className="tab-content">
            <AccessLogs logs={tabData || []} />
          </div>
        );
      case 'settings':
        return (
          <div className="tab-content">
            <Settings 
              settings={tabData || {}} 
              onSave={handleUpdateSettings} 
            />
          </div>
        );
      default:
        return (
          <div className="tab-content">
            <div className="default-content">
              <h2>Welcome to Admin Dashboard</h2>
              <p>Select a tab from the sidebar to begin managing your system.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;

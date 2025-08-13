import axios from 'axios';
import { getAuthToken } from './authService';



// Create axios instance with auth header
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Users
const getUsers = async () => {
  try {
    const response = await api.get("http://localhost:5000/api/admin/users");
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(
      `http://localhost:5000/api/admin/users/${userId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

// Access Logs
const getAccessLogs = async (params = {}) => {
  try {
    const response = await api.get("http://localhost:5000/api/admin/access-logs", { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching access logs:', error);
    throw error;
  }
};

// Analytics
const getAnalytics = async (timeRange = '7d') => {
  try {
    const response = await api.get("http://localhost:5000/api/admin/metrics", { params: { range: timeRange } });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// Settings
const getSettings = async () => {
  try {
    const response = await api.get("http://localhost:5000/api/admin/settings");
    return response.data || {}; // Return empty object if no settings
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

const updateSettings = async (settings) => {
  try {
    const response = await api.put("http://localhost:5000/api/admin/settings", settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export default {
  users: {
    get: getUsers,
    updateStatus: updateUserStatus,
  },
  accessLogs: {
    get: getAccessLogs,
  },
  analytics: {
    get: getAnalytics,
  },
  settings: {
    get: getSettings,
    update: updateSettings,
  },
};

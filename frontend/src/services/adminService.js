import axios from 'axios';



// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const adminService = {
  // Analytics endpoints
  analytics: {
    async get(timeRange = '7d') {
      try {
        const response = await api.get(`/admin/metrics?range=${timeRange}`);
        return {
          ...response.data,
          // Transform data for charts
          userActivity: {
            labels: response.data.activityData?.map(d => d.date) || [],
            data: response.data.activityData?.map(d => d.count) || []
          },
          roleDistribution: {
            labels: response.data.roleDistribution?.map(r => r.role) || [],
            data: response.data.roleDistribution?.map(r => r.count) || []
          }
        };
      } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error; // Don't use mock data, let component handle error
      }
    },

    async getMetrics() {
      try {
        const response = await api.get('/admin/metrics');
        return {
          ...response.data,
          // Transform data for charts
          userActivity: {
            labels: response.data.activityData?.map(d => d.date) || [],
            data: response.data.activityData?.map(d => d.count) || []
          },
          roleDistribution: {
            labels: response.data.roleDistribution?.map(r => r.role) || [],
            data: response.data.roleDistribution?.map(r => r.count) || []
          }
        };
      } catch (error) {
        console.error('Error fetching metrics:', error);
        throw error; // Don't use mock data, let component handle error
      }
    },
  },

  // User management endpoints
  users: {
    get: async () => {
      try {
        const response = await api.get('/admin/users');
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    getAll: async () => {
      try {
        const response = await api.get('/admin/users');
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    updateStatus: async (userId, status) => {
      try {
        const response = await api.patch(`/admin/users/${userId}/status`, { status });
        return response.data;
      } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
      }
    },
    create: async (userData) => {
      try {
        const response = await api.post('/admin/users', userData);
        return response.data;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },
    update: async (userId, userData) => {
      try {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    delete: async (userId) => {
      try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
  },

  // Manager-specific CRUD operations
  managers: {
    getAll: async () => {
      try {
        const response = await api.get('/admin/users?role=manager');
        return response.data;
      } catch (error) {
        console.error('Error fetching managers:', error);
        throw error;
      }
    },
    create: async (managerData) => {
      try {
        const response = await api.post('/admin/users', { ...managerData, role: 'manager' });
        return response.data;
      } catch (error) {
        console.error('Error creating manager:', error);
        throw error;
      }
    },
    update: async (managerId, managerData) => {
      try {
        const response = await api.put(`/admin/users/${managerId}`, managerData);
        return response.data;
      } catch (error) {
        console.error('Error updating manager:', error);
        throw error;
      }
    },
    delete: async (managerId) => {
      try {
        const response = await api.delete(`/admin/users/${managerId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting manager:', error);
        throw error;
      }
    },
    updateStatus: async (managerId, status) => {
      try {
        const response = await api.patch(`/admin/users/${managerId}/status`, { status });
        return response.data;
      } catch (error) {
        console.error('Error updating manager status:', error);
        throw error;
      }
    },
  },

  // Access logs endpoints
  accessLogs: {
    get: async (filters = {}) => {
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/admin/access-logs?${query}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching access logs:', error);
        throw error;
      }
    },
    getAll: async (filters = {}) => {
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/admin/access-logs?${query}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching access logs:', error);
        throw error;
      }
    },
  },

  // System settings endpoints
  settings: {
    get: async () => {
      try {
        const response = await api.get('/admin/settings');
        return response.data;
      } catch (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }
    },
    getAll: async () => {
      try {
        const response = await api.get('/admin/settings');
        return response.data;
      } catch (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }
    },
    update: async (settings) => {
      try {
        const response = await api.put('/admin/settings', settings);
        return response.data;
      } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
    },
  },
};

export default adminService;

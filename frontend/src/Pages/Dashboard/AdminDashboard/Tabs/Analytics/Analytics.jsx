import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { FaUsers, FaChartLine, FaServer, FaClock, FaUserShield } from 'react-icons/fa';
import adminService from '../../../../../services/adminService';
import './Analytics.css';

// Register ChartJS components with all required elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Set global chart defaults
ChartJS.defaults.plugins.legend.display = false;
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

const timeRangeOptions = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [analytics, metrics] = await Promise.all([
          adminService.analytics.get(timeRange),
          adminService.analytics.getMetrics(),
        ]);
        
        setMetrics({
          ...analytics,
          ...metrics,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // User activity data
  const userActivityData = {
    labels: metrics?.userActivity?.labels || [],
    datasets: [
      {
        label: 'Active Users',
        data: metrics?.userActivity?.data || [],
        backgroundColor: 'rgba(74, 111, 165, 0.5)',
        borderColor: 'rgba(74, 111, 165, 1)',
        borderWidth: 1,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Role distribution data
  const roleDistributionData = {
    labels: metrics?.roleDistribution?.labels || [],
    datasets: [
      {
        data: metrics?.roleDistribution?.data || [],
        backgroundColor: [
          'rgba(74, 111, 165, 0.7)',
          'rgba(56, 178, 172, 0.7)',
          'rgba(159, 122, 234, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(74, 111, 165, 1)',
          'rgba(56, 178, 172, 1)',
          'rgba(159, 122, 234, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // System metrics data
  const systemMetricsData = {
    labels: metrics?.systemMetrics?.labels || [],
    datasets: [
      {
        label: 'API Response Time (ms)',
        data: metrics?.systemMetrics?.responseTimes || [],
        borderColor: 'rgba(74, 111, 165, 1)',
        backgroundColor: 'rgba(74, 111, 165, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Feature usage data
  const featureUsageData = {
    labels: metrics?.featureUsage?.labels || [],
    datasets: [
      {
        label: 'Feature Usage',
        data: metrics?.featureUsage?.data || [],
        backgroundColor: [
          'rgba(74, 111, 165, 0.7)',
          'rgba(56, 178, 172, 0.7)',
          'rgba(159, 122, 234, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(74, 111, 165, 1)',
          'rgba(56, 178, 172, 1)',
          'rgba(159, 122, 234, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Loading state
  if (loading && !metrics) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Analytics</h3>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div>
          <h2>Analytics Dashboard</h2>
          <p className="last-updated">Last updated: {new Date().toLocaleString()}</p>
        </div>
        <div className="time-range-selector">
          <label htmlFor="time-range">Time Range:</label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            disabled={loading}
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div className="metric-info">
            <h3>Total Users</h3>
            <p className="metric-value">{metrics?.totalUsers || 0}</p>
            <p className="metric-delta">
              <span className="delta-positive">+{metrics?.newUsers || 0} this month</span>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FaChartLine />
          </div>
          <div className="metric-info">
            <h3>Active Sessions</h3>
            <p className="metric-value">{metrics?.activeSessions || 0}</p>
            <p className="metric-delta">
              <span className={metrics?.sessionChange >= 0 ? 'delta-positive' : 'delta-negative'}>
                {metrics?.sessionChange >= 0 ? '↑' : '↓'} {Math.abs(metrics?.sessionChange || 0)}% from last period
              </span>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FaServer />
          </div>
          <div className="metric-info">
            <h3>API Uptime</h3>
            <p className="metric-value">{metrics?.uptime || 0}%</p>
            <p className="metric-delta">
              <span className="delta-positive">Last 30 days</span>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FaUserShield />
          </div>
          <div className="metric-info">
            <h3>Admin Actions</h3>
            <p className="metric-value">{metrics?.adminActions || 0}</p>
            <p className="metric-delta">
              <span className="delta-positive">Today</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="analytics-grid">
        <div className="chart-container full-width">
          <div className="chart-header">
            <h3>User Activity</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-color blue"></span> Active Users</span>
            </div>
          </div>
          <div className="chart">
            <div className="chart-wrapper">
            <Chart 
              type="line" 
              data={userActivityData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
                elements: {
                  point: {
                    radius: 3,
                    hoverRadius: 5,
                    hitRadius: 10,
                    hoverBorderWidth: 2
                  }
                }
              }}
              key={`chart-${Date.now()}`}
            />
          </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Role Distribution</h3>
          </div>
          <div className="chart">
            <div className="chart-wrapper">
              <Chart 
                type="doughnut"
                data={roleDistributionData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { 
                      position: 'right',
                      display: true
                    }
                  },
                  cutout: '70%'
                }}
                key={`doughnut-${Date.now()}`}
              />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Feature Usage</h3>
          </div>
          <div className="chart">
            <div className="chart-wrapper">
              <Chart 
                type="pie"
                data={featureUsageData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { 
                      position: 'right',
                      display: true
                    }
                  },
                  radius: '70%'
                }}
                key={`pie-${Date.now()}`}
              />
            </div>
          </div>
        </div>
        
        <div className="chart-card full-width">
          <h3>System Performance</h3>
          <div className="chart">
            <div className="chart-wrapper">
              <Chart 
                type="line"
                data={systemMetricsData}
                options={{
                  ...chartOptions,
                  responsive: true,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'top',
                      display: true
                    }
                  },
                  elements: {
                    point: {
                      radius: 3,
                      hoverRadius: 5,
                      hitRadius: 10,
                      hoverBorderWidth: 2
                    },
                    line: {
                      tension: 0.3,
                      borderWidth: 2,
                      fill: true
                    }
                  }
                }}
                key={`system-${Date.now()}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

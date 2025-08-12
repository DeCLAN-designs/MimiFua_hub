import React, { useState, useEffect } from 'react';
import { 
  FiClock, 
  FiActivity, 
  FiCalendar, 
  FiWifi, 
  FiRefreshCw,
  FiUser,
  FiMapPin
} from 'react-icons/fi';
import './PersonalActivity.css';

const PersonalActivity = () => {
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonalActivity();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPersonalActivity, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPersonalActivity = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/access-logs/my-activity', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivityData(data.data);
        setError(null);
      } else {
        setError('Failed to fetch activity data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Personal activity fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date and time in Kenya Time (EAT, UTC+3)
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format time only in Kenya Time (EAT, UTC+3)
  const formatTimeOnly = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="personal-activity-container">
        <div className="loading-state">
          <FiRefreshCw className="loading-spinner" />
          <p>Loading your activity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="personal-activity-container">
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchPersonalActivity} className="retry-btn">
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  const { currentSession, recentSessions, todayStats } = activityData || {};

  return (
    <div className="personal-activity-container">
      {/* Header */}
      <div className="activity-header">
        <h2><FiUser /> My Activity</h2>
        <p>Your personal login activity and session information</p>
      </div>

      {/* Current Session Card */}
      {currentSession && (
        <div className="current-session-card">
          <div className="session-header">
            <div className="session-icon">
              <FiWifi />
            </div>
            <div className="session-info">
              <h3>Current Session</h3>
              <p className="session-status active">Active Now</p>
            </div>
          </div>
          <div className="session-details">
            <div className="detail-item">
              <FiClock />
              <span>Started: {formatTime(currentSession.login_time)}</span>
            </div>
            <div className="detail-item">
              <FiActivity />
              <span>Duration: {formatDuration(currentSession.session_minutes)}</span>
            </div>
            <div className="detail-item">
              <FiMapPin />
              <span>IP: {currentSession.ip_address}</span>
            </div>
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div className="today-summary">
        <h3><FiCalendar /> Today's Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-value">{todayStats?.loginCount || 0}</div>
            <div className="summary-label">Logins</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">
              {todayStats?.firstLogin ? formatTimeOnly(todayStats.firstLogin) : 'N/A'}
            </div>
            <div className="summary-label">First Login</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{formatDuration(todayStats?.totalTimeToday || 0)}</div>
            <div className="summary-label">Total Time</div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="recent-sessions">
        <h3><FiActivity /> Recent Sessions</h3>
        <div className="sessions-list">
          {recentSessions && recentSessions.length > 0 ? (
            recentSessions.map((session, index) => (
              <div key={index} className="session-item">
                <div className="session-time">
                  <div className="login-time">{formatTime(session.login_time)}</div>
                  {session.logout_time && (
                    <div className="logout-time">to {formatTime(session.logout_time)}</div>
                  )}
                </div>
                <div className="session-meta">
                  <span className={`session-badge ${session.session_status.toLowerCase()}`}>
                    {session.session_status}
                  </span>
                  <span className="session-duration">
                    {session.session_duration ? formatDuration(session.session_duration) : 'Ongoing'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-sessions">
              <p>No recent sessions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalActivity;

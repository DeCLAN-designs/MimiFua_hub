import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { performLogout } from '../../utils/authUtils';
import { checkAccessWindow, syncServerTime } from '../../utils/serverTime';
import './TimeAccessGuard.css';

const TimeAccessGuard = ({ children }) => {
  const [timeUntilNextWindow, setTimeUntilNextWindow] = useState(0);
  const [isAccessAllowed, setIsAccessAllowed] = useState(true);
  const navigate = useNavigate();
  const logoutTimer = useRef(null);

  // Format time as HH:MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  const forceLogout = useCallback((reason = 'time_restriction') => {
    // Use the auth utility to handle server-side logout
    performLogout(navigate, reason);
  }, [navigate]);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Sync time with server
        await syncServerTime();
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          navigate('/login');
          return;
        }

        // Admins bypass time restrictions
        if (user.role === 'admin') {
          setIsAccessAllowed(true);
          return;
        }

        // Check access window
        const { isAccessAllowed: allowed, timeUntilNextWindow, timeUntilEnd } = checkAccessWindow();
        
        setIsAccessAllowed(allowed);
        setTimeUntilNextWindow(timeUntilNextWindow);

        // Set up auto-logout at 9:30 PM
        if (allowed && timeUntilEnd > 0) {
          clearTimeout(logoutTimer.current);
          logoutTimer.current = setTimeout(() => {
            forceLogout('time_restriction');
          }, timeUntilEnd);
        } else if (!allowed) {
          // If outside allowed hours, force logout immediately
          forceLogout('outside_access_hours');
        }
      } catch (error) {
        console.error('Error checking access:', error);
        // Default to allowing access if there's an error
        setIsAccessAllowed(true);
      }
    };

    // Check immediately and then every minute
    checkAccess();
    const interval = setInterval(checkAccess, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(logoutTimer.current);
    };
  }, [navigate]);

  if (!isAccessAllowed) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Admin can always access
    if (user?.role === 'admin') {
      return children;
    }
    
    // Show access denied message for non-admin users
    return (
      <div className="access-denied-container">
        <div className="access-denied-content">
          <h2>Access Restricted</h2>
          <p>The system is only accessible between 5:30 AM and 9:30 PM.</p>
          {timeUntilNextWindow > 0 && (
            <p className="time-left">
              Next available access in: {formatTime(timeUntilNextWindow)}
            </p>
          )}
          <button 
            onClick={() => forceLogout('manual')}
            className="back-to-login-btn"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default TimeAccessGuard;

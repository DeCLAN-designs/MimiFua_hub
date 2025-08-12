// authUtils.js - Authentication utility functions

/**
 * Record user logout in access logs
 */
export const recordLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch('http://localhost:5000/api/access-logs/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error recording logout:', error);
    // Don't throw error - logout should still proceed
  }
};

/**
 * Complete logout process with cleanup
 */
export const performLogout = async (navigate) => {
  try {
    // Record logout in access logs
    await recordLogout();
    
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('user_id');
    
    // Navigate to login
    if (navigate) {
      navigate('/login');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Still clear localStorage and navigate even if recording fails
    localStorage.clear();
    if (navigate) {
      navigate('/login');
    }
  }
};

/**
 * Set up beforeunload listener to record logout on page close/refresh
 */
export const setupLogoutOnPageClose = () => {
  const handleBeforeUnload = () => {
    // Use sendBeacon for reliable logout recording on page close
    const token = localStorage.getItem('token');
    if (token) {
      const data = JSON.stringify({});
      navigator.sendBeacon(
        'http://localhost:5000/api/access-logs/logout',
        new Blob([data], { type: 'application/json' })
      );
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

/**
 * Get current user info from localStorage
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!(token && user);
};

// authUtils.js - Client-side authentication utility functions

/**
 * Performs a complete logout with server-side cleanup
 * @param {function} [navigate] - Optional navigation function (e.g., from useNavigate)
 * @param {string} [reason] - Reason for logout (e.g., 'manual', 'time_restriction')
 * @returns {Promise<boolean>} True if logout was successful, false otherwise
 */
export const performLogout = async (navigate, reason = 'manual') => {
  try {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();
    
    // Only try to call the server if we have a token
    if (token) {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason })
        });
      } catch (error) {
        console.error('Error during server logout (proceeding with client cleanup):', error);
        // Continue with client-side cleanup even if server logout fails
      }
    }
    
    // Clear all client-side authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('user_id');
    
    // Navigate to login if navigation function is provided
    if (navigate) {
      navigate('/login');
      // Force a full page reload to clear any application state
      window.location.reload();
    }
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    // Still clear localStorage and navigate even if there was an error
    localStorage.clear();
    if (navigate) {
      navigate('/login');
      window.location.reload();
    }
    return false;
  }
};

/**
 * Get current user info from localStorage
 * @returns {Object|null} The current user object or null if not authenticated
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
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Set up beforeunload listener to record logout on page close/refresh
 * @returns {Function} Cleanup function to remove the event listener
 */
export const setupLogoutOnPageClose = () => {
  const handleBeforeUnload = () => {
    // Use sendBeacon for reliable logout recording on page close
    const token = localStorage.getItem('token');
    if (token) {
      const data = JSON.stringify({ reason: 'page_close' });
      navigator.sendBeacon(
        'http://localhost:5000/api/access-logs/logout',
        new Blob([data], { type: 'application/json' })
      );
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('beforeUnload', handleBeforeUnload);
  };
};

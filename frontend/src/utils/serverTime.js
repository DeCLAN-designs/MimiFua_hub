// Utility for server time synchronization
let serverTimeOffset = 0;
let lastSyncTime = 0;
const SYNC_INTERVAL = 5 * 60 * 1000; // Sync every 5 minutes

/**
 * Fetches the current server time and calculates the offset from the local clock
 * @returns {Promise<number>} The current server timestamp in milliseconds
 */
export const syncServerTime = async () => {
  try {
    const startTime = Date.now();
    const response = await fetch('/api/server-time', {
      method: 'HEAD',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (response.ok) {
      const serverTime = new Date(response.headers.get('Date')).getTime();
      const endTime = Date.now();
      const roundTripTime = endTime - startTime;
      
      // Calculate the offset with network latency compensation
      serverTimeOffset = serverTime - startTime - (roundTripTime / 2);
      lastSyncTime = startTime;
    }
    
    return getCurrentServerTime();
  } catch (error) {
    console.error('Failed to sync server time, using local time as fallback', error);
    return Date.now();
  }
};

/**
 * Gets the current server time based on the last sync
 * @returns {number} Current server timestamp in milliseconds
 */
export const getCurrentServerTime = () => {
  return Date.now() + serverTimeOffset;
};

/**
 * Checks if the current server time is within allowed access hours
 * @param {number} [customTime] - Optional custom time to check (for testing)
 * @returns {{isAccessAllowed: boolean, timeUntilNextWindow: number, nextWindowTime: Date}}
 */
export const checkAccessWindow = (customTime) => {
  const now = customTime || getCurrentServerTime();
  const date = new Date(now);
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  const currentSeconds = date.getSeconds();
  
  // Define access window (5:30 AM to 9:30 PM)
  const startTime = new Date(date);
  startTime.setHours(5, 30, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(21, 30, 0, 0);
  
  // Check if current time is within allowed window
  if (now >= startTime && now <= endTime) {
    // Calculate time until end of window (in ms)
    const timeUntilEnd = endTime - now;
    return {
      isAccessAllowed: true,
      timeUntilNextWindow: 0,
      nextWindowTime: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      timeUntilEnd
    };
  }
  
  // Calculate time until next access window (5:30 AM next day)
  let nextWindow = new Date(date);
  if (now > endTime) {
    nextWindow.setDate(nextWindow.getDate() + 1);
  }
  nextWindow.setHours(5, 30, 0, 0);
  
  return {
    isAccessAllowed: false,
    timeUntilNextWindow: nextWindow - now,
    nextWindowTime: nextWindow,
    timeUntilEnd: 0
  };
};

// Initial sync
syncServerTime();

// Periodic sync
setInterval(syncServerTime, SYNC_INTERVAL);

const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/server-time
 * @desc    Returns the current server time
 * @access  Public
 */
router.get('/server-time', (req, res) => {
  // Set cache control headers to prevent caching
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  // Return the current server time in the Date header
  res.status(200).end();
});

module.exports = router;

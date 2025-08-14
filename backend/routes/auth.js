const express = require('express');
const router = express.Router();
const { performServerSideLogout } = require('../utils/authUtils');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/logout
 * @desc    Log out the current user
 * @access  Private
 * @body    {string} [reason] - Reason for logout (e.g., 'manual', 'time_restriction')
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    
    // Perform server-side logout (logs the event and invalidates the token)
    await performServerSideLogout(req.user, token, req.body.reason || 'manual');
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

module.exports = router;

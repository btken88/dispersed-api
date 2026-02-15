const router = require('express').Router();

/**
 * DEPRECATED: Favorites are now called "campsites"
 * Use /api/campsites endpoints instead
 */
router.all('*', (req, res) => {
  res.status(410).json({ 
    error: 'This endpoint is deprecated',
    message: 'Please use /api/campsites endpoints instead'
  });
});

module.exports = router;

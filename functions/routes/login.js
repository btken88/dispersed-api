const router = require('express').Router();

/**
 * DEPRECATED: Login is now handled client-side via Firebase Authentication
 * This endpoint is maintained for backward compatibility only
 */
router.post('/', (req, res) => {
  res.status(410).json({ 
    error: 'This endpoint is deprecated',
    message: 'Please use Firebase Authentication on the client side',
    documentation: 'https://firebase.google.com/docs/auth/web/start'
  });
});

module.exports = router;

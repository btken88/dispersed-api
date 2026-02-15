const router = require('express').Router();
const { optionalAuth } = require('../middleware/auth');

/**
 * GET /api/elevation/:lat/:lng
 * Fetch elevation data for coordinates
 * Uses MapQuest Elevation API
 */
router.get('/:lat/:lng', optionalAuth, async (req, res) => {
  const { lat, lng } = req.params;
  
  // Validate coordinates
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: 'Invalid latitude' });
  }
  
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Invalid longitude' });
  }

  try {
    const MAPQUEST_API_KEY = process.env.MAPQUEST_API_KEY;
    
    if (!MAPQUEST_API_KEY) {
      console.error('MAPQUEST_API_KEY not found in environment');
      return res.status(503).json({ error: 'Elevation service not configured' });
    }

    // Using MapQuest Elevation API
    // The Elevation API uses the open subdomain
    const url = `http://open.mapquestapi.com/elevation/v1/profile?key=${MAPQUEST_API_KEY}&shapeFormat=raw&latLngCollection=${latitude},${longitude}`;
    
    console.log('Fetching elevation from:', url.replace(MAPQUEST_API_KEY, 'REDACTED'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Elevation API error:', response.status, errorData);
      return res.status(502).json({ 
        error: 'Elevation API request failed',
        details: errorData.message || response.statusText
      });
    }
    
    const data = await response.json();
    
    if (!data.elevationProfile || data.elevationProfile.length === 0) {
      throw new Error('No elevation data found');
    }
    
    // MapQuest returns elevation in meters by default, convert to feet
    const elevationMeters = data.elevationProfile[0].height;
    const elevationFeet = Math.floor(elevationMeters * 3.28084);
    
    const elevationData = {
      elevation: elevationFeet, // feet
      elevationFeet: elevationFeet, // feet
      elevationMeters: elevationMeters, // meters
      latitude: latitude,
      longitude: longitude,
      timestamp: Date.now()
    };
    
    console.log('Elevation data retrieved successfully:', elevationData.elevation);
    
    res.json(elevationData);
  } catch (error) {
    console.error('Elevation API error:', error);
    res.status(500).json({ error: 'Failed to fetch elevation data' });
  }
});

module.exports = router;

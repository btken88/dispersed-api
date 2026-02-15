# Dispersed API

## Table of Contents

- [Dispersed API](#dispersed-api)
  - [Table of Contents](#table-of-contents)
  - [General Info](#general-info)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Development](#development)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [API Endpoints](#api-endpoints)
  - [Database Schema](#database-schema)
  - [Security](#security)
  - [Example Code](#example-code)
  - [Features](#features)
  - [Status](#status)
  - [Contact](#contact)
  - [License](#license)

## General Info

This is a Firebase Functions-based API for the Dispersed App, a web application designed to let users find and save dispersed camping sites across the United States. The API uses Firebase Authentication for secure user management, Firestore for data storage, and includes external integrations for weather and elevation data.

## Technologies

- JavaScript
- Node.js 18
- Express.js 4.18.2
- Firebase Functions (Gen 2)
- Firebase Authentication
- Firestore
- Helmet.js (security)
- express-rate-limit (rate limiting)
- express-validator (input validation)
- OpenWeatherMap API
- Open-Elevation API

## Setup

### Prerequisites

- Node.js 18+ 
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Firestore and Authentication enabled

### Installation

```bash
cd dispersed-api/functions
npm install
```

### Environment Variables

Create a `.env` file in the `functions` directory:

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### Firebase Configuration

1. Login to Firebase:
```bash
firebase login
```

2. Set your project:
```bash
firebase use your-project-id
```

3. Deploy Firestore rules and indexes:
```bash
firebase deploy --only firestore
```

## Development

### Run Locally with Emulators

Start the Firebase emulators:

```bash
firebase emulators:start
```

The API will be available at `http://localhost:5001/your-project-id/us-central1/api`

Emulator UI: `http://localhost:4000`

## Testing

Run tests:
```bash
cd functions
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm test -- --coverage
```

## Deployment

Deploy functions only:
```bash
firebase deploy --only functions
```

Deploy everything (functions, Firestore rules, indexes):
```bash
firebase deploy
```

## API Endpoints

### Authentication
All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Campsites

- `GET /api/campsites` - Get all campsites (public + user's private if authenticated)
- `GET /api/campsites/:id` - Get campsite by ID
- `POST /api/campsites` - Create new campsite (requires auth)
- `PUT /api/campsites/:id` - Update campsite (requires auth + ownership)
- `DELETE /api/campsites/:id` - Delete campsite (requires auth + ownership)

### Weather & Elevation

- `GET /api/weather/:lat/:lng` - Get weather data for coordinates
- `GET /api/elevation/:lat/:lng` - Get elevation data for coordinates

### Bug Reports

- `POST /api/bug` - Submit bug report

## Database Schema

### Campsites Collection

```javascript
{
  name: string,
  description: string,
  latitude: number,
  longitude: number,
  visibility: 'public' | 'private',
  createdBy: string (user UID),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Security

- **Rate limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers (HSTS, XSS protection, etc.)
- **Firebase Auth**: Token-based authentication with automatic expiration
- **Firestore Rules**: Database-level access control and ownership validation
- **Input validation**: express-validator for all user inputs
- **Ownership checks**: API-level verification for update/delete operations

## Example Code

### Firebase Auth Middleware

```javascript
const admin = require('firebase-admin');

// Verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};
```

### Campsite CRUD with Ownership Verification

```javascript
// Create campsite
router.post('/', verifyFirebaseToken, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('visibility').isIn(['public', 'private']).withMessage('Invalid visibility')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const campsiteData = {
      ...req.body,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('campsites').add(campsiteData);
    res.status(201).json({ id: docRef.id, ...campsiteData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campsite' });
  }
});

// Delete with ownership check
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const campsiteDoc = await db.collection('campsites').doc(req.params.id).get();
    
    if (!campsiteDoc.exists) {
      return res.status(404).json({ error: 'Campsite not found' });
    }

    if (campsiteDoc.data().createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized to delete this campsite' });
    }

    await campsiteDoc.ref.delete();
    res.status(200).json({ message: 'Campsite deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campsite' });
  }
});
```

## Features

Current Features:

- **Firebase Authentication**: Secure user authentication with automatic token expiration
- **Campsite Management**: Full CRUD operations with public/private visibility
- **Ownership Controls**: Users can only modify/delete their own campsites
- **Weather Integration**: Real-time weather data from OpenWeatherMap API
- **Elevation Data**: Elevation information from Open-Elevation API
- **Rate Limiting**: Protection against abuse with 100 requests per 15 minutes
- **Security Headers**: Helmet.js for XSS, HSTS, and other protections
- **Input Validation**: Comprehensive validation on all user inputs
- **Firestore Security Rules**: Database-level access control
- **Bug Reporting**: Endpoint for users to submit bug reports

Future Features:

- Password reset functionality
- User profile management
- Campsite reviews and ratings
- Photo uploads for campsites
- Search and filter capabilities
- Favorite/bookmark system
- Social features (following users, sharing campsites)
- Admin dashboard and moderation tools

## Status

The application is fully functional and ready to be enjoyed as is. Future updates and improvements are still a possibility.

## Contact

Created by [Bryce Kennedy](https://www.linkedin.com/in/bryce-kennedy/)

If you have any questions or suggestions feel free to reach out to me.

## License

[Click to view](https://github.com/btken88/dispersed-api/blob/master/license.txt)

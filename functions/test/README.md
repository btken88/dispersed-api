# Test Documentation

## Test Organization

Tests are organized by module for better maintainability and code organization:

```
test/
├── helpers/
│   └── mocks.js                 # Shared mock configurations and utilities
├── middleware/
│   └── auth.test.js            # Authentication middleware tests
├── routes/
│   ├── bug.test.js             # Bug report endpoint tests
│   ├── campsites.test.js       # Campsite CRUD operations tests
│   ├── elevation.test.js       # Elevation API tests
│   ├── photos.test.js          # Photo upload/delete tests
│   ├── reviews.test.js         # Review system tests
│   ├── search.test.js          # Search and filtering tests
│   └── weather.test.js         # Weather API tests
├── setup.js                    # Global test setup (Jest configuration)
└── api.test.js.backup          # Legacy monolithic test file (archived)
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npm test -- test/routes/campsites.test.js
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm test
# Coverage report generated in coverage/ directory
```

## Shared Mocks (`helpers/mocks.js`)

The `helpers/mocks.js` file provides centralized mock configurations that can be reused across all test files:

### Available Mocks
- `mockAuth` - Firebase Admin Auth mock
- `mockFirestore` - Firestore database mock
- `mockStorage` - Cloud Storage mock
- `mockCollection()` - Helper to create collection mocks

### Helper Functions
- `mockAuthenticatedUser(uid, email)` - Setup authenticated user session
- `mockUnauthenticatedUser()` - Setup unauthenticated/invalid token scenario
- `resetAllMocks()` - Reset all mocks between tests
- `mockCampsiteDoc(data)` - Create a mock campsite document
- `mockSuccessfulWeatherAPI(data)` - Setup successful weather API response
- `mockSuccessfulElevationAPI(meters)` - Setup successful elevation API response

### Example Usage

```javascript
const {
  resetAllMocks,
  mockAuthenticatedUser,
  mockCampsiteDoc
} = require('../helpers/mocks');

describe('My Test Suite', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it('should work with authenticated user', async () => {
    mockAuthenticatedUser('user123', 'test@example.com');
    // Your test code here
  });
});
```

## Coverage Thresholds

The project maintains the following minimum coverage thresholds (configured in `jest.config.js`):

- **Statements:** 50%
- **Branches:** 50%
- **Lines:** 50%
- **Functions:** 50%

Current coverage typically exceeds 60% across all metrics.

## Writing New Tests

When adding new tests:

1. **Choose the right location:**
   - Middleware tests → `test/middleware/`
   - Route tests → `test/routes/`
   - Create new directories as needed

2. **Use shared mocks:**
   - Import from `../helpers/mocks.js`
   - Call `resetAllMocks()` in `beforeEach()`
   - Use helper functions to reduce boilerplate

3. **Follow existing patterns:**
   - Look at similar test files for examples
   - Group related tests with `describe()` blocks
   - Use descriptive test names with `it()`

4. **Test both success and failure paths:**
   - Validate happy paths
   - Test error handling
   - Test edge cases
   - Test authentication/authorization

## Benefits of This Structure

### ✅ Better Organization
- Tests are grouped logically by module
- Easy to find tests for specific functionality
- Clear separation of concerns

### ✅ More Maintainable
- Smaller, focused test files
- Shared mocks reduce duplication
- Changes to one module don't affect unrelated tests

### ✅ Better Developer Experience
- Run tests for specific modules only
- Faster feedback during development
- Easier to understand test failures

### ✅ More Reusable Mocks
- Centralized mock configuration
- Helper functions reduce boilerplate
- Consistent mocking patterns across tests

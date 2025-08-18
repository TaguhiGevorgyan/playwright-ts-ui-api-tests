# API Tests Documentation

This directory contains focused API testing for the Sushi Mushi application using Playwright.

## 📁 Files

- **`tests/api-tests.spec.ts`** - Main API test suite (2 tests)
- **`config/api-config.ts`** - API configuration and helper functions
- **`config.env`** - Environment variables for API testing (project root)

## 🚀 Getting Started

### 1. Environment Setup

Copy the example environment file and configure your API settings:

```bash
cp config.env.example config.env
```

Edit `config.env` with your API configuration:

```env
# API Configuration
API_BASE_URL=https://api.sushimushi.am
API_AUTH_TOKEN=your_api_auth_token_here
API_VALID_TOKEN=your_valid_token_here
API_ADMIN_TOKEN=your_admin_token_here

# API Timeouts (in milliseconds)
API_REQUEST_TIMEOUT=10000
API_RESPONSE_TIMEOUT=5000
API_CONNECTION_TIMEOUT=30000
API_MAX_RESPONSE_TIME=3000
API_MAX_REQUEST_TIME=10000
API_ACCEPTABLE_LATENCY=1000
```

### 2. Run API Tests

```bash
# Run all API tests
npx playwright test tests/api-tests.spec.ts

# Run specific test
npx playwright test tests/api-tests.spec.ts -g "GET Products API"

# Run tests in headed mode
npx playwright test tests/api-tests.spec.ts --headed

# Run tests with debug
npx playwright test tests/api-tests.spec.ts --debug
```

## 🧪 Test Suite Overview

### Core API Tests (2 API Calls)

#### 1. **GET Products API** - Retrieve product list
- **Endpoint**: `/api/products`
- **Method**: GET
- **Purpose**: Test product listing functionality
- **Validations**:
  - Response status (200)
  - JSON content type
  - Product structure validation
  - Performance benchmarks

#### 2. **POST Search API** - Search products with query
- **Endpoint**: `/api/search`
- **Method**: POST
- **Purpose**: Test product search functionality
- **Validations**:
  - Response status (200/201)
  - Search query matching
  - Results structure validation
  - Search relevance
  - Performance benchmarks

## ⚙️ Configuration

### API Configuration (`config/api-config.ts`)

```typescript
export const apiConfig: ApiConfig = {
  baseUrl: process.env.API_BASE_URL || 'https://api.sushimushi.am',
  endpoints: {
    products: '/api/products',
    orders: '/api/orders',
    search: '/api/search',
    basket: '/api/basket',
    // ... more endpoints
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Playwright-Test-Suite/1.0',
    'Authorization': process.env.API_AUTH_TOKEN ? `Bearer ${process.env.API_AUTH_TOKEN}` : undefined
  },
  timeouts: {
    request: 10000,
    response: 5000,
    connection: 30000
  },
  // ... more configuration
};
```

### Helper Functions

The following helpers are available and used in tests:

```ts
// Random data generators
generateRandomString(length?: number): string
generateRandomEmail(): string
generateRandomPhone(): string

// Validators
validateProductStructure(product: any): boolean
validateSearchResponse(response: any): boolean

// Performance helpers
isResponseTimeAcceptable(responseTime: number): boolean
formatResponseTime(responseTime: number): string
```

## 🔧 Customization

### Adding New API Endpoints

1. **Update `api-config.ts`**:
```typescript
endpoints: {
  // ... existing endpoints
  newEndpoint: '/api/new-endpoint'
}
```

2. **Add test data**:
```typescript
testData: {
  // ... existing test data
  newTestData: {
    field1: 'value1',
    field2: 'value2'
  }
}
```

3. **Create new test**:
```typescript
test('New API Endpoint Test', async ({ request }) => {
  const response = await request.get(`${apiConfig.baseUrl}${apiConfig.endpoints.newEndpoint}`, {
    headers: apiConfig.headers,
    timeout: apiConfig.timeouts.request
  });
  
  // Add your assertions here
  expect(response.status()).toBe(200);
});
```

### Modifying Test Data

Update the test data in `api-config.ts`:

```typescript
testData: {
  searchQueries: {
    pizza: 'your-pizza-query',
    sushi: 'your-sushi-query',
    // ... add more queries
  }
}
```

## 📊 Test Results

### Sample Output

```
✅ Products API test passed. Status: 200, Response time: 245ms
✅ Search API test passed. Status: 200, Query: "պիցցա", Results: 5, Response time: 189ms
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check `API_BASE_URL` in config.env
   - Verify network connectivity
   - Adjust `API_CONNECTION_TIMEOUT` if needed

2. **Authentication Errors**
   - Verify `API_AUTH_TOKEN` is set correctly
   - Check token expiration
   - Ensure proper Bearer token format

3. **Response Time Failures**
   - Adjust `API_MAX_RESPONSE_TIME` in config.env
   - Check API server performance
   - Verify network latency

4. **Test Discovery Issues**
   - Run `npx playwright test --list` to ensure Playwright discovers tests
   - Check for syntax errors in `tests/api-tests.spec.ts`
   - Verify import paths

### Debug Mode

Run tests with debug information:

```bash
npx playwright test tests/api-tests.spec.ts --debug
```

This will:
- Open Playwright Inspector
- Allow step-by-step execution
- Show detailed request/response information
- Help identify API issues

## 📈 Performance Benchmarks

### Response Time Thresholds

- **Excellent**: < 500ms
- **Good**: < 1000ms
- **Acceptable**: < 3000ms
- **Poor**: > 3000ms

### Performance Metrics

- **Request Timeout**: 10 seconds
- **Response Timeout**: 5 seconds
- **Connection Timeout**: 30 seconds
- **Max Response Time**: 3 seconds
- **Acceptable Latency**: 1 second

## 🔒 Security Testing

### Authentication Tests

- Tests protected endpoints without authentication
- Verifies proper 401/403 responses
- Checks authentication error messages
- Validates security headers

### Data Validation Tests

- Tests with invalid/malicious input
- Verifies proper validation responses
- Checks error handling for malformed data
- Ensures API security

## 📝 Best Practices

1. **Environment Variables**: Never hardcode API keys or URLs
2. **Error Handling**: Always test error scenarios
3. **Performance**: Monitor response times consistently
4. **Data Validation**: Test with various input types
5. **Security**: Verify authentication and authorization
6. **Logging**: Use descriptive console.log messages
7. **Configuration**: Centralize API settings
8. **Helpers**: Use utility functions for common operations

## 🤝 Contributing

When adding new API tests:

1. Follow the existing naming convention
2. Add proper error handling
3. Include performance assertions
4. Use the centralized configuration
5. Add comprehensive documentation
6. Test with various data scenarios
7. Verify TypeScript compilation
8. Update this README if needed

## 📚 Additional Resources

- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [REST API Testing Best Practices](https://restfulapi.net/testing-rest-apis/)
- [API Performance Testing](https://www.guru99.com/api-testing.html)
- [Security Testing for APIs](https://owasp.org/www-project-api-security/) 
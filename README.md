# Sushi Mushi Playwright Test Suite

This repository contains comprehensive Playwright tests for the Sushi Mushi website, covering search functionality and basket operations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running Tests
```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/tests.spec.ts

# Run tests with debug
PWDEBUG=1 npx playwright test
```

## 🔧 Environment Configuration

This project uses environment variables for configuration management. This approach provides several benefits:

- **Environment-specific settings**: Different configs for dev, staging, production
- **Security**: Sensitive data not committed to version control
- **Flexibility**: Easy to change settings without code modifications
- **Team collaboration**: Developers can have different local settings

### Setup Environment Variables

1. **Copy the example file**:
   ```bash
   cp config.env.example config.env
   ```

2. **Edit `config.env`** with your specific values:
   ```bash
   # Base URLs
   BASE_URL=https://sushimushi.am/
   HOMEPAGE_URL=sushimushi.am
   
   # Timeouts (in milliseconds)
   SEARCH_RESULTS_TIMEOUT=2000
   PAGE_LOAD_TIMEOUT=2000
   
   # Test Data
   TEST_USER_NAME=Your Test User
   TEST_USER_PHONE=+37412345678
   ```

3. **Never commit `config.env`** - it's already in `.gitignore`

### Environment Variables Structure

The configuration is organized into logical sections:

#### URLs
```bash
BASE_URL=https://sushimushi.am/
HOMEPAGE_URL=sushimushi.am
PRODUCT_PAGE_URL=sushimushi.am
```

#### Timeouts
```bash
SEARCH_RESULTS_TIMEOUT=2000
PAGE_LOAD_TIMEOUT=2000
ITEM_ADD_TIMEOUT=1000
BASKET_NAVIGATION_TIMEOUT=2000
FORM_FILL_TIMEOUT=1000
```

#### Search Keywords
```bash
SEARCH_KEYWORD_PIZZA=պիցցա
SEARCH_KEYWORD_SUSHI=սուշի
SEARCH_KEYWORD_TUNA_PIZZA=թունա պիցցա
```

#### Test Data
```bash
TEST_USER_NAME=Test User
TEST_USER_PHONE=+37412345678
TEST_USER_ADDRESS=Test Address
```

#### Locators
```bash
CSS_BASKET_ICON=.cart-fixed-btn,.cart-icon,.basket-icon
CSS_ERROR_MESSAGE=.error-message,.validation-error,.required-field-error
```

## 📁 Project Structure

```
sushiTest/
├── config/
│   ├── config.ts          # Configuration loader and types
│   └── config.env.example # Example environment file
├── pom/                   # Page Object Models
│   ├── homePage/
│   ├── searchResultPage/
│   └── basketPage/
├── tests/
│   └── tests.spec.ts      # Main test suite
├── config.env             # Your local environment file (not committed)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🧪 Test Categories

### 1. Basic Basket Functionality
- Add item to basket and compare price/title
- Add multiple items and verify totals

### 2. Search Functionality
- Search for existing products
- Search with special characters
- Search performance testing
- Multi-language search support

### 3. Comprehensive Basket Operations
- Item quantity management
- Item removal
- Basket clearing
- Order confirmation flow

## 🔄 Using Configuration in Tests

### Import Configuration
```typescript
import { testConfig, urls, timeouts, search } from '../config/config';
```

### Access Configuration Values
```typescript
// URLs
await page.goto(testConfig.urls.base);

// Timeouts
await page.waitForTimeout(testConfig.timeouts.searchResults);

// Search keywords
await homePage.doSearch(testConfig.search.keywords.pizza);

// Test data
await nameField.fill(testConfig.testData.userName);
```

### Destructured Imports
```typescript
import { urls, timeouts, search } from '../config/config';

// Direct access
await page.goto(urls.base);
await page.waitForTimeout(timeouts.searchResults);
```

## 🌍 Environment-Specific Configurations

### Development
```bash
BASE_URL=http://localhost:3000
SEARCH_RESULTS_TIMEOUT=5000
```

### Staging
```bash
BASE_URL=https://staging.sushimushi.am
SEARCH_RESULTS_TIMEOUT=3000
```

### Production
```bash
BASE_URL=https://sushimushi.am
SEARCH_RESULTS_TIMEOUT=2000
```

## 🔒 Security Best Practices

1. **Never commit sensitive data**:
   - API keys
   - Database credentials
   - User passwords
   - Production URLs

2. **Use environment-specific files**:
   - `config.env` for local development
   - `config.env.staging` for staging (if needed)
   - `config.env.production` for production (if needed)

3. **Validate environment variables**:
   - The config loader provides fallback values
   - Missing variables won't crash tests

## 🚨 Troubleshooting

### Configuration Not Loading
- Ensure `config.env` file exists
- Check file path in `config/config.ts`
- Verify environment variable names match

### TypeScript Errors
- Run `npm install` to ensure dependencies are installed
- Check that `@types/node` is installed for path operations

### Environment Variables Not Working
- Restart your terminal/IDE after creating `config.env`
- Verify the file is in the correct location
- Check for typos in variable names

## 📝 Contributing

1. **Update `config.env.example`** when adding new configuration options
2. **Document new environment variables** in this README
3. **Use descriptive variable names** that clearly indicate their purpose
4. **Provide sensible fallback values** in the configuration loader

## 🔗 Related Documentation

- [Playwright Documentation](https://playwright.dev/)
- [dotenv Package](https://www.npmjs.com/package/dotenv)
- [Environment Variables Best Practices](https://12factor.net/config)

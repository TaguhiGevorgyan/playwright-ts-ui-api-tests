# Sushi Mushi Playwright Test Suite

This repository contains comprehensive Playwright tests for the Sushi Mushi website, featuring a robust Page Object Model (POM) architecture with TypeScript support

## 📁 Project Structure

```
sushiTest/
├── config/
│   ├── config.ts          # Configuration loader and types
│   └── config.env.example # Example environment file
├── pom/                   # Page Object Models (POM)
│   ├── basePage.ts        # Base page class
│   ├── homePage/          # Home page POM
│   │   ├── homePagePom.ts
│   │   ├── homePageLocators.ts
│   │   └── homePageAssertions.ts
│   ├── searchResultPage/  # Search results POM
│   │   ├── searchResultPagePom.ts
│   │   ├── searchResultPageLocators.ts
│   │   └── searchResultPageAssertions.ts
│   ├── basketPage/        # Shopping basket POM
│   │   ├── basketPagePom.ts
│   │   ├── basketPageLocators.ts
│   │   └── basketPageAssertions.ts
│   ├── orderForm/         # Order form POM
│   │   ├── orderFormPom.ts
│   │   ├── orderFormLocators.ts
│   │   └── orderFormAssertions.ts
│   └── productItemPage/   # Product page POM
│       ├── productItemPagePom.ts
│       ├── productItemPageLocators.ts
│       └── productItemPageAssertions.ts
├── tests/                 # Test suites
│   ├── api-tests.spec.ts
│   ├── basket-functionality.spec.ts
│   ├── item-page-functionality.spec.ts
│   ├── order-form-validation.spec.ts
│   └── search-functionality.spec.ts
├── config.env             # Your local environment file (not committed)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Test Categories

### 1. API Tests (`api-tests.spec.ts`)
- Mock API responses for products and search
- API endpoint validation
- Response time testing

### 2. Search Functionality (`search-functionality.spec.ts`)
- Search for existing products (pizza, sushi)
- Search with non-existent items
- Search field placeholder validation
- Empty search validation
- Multi-language search support (Armenian)

### 3. Basket Functionality (`basket-functionality.spec.ts`)
- Add single item to basket and verify details
- Add multiple items and verify totals
- Item quantity management (increase/decrease)
- Item removal and basket clearing
- Navigation between basket and product pages
- Price calculation validation

### 4. Order Form Validation (`order-form-validation.spec.ts`)
- Form field validation without submission
- Required field validation with error messages
- Contact information filling (name, phone, email)
- Address and region selection
- Armenian language support for validation messages

### 5. Item Page Functionality (`item-page-functionality.spec.ts`)
- Add items to basket from product pages
- Quantity changes on product pages
- Success message validation
- Favorite functionality testing

##  Page Object Model (POM) Architecture

### POM Structure
Each page has three main components:
- **`*Pom.ts`**: Main page interactions and methods
- **`*Locators.ts`**: CSS selectors and locators
- **`*Assertions.ts`**: Test assertions and validations

### POM Best Practices
- **Consistent Constructor Pattern**: All POM classes use explicit constructors with locator initialization
- **Single Responsibility**: Each POM handles one specific page/component
- **Reusable Methods**: Common actions are abstracted into reusable methods
- **Type Safety**: Full TypeScript support with proper typing
- **Error Handling**: Robust error handling with meaningful error messages

### Example POM Usage
```typescript
// Initialize POM
const homePage = new HomePage(page);
const searchResult = new SearchResultPage(page);
const basketPage = new BasketPage(page);

// Use POM methods
await homePage.doSearch('պիցցա');
await searchResult.clickAddButton();
await basketPage.verifyItemInBasket();
```

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

### Test Failures
- **Strict Mode Violations**: Use `.first()` when locators return multiple elements
- **Timeout Issues**: Increase timeout values in `config.env` or add explicit waits
- **Element Not Found**: Check if locators are still valid after UI changes
- **Armenian Text Issues**: Ensure proper encoding and font support

### Common Playwright Issues
- **Browser Not Starting**: Run `npx playwright install` to install browsers
- **Headless Mode Issues**: Use `--headed` flag to debug visually
- **Slow Tests**: Check network conditions and increase timeouts
- **Flaky Tests**: Add proper waits and retry mechanisms

##  Contributing

1. **Update `config.env.example`** when adding new configuration options
2. **Document new environment variables** in this README
3. **Use descriptive variable names** that clearly indicate their purpose
4. **Provide sensible fallback values** in the configuration loader

## 🔗 Related Documentation

- [Playwright Documentation](https://playwright.dev/)
- [dotenv Package](https://www.npmjs.com/package/dotenv)
- [Environment Variables Best Practices](https://12factor.net/config)

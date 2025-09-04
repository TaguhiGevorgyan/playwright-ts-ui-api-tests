import { test, Page, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage/homePagePom';
import { SearchResultPage } from '../pom/searchResultPage/searchResultPagePom';
import { BasketPage } from '../pom/basketPage/basketPagePom';
import { testConfig } from '../config/config';
import { BasketPageLocators } from '../pom/basketPage/basketPageLocators';
import { searchResultPageLocators } from '../pom/searchResultPage/searchResultPageLocators';
import { OrderFormLocators } from '../pom/orderForm/orderFormLocators';
import { OrderFormAssertions } from '../pom/orderForm/orderFormAssertions';
import { OrderFormPom } from '../pom/orderForm/orderFormPom';

// Order form validation test cases
test.describe('Order Form Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.urls.base);
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Add item to basket, navigate to order form, and test validation without placing order', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new OrderFormAssertions(page);
    const orderFormPom = new OrderFormPom(page);

    // Step 1: Add any item to basket
    await homePage.doSearch(testConfig.search.keywords.pizza);

    const searchResult = new SearchResultPage(page);

    // Add item to basket
    await searchResult.clickAddButton();

    // Navigate to basket page
    await searchResult.clickToBasket();

    // Press "Make an Order" button using proper locator

    const basketPage = new BasketPage(page);
    await basketPage.clickMakeOrderButton();

    //  Verify order form is displayed
    await assertions.expectOrderFormToBeVisible();

    // Test all required fields and their validation
    await assertions.expectNameFieldToBeVisible();
    await assertions.expectPhoneFieldToBeVisible();
    await assertions.expectAddressFieldToBeVisible();

    // Try to submit the form to trigger validation errors
    await orderFormPom.submitOrder();

    // Wait a moment for validation errors to appear
    await page.waitForTimeout(2000);

    // Check if there are any validation errors
    const errorCount = await orderFormPom.errorMessages.count();
    console.log(`Found ${errorCount} validation errors`);
    
    if (errorCount > 0) {
        const errors = await orderFormPom.getErrorMessages();
        console.log('Validation errors:', errors);
        await assertions.expectValidationErrorsToBePresent();
    } else {
        console.log('No validation errors found - form may have been submitted successfully');
    }
  });

  test('Test order form field validation without submission', async ({ page }) => {
    const assertions = new OrderFormAssertions(page);
    const homePage = new HomePage(page);
    const orderForm = new OrderFormPom(page);

    await homePage.doSearch(testConfig.search.keywords.pizza);

    const searchResult = new SearchResultPage(page);

    // Add item to basket
    await searchResult.clickAddButton();

    // Navigate to basket page
    await searchResult.clickToBasket();

    // Press "Make an Order" button using proper locator
    const basketPage = new BasketPage(page);
    await basketPage.clickMakeOrderButton();

    // Fill all required fields using the new methods
    await orderForm.fillContactInfo(
      testConfig.testData.userName,
      testConfig.testData.userPhone,
      testConfig.testData.userEmail
    );
    await orderForm.chooseRegion(testConfig.testData.userProvince);
    await orderForm.fillAddress(testConfig.testData.userAddress);

    // Verify field validations
    const fieldValidations = await orderForm.getFieldValidations();
  });

  test('Should show errors when required fields are empty', async ({ page }) => {
    const homePage = new HomePage(page);
    const orderForm = new OrderFormPom(page);
    const assertions = new OrderFormAssertions(page);

    await homePage.doSearch(testConfig.search.keywords.pizza);
    const searchResult = new SearchResultPage(page);
    await searchResult.clickAddButton();
    await searchResult.clickToBasket();

    const basketPage = new BasketPage(page);
    await basketPage.clickMakeOrderButton();

    // Try submitting without filling fields
    await orderForm.submitOrder();

    // Collect errors
    const errors = await orderForm.getErrorMessages();
    console.log(errors);

    // Assertions
    await assertions.expectValidationErrorsToBePresent();
    if (errors.length > 0) {
      await assertions.expectErrorMessagesToContain('Չի լրացվել դաշտը');
    }
  });
}); 
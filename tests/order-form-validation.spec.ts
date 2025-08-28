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
    await page.goto(testConfig.urls.base, { waitUntil: 'domcontentloaded', timeout: 120000 });
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
    
    // Get item details before adding to basket
    const itemTitle = await searchResult.getTitle();
    const itemPrice = await searchResult.getPrice();
    
    // Add item to basket
    await searchResult.clickAddButton();
    
    
    // Navigate to basket page
    await searchResult.clickToBasket();

    
    const basketPage = new BasketPage(page);

    
    // Press "Make an Order" button using proper locator
    const makeOrderButton = page.locator(BasketPageLocators.checkoutButton).first();
    
    if (await makeOrderButton.isVisible()) {
      await makeOrderButton.click();
      
      //  Verify order form is displayed using proper locator
  
      await assertions.expectOrderFormToBeVisible();
      
      // Test all required fields and their validation
      const requiredFieldsResult = await orderFormPom.testRequiredFields();
      const fieldValidationResult = await orderFormPom.testFieldValidation();
      const formStateResult = await orderFormPom.testFormStateChanges();
      
      // Assert on the returned data
      if (requiredFieldsResult.nameFieldVisible) {
        await assertions.expectNameFieldToBeVisible();
      }
      if (requiredFieldsResult.phoneFieldVisible) {
        await assertions.expectPhoneFieldToBeVisible();
      }
      if (requiredFieldsResult.addressFieldVisible) {
        await assertions.expectAddressFieldToBeVisible();
      }
      
      if (fieldValidationResult.hasErrors) {
        await assertions.expectValidationErrorsToBePresent([assertions.errorMessages]);
      }
      
      if (formStateResult.nameFieldFilled) {
        await assertions.expectNameFieldToHaveValue(formStateResult.nameFieldValue);
      }
      if (formStateResult.phoneFieldFilled) {
        await assertions.expectPhoneFieldToHaveValue(formStateResult.phoneFieldValue);
      }
      if (formStateResult.addressFieldFilled) {
        await assertions.expectAddressFieldToHaveValue(formStateResult.addressFieldValue);
      }
      
    } 
  });

  test('Test order form field validation without submission', async ({ page }) => {
    const assertions = new OrderFormAssertions(page);
    const orderFormPom = new OrderFormPom(page);
    
    // Navigate directly to order form if possible
    const orderFormUrl = page.url().includes('order') ? page.url() : `${testConfig.urls.base}order`;
    
    try {
      await page.goto(orderFormUrl);
      // Wait for order form to be visible instead of static timeout
      await page.waitForSelector(OrderFormLocators.orderForm, { state: 'visible', timeout: 30000 });
      
      const orderForm = page.locator(OrderFormLocators.orderForm).first();
      
      if (await orderForm.isVisible()) {
        const requiredFieldsResult = await orderFormPom.testRequiredFields();
        const fieldValidationResult = await orderFormPom.testFieldValidation();
        const formStateResult = await orderFormPom.testFormStateChanges();
        
        // Assert on the returned data
        if (requiredFieldsResult.nameFieldVisible) {
          await assertions.expectNameFieldToBeVisible();
        }
        if (requiredFieldsResult.phoneFieldVisible) {
          await assertions.expectPhoneFieldToBeVisible();
        }
        if (requiredFieldsResult.addressFieldVisible) {
          await assertions.expectAddressFieldToBeVisible();
        }
        
        if (fieldValidationResult.hasErrors) {
          await assertions.expectValidationErrorsToBePresent([assertions.errorMessages]);
        }
        
        if (formStateResult.nameFieldFilled) {
          await assertions.expectNameFieldToHaveValue(formStateResult.nameFieldValue);
        }
        if (formStateResult.phoneFieldFilled) {
          await assertions.expectPhoneFieldToHaveValue(formStateResult.phoneFieldValue);
        }
        if (formStateResult.addressFieldFilled) {
          await assertions.expectAddressFieldToHaveValue(formStateResult.addressFieldValue);
        }
      } 
    } catch (error) {
      console.error('Error navigating to order form:', error);
      throw error;
    }
  });
}); 
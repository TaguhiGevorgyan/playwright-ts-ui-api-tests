import { Page, Locator } from '@playwright/test';
import { OrderFormLocators } from './orderFormLocators';
import { HomePage } from '../homePage/homePagePom';
import { SearchResultPage } from '../searchResultPage/searchResultPagePom';
import { BasketPage } from '../basketPage/basketPagePom';
import { testConfig } from '../../config/config';

export class OrderFormPom {
  constructor(private page: Page) {}

  // Test required field validation using proper locators
  async testRequiredFields() {
    const nameField = this.page.locator(OrderFormLocators.nameField).first();
    const phoneField = this.page.locator(OrderFormLocators.phoneField).first();
    const addressField = this.page.locator(OrderFormLocators.addressField).first();
    
    // Return field visibility status for tests to assert on
    return {
      nameFieldVisible: await nameField.isVisible(),
      phoneFieldVisible: await phoneField.isVisible(),
      addressFieldVisible: await addressField.isVisible()
    };
  }

  // Test field validation without filling required fields using proper locator
  async testFieldValidation() {
    const submitButton = this.page.locator(OrderFormLocators.submitButton).first();
    
    if (await submitButton.isVisible()) {
      // Try to submit without filling required fields
      await submitButton.click();
      await this.page.waitForTimeout(testConfig.timeouts.formFill);
      
      // Return error messages for tests to assert on
      const errorMessages = this.page.locator(OrderFormLocators.errorMessages);
      return {
        hasErrors: await errorMessages.count() > 0,
        errorCount: await errorMessages.count()
      };
    }
    return { hasErrors: false, errorCount: 0 };
  }

  // Test form state changes when filling fields using proper locators
  async testFormStateChanges() {
    const nameField = this.page.locator(OrderFormLocators.nameField).first();
    const phoneField = this.page.locator(OrderFormLocators.phoneField).first();
    const addressField = this.page.locator(OrderFormLocators.addressField).first();
    
    const results = {
      nameFieldFilled: false,
      phoneFieldFilled: false,
      addressFieldFilled: false,
      nameFieldValue: '',
      phoneFieldValue: '',
      addressFieldValue: ''
    };
    
    // Fill fields and return state for tests to assert on
    if (await nameField.isVisible()) {
      await nameField.fill(testConfig.testData.userName);
      results.nameFieldFilled = true;
      results.nameFieldValue = await nameField.inputValue();
    }
    
    if (await phoneField.isVisible()) {
      await phoneField.fill(testConfig.testData.userPhone);
      results.phoneFieldFilled = true;
      results.phoneFieldValue = await phoneField.inputValue();
    }
    
    if (await addressField.isVisible()) {
      await addressField.fill(testConfig.testData.userAddress);
      results.addressFieldFilled = true;
      results.addressFieldValue = await addressField.inputValue();
    }
    
    return results;
  }

  // Test basket order flow as fallback when order form is not accessible
  async testBasketOrderFlow() {
    const homePage = new HomePage(this.page);
    const searchResult = new SearchResultPage(this.page);
    const basketPage = new BasketPage(this.page);
    
    // Add item to basket
    await homePage.doSearch(testConfig.search.keywords.pizza);
    await this.page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get item details before adding to basket
    const itemTitle = await searchResult.getTitle();
    const itemPrice = await searchResult.getPrice();
    
    // Add item to basket
    await searchResult.clickAddButton();
    await this.page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket page
    await searchResult.clickToBasket();
    await this.page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Get basket item details
    const basketItemTitle = await basketPage.getItemTitle();
    const basketItemPrice = await basketPage.getItemPrice();
    
    return {
      itemTitle: basketItemTitle || itemTitle,
      itemPrice: basketItemPrice || itemPrice,
      basketItemTitle,
      basketItemPrice,
      originalItemTitle: itemTitle,
      originalItemPrice: itemPrice
    };
  }
} 
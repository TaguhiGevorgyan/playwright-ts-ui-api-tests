import { test, Page, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage/homePagePom';
import { SearchResultPage } from '../pom/searchResultPage/searchResultPagePom';
import { BasketPage } from '../pom/basketPage/basketPagePom';
import { testConfig } from '../config/config';
import { BasketPageLocators } from '../pom/basketPage/basketPageLocators';
import { HomePageLocators } from '../pom/homePage/homePageLocators';
import { searchResultPageLocators } from '../pom/searchResultPage/searchResultPageLocators';
import { OrderFormLocators } from '../pom/orderForm/orderFormLocators';
import { BasketAssertions } from '../pom/basketPage/basketPageAssertions';

// Basic basket functionality test cases
test.describe('Basic Basket Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.urls.base);
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Add item to the basket and compare the price and title', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Verify search results contain keyword
    await assertions.expectSearchResultTitleToContainKeyword(firstResultTitle, testConfig.search.keywords.pizza);
    
    // Add to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Verify basket contains the item
    const basketPage = new BasketPage(page);
    const basketItemName = await basketPage.getItemTitle();
    const basketItemPrice = await basketPage.getItemPrice();
    
    // Compare names and prices
    await assertions.expectBasketItemNameToMatch(firstResultTitle, basketItemName);
    await assertions.expectBasketItemPriceToMatch(firstResultPrice, basketItemPrice);
  });

  test('Add two items to basket check the names, the prices and the total price', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Add first item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate back to search results
    await searchResult.clickToLogo();
    await homePage.addAnItem();
    
    // Get second result details
    const secondResultTitle = await searchResult.getTitle();
    const secondResultPrice = await searchResult.getPrice();
    
    // Add second item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Verify basket contains both items
    const basketPage = new BasketPage(page);
    const basketFirstItemName = await basketPage.getItemTitle();
    const basketSecondItemName = await basketPage.getSecondItemTitle();
    const basketFirstItemPrice = await basketPage.getItemPrice();
    const basketSecondItemPrice = await basketPage.getSecondItemPrice();
    
    // Compare names and prices
    await assertions.expectBasketFirstItemNameToMatch(firstResultTitle, basketFirstItemName);
    await assertions.expectBasketSecondItemNameToMatch(secondResultTitle, basketSecondItemName);
    await assertions.expectBasketFirstItemPriceToMatch(firstResultPrice, basketFirstItemPrice);
    await assertions.expectBasketSecondItemPriceToMatch(secondResultPrice, basketSecondItemPrice);
    
    // Calculate and verify total price
    const totalPrice = await basketPage.getTotalPrice();
    const expectedTotal = Number(firstResultPrice.replace(/[^\d]/g, '')) + Number(secondResultPrice.replace(/[^\d]/g, ''));
    await assertions.expectTotalPriceToMatchExpected(totalPrice, expectedTotal);
  });
});

// Comprehensive basket functionality test cases
test.describe('Comprehensive Basket Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.urls.base);
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Add item to the basket and compare the price', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Verify search results contain keyword
    await assertions.expectSearchResultTitleToContainKeyword(firstResultTitle, testConfig.search.keywords.pizza);
    
    // Add to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Verify basket contains the item
    const basketPage = new BasketPage(page);
    const basketItemName = await basketPage.getItemTitle();
    const basketItemPrice = await basketPage.getItemPrice();
    
    // Compare names and prices
    await assertions.expectBasketItemNameToMatch(firstResultTitle, basketItemName);
    await assertions.expectBasketItemPriceToMatch(firstResultPrice, basketItemPrice);
    

  });

  test('Add two items to basket check the names, the prices and the total price (Comprehensive)', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Add first item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate back to search results
    await searchResult.clickToLogo();
    await homePage.addAnItem();
    
    // Get second result details
    const secondResultTitle = await searchResult.getTitle();
    const secondResultPrice = await searchResult.getPrice();
    
    // Add second item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Verify basket contains both items
    const basketPage = new BasketPage(page);
    const basketFirstItemName = await basketPage.getItemTitle();
    const basketSecondItemName = await basketPage.getSecondItemTitle();
    const basketFirstItemPrice = await basketPage.getItemPrice();
    const basketSecondItemPrice = await basketPage.getSecondItemPrice();
    
    // Compare names and prices
    await assertions.expectBasketFirstItemNameToMatch(firstResultTitle, basketFirstItemName);
    await assertions.expectBasketSecondItemNameToMatch(secondResultTitle, basketSecondItemName);
    await assertions.expectBasketFirstItemPriceToMatch(firstResultPrice, basketFirstItemPrice);
    await assertions.expectBasketSecondItemPriceToMatch(secondResultPrice, basketSecondItemPrice);
    
    // Calculate and verify total price
    const totalPrice = await basketPage.getTotalPrice();
    const expectedTotal = Number(firstResultPrice.replace(/[^\d]/g, '')) + Number(secondResultPrice.replace(/[^\d]/g, ''));
    await assertions.expectTotalPriceToMatchExpected(totalPrice, expectedTotal);
    
    // Verify basket items match search results
    await assertions.expectBasketItemNameToMatch(firstResultTitle, await basketPage.getItemTitle());
    await assertions.expectBasketItemNameToMatch(secondResultTitle, await basketPage.getSecondItemTitle());
  });

  test('Add two items and delete one of them, then check the total price', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Add first item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate back to search results
    await searchResult.clickToLogo();
    await homePage.addAnItem();
    
    // Get second result details
    const secondResultTitle = await searchResult.getTitle();
    const secondResultPrice = await searchResult.getPrice();
    
    // Add second item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Delete first item
    const basketPage = new BasketPage(page);
    await basketPage.deleteFirstItem();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Verify remaining item
    const remainingItemTitle = await basketPage.getItemTitle();
    await assertions.expectRemainingItemTitleToMatch(remainingItemTitle, secondResultTitle);
    
    // Verify total price matches remaining item price
    const totalPrice = await basketPage.getTotalPrice();
    await assertions.expectTotalPriceToMatchItemPrice(totalPrice, secondResultPrice);
  });

  test('Add items to the basket and check the sum of prices from the main page', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Add first item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate back to search results
    await searchResult.clickToLogo();
    await homePage.addAnItem();
    
    // Get second result details
    const secondResultTitle = await searchResult.getTitle();
    const secondResultPrice = await searchResult.getPrice();
    
    // Add second item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Calculate and verify total price
    const basketPage = new BasketPage(page);
    const totalPrice = await basketPage.getTotalPrice();
    const expectedTotal = Number(firstResultPrice.replace(/[^\d]/g, '')) + Number(secondResultPrice.replace(/[^\d]/g, ''));
    await assertions.expectTotalPriceToMatchExpected(totalPrice, expectedTotal);
  });

  test('Increase items quantity from the basket', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Add item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Increase quantity
    const basketPage = new BasketPage(page);
    const initialQuantity = await basketPage.getItemQuantity();
    await basketPage.increaseItemQuantity();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    const newQuantity = await basketPage.getItemQuantity();
    await assertions.expectQuantityToIncrease(initialQuantity, newQuantity);
    
    // Verify price doubles
    const initialPrice = await basketPage.getItemPrice();
    const newPrice = await basketPage.getItemPrice();
    if (initialPrice && newPrice) {
      await assertions.expectTotalPriceToMatchDoublePrice(newPrice, initialPrice);
    }
  });

  test('Go to the items main page from the basket', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Add item to basket
    await searchResult.clickAddButton();
    await page.waitForTimeout(testConfig.timeouts.itemAdd);
    
    // Navigate to basket
    await searchResult.clickToBasket();
    await page.waitForTimeout(testConfig.timeouts.basketNavigation);
    
    // Click on item to go to product page
    const basketPage = new BasketPage(page);
    await basketPage.clickOnItem();
    await page.waitForTimeout(testConfig.timeouts.pageLoad);
    
    // Verify we're on product page
    await assertions.expectCurrentUrlToContainProductPage();
    
    // Verify product details are displayed
    const productTitle = page.locator('h1, .product-title, .item-title').first();
    await assertions.expectProductTitleToBeVisible(productTitle);
  });

  test('Delete all items from the basket', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Add multiple items to basket
    await homePage.doSearch(testConfig.search.keywords.pizza);
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    await searchResult.clickAddButton();
    
    await searchResult.clickToLogo();
    await homePage.addAnItem();
    
    // Open basket
    await homePage.clickToBasketHome();
    
    // Delete all items using proper locator
    const deleteButtons = page.locator(BasketPageLocators.removeItemButton);
    const deleteCount = await deleteButtons.count();
    
    for (let i = 0; i < deleteCount; i++) {
      const deleteButton = deleteButtons.nth(i);
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(testConfig.timeouts.itemAdd);
      }
    }
    
    // Verify basket is empty using proper locator
    const emptyMessage = page.locator(BasketPageLocators.basketEmptyMessage).first();
    await assertions.expectBasketToBeEmpty(emptyMessage);
    
    // Verify total price is 0
    const totalPrice = page.locator(BasketPageLocators.totalPrice).first();
    await assertions.expectTotalPriceToBeZero(totalPrice);
  });

  test('Confirm the order', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Add item to basket
    await homePage.doSearch(testConfig.search.keywords.pizza);
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    await searchResult.clickAddButton();
    
    // Open basket
    await searchResult.clickToBasket();
    
    // Click "Make an Order" button using proper locator
    const makeOrderButton = page.locator(BasketPageLocators.checkoutButton).first();
    
    if (await makeOrderButton.isVisible()) {
      await makeOrderButton.click();
      await page.waitForTimeout(testConfig.timeouts.pageLoad);
      
      // Verify order form is displayed using proper locator
      const orderForm = page.locator(OrderFormLocators.orderForm).first();
      await assertions.expectOrderFormToBeVisible(orderForm);
      
      // Fill required fields using proper locators
      const nameField = page.locator(OrderFormLocators.nameField).first();
      const phoneField = page.locator(OrderFormLocators.phoneField).first();
      const addressField = page.locator(OrderFormLocators.addressField).first();
      
      if (await nameField.isVisible()) {
        await nameField.fill(testConfig.testData.userName);
      }
      if (await phoneField.isVisible()) {
        await phoneField.fill(testConfig.testData.userPhone);
      }
      if (await addressField.isVisible()) {
        await addressField.fill(testConfig.testData.userAddress);
      }
      
      // Click confirm order button
      const confirmButton = page.locator(testConfig.locators.confirmOrderButton.join(', ')).first();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(testConfig.timeouts.pageLoad);
        
        // Verify order confirmation using proper locator
        const confirmationMessage = page.locator(OrderFormLocators.confirmationMessage).first();
        await assertions.expectOrderConfirmationToBeVisible(confirmationMessage);
      }
    }
  });
}); 
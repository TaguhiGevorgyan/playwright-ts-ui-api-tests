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
import { HomePageAssertions } from '../pom/homePage/homePageAssertions';
import { productItemPageLocators } from '../pom/productItemPage/productItemPageLocators';
import { ProductItemPagePom } from '../pom/productItemPage/productItemPagePom';
import { ProductItemPageAssertions } from '../pom/productItemPage/productItemPageAssertions';

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
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Debug: Log the retrieved values
    console.log(`First result title: "${firstResultTitle}"`);
    console.log(`First result price: "${firstResultPrice}"`);
    
    // Verify search results contain keyword
    await assertions.expectSearchResultTitleToContainKeyword(firstResultTitle, testConfig.search.keywords.pizza);
    
    // Add to basket
    await searchResult.clickAddButton();
   
    // Navigate to basket
    await searchResult.clickToBasket();
    
    // Verify basket contains the item
    const basketPage = new BasketPage(page);
    const basketItemName = await basketPage.getItemTitle();
    const basketItemPrice = await basketPage.getItemPrice();
    
    // Compare names and prices
    console.log(`Item titles: ${basketItemName}, ${firstResultTitle}`);

    console.log(`Item prices ${basketItemPrice}, ${firstResultPrice}`);
    await assertions.expectBasketItemNameToMatch(firstResultTitle, basketItemName);
    await assertions.expectBasketItemPriceToMatch(firstResultPrice, basketItemPrice);
  });

  test('Add two items to basket check the names, the prices and the total price', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Add first item to basket
    await searchResult.clickAddButton();
    
    // Navigate to basket first to verify first item
    await searchResult.clickToBasket();
    
    // Verify first item is in basket
    const basketPage = new BasketPage(page);
    const basketFirstItemName = await basketPage.getItemTitle();
    const basketFirstItemPrice = await basketPage.getItemPrice();
    
    // Compare first item

    console.log(`Item titles: ${basketFirstItemName}, ${firstResultTitle}`);
    console.log(`Item prices: ${basketFirstItemPrice}, ${firstResultPrice}`);
    await assertions.expectBasketItemNameToMatch(firstResultTitle, basketFirstItemName);
    await assertions.expectBasketItemPriceToMatch(firstResultPrice, basketFirstItemPrice);
    
    const totalPrice = await basketPage.getTotalPrice();
    
    // Verify total price exists and is reasonable
    const totalPriceResult = await assertions.verifyTotalPrice();
    expect(totalPriceResult.isValid).toBeTruthy();
  });

  test('Add two items to basket check the names, the prices and the total price (Comprehensive)', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
        
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Add first item to basket
    await searchResult.clickAddButton();

    
    // Navigate back to search results
    await searchResult.clickToLogo();
    await homePage.FindAnItem();
    
    // Get second result details
    const secondResultTitle = await searchResult.getTitle();
    const secondResultPrice = await searchResult.getPrice();
    
    // Add second item to basket
    await searchResult.clickAddButton();
   
    
    // Navigate to basket
    await searchResult.clickToBasket();

    
    // Verify basket contains both items
    const basketPage = new BasketPage(page);
    const basketFirstItemPrice = await basketPage.getItemPrice();
    const basketSecondItemPrice = await basketPage.getSecondItemPrice();

    // Calculate and verify total price
    const totalPrice = await basketPage.getTotalPrice();
    const expectedTotal = Number(basketFirstItemPrice.replace(/[^\d]/g, '')) + Number(basketSecondItemPrice.replace(/[^\d]/g, ''));
    await assertions.expectTotalPriceToMatchExpected(totalPrice, expectedTotal);
  });


  test('Add two items and delete one of them, then check the total price', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
 
    
    // Get first result details
    const firstResultTitle = await searchResult.getTitle();
    const firstResultPrice = await searchResult.getPrice();
    
    // Add first item to basket
    await searchResult.clickAddButton();
   // click on the logo and add the second item
   await searchResult.clickToLogo();
   await homePage.FindAnItem();      

   // Add second item to basket
   await searchResult.clickAddButton();

   // Navigate to basket
   await searchResult.clickToBasket();

   // Get prices of the items
   const basketPage = new BasketPage(page);
   const basketFirstItemPrice = await basketPage.getItemPrice();
   const basketSecondItemPrice = await basketPage.getSecondItemPrice();
  const totalPrice = await basketPage.getTotalPrice();
    // delete one item from the basket
    await basketPage.deleteItem();
    const newTotalPrice = await basketPage.getTotalPrice();
    console.log(`new total price: ${newTotalPrice}`);
    
    // assert that total price is the sum of the prices of the items
    await assertions.expectTotalPriceToDecrease(totalPrice, newTotalPrice);
  });

  // test('Add items to the basket and check the quantity of the items from the main page', async ({ page }) => {
  //   const homePage = new HomePage(page);
  //   // Search for pizza
  //   await homePage.doSearch(testConfig.search.keywords.pizza);
    
  //   const searchResult = new SearchResultPage(page);
    
  //   // Add an item to basket
  //   await searchResult.clickAddButton();
    
  //   // Wait for basket quantity to update
  //   await page.waitForTimeout(10000);
    
  //   // Get basket count after actually adding to cart
  //   const basketQuantityAfterAdding = await homePage.getBasketCount();
  //   console.log(`Basket count after adding: "${basketQuantityAfterAdding}"`);

  //   const homeAssertions = new HomePageAssertions(page);
    
  //   await homeAssertions.expectBasketCountToBeGreaterThanZero(basketQuantityAfterAdding);
  // });

  test('Increase items quantity from the basket', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    // Add item to basket
    await searchResult.clickAddButton();
    
    // Navigate to basket
    await searchResult.clickToBasket();

    // Increase quantity
    const basketPage = new BasketPage(page);
     // Get total price before increasing quantity
     const initialTotalPrice = await basketPage.getTotalPrice();
     console.log(`Initial total price: ${initialTotalPrice}`);

    await basketPage.increaseItemQuantity();
    //add timeout
    await page.waitForTimeout(2000);
    
    // Get total price after increasing quantity
    const newTotalPrice = await basketPage.getTotalPrice();
    console.log(`new total price: ${newTotalPrice}`);
    
    // assert that total price increased
    await assertions.expectTotalPriceToIncrease(initialTotalPrice, newTotalPrice);
  });

  test('Go to the items main page from the basket', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    
    // Add item to basket
    await searchResult.clickAddButton();
    
    // Navigate to basket
    await searchResult.clickToBasket();

    
    // Click on item to go to product page
    const basketPage = new BasketPage(page);

    const basketItemTitle = await basketPage.getItemTitle();

    await basketPage.clickOnItem();

    await page.waitForTimeout(2000);
    
        // Verify product title is the same as in the basket
    
    const productAssertions = new ProductItemPageAssertions(page);
    await productAssertions.expectItemTitleToBeTheSameAsInBasket(basketItemTitle);
  });

  test('Delete all items from the basket', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new BasketAssertions(page);
    
    // Add multiple items to basket
    await homePage.doSearch(testConfig.search.keywords.pizza);
    const searchResult = new SearchResultPage(page);
    await searchResult.clickAddButton();
    
    await searchResult.clickToLogo();
    await homePage.FindAnItem();
    await searchResult.clickAddButton();
    
    // Open basket
    await homePage.clickToBasketHome();
    
    // Delete all items using POM method
    const basketPage = new BasketPage(page);
    await basketPage.deleteAllItems();
    await page.waitForTimeout(2000);

    // Verify basket is empty using proper locator
    const emptyMessage = page.locator(BasketPageLocators.basketEmptyMessage).first();
    await assertions.expectBasketToBeEmpty(emptyMessage);
    
    // Verify total price is 0
    const totalPrice = page.locator(BasketPageLocators.totalPrice).first();
    await assertions.expectTotalPriceToBeZero(totalPrice);
  });
});
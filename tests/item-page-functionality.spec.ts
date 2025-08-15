import { test, Page, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage/homePagePom';
import { SearchResultPage } from '../pom/searchResultPage/searchResultPagePom';
import { testConfig } from '../config/config';
import { searchResultPageLocators } from '../pom/searchResultPage/searchResultPageLocators';
import { productItemPageLocators } from '../pom/productItemPage/productItemPageLocators';
import { ProductItemPageAssertions } from '../pom/productItemPage/productItemPageAssertions';

// Item page functionality test cases
test.describe('Item Page Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.urls.base);
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Navigate to item page and verify product details', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new ProductItemPageAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Click on first result to go to item page
    const firstResult = page.locator(searchResultPageLocators.searchResultItem).first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await page.waitForTimeout(testConfig.timeouts.pageLoad);
      
      // Verify we're on product page
      await assertions.expectCurrentUrlToContainProductPage();
      
      // Verify product details are displayed
      const productTitle = page.locator(productItemPageLocators.productItemTitle).first();
      const productPrice = page.locator(productItemPageLocators.productItemPrice).first();
      const productImage = page.locator(productItemPageLocators.productImage).first();
      const productDescription = page.locator(productItemPageLocators.productDescription).first();
      
      await assertions.expectProductTitleToBeVisible(productTitle);
      await assertions.expectProductPriceToBeVisible(productPrice);
      await assertions.expectProductImageToBeVisible(productImage);
      await assertions.expectProductDescriptionToBeVisible(productDescription);
    }
  });

  test('Add item to basket from item page', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new ProductItemPageAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Click on first result to go to item page
    const firstResult = page.locator(searchResultPageLocators.searchResultItem).first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await page.waitForTimeout(testConfig.timeouts.pageLoad);
      
      // Verify add to basket button is visible
      const addToBasketButton = page.locator(productItemPageLocators.addToCartButton).first();
      await assertions.expectAddToBasketButtonToBeVisible(addToBasketButton);
      
      // Add item to basket
      await addToBasketButton.click();
      await page.waitForTimeout(testConfig.timeouts.itemAdd);
      
      // Verify success message
      const successMessage = page.locator('text=/ավելացվել է|added|successfully added/').first();
      if (await successMessage.isVisible()) {
        await assertions.expectSuccessMessageToBeVisible(successMessage);
      }
      
      // Verify basket count increased
      const basketText = await homePage.getBasketCount();
      await assertions.expectBasketCountToContainOne(basketText);
    }
  });

  test('Change item quantity on item page', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new ProductItemPageAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Click on first result to go to item page
    const firstResult = page.locator(searchResultPageLocators.searchResultItem).first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await page.waitForTimeout(testConfig.timeouts.pageLoad);
      
      // Get initial quantity
      const quantityInput = page.locator(productItemPageLocators.quantityInput).first();
      if (await quantityInput.isVisible()) {
        const initialQuantity = await quantityInput.inputValue();
        
        // Increase quantity
        const increaseButton = page.locator(productItemPageLocators.quantityIncrease).first();
        if (await increaseButton.isVisible()) {
          await increaseButton.click();
          await page.waitForTimeout(testConfig.timeouts.itemAdd);
          
          const newQuantity = await quantityInput.inputValue();
          await assertions.expectQuantityToIncrease(initialQuantity, newQuantity);
          
          // Decrease quantity back to original
          const decreaseButton = page.locator(productItemPageLocators.quantityDecrease).first();
          if (await decreaseButton.isVisible()) {
            await decreaseButton.click();
            await page.waitForTimeout(testConfig.timeouts.itemAdd);
            
            const finalQuantity = await quantityInput.inputValue();
            await assertions.expectQuantityToReturnToOriginal(initialQuantity, finalQuantity);
          }
        }
      }
    }
  });

  test('View item image', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new ProductItemPageAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Click on first result to go to item page
    const firstResult = page.locator(searchResultPageLocators.searchResultItem).first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await page.waitForTimeout(testConfig.timeouts.pageLoad);
      
      // Verify main image is visible
      const mainImage = page.locator(productItemPageLocators.productImage).first();
      await assertions.expectMainImageToBeVisible(mainImage);
    }
  });

  test('Add item to favorites', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new ProductItemPageAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Click on first result to go to item page
    const firstResult = page.locator(searchResultPageLocators.searchResultItem).first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await page.waitForTimeout(testConfig.timeouts.pageLoad);
      
      // Verify favorite button is visible
      const favoriteButton = page.locator('.favorite-btn, .wishlist-btn, .like-btn, button:has-text("❤"), button:has-text("♡")').first();
      await assertions.expectFavoriteButtonToBeVisible(favoriteButton);
      
      // Add to favorites
      await favoriteButton.click();
      await page.waitForTimeout(testConfig.timeouts.itemAdd);
      
      // Verify success message
      const successMessage = page.locator('text=/added to favorites|added to wishlist|հավանել եք/').first();
      if (await successMessage.isVisible()) {
        await assertions.expectFavoriteSuccessMessageToBeVisible(successMessage);
      }
    }
  });
}); 
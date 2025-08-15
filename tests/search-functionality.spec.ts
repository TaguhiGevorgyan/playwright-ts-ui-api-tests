import { test, Page, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage/homePagePom';
import { SearchResultPage } from '../pom/searchResultPage/searchResultPagePom';
import { testConfig } from '../config/config';
import { HomePageLocators } from '../pom/homePage/homePageLocators';
import { searchResultPageLocators } from '../pom/searchResultPage/searchResultPageLocators';
import { SearchResultPageAssertions } from '../pom/searchResultPage/searchResultPageAssertions';

// Search functionality test cases
test.describe('Search Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.urls.base);
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Search for pizza and verify results contain keyword', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result title
    const firstResultTitle = await searchResult.getTitle();
    
    // Verify search results contain keyword
    await assertions.expectSearchResultTitleToContainKeyword(firstResultTitle, testConfig.search.keywords.pizza);
  });

  test('Search for non-existent item and verify no results message', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Search for non-existent item
    await homePage.doSearch(testConfig.search.keywords.nonExistent);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Check for no results message
    const noResultsMessage = page.locator(searchResultPageLocators.noResultsMessage).first();
    if (await noResultsMessage.isVisible()) {
      await assertions.expectNoResultsMessageToBeVisible(noResultsMessage);
    }
    
    // Verify result count is 0
    const resultCount = await searchResult.getResultCount();
    await assertions.expectResultCountToBeZero(resultCount);
  });

  test('Verify search field placeholder text', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Get search field placeholder
    const searchField = page.locator(HomePageLocators.searchField).first();
    if (await searchField.isVisible()) {
      const placeholder = await searchField.getAttribute('placeholder');
      if (placeholder) {
        await assertions.expectSearchFieldPlaceholderToContainKeyword(placeholder, testConfig.search.keywords.fieldPlaceholder);
      }
    }
  });

  test('Search for multiple keywords and verify results', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Search for multiple keywords
    const keywords = [testConfig.search.keywords.pizza, testConfig.search.keywords.sushi, testConfig.search.keywords.tuna];
    
    for (const keyword of keywords) {
      await homePage.doSearch(keyword);
      await page.waitForTimeout(testConfig.timeouts.searchResults);
      
      const searchResult = new SearchResultPage(page);
      const resultCount = await searchResult.getResultCount();
      await assertions.expectResultCountToBeGreaterThanZero(resultCount);
    }
  });

  test('Verify search results navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Verify first result is visible
    const firstResult = page.locator(searchResultPageLocators.searchResultItem).first();
    await assertions.expectFirstResultToBeVisible(firstResult);
    
    // Verify URL has changed from base
    await assertions.expectCurrentUrlToNotBeBaseUrl();
  });
}); 
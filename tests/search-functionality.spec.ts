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
    await page.goto(testConfig.urls.base, { waitUntil: 'domcontentloaded', timeout: 120000 });
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Search for pizza and verify results contain keyword', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Close modal before searching
    await homePage.closeModal();
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    await page.waitForTimeout(testConfig.timeouts.searchResults);
    
    // Get first result title
    const firstResultTitle = await searchResult.getTitle();
    
    // Verify search results contain keyword (case-insensitive)
    await assertions.expectSearchResultTitleToContainKeywordCaseInsensitive(firstResultTitle, testConfig.search.keywords.pizza);
  });

  test('Search for non-existent item and verify no results message', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Close modal before searching
    await homePage.closeModal();
    
    // Search for non-existent item
    await homePage.doSearch(testConfig.search.keywords.nonexistent);
    
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
    const keywords = [testConfig.search.keywords.pizza, testConfig.search.keywords.sushi, testConfig.search.keywords.tunaPizza];
    
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
    
    // Close modal before searching
    await homePage.closeModal();
    
    console.log('Starting search...');
    const searchStart = Date.now();
    
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    console.log(`Search completed in ${Date.now() - searchStart}ms`);
    
    const searchResult = new SearchResultPage(page);
    
    console.log('Waiting for search results...');
    const waitStart = Date.now();
    
    // Wait for search results to load with explicit waiting
    await page.waitForSelector(searchResultPageLocators.searchResultItem, { state: 'attached', timeout: 30000 });
    console.log(`Results loaded in ${Date.now() - waitStart}ms`);
    
    // Additional wait for elements to become visible
    await page.waitForTimeout(2000);
    
    // Verify a product title is visible (choose the first visible one)
    const titles = page.locator(searchResultPageLocators.searchResultTitle);
    const count = await titles.count();
    let foundVisible = false;
    for (let i = 0; i < count; i++) {
      const t = titles.nth(i);
      await t.scrollIntoViewIfNeeded();
      if (await t.isVisible()) {
        await assertions.expectSearchResultTitleToBeVisible(t);
        foundVisible = true;
        break;
      }
    }
    expect(foundVisible).toBe(true);
    
    // Verify URL has changed from base
    await assertions.expectCurrentUrlToNotBeBaseUrl();
    
    console.log(`Total test time: ${Date.now() - searchStart}ms`);
  });
}); 
import { test, Page, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage/homePagePom';
import { SearchResultPage } from '../pom/searchResultPage/searchResultPagePom';
import { testConfig } from '../config/config';
import { HomePageLocators } from '../pom/homePage/homePageLocators';
import { searchResultPageLocators } from '../pom/searchResultPage/searchResultPageLocators';
import { SearchResultPageAssertions } from '../pom/searchResultPage/searchResultPageAssertions';
import { HomePageAssertions } from '../pom/homePage/homePageAssertions';

// Search functionality test cases
test.describe('Search Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig.urls.base);
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Search for pizza and verify results contain keyword', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new HomePageAssertions(page);
    // Search for pizza
    await homePage.doSearch(testConfig.search.keywords.pizza);
    
    const searchResult = new SearchResultPage(page);
    
    // Get first result title
    const firstResultTitle = await searchResult.getTitle();
    
    // Verify search results contain keyword (case-insensitive)
    await assertions.expectSearchResultTitleToContainKeywordCaseInsensitive(firstResultTitle, testConfig.search.keywords.pizza);
  });

  test('Search for non-existent item and verify no results message', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);

    // Search for non-existent item
    await homePage.doSearch(testConfig.search.keywords.nonexistent);
    
    const searchResult = new SearchResultPage(page);
  
    // Check for no results message and verify count
    const { hasNoResultsMessage, resultCount } = await searchResult.verifyNoResultsAndCount();
    
    if (hasNoResultsMessage) {
      const noResultsMessage = await searchResult.getNoResultsMessage();
      await assertions.expectNoResultsMessageToBeVisible(noResultsMessage);
    }
    
    await assertions.expectResultCountToBeZero(resultCount);
  });

  test('Verify search field placeholder text', async ({ page }) => {
    const homePage = new HomePage(page);
    const assertions = new SearchResultPageAssertions(page);
    
    // Get search field placeholder
    const placeholder = await homePage.getSearchFieldPlaceholder();
    if (placeholder) {
      await assertions.expectSearchFieldPlaceholderToContainKeyword(placeholder, testConfig.search.keywords.fieldPlaceholder);
    }
  });

  test('Search with empty input and verify validation', async ({ page }) => {
    const homePage = new HomePage(page);
    const homePageAssertions = new HomePageAssertions(page);
    
    // Get search field and search button
    const searchField = page.locator(HomePageLocators.searchField);
    const searchButton = page.locator(HomePageLocators.searchFieldButton);
    
    // Verify search field is visible and enabled
    await homePageAssertions.verifySearchFieldIsVisible();
    await homePageAssertions.verifySearchFieldIsEnabled(); 
    // Clear the search field
    await searchField.clear();
    // Try to search with empty input
    await searchButton.click();
    // Check for no results message and verify count
    const searchResult = new SearchResultPage(page);
    const searchPageAssertions = new SearchResultPageAssertions(page);
    const { hasNoResultsMessage, resultCount } = await searchResult.verifyNoResultsAndCount();
    if (hasNoResultsMessage) {
      const noResultsMessage = await searchResult.getNoResultsMessage();
      await searchPageAssertions.expectNoResultsMessageToBeVisible(noResultsMessage);
    }
    await searchPageAssertions.expectResultCountToBeZero(resultCount);
  });
      
}); 
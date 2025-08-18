import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';

export class SearchResultPageAssertions {
  constructor(private page: Page) {}

  // Search result content assertions
  async expectSearchResultTitleToContainKeyword(firstResultTitle: string, keyword: string) {
    expect(firstResultTitle).toContain(keyword);
  }

  async expectSearchResultTitleToContainKeywordCaseInsensitive(firstResultTitle: string, keyword: string) {
    expect(firstResultTitle.toLowerCase()).toContain(keyword.toLowerCase());
  }

  // No results assertions
  async expectNoResultsMessageToBeVisible(noResultsMessage: Locator) {
    expect(await noResultsMessage.isVisible()).toBe(true);
  }

  async expectResultCountToBeZero(resultCount: number) {
    expect(resultCount).toBe(0);
  }

  // Search field assertions
  async expectSearchFieldPlaceholderToContainKeyword(placeholder: string, keyword: string) {
    expect(placeholder).toContain(keyword);
  }

  async expectSearchFieldToBeVisible(searchField: Locator) {
    expect(await searchField.isVisible()).toBe(true);
  }

  async expectSearchFieldInputValueToMatch(inputValue: string, expectedValue: string) {
    expect(inputValue).toBe(expectedValue);
  }

  // Result count assertions
  async expectResultCountToBeGreaterThanZero(resultCount: number) {
    expect(resultCount).toBeGreaterThan(0);
  }

  // Search result item assertions
  async expectFirstResultToBeVisible(firstResult: Locator) {
    await expect(firstResult).toBeVisible();
  }

  async expectSearchResultTitleToBeVisible(title: Locator) {
    await expect(title).toBeVisible();
  }

  async expectSearchResultPriceToBeVisible(price: Locator) {
    expect(await price.isVisible()).toBe(true);
  }

  async expectSearchResultImageToBeVisible(image: Locator) {
    expect(await image.isVisible()).toBe(true);
  }

  // Navigation assertions
  async expectCurrentUrlToNotBeBaseUrl() {
    const currentUrl = this.page.url();
    expect(currentUrl).not.toBe(testConfig.urls.base);
  }

  // Performance assertions
  async expectSearchTimeToBeBelowThreshold(searchTime: number, threshold: number) {
    expect(searchTime).toBeLessThan(threshold);
  }

  // Add to basket assertions
  async expectAddButtonToBeVisible(addButton: Locator) {
    expect(await addButton.isVisible()).toBe(true);
  }

  async expectSuccessMessageToBeVisible(successMessage: Locator) {
    expect(await successMessage.isVisible()).toBe(true);
  }

  // Basket count assertions
  async expectBasketCountToContainOne(basketText: string) {
    expect(basketText).toContain('1');
  }
}

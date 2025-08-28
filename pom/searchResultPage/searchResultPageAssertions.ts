import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';
import { searchResultPageLocators } from './searchResultPageLocators';

export class SearchResultPageAssertions {
  constructor(private page: Page) {}

  async expectNoResultsMessageToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectResultCountToBeZero(count: number) {
    expect(count).toBe(0);
  }

  async expectResultCountToBeGreaterThanZero(count: number) {
    expect(count).toBeGreaterThan(0);
  }

  async expectSearchFieldPlaceholderToContainKeyword(placeholder: string, keyword: string) {
    expect(placeholder.toLowerCase()).toContain(keyword.toLowerCase());
  }

  async expectSearchResultTitleToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectCurrentUrlToNotBeBaseUrl() {
    const currentUrl = this.page.url();
    expect(currentUrl).not.toBe(testConfig.urls.base);
  }
}
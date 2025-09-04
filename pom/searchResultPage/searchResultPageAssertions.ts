import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';

export class SearchResultPageAssertions {
  constructor(private page: Page) {}

  async expectNoResultsMessageToBeVisible(message: string) {
    expect(message).toBeTruthy();
    expect(message.length).toBeGreaterThan(0);
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
}
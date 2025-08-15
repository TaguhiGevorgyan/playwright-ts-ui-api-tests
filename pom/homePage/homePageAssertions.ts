import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';

export class HomePageAssertions {
  constructor(private page: Page) {}

  // Search functionality assertions
  async expectSearchResultsToContainKeyword(searchResults: string[], keyword: string) {
    const hasKeyword = searchResults.some(result => 
      result.toLowerCase().includes(keyword.toLowerCase())
    );
    expect(hasKeyword).toBe(true);
  }

  // Modal assertions
  async expectModalToBeClosed(modal: Locator) {
    expect(await modal.isVisible()).toBe(false);
  }

  async expectModalToBeOpen(modal: Locator) {
    expect(await modal.isVisible()).toBe(true);
  }

  // Navigation assertions
  async expectCurrentUrlToBeBaseUrl() {
    const currentUrl = this.page.url();
    expect(currentUrl).toBe(testConfig.urls.base);
  }

  async expectCurrentUrlToContainPath(path: string) {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain(path);
  }

  // Page element assertions
  async expectElementToBeVisible(element: Locator) {
    expect(await element.isVisible()).toBe(true);
  }

  async expectElementToNotBeVisible(element: Locator) {
    expect(await element.isVisible()).toBe(false);
  }

  // Content assertions
  async expectTextToContain(text: string, expectedContent: string) {
    expect(text).toContain(expectedContent);
  }

  async expectTextToBe(text: string, expectedText: string) {
    expect(text).toBe(expectedText);
  }

  // Count assertions
  async expectCountToBeGreaterThan(count: number, threshold: number) {
    expect(count).toBeGreaterThan(threshold);
  }

  async expectCountToBe(count: number, expectedCount: number) {
    expect(count).toBe(expectedCount);
  }

  // Boolean assertions
  async expectToBeTrue(value: boolean) {
    expect(value).toBe(true);
  }

  async expectToBeFalse(value: boolean) {
    expect(value).toBe(false);
  }

  // Truthiness assertions
  async expectToBeTruthy(value: any) {
    expect(value).toBeTruthy();
  }

  async expectToBeFalsy(value: any) {
    expect(value).toBeFalsy();
  }
}

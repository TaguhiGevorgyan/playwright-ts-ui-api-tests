import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';
import { HomePageLocators } from './homePageLocators';

export class HomePageAssertions {
  readonly page: Page;
  readonly searchField: Locator;
  readonly searchFieldButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchField = page.locator(HomePageLocators.searchField);
    this.searchFieldButton = page.locator(HomePageLocators.searchFieldButton);
  }

  async verifySearchFieldIsVisible() {
    await expect(this.searchField).toBeVisible();
  }
  
  async verifySearchFieldButtonIsVisible() {        
    await expect(this.searchFieldButton).toBeVisible();
  }
  
  async verifySearchFieldButtonIsEnabled() {
    await expect(this.searchFieldButton).toBeEnabled();
  }

  async verifySearchFieldIsEnabled() {
    await expect(this.searchField).toBeEnabled();
  }

  async expectSearchResultTitleToContainKeywordCaseInsensitive(title: string, keyword: string) {
    expect(title.toLowerCase()).toContain(keyword.toLowerCase());
  }
  async expectBasketCountToBeGreaterThanZero(quantity: string): Promise<void> {
    const quantityNumber = Number(quantity.replace(/[^\d]/g, ''));
    expect(quantityNumber).toBeGreaterThan(0);
  }
}
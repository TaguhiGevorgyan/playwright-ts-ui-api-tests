import { Page, Locator } from '@playwright/test';
import { searchResultPageLocators } from './searchResultPageLocators';

export class SearchResultPage {
  constructor(private page: Page) {}

  async getTitle(): Promise<string> {
    const titleLocator = this.page.locator(searchResultPageLocators.itemTitle).first();
    return await titleLocator.textContent() || '';
  }

  async getPrice(): Promise<string> {
    const priceLocator = this.page.locator(searchResultPageLocators.itemPrice).first();
    return await priceLocator.textContent() || '';
  }

  async clickAddButton(): Promise<void> {
    const addButton = this.page.locator(searchResultPageLocators.addButton).first();
    await addButton.click();
  }

  async clickToBasket(): Promise<void> {
    const basketButton = this.page.locator(searchResultPageLocators.basket).first();
    await basketButton.click();
  }

  async clickToLogo(): Promise<void> {
    const logoButton = this.page.locator(searchResultPageLocators.logo).first();
    await logoButton.click();
  }

  async getResultCount(): Promise<number> {
    const items = this.page.locator(searchResultPageLocators.item);
    return await items.count();
  }

  async getNoResultsMessage(): Promise<Locator> {
    return this.page.locator(searchResultPageLocators.noResultsMessage);
  }

  async isNoResultsMessageVisible(): Promise<boolean> {
    const noResultsMessage = await this.getNoResultsMessage();
    return await noResultsMessage.isVisible();
  }

  async verifyNoResultsAndCount(): Promise<{ hasNoResultsMessage: boolean; resultCount: number }> {
    const hasNoResultsMessage = await this.isNoResultsMessageVisible();
    const resultCount = await this.getResultCount();
    return { hasNoResultsMessage, resultCount };
  }
}


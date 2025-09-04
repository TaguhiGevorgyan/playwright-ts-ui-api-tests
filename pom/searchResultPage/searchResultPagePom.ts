import { Page, Locator } from '@playwright/test';
import { searchResultPageLocators } from './searchResultPageLocators';

export class SearchResultPage {
  readonly page: Page;
  readonly itemTitle: Locator;
  readonly itemPrice: Locator;
  readonly item: Locator;
  readonly addButton: Locator;
  readonly basket: Locator;
  readonly logo: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemTitle = page.locator(searchResultPageLocators.itemTitle);
    this.itemPrice = page.locator(searchResultPageLocators.itemPrice);
    this.item = page.locator(searchResultPageLocators.item);
    this.addButton = page.locator(searchResultPageLocators.addButton);
    this.basket = page.locator(searchResultPageLocators.basket);
    this.logo = page.locator(searchResultPageLocators.logo);
    this.noResultsMessage = page.locator(searchResultPageLocators.noResultsMessage);
  }

  async getTitle(): Promise<string> {
    const titleLocator = this.itemTitle.first();
    return await titleLocator.textContent() || '';
  }

  async getPrice(): Promise<string> {
      await this.page.waitForSelector(searchResultPageLocators.itemPrice, { state: 'visible', timeout: 10000 });
      const priceLocator = this.itemPrice.first();
      const price = await priceLocator.textContent() || '';
      return price;
    }

  async clickAddButton() {
    try {
      await this.page.waitForSelector(searchResultPageLocators.item, { state: 'visible', timeout: 10000 });
      const addButton = this.addButton.first();
      
      // Wait for button to be visible and attached
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      await addButton.waitFor({ state: 'attached', timeout: 5000 });
      
      const isEnabled = await addButton.isEnabled();
      console.log(`Add button enabled: ${isEnabled}`);
      
      // Scroll into view if needed
      await addButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      
      // Try different click strategies
      try {
        await addButton.click({ timeout: 5000 });
        console.log('Normal click successful');
      } catch (error) {
        console.log('Normal click failed, trying force click...');
        await addButton.click({ force: true, timeout: 5000 });
        console.log('Force click successful');
      }
      
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error('Error clicking add button:', error);
      throw error;
    }
  }

  async clickToBasket(): Promise<void> {
    const basketButton = this.basket.first();
    await basketButton.click();
  }

  async clickToLogo(): Promise<void> {
    const logoButton = this.logo.first();
    await logoButton.click();
  }

  async getResultCount(): Promise<number> {
    return await this.item.count();
  }

  async getNoResultsMessage(): Promise<string> {
    return await this.noResultsMessage.textContent() || '';
  }

  async isNoResultsMessageVisible(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }

  async verifyNoResultsAndCount(): Promise<{ hasNoResultsMessage: boolean; resultCount: number }> {
    const hasNoResultsMessage = await this.isNoResultsMessageVisible();
    const resultCount = await this.getResultCount();
    return { hasNoResultsMessage, resultCount };
  }

  async clickToItem(): Promise<void> {
    const item = this.itemTitle.first();
    await item.click();
  }
}


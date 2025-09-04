import { Page, Locator } from '@playwright/test';
import { searchResultPageLocators } from './searchResultPageLocators';

export class SearchResultPage {
  constructor(private page: Page) { }

  async getTitle(): Promise<string> {
    const titleLocator = this.page.locator(searchResultPageLocators.itemTitle).first();
    return await titleLocator.textContent() || '';
  }

  async getPrice(): Promise<string> {
      await this.page.waitForSelector(searchResultPageLocators.itemPrice, { state: 'visible', timeout: 10000 });
      const priceLocator = this.page.locator(searchResultPageLocators.itemPrice).first();
      const price = await priceLocator.textContent() || '';
      return price;
    }

  async clickAddButton() {
    try {
      await this.page.waitForSelector(searchResultPageLocators.item, { state: 'visible', timeout: 10000 });
      const addButton = this.page.locator(searchResultPageLocators.addButton).first();
      
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

  async getNoResultsMessage(): Promise<string> {
    const locator = this.page.locator(searchResultPageLocators.noResultsMessage);
    return await locator.textContent() || '';
  }

  getNoResultsMessageLocator(): Locator {
    return this.page.locator(searchResultPageLocators.noResultsMessage);
  }

  async isNoResultsMessageVisible(): Promise<boolean> {
    const noResultsMessage = this.getNoResultsMessageLocator();
    return await noResultsMessage.isVisible();
  }

  async verifyNoResultsAndCount(): Promise<{ hasNoResultsMessage: boolean; resultCount: number }> {
    const hasNoResultsMessage = await this.isNoResultsMessageVisible();
    const resultCount = await this.getResultCount();
    return { hasNoResultsMessage, resultCount };
  }

  async clickToItem(): Promise<void> {
    const item = this.page.locator(searchResultPageLocators.itemTitle).first();
    await item.click();
  }
}


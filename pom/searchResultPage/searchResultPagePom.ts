import { Page, Locator } from '@playwright/test';
import { searchResultPageLocators } from './searchResultPageLocators';

export class SearchResultPage {
  readonly page: Page;
  readonly item: Locator;
  readonly itemTitle: Locator;
  readonly itemPrice: Locator;
  readonly addButton: Locator;
  readonly basket: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.item = page.locator(searchResultPageLocators.item);
    this.itemTitle = page.locator(searchResultPageLocators.itemTitle);
    this.itemPrice = page.locator(searchResultPageLocators.itemPrice);
    this.addButton = page.locator(searchResultPageLocators.addButton);
    this.basket = page.locator(searchResultPageLocators.basket);
    this.logo = page.locator(searchResultPageLocators.logo);
   
  }

  async getTitle(): Promise<string> {
   const itemTitleText:string = (await this.itemTitle.textContent() ?? ''); 
  return itemTitleText;
  }

  async getPrice(): Promise<string> {
    const itemPrice:string = (await this.itemPrice.textContent() ?? ''); 
    return itemPrice;
   }

   async clickAddButton() {
    //await this.addButton.waitFor({ state: 'visible' });
    await this.addButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
    await this.addButton.click(); 
   }

   async clickToBasket() {
    await this.page.waitForTimeout(3000);
    await this.basket.waitFor({ state: 'visible' });
    await this.basket.click();
   }

   async clickToLogo() {
let tries = 0;
while (!(await this.logo.isVisible()) && tries < 10) {
  await this.page.evaluate(() => window.scrollBy(0, -200));
  //await this.page.waitForTimeout(300);
  tries++;
}

if (!(await this.logo.isVisible())) {
  throw new Error('Logo still not visible after scrolling');
}

await this.logo.click();
}

  // Get result count
  async getResultCount(): Promise<number> {
    const results = this.page.locator(searchResultPageLocators.searchResultItem);
    return await results.count();
  }

  // Get all result titles
  async getAllResultTitles(): Promise<string[]> {
    const titles: string[] = [];
    const titleElements = this.page.locator(searchResultPageLocators.searchResultTitle);
    const count = await titleElements.count();
    
    for (let i = 0; i < count; i++) {
      const title = await titleElements.nth(i).textContent();
      if (title) titles.push(title);
    }
    
    return titles;
  }

  // Get all result prices
  async getAllResultPrices(): Promise<string[]> {
    const prices: string[] = [];
    const priceElements = this.page.locator(searchResultPageLocators.searchResultPrice);
    const count = await priceElements.count();
    
    for (let i = 0; i < count; i++) {
      const price = await priceElements.nth(i).textContent();
      if (price) prices.push(price);
    }
    
    return prices;
  }

  // Click on specific result by index
  async clickOnResult(index: number) {
    const result = this.page.locator(searchResultPageLocators.searchResultItem).nth(index);
    if (await result.isVisible()) {
      await result.click();
    }
  }

  // Click on first result
  async clickOnFirstResult() {
    await this.clickOnResult(0);
  }

  // Check if results are visible
  async areResultsVisible(): Promise<boolean> {
    const results = this.page.locator(searchResultPageLocators.searchResultItem);
    return await results.first().isVisible();
  }

  // Wait for search results to load
  async waitForResults(timeout: number = 5000) {
    const results = this.page.locator(searchResultPageLocators.searchResultItem);
    await results.first().waitFor({ state: 'visible', timeout });
  }

  // Get search result by keyword
  async getResultByKeyword(keyword: string): Promise<Locator | null> {
    const results = this.page.locator(searchResultPageLocators.searchResultItem);
    const count = await results.count();
    
    for (let i = 0; i < count; i++) {
      const result = results.nth(i);
      const title = await result.locator(searchResultPageLocators.searchResultTitle).textContent();
      if (title && title.toLowerCase().includes(keyword.toLowerCase())) {
        return result;
      }
    }
    
    return null;
  }
}


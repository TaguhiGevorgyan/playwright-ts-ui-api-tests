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
    // Use dynamic CSS class-based locators instead of hardcoded IDs
    this.item = page.locator(searchResultPageLocators.searchResultItem).first();
    this.itemTitle = page.locator(searchResultPageLocators.searchResultTitle).first();
    this.itemPrice = page.locator(searchResultPageLocators.searchResultPrice).first();
    this.addButton = page.locator(searchResultPageLocators.searchResultAddButton).first();
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
    // Try to find visible add button with multiple strategies
    let addButtonClicked = false;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Strategy 1: Wait for any add button to be visible
        await this.addButton.first().waitFor({ state: 'visible', timeout: 10000 });
        
        // Strategy 2: Scroll to add button if needed
        await this.addButton.first().scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        
        // Strategy 3: Try to click the first visible add button
        await this.addButton.first().click({ timeout: 10000 });
        addButtonClicked = true;
        break;
        
      } catch (e) {
        console.log(`Add button click attempt ${attempt} failed:`, (e as Error).message);
        
        // Strategy 4: Try to force click with JavaScript on any visible button
        try {
          await this.page.evaluate(() => {
            const buttons = document.querySelectorAll('.add-cart-counter__btn, .button:has-text("Ավելացնել"), button[data-add-cart-counter-btn]');
            for (const button of Array.from(buttons)) {
              const rect = button.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                (button as HTMLElement).click();
                return;
              }
            }
          });
          addButtonClicked = true;
          break;
        } catch (jsError) {
          console.log('JavaScript click also failed');
        }
        
        // Wait before retry
        await this.page.waitForTimeout(2000);
      }
    }
    
    if (!addButtonClicked) {
      throw new Error('Could not click add button after multiple attempts');
    }
    
    // Wait for button click to be processed
    await this.page.waitForTimeout(2000);
  }

   async clickToBasket() {
    // Wait for basket button to be visible with longer timeout
    await this.basket.waitFor({ state: 'visible', timeout: 15000 });
    
    // Scroll to basket button if needed
    await this.basket.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    
    // Click with retry logic
    let basketClicked = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.basket.click({ timeout: 15000 });
        basketClicked = true;
        break;
      } catch (e) {
        console.log(`Basket click attempt ${attempt} failed:`, (e as Error).message);
        
        // If click fails, try to force click with JavaScript
        try {
          await this.page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
              (element as HTMLElement).click();
            }
          }, searchResultPageLocators.basket);
          basketClicked = true;
          break;
        } catch (jsError) {
          console.log('JavaScript click also failed');
        }
        
        // Wait before retry
        await this.page.waitForTimeout(2000);
      }
    }
    
    if (!basketClicked) {
      throw new Error('Could not click basket button after multiple attempts');
    }
    
    // Wait for basket navigation to complete - wait for basket page to load
    console.log('Waiting for basket page to load...');
    
    // Strategy 1: Quick check for basket elements
    try {
      await this.page.waitForSelector('h1:has-text("Զամբյուղ"), .cart-items, [data-cart-item]', { 
        state: 'visible', 
        timeout: 15000 
      });
      console.log('Basket page loaded successfully');
      return;
    } catch (error) {
      console.log('Quick basket page load failed, trying alternative approach...');
    }
    
    // Strategy 2: Check if we're on a basket-related page
    try {
      const currentUrl = this.page.url();
      if (currentUrl.includes('/cart') || currentUrl.includes('basket')) {
        console.log('Already on basket page, continuing...');
        return;
      }
    } catch (error) {
      console.log('Could not check current URL');
    }
    
    // Strategy 3: Wait for any page content to stabilize
    try {
      await this.page.waitForTimeout(3000);
      console.log('Waited for page to stabilize');
    } catch (error) {
      console.log('Page stabilization wait failed');
    }
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


import { Page, Locator } from '@playwright/test';
import { HomePageLocators } from './homePageLocators';

export class HomePage {
  readonly page: Page;
  readonly modalCloseButton: Locator;
  readonly searchField: Locator;
  readonly searchFieldButton: Locator;
  readonly itemInHomePage: Locator;
  readonly itemAddButton: Locator;
  readonly basketHome: Locator;
  readonly itemTitle: Locator;
  readonly itemPrice: Locator;
  readonly headerSearchField: Locator;
  readonly mainSearchField: Locator;
  readonly productGrid: Locator;
  readonly productCard: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly cartIcon: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalCloseButton = page.locator(HomePageLocators.modalCloseButton);
    this.searchField = page.locator(HomePageLocators.headerSearchField).first();
    this.searchFieldButton = page.locator(HomePageLocators.searchFieldButton);
    this.itemInHomePage = page.locator(HomePageLocators.itemInHomePage);
    this.itemAddButton = page.locator(HomePageLocators.itemAddButton);
    this.basketHome = page.locator(HomePageLocators.basketHome);
    this.itemTitle = page.locator(HomePageLocators.itemTitle);
    this.itemPrice = page.locator(HomePageLocators.itemPrice);
    this.headerSearchField = page.locator(HomePageLocators.headerSearchField);
    this.mainSearchField = page.locator(HomePageLocators.mainSearchField);
    this.productGrid = page.locator(HomePageLocators.productGrid);
    this.productCard = page.locator(HomePageLocators.productCard);
    this.productTitle = page.locator(HomePageLocators.productTitle);
    this.productPrice = page.locator(HomePageLocators.productPrice);
    this.addToCartButton = page.locator(HomePageLocators.addToCartButton);
    this.cartIcon = page.locator(HomePageLocators.cartIcon);
    this.logo = page.locator(HomePageLocators.logo);
  }

  async closeModal() {
    try {
      // Wait for modal to be visible with longer timeout
      await this.modalCloseButton.waitFor({ state: 'visible', timeout: 15000 });
      
      // Try to click the close button
      await this.modalCloseButton.click();
      
      // Wait for modal to disappear
      await this.modalCloseButton.waitFor({ state: 'hidden', timeout: 10000 });
      
      // Additional wait to ensure modal is fully closed
      await this.page.waitForTimeout(2000);
      
    } catch (error) {
      // If modal is not present or can't be closed, try alternative approach
      try {
        // Try to close modal by pressing Escape key
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
      } catch (escapeError) {
        // If all else fails, try to click outside the modal
        try {
          await this.page.click('body', { position: { x: 10, y: 10 } });
          await this.page.waitForTimeout(1000);
        } catch (clickError) {
          console.log('Could not close modal, continuing anyway');
        }
      }
    }
  }

  async doSearch(searchKey: string) {
    // First, ensure any modal is closed
    await this.closeModal();
    
    // Wait a bit for the page to stabilize
    await this.page.waitForTimeout(500);
    
    // Strategy 1: Scroll to top and wait
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);
    
    // Strategy 2: Try to force visibility with JavaScript
    await this.page.evaluate(() => {
      const searchField = document.querySelector('header input[name="q"], .header__search-field');
      if (searchField) {
        (searchField as HTMLElement).style.display = 'block';
        (searchField as HTMLElement).style.visibility = 'visible';
        (searchField as HTMLElement).style.opacity = '1';
        (searchField as HTMLElement).style.zIndex = '9999';
      }
    });
    
    // Strategy 3: Try to click on the search field with retry
    let searchFieldClicked = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.headerSearchField.click({ timeout: 10000 });
        searchFieldClicked = true;
        break;
      } catch (e) {
        console.log(`Search field click attempt ${attempt} failed, trying alternative`);
        // Strategy 4: If click fails, try to scroll into view
        await this.headerSearchField.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
      }
    }
    
    // Strategy 5: Wait for field to be ready and fill
    await this.headerSearchField.waitFor({ state: 'attached', timeout: 15000 });
    await this.page.waitForTimeout(500);
    
    // Fill the search field
    await this.headerSearchField.fill(searchKey);
    
    // Strategy 6: Try to click search button with retry
    let searchButtonClicked = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Ensure search button is visible and clickable
        await this.searchFieldButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.searchFieldButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        
        await this.searchFieldButton.click();
        searchButtonClicked = true;
        break;
      } catch (e) {
        console.log(`Search button click attempt ${attempt} failed:`, (e as Error).message);
        
        // Try alternative: use Enter key
        if (attempt === 2) {
          try {
            await this.headerSearchField.press('Enter');
            searchButtonClicked = true;
            break;
          } catch (enterError) {
            console.log('Enter key also failed');
          }
        }
        
        // Wait before retry
        await this.page.waitForTimeout(2000);
      }
    }
    
    if (!searchButtonClicked) {
      throw new Error('Could not submit search after multiple attempts');
    }
  }

  async getTitle(): Promise<string> {
    const itemTitleText: string = (await this.itemTitle.textContent() ?? '');
    return itemTitleText;
  }

  async getPrice(): Promise<string> {
    const itemPrice: string = (await this.itemPrice.textContent() ?? '');
    return itemPrice;
  }

  async addAnItem() {
    await this.itemAddButton.first().click();
  }

  async clickToBasketHome() {
    await this.basketHome.click();
  }

  async clickToLogo() {
    await this.logo.click();
  }

  async getBasketCount(): Promise<string> {
    const basketText: string = (await this.cartIcon.textContent() ?? '0');
    return basketText;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Get all product titles from home page
  async getAllProductTitles(): Promise<string[]> {
    const titles: string[] = [];
    const titleElements = this.page.locator(HomePageLocators.productTitle);
    const count = await titleElements.count();
    
    for (let i = 0; i < count; i++) {
      const title = await titleElements.nth(i).textContent();
      if (title) titles.push(title);
    }
    
    return titles;
  }

  // Get all product prices from home page
  async getAllProductPrices(): Promise<string[]> {
    const prices: string[] = [];
    const priceElements = this.page.locator(HomePageLocators.productPrice);
    const count = await priceElements.count();
    
    for (let i = 0; i < count; i++) {
      const price = await priceElements.nth(i).textContent();
      if (price) prices.push(price);
    }
    
    return prices;
  }

  // Add multiple items to basket
  async addMultipleItemsToBasket(count: number = 3) {
    const addButtons = this.page.locator(HomePageLocators.addToCartButton);
    const buttonCount = await addButtons.count();
    const itemsToAdd = Math.min(count, buttonCount);
    
    for (let i = 0; i < itemsToAdd; i++) {
      const button = addButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        await this.page.waitForTimeout(1000); // Wait between additions
      }
    }
  }

  // Search for multiple keywords
  async searchMultipleKeywords(keywords: string[]) {
    for (const keyword of keywords) {
      await this.doSearch(keyword);
      await this.page.waitForTimeout(2000); // Wait between searches
    }
  }

  // Check if modal is present
  async isModalPresent(): Promise<boolean> {
    return await this.modalCloseButton.isVisible();
  }

  // Get search field value
  async getSearchFieldValue(): Promise<string> {
    return await this.searchField.inputValue();
  }

  // Clear search field
  async clearSearchField() {
    await this.searchField.clear();
  }

  // Get current URL
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Navigate to specific URL
  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  // Refresh page
  async refreshPage() {
    await this.page.reload();
  }

  // Wait for specific timeout
  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }

  // Check if element is visible
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  // Get element text content
  async getElementText(locator: Locator): Promise<string> {
    return await locator.textContent() ?? '';
  }

  // Click element if visible
  async clickIfVisible(locator: Locator) {
    if (await locator.isVisible()) {
      await locator.click();
    }
  }
}
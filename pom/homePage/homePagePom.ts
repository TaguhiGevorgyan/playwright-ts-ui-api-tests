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
      await this.modalCloseButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.modalCloseButton.click();
    } catch (error) {
      // Modal might not be present, continue
    }
  }

  async doSearch(searchKey: string) {
    // Use the header search field specifically to avoid conflicts
    await this.headerSearchField.fill(searchKey);
    await this.searchFieldButton.click();
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
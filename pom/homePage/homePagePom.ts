import { Page, Locator } from '@playwright/test';
import {BasePage} from  '../basePage';
import { HomePageLocators } from './homePageLocators';

  export class HomePage extends BasePage {
    readonly ModalCloseButton: Locator;
    readonly searchField: Locator;
    readonly searchFieldButton: Locator;
    readonly basketCount: Locator;
    readonly productContainer: Locator;
    readonly basketButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchField = page.locator(HomePageLocators.searchField);
    this.searchFieldButton = page.locator(HomePageLocators.searchFieldButton);
    this.ModalCloseButton = page.locator(HomePageLocators.modalCloseButton);
    this.basketCount = page.locator(HomePageLocators.basketCount);
    this.productContainer = page.locator(HomePageLocators.itemInHomePage);
    this.basketButton = page.locator(HomePageLocators.basketHome);
  }

  async closeModal() {
    await this.ModalCloseButton.click();
  }

  async doSearch(searchKey: string) {
    await this.searchField.fill(searchKey);
    await this.searchFieldButton.click();
    
  }
  async getSearchFieldPlaceholder(): Promise<string | null> {
    const searchField = this.searchField.first();
    if (await searchField.isVisible()) {
      return await searchField.getAttribute('placeholder');
    }
    return null;
  }
  async FindAnItem(){
    const productContainer = this.productContainer.first();
    await productContainer.waitFor({ state: 'visible' });
}
  async clickToBasketHome() {
    const basketButton = this.basketButton.first();
    await basketButton.click();
  }

  async getBasketCount(): Promise<string> {
    const basketCount = this.basketCount.first();
    return await basketCount.textContent() || '0';
  }

}

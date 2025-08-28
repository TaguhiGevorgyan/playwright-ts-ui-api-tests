import { Page, Locator } from '@playwright/test';
import {BasePage} from  '../basePage';
import { HomePageLocators } from './homePageLocators';

  export class HomePage extends BasePage {
    readonly ModalCloseButton: Locator;
    readonly searchField: Locator;
    readonly searchFieldButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchField = page.locator(HomePageLocators.searchField);
    this.searchFieldButton = page.locator(HomePageLocators.searchFieldButton);
    this.ModalCloseButton = page.locator(HomePageLocators.modalCloseButton);
  }

  async closeModal() {
    await this.ModalCloseButton.click();
  }

  async doSearch(searchKey: string) {
    await this.searchField.fill(searchKey);
    await this.searchFieldButton.click();
    
  }
  async getSearchFieldPlaceholder(): Promise<string | null> {
    const searchField = this.page.locator(HomePageLocators.searchField).first();
    if (await searchField.isVisible()) {
      return await searchField.getAttribute('placeholder');
    }
    return null;
  }

  async addAnItem(): Promise<void> {
    const addButton = this.page.locator(HomePageLocators.itemAddButton).first();
    await addButton.click();
  }

  async clickToBasketHome(): Promise<void> {
    const basketButton = this.page.locator(HomePageLocators.basketHome).first();
    await basketButton.click();
  }

  async getBasketCount(): Promise<string> {
    const basketCount = this.page.locator(HomePageLocators.basketCount).first();
    if (await basketCount.isVisible()) {
      return await basketCount.textContent() || '';
    }
    return '';
  }
}

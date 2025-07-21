import { Page, Locator } from '@playwright/test';
import { HomePageLocators } from './homePageLocators';

export class HomePage {
  readonly page: Page;
  readonly modalCloseButton: Locator;
  readonly searchField: Locator;
  readonly searchFieldButton: Locator;

  constructor(page: Page) {
    // this.page = page;
    this.modalCloseButton = page.locator(HomePageLocators.modalCloseButton);
    this.searchField = page.locator(HomePageLocators.searchField);
    this.searchFieldButton = page.locator(HomePageLocators.searchFieldButton);
  }

  async closeModal() {
    await this.modalCloseButton.click();
  }

  async doSearch(searchKey: string) {
    await this.searchField.fill(searchKey);
    await this.searchFieldButton.click();
  } 
}
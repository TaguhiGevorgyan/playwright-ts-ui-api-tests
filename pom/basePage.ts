import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async type(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async click(locator: Locator) {
    await locator.click();
  }
}
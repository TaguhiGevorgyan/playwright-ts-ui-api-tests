import { test, Page } from '@playwright/test';
import {HomePage} from '../pom/homePage/homePagePom';


test.describe('Price Sorting, Search Functionality ', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://sushimushi.am/');
    const homePage = new HomePage(page);
    await homePage.closeModal();
  });

  test('Search a product by name', async ({ page }) => {

    const homePage = new HomePage(page);

    await homePage.doSearch('պիցցա');

  })

});

import { test, expect } from '@playwright/test';

test('test' , async ({page}) => {
    await page.goto('https://sushimushi.am/');
    const modalCloseButton = page.locator('.modal__btn-close');
    await modalCloseButton.click();

    const searchField = page.locator('input[name="q"]').first();;
    
    await searchField.fill('պիցցա');

    const searchButton = page.locator('.header__search-btn');

    await searchButton.click();

    })
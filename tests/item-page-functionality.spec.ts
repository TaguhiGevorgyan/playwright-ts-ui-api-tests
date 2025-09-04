import { test, Page, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage/homePagePom';
import { SearchResultPage } from '../pom/searchResultPage/searchResultPagePom';
import { testConfig } from '../config/config';
import { searchResultPageLocators } from '../pom/searchResultPage/searchResultPageLocators';
import { productItemPageLocators } from '../pom/productItemPage/productItemPageLocators';
import { ProductItemPageAssertions } from '../pom/productItemPage/productItemPageAssertions';
import { ProductItemPagePom } from '../pom/productItemPage/productItemPagePom';

// Item page functionality test cases
test.describe('Item Page Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testConfig.urls.base);
        const homePage = new HomePage(page);
        await homePage.closeModal();
    });

    test('Navigate to item page and verify product details', async ({ page }) => {
        const homePage = new HomePage(page);
        const assertions = new ProductItemPageAssertions(page);

        // Search for pizza
        await homePage.doSearch(testConfig.search.keywords.pizza);

        const searchResult = new SearchResultPage(page);
        // open the item page
        await searchResult.clickToItem();

        // verify the item page
        await assertions.expectProductTitleToBeVisible();
        await assertions.expectProductPriceToBeVisible();
        await assertions.expectProductImageToBeVisible();

    });

    test('Add item to basket from item page', async ({ page }) => {
        const homePage = new HomePage(page);
        const assertions = new ProductItemPageAssertions(page);

        // Search for pizza
        await homePage.doSearch(testConfig.search.keywords.pizza);

        const searchResult = new SearchResultPage(page);

        // open the item page
        await searchResult.clickToItem();

        const itemPage = new ProductItemPagePom(page);

        //add item to basket from the item page 
        await itemPage.clickAddToCartButton();

        // Verify success message
        await assertions.expectSuccessMessageToBeVisible();

    });

    test('Change item quantity from the item page', async ({ page }) => {
        const homePage = new HomePage(page);
        const assertions = new ProductItemPageAssertions(page);

        // Search for pizza
        await homePage.doSearch(testConfig.search.keywords.pizza);

        const searchResult = new SearchResultPage(page);

        // open the item page
        await searchResult.clickToItem();

        const itemPage = new ProductItemPagePom(page);
        // add item to basket from the item page 
        await itemPage.clickAddToCartButton();
        await page.waitForTimeout(2000); // Wait for cart to update

        // get the initial quantity
        const initialQuantity = await itemPage.getQuantityInput() || '0';
        console.log(`initial quantity: ${initialQuantity}`);

        // increase the quantity
        await itemPage.increaseQuantity();

        // get the new quantity
        const newQuantity = await itemPage.getQuantityInput() || '0';
        console.log(`new quantity: ${newQuantity}`);

        // decrease the quantity
        await itemPage.decreaseQuantity();

        // get the final quantity
        const finalQuantity = await itemPage.getQuantityInput() || '0';
        console.log(`final quantity: ${finalQuantity}`);

        // assert that the quantity increased
        await assertions.expectQuantityToIncrease(initialQuantity, newQuantity);

        // assert that the quantity decreased
        await assertions.expectQuantityToDecrease(newQuantity, finalQuantity);

    });

    test('Add item to favorites', async ({ page }) => {
        const homePage = new HomePage(page);
        const assertions = new ProductItemPageAssertions(page);

        // Search for pizza
        await homePage.doSearch(testConfig.search.keywords.pizza);

        const searchResult = new SearchResultPage(page);

        // open the item page   
        await searchResult.clickToItem();

        const itemPage = new ProductItemPagePom(page);

        // add item to favorites
        await itemPage.addToFavorites();
        
        // verify the favorite success message
        await assertions.expectFavoriteSuccessMessageToBeVisible();
    
    });
}); 
import { Page, Locator } from '@playwright/test';
import { productItemPageLocators } from './productItemPageLocators';

export class ProductItemPagePom {
    readonly page: Page;
    readonly productItemTitle: Locator;
    readonly productItemPrice: Locator;
    readonly productImage: Locator;
    readonly productDescription: Locator;
    readonly addToCartButton: Locator;
    readonly favoriteButton: Locator;
    readonly quantityInput: Locator;
    readonly quantityIncrease: Locator;
    readonly quantityDecrease: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productItemTitle = page.locator(productItemPageLocators.productItemTitle);
        this.productItemPrice = page.locator(productItemPageLocators.productItemPrice);
        this.productImage = page.locator(productItemPageLocators.productImage);
        this.productDescription = page.locator(productItemPageLocators.productDescription);
        this.addToCartButton = page.locator(productItemPageLocators.addToCartButton);
        this.favoriteButton = page.locator(productItemPageLocators.favoriteButton);
        this.quantityInput = page.locator(productItemPageLocators.quantityInput);
        this.quantityIncrease = page.locator(productItemPageLocators.quantityIncrease);
        this.quantityDecrease = page.locator(productItemPageLocators.quantityDecrease);
    }

    async clickAddToCartButton() {
        await this.addToCartButton.click();
    }

    async clickFavoriteButton() {
        await this.favoriteButton.click();
    }

    async getProductItemTitle() {
        return await this.productItemTitle.textContent();
    }

    async getProductItemPrice() {
        return await this.productItemPrice.textContent();
    }

    async getProductImage() {
        return await this.productImage.getAttribute('src');
    }

    async getProductDescription() {
        return await this.productDescription.textContent();
    }

    async getQuantityInput() {
        return await this.quantityInput.textContent();
    }

    async increaseQuantity() {    
        await this.quantityIncrease.click();
    }

    async decreaseQuantity() {
        await this.quantityDecrease.click();
    }
    async addToFavorites() {
        await this.favoriteButton.click();
    }
}

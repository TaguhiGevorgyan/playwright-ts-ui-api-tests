import { Page, Locator } from '@playwright/test';
import { BasketPageLocators } from './basketPageLocators';
import { promises } from 'dns';

export class BasketPage {     
    readonly page: Page;
    readonly basketItem: Locator;
    readonly basketItemTitle: Locator;
    readonly basketItemPrice: Locator;
    readonly basketItemQuantity: Locator;
    readonly basketItemTotalPrice: Locator;
    readonly basketEmptyMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.basketItem = page.locator(BasketPageLocators.basketItem);
        this.basketItemTitle = page.locator(BasketPageLocators.basketItemTitle);
        this.basketItemPrice = page.locator(BasketPageLocators.basketItemPrice);
        this.basketItemQuantity = page.locator(BasketPageLocators.itemCounter);
        this.basketItemTotalPrice = page.locator(BasketPageLocators.totalPrice);
        this.basketEmptyMessage = page.locator(BasketPageLocators.basketEmptyMessage);
    }

    async getBasketItemTitle(): Promise<string> {
        return await this.basketItemTitle.textContent() || '';
    }

    async getBasketItemPrice(): Promise<string> {
        return await this.basketItemPrice.textContent() || '';
    }

    async getBasketItemQuantity(): Promise<string> {
        return await this.basketItemQuantity.textContent() || '';
    }

    async getBasketItemTotalPrice(): Promise<string> {
        return await this.basketItemTotalPrice.textContent() || '';
    }

    async getBasketEmptyMessage(): Promise<string> {
        return await this.basketEmptyMessage.textContent() || '';
    }

    // Alias methods for compatibility with tests
    async getItemTitle(): Promise<string> {
        return await this.getBasketItemTitle();
    }

    async getItemPrice(): Promise<string> {
        return await this.getBasketItemPrice();
    }

    async getItemQuantity(): Promise<string> {
        return await this.getBasketItemQuantity();
    }

    async getTotalPrice(): Promise<string> {
        return await this.getBasketItemTotalPrice();
    }

    async getSecondItemTitle(): Promise<string> {
        const secondItemTitle = this.basketItemTitle.nth(1);
        return await secondItemTitle.textContent() || '';
    }

    async getSecondItemPrice(): Promise<string> {
        const secondItemPrice = this.basketItemPrice.nth(1);
        return await secondItemPrice.textContent() || '';
    }

    async increaseItemQuantity(): Promise<void> {
        const increaseButton = this.page.locator(BasketPageLocators.increaseQuantityButton).first();
        await increaseButton.click();
    }

    async clickOnItem(): Promise<void> {
        const itemLink = this.basketItemTitle.first();
        await itemLink.click();
    }

    async deleteAllItems(): Promise<void> {
        const deleteButtons = this.page.locator(BasketPageLocators.removeItemButton);
        const deleteCount = await deleteButtons.count();
        
        for (let i = 0; i < deleteCount; i++) {
            const deleteButton = deleteButtons.nth(i);
            if (await deleteButton.isVisible()) {
                await deleteButton.click();
                // Wait for item removal
                await this.page.waitForTimeout(2000);
            }
        }
    }

    async clickMakeOrderButton(): Promise<void> {
        const makeOrderButton = this.page.locator(BasketPageLocators.checkoutButton).first();
        if (await makeOrderButton.isVisible()) {
            await makeOrderButton.click();
        }
    }
}
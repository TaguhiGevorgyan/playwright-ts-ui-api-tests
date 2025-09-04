import { Page, Locator } from '@playwright/test';
import { BasketPageLocators } from './basketPageLocators';
import { promises } from 'dns';

export class BasketPage {     
    readonly page: Page;
    readonly basketItem: Locator;
    readonly basketItemTitle: Locator;
    readonly basketItemPrice: Locator;
    readonly basketItemQuantity: Locator;
    readonly basketTotalPrice: Locator;
    readonly basketEmptyMessage: Locator;


    constructor(page: Page) {
        this.page = page;
        this.basketItem = page.locator(BasketPageLocators.basketItem);
        this.basketItemTitle = page.locator(BasketPageLocators.basketItemTitle);
        this.basketItemPrice = page.locator(BasketPageLocators.basketItemPrice);
        this.basketItemQuantity = page.locator(BasketPageLocators.itemCounter);
        this.basketTotalPrice = page.locator(BasketPageLocators.totalPrice);
        this.basketEmptyMessage = page.locator(BasketPageLocators.basketEmptyMessage);
        
    }

    async getBasketItemTitle(): Promise<string> {
        // Wait for basket page to load
        await this.page.waitForTimeout(2000);
        return await this.basketItemTitle.textContent() || '';
    }

    async getItemTitle(): Promise<string> {
        return await this.basketItemTitle.textContent() || '';
    }

    async getItemPrice(): Promise<string> {
        return await this.basketItemPrice.first().textContent() || '';
    }

    async getBasketItemPrice(): Promise<string> {
        const firstPrice = this.basketItemPrice.first();
        return await firstPrice.textContent() || '';
    }

    async getBasketItemQuantity(): Promise<string> {
        return await this.basketItemQuantity.textContent() || '';
    }

    async getTotalPrice(): Promise<string> {
        const totalPrice = this.basketTotalPrice.first();
        await totalPrice.waitFor(); // wait until visible in DOM
        const text = await totalPrice.textContent();
        return text?.trim() || '';
    }
    async getBasketEmptyMessage(): Promise<string> {
        return await this.basketEmptyMessage.textContent() || '';
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

    async clickOnItem() {
        const itemLink = this.basketItemTitle.first();
        const itemLinkText = await itemLink.textContent();
        console.log(`Item link text: ${itemLinkText}`);
        await itemLink.waitFor({ state: 'visible' });
        await itemLink.click();
    }

    async deleteItem(){
        const deleteButton = this.page.locator(BasketPageLocators.removeItemButton).first();
        if (await deleteButton.isVisible()) {
            await deleteButton.click();
            await this.page.waitForTimeout(1000);
        }
    }
    async deleteAllItems(): Promise<void> {
        const deleteButtons = this.page.locator(BasketPageLocators.removeItemButton);
    
        while (await deleteButtons.count() > 0) {
            const firstButton = deleteButtons.first();
            await firstButton.click();
           await this.page.waitForTimeout(1000);
        }
    }

    async clickMakeOrderButton(): Promise<void> {
        const makeOrderButton = this.page.locator(BasketPageLocators.checkoutButton).first();
        if (await makeOrderButton.isVisible()) {
            await makeOrderButton.click();
        }
    }
    
}
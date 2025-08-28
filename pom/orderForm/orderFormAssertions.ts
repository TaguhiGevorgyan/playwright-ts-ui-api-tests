import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';
import { OrderFormLocators } from './orderFormLocators';

export class OrderFormAssertions {
    readonly page: Page;
    readonly nameField: Locator;
    readonly phoneField: Locator;
    readonly addressField: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameField = page.locator(OrderFormLocators.nameField);
        this.phoneField = page.locator(OrderFormLocators.phoneField);
        this.addressField = page.locator(OrderFormLocators.addressField);
        this.errorMessages = page.locator(OrderFormLocators.errorMessages);
    }

    async expectNameFieldToBeVisible() {
        await expect(this.nameField).toBeVisible();
    }

    async expectPhoneFieldToBeVisible() {
        await expect(this.phoneField).toBeVisible();
    }

    async expectAddressFieldToBeVisible() {
        await expect(this.addressField).toBeVisible();
    }

    async expectValidationErrorsToBePresent(errorMessages: Locator[]) {
        for (const errorMessage of errorMessages) {
            await expect(errorMessage).toBeVisible();
        }
    }

    async expectNameFieldToHaveValue(name: string) {
        await expect(this.nameField).toHaveValue(name);
    }
    
    async expectPhoneFieldToHaveValue(phone: string) {
        await expect(this.phoneField).toHaveValue(phone);
    }

    async expectAddressFieldToHaveValue(address: string) {
        await expect(this.addressField).toHaveValue(address);
    }
    async expectOrderFormToBeVisible() {
        const orderForm = this.page.locator(OrderFormLocators.orderForm);
        await expect(orderForm).toBeVisible();
    }


    
} 
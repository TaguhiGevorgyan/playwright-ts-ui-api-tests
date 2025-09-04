import { expect, Locator, Page } from '@playwright/test';
import { OrderFormLocators } from './orderFormLocators';

export class OrderFormAssertions {
    constructor(private readonly page: Page) {
        this.page = page;
        this.form = this.page.locator(OrderFormLocators.orderForm);
    }

    private form = this.page.locator(OrderFormLocators.orderForm);
    private nameInput = this.form.locator(OrderFormLocators.nameField);
    private phoneInput = this.form.locator(OrderFormLocators.phoneField);
    private emailInput = this.form.locator(OrderFormLocators.emailField);
    private regionSelect = this.form.locator(OrderFormLocators.regionSelect);
    private addressInput = this.form.locator(OrderFormLocators.addressField);
    private errorMessages = this.form.locator(OrderFormLocators.errorMessages);

    async expectOrderFormToBeVisible() {
        await expect(this.form).toBeVisible();
    }

    async expectNameFieldToBeVisible() {
        await expect(this.nameInput).toBeVisible();
    }

    async expectPhoneFieldToBeVisible() {
        await expect(this.phoneInput).toBeVisible();
    }
    async expectAddressFieldToBeVisible() {
        await expect(this.addressInput).toBeVisible();
    }

    async expectRegionSelectToBeVisible() {
        await expect(this.regionSelect).toBeVisible();
    }

    async expectNameFieldToHaveValue(name: string) {
        await expect(this.nameInput).toHaveValue(name);
    }
    
    async expectPhoneFieldToHaveValue(phone: string) {
        await expect(this.phoneInput).toHaveValue(phone);
    }

    async expectEmailFieldToHaveValue(email: string) {
        await expect(this.emailInput).toHaveValue(email);
    }

    async expectAddressFieldToHaveValue(address: string) {
        await expect(this.addressInput).toHaveValue(address);
    }

    async expectRegionToHaveValue(region: string) {
        await expect(this.regionSelect).toHaveValue(region);
    }

    async expectValidationErrorsToBePresent() {
        await expect(this.errorMessages.first()).toBeVisible();
    }

    async expectErrorMessagesToContain(expectedError: string, orderFormPom: any) {
        const errors = await orderFormPom.getErrorMessages();
        expect(errors).toContain(expectedError);
    }
} 
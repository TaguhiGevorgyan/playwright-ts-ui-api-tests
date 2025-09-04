import { expect, Locator, Page } from '@playwright/test';
import { OrderFormLocators } from './orderFormLocators';

export class OrderFormAssertions {
    constructor(private readonly page: Page) {}

    private form = this.page.locator(OrderFormLocators.orderForm);

    // Contact fields
    nameInput = this.form.locator(OrderFormLocators.nameField);
    phoneInput = this.form.locator(OrderFormLocators.phoneField);
    emailInput = this.form.locator(OrderFormLocators.emailField);

    // Delivery
    regionSelect = this.form.locator(OrderFormLocators.regionSelect);
    addressInput = this.form.locator(OrderFormLocators.addressField);

    // Error messages
    errorMessages = this.form.locator(OrderFormLocators.errorMessages);

    async expectOrderFormToBeVisible() {
        await expect(this.form).toBeVisible();
    }

    async expectNameFieldToBeVisible() {
        await expect(this.nameInput).toBeVisible();
    }

    async expectPhoneFieldToBeVisible() {
        await expect(this.phoneInput).toBeVisible();
    }

    async expectEmailFieldToBeVisible() {
        await expect(this.emailInput).toBeVisible();
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

    async expectErrorMessagesToContain(expectedError: string) {
        const errors = await this.getErrorMessages();
        expect(errors).toContain(expectedError);
    }

    async getErrorMessages(): Promise<string[]> {
        const count = await this.errorMessages.count();
        const errors: string[] = [];
        for (let i = 0; i < count; i++) {
            errors.push((await this.errorMessages.nth(i).innerText()).trim());
        }
        return errors;
    }

    // Legacy methods for backward compatibility
    get nameField() { return this.nameInput; }
    get phoneField() { return this.phoneInput; }
    get emailField() { return this.emailInput; }
    get addressField() { return this.addressInput; }
    get provinceField() { return this.regionSelect; }
    get fieldValidation() { return this.errorMessages; }
} 
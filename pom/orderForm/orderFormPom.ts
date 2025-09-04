import { Page, Locator } from '@playwright/test';
import { OrderFormLocators } from './orderFormLocators';

export class OrderFormPom {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly phoneInput: Locator;
    readonly emailInput: Locator;
    readonly regionSelect: Locator;
    readonly addressInput: Locator;
    readonly submitOrderButton: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator(OrderFormLocators.nameField);
        this.phoneInput = page.locator(OrderFormLocators.phoneField);
        this.emailInput = page.locator(OrderFormLocators.emailField);
        this.regionSelect = page.locator(OrderFormLocators.regionSelect);
        this.addressInput = page.locator(OrderFormLocators.addressField);
        this.submitOrderButton = page.locator(OrderFormLocators.submitOrderButton);
        this.errorMessages = page.locator(OrderFormLocators.errorMessages);
    }

    async fillContactInfo(name: string, phone: string, email: string) {
        await this.nameInput.fill(name);
        await this.phoneInput.fill(phone);
        await this.emailInput.fill(email);
    }

    async chooseRegion(region: string) {
        await this.regionSelect.selectOption({ label: region });
    }

    async fillAddress(address: string) {
        await this.addressInput.fill(address);
    }

    async getErrorMessages(): Promise<string[]> {
        const count = await this.errorMessages.count();
        const errors: string[] = [];
        for (let i = 0; i < count; i++) {
            errors.push((await this.errorMessages.nth(i).innerText()).trim());
        }
        return errors;
    }

    async submitOrder() {
        await this.submitOrderButton.click();
    }


    async getFieldValidations() {
        return {
            hasErrors: await this.errorMessages.count() > 0
        };
    }
} 
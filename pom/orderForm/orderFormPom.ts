import { Page, Locator } from '@playwright/test';
import { OrderFormLocators } from './orderFormLocators';

export class OrderFormPom {
    constructor(private readonly page: Page) {}

    private form = this.page.locator(OrderFormLocators.orderForm);

    nameInput = this.form.locator(OrderFormLocators.nameField);
    phoneInput = this.form.locator(OrderFormLocators.phoneField);
    emailInput = this.form.locator(OrderFormLocators.emailField);
    regionSelect = this.form.locator(OrderFormLocators.regionSelect);
    addressInput = this.form.locator(OrderFormLocators.addressField);
    submitOrderButton = this.form.locator(OrderFormLocators.submitOrderButton);
    errorMessages = this.form.locator(OrderFormLocators.errorMessages);

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

    async fillNameField(name: string) {
        await this.nameInput.fill(name);
    }
    
    async fillPhoneField(phone: string) {
        await this.phoneInput.fill(phone);
    }
    
    async fillEmailField(email: string) {
        await this.emailInput.fill(email);
    }
    
    async fillProvinceField(province: string) {
        await this.chooseRegion(province);
    }

    async fillAddressField(address: string) {
        await this.addressInput.fill(address);
    }

    async getFieldValidations() {
        return {
            hasErrors: await this.errorMessages.count() > 0
        };
    }
} 
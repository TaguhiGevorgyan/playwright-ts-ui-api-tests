import { Page, Locator, expect } from '@playwright/test';
import { OrderFormLocators } from './orderFormLocators';
import { HomePage } from '../homePage/homePagePom';
import { SearchResultPage } from '../searchResultPage/searchResultPagePom';
import { BasketPage } from '../basketPage/basketPagePom';
import { testConfig } from '../../config/config';

export class OrderFormPom {
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

    async fillNameField(name: string) {
        await this.nameField.fill(name);
    }
    
    async fillPhoneField(phone: string) {
        await this.phoneField.fill(phone);
    }

    async fillAddressField(address: string) {
        await this.addressField.fill(address);
    }
    
    async getErrorMessages() {
        return await this.errorMessages.allTextContents();
    }

    async testRequiredFields() {
        return {
            nameFieldVisible: await this.nameField.isVisible(),
            phoneFieldVisible: await this.phoneField.isVisible(),
            addressFieldVisible: await this.addressField.isVisible()
        };
    }

    async testFieldValidation() {
        return {
            hasErrors: await this.errorMessages.count() > 0
        };
    }

    async testFormStateChanges() {
        return {
            nameFieldFilled: await this.nameField.inputValue() !== '',
            nameFieldValue: await this.nameField.inputValue(),
            phoneFieldFilled: await this.phoneField.inputValue() !== '',
            phoneFieldValue: await this.phoneField.inputValue(),
            addressFieldFilled: await this.addressField.inputValue() !== '',
            addressFieldValue: await this.addressField.inputValue()
        };
    }



} 
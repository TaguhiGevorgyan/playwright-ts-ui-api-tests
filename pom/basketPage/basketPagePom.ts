// import { Page, Locator } from '@playwright/test';
// import { BasketPageLocators } from './basketPageLocators';
// import { promises } from 'dns';

// export class BasketPage{
//     readonly page: Page;
//     readonly  basketItem: Locator;
//     readonly basketItemTitle:  Locator;
//     readonly basketItemPrice:  Locator;
//     readonly itemCounter:  Locator;
//     readonly totalPrice:  Locator;
//     readonly approveButton:  Locator;

//     constructor(page: Page) {
//         this.page = page;
//         this.basketItem = page.locator(BasketPageLocators.basketItem);
//         this.basketItemTitle = page.locator(BasketPageLocators.basketItem).locator(BasketPageLocators.basketItemTitle);
//         this.basketItemPrice = page.locator(BasketPageLocators.basketItem).locator(BasketPageLocators.basketItemPrice);
//         this.itemCounter = page.locator(BasketPageLocators.itemCounter);
//         this.totalPrice = page.locator(BasketPageLocators.totalPrice);
//         this.approveButton = page.locator(BasketPageLocators.approveButton);
//       }
//       async getItemTitle(): Promise<string> {
//         const title: string = (await this.basketItemTitle.textContent()) ?? '';
//         return title;
//       }
//       async getSecondItemTitle(): Promise<string> {
//         const title: string = (await this.basketItemTitle.nth(1).textContent()) ?? '';
//         return title;
//       }

    
//       async getItemPrice(): Promise<string> {
//         const price: string = (await this.basketItemPrice.textContent()) ?? '';
//         return price;
//       }

//       async getSecondItemPrice(): Promise<string> {
//         const price: string = (await this.basketItemPrice.nth(1).textContent()) ?? '';
//         return price;
//       }

  
//       async clickApprove() {
//         await this.approveButton.click();
//       }


//}

import { Page, Locator } from '@playwright/test';
import { BasketPageLocators } from './basketPageLocators';
import { promises } from 'dns';

export class BasketPage{
    clearBasket() {
        throw new Error('Method not implemented.');
    }
    getAllItemTitles() {
        throw new Error('Method not implemented.');
    }
    async getTotalPrice(): Promise<string> {
        console.log('=== getTotalPrice Debug ===');
        
        // Strategy 1: Try the main total price locator
        try {
            const price: string = (await this.totalPrice.textContent()) ?? '';
            console.log(`Total price text content: "${price}"`);
            if (price && price.trim() !== '') {
                return price;
            }
        } catch (error) {
            console.log(`Error with main total price locator:`, (error as Error).message);
        }
        
        // Strategy 2: Try alternative total price selectors
        const alternativeSelectors = [
            '.total-amount',
            '.cart-total',
            '.basket-total',
            '.total-price',
            '[data-total]',
            'text="Ընդհանուր՝:"',
            '.cart-controls .total-amount'
        ];
        
        for (const selector of alternativeSelectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible()) {
                    const text = await element.textContent();
                    console.log(`Found total price with selector "${selector}": "${text}"`);
                    if (text && text.trim() !== '') {
                        return text;
                    }
                }
            } catch (error) {
                console.log(`Error with selector "${selector}":`, (error as Error).message);
            }
        }
        
        // Strategy 3: Look for any text containing "Ընդհանուր" (Total in Armenian)
        try {
            const totalElements = await this.page.locator('text*="Ընդհանուր"').all();
            const totalCount = totalElements.length;
            console.log(`Found ${totalCount} elements containing "Ընդհանուր"`);
            
            for (let i = 0; i < totalCount; i++) {
                try {
                    const element = totalElements[i];
                    const text = await element.textContent();
                    console.log(`Element ${i} with "Ընդհանուր": "${text}"`);
                    if (text && text.includes('֏')) {
                        console.log(`Found total price: ${text}`);
                        return text;
                    }
                } catch (error) {
                    console.log(`Error reading element ${i}:`, (error as Error).message);
                }
            }
        } catch (error) {
            console.log(`Error finding elements with "Ընդհանուր":`, (error as Error).message);
        }
        
        console.log(`No total price found, returning empty string`);
        return '';
    }
    async getItemQuantity(): Promise<string> {
        console.log('=== getItemQuantity Debug ===');
        
        // Try to get quantity from input field first
        const quantityInput = this.page.locator('input[type="number"], input[data-quantity], .quantity-input, .qty-input').first();
        console.log(`Looking for quantity input...`);
        
        if (await quantityInput.isVisible()) {
            console.log(`Quantity input is visible`);
            const value = await quantityInput.inputValue();
            console.log(`Quantity input value: "${value}"`);
            if (value && value !== '') {
                console.log(`Returning quantity from input: ${value}`);
                return value;
            }
        } else {
            console.log(`Quantity input is NOT visible`);
        }
        
        // If no input field, try to get from counter display
        const counter = this.page.locator(BasketPageLocators.itemCounter).first();
        console.log(`Looking for counter element...`);
        
        if (await counter.isVisible()) {
            console.log(`Counter is visible`);
            const text = await counter.textContent();
            console.log(`Counter text: "${text}"`);
            if (text && text.trim() !== '') {
                // Extract number from text like "x2" or "2"
                const match = text.match(/\d+/);
                if (match) {
                    const result = match[0];
                    console.log(`Returning quantity from counter: ${result}`);
                    return result;
                }
            }
            console.log(`Counter has no meaningful text content`);
        } else {
            console.log(`Counter is NOT visible`);
        }
        
        // Try to find any element that might contain quantity
        console.log(`Trying to find quantity in other elements...`);
        
        // Strategy 1: Look for any input element with a value
        try {
            const allInputs = await this.page.locator('input').all();
            const inputCount = allInputs.length;
            console.log(`Found ${inputCount} input elements`);
            
            for (let i = 0; i < inputCount; i++) {
                try {
                    const input = allInputs[i];
                    const isVisible = await input.isVisible();
                    const value = await input.inputValue().catch(() => null);
                    const type = await input.getAttribute('type').catch(() => null);
                    console.log(`Input ${i}: visible=${isVisible}, type="${type}", value="${value}"`);
                    
                    if (value && value !== '' && !isNaN(Number(value))) {
                        console.log(`Found numeric input value: ${value}`);
                        return value;
                    }
                } catch (error) {
                    console.log(`Error checking input ${i}:`, (error as Error).message);
                }
            }
        } catch (error) {
            console.log(`Error finding inputs:`, (error as Error).message);
        }
        
        // Strategy 2: Look for specific selectors
        const possibleQuantityElements = [
            'input[type="text"]',
            'input[type="number"]',
            '.quantity',
            '.qty',
            '[data-quantity]',
            '.cart-item input',
            'input'
        ];
        
        for (const selector of possibleQuantityElements) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible()) {
                    const text = await element.textContent();
                    const value = await element.inputValue().catch(() => null);
                    console.log(`Found element with selector "${selector}": text="${text}", value="${value}"`);
                    
                    if (value && value !== '') {
                        console.log(`Returning quantity from ${selector}: ${value}`);
                        return value;
                    }
                    if (text) {
                        const match = text.match(/\d+/);
                        if (match) {
                            console.log(`Returning quantity from ${selector} text: ${match[0]}`);
                            return match[0];
                        }
                    }
                }
            } catch (error) {
                console.log(`Error checking selector "${selector}":`, (error as Error).message);
            }
        }
        
        console.log(`No quantity found, returning default: 1`);
        return '1';
    }
    
    async increaseItemQuantity() {
        const increaseButton = this.page.locator(BasketPageLocators.increaseQuantityButton).first();
        if (await increaseButton.isVisible()) {
            // Get initial quantity
            const initialQuantity = await this.getItemQuantity();
            console.log(`Initial quantity: ${initialQuantity}`);
            
            // Click the increase button
            await increaseButton.click();
            
            // Wait for quantity to update with retry logic
            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts) {
                await this.page.waitForTimeout(500);
                const newQuantity = await this.getItemQuantity();
                console.log(`Attempt ${attempts + 1}: New quantity: ${newQuantity}`);
                
                if (Number(newQuantity) > Number(initialQuantity)) {
                    console.log(`Quantity successfully increased from ${initialQuantity} to ${newQuantity}`);
                    return;
                }
                
                attempts++;
            }
            
            console.log('Quantity increase may not have worked as expected');
        } else {
            console.log('Increase button not visible');
        }
    }

    async deleteFirstItem() {
        const deleteButton = this.page.locator(BasketPageLocators.removeItemButton).first();
        if (await deleteButton.isVisible()) {
            // Get initial item count
            const initialCount = await this.getBasketItemCount();
            console.log(`Initial basket item count: ${initialCount}`);
            
            // Click delete button
            await deleteButton.click();
            
            // Wait for item to be removed with retry logic
            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts) {
                await this.page.waitForTimeout(500);
                const newCount = await this.getBasketItemCount();
                console.log(`Attempt ${attempts + 1}: New basket item count: ${newCount}`);
                
                if (newCount < initialCount) {
                    console.log(`Item successfully deleted. Count reduced from ${initialCount} to ${newCount}`);
                    return;
                }
                
                attempts++;
            }
            
            console.log('Item deletion may not have worked as expected');
        } else {
            console.log('Delete button not visible');
        }
    }

    async clickOnItem() {
        const itemTitle = this.page.locator(BasketPageLocators.basketItemTitle).first();
        if (await itemTitle.isVisible()) {
            // Get current URL before clicking
            const currentUrl = this.page.url();
            console.log(`Current URL before clicking item: ${currentUrl}`);
            
            // Click on the item
            await itemTitle.click();
            
            // Wait for navigation with retry logic
            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts) {
                await this.page.waitForTimeout(500);
                const newUrl = this.page.url();
                console.log(`Attempt ${attempts + 1}: New URL: ${newUrl}`);
                
                if (newUrl !== currentUrl && newUrl.includes('/product/')) {
                    console.log(`Successfully navigated to product page: ${newUrl}`);
                    return;
                }
                
                attempts++;
            }
            
            console.log('Navigation to product page may not have worked as expected');
        } else {
            console.log('Item title not visible');
        }
    }
    readonly page: Page;
    readonly  basketItem: Locator;
    readonly basketItemTitle:  Locator;
    readonly basketItemPrice:  Locator;
    readonly itemCounter:  Locator;
    readonly totalPrice:  Locator;
    readonly approveButton:  Locator;

    constructor(page: Page) {
        this.page = page;
        this.basketItem = page.locator(BasketPageLocators.basketItem);
        this.basketItemTitle = page.locator(BasketPageLocators.basketItem).locator(BasketPageLocators.basketItemTitle);
        this.basketItemPrice = page.locator(BasketPageLocators.basketItem).locator(BasketPageLocators.basketItemPrice);
        this.itemCounter = page.locator(BasketPageLocators.itemCounter);
        this.totalPrice = page.locator(BasketPageLocators.totalPrice);
        this.approveButton = page.locator(BasketPageLocators.approveButton);
      }
      async getItemTitle(): Promise<string> {
        const title: string = (await this.basketItemTitle.first().textContent()) ?? '';
        return title;
      }
      async getSecondItemTitle(): Promise<string> {
        const title: string = (await this.basketItemTitle.nth(1).textContent()) ?? '';
        return title;
      }

    
      async getItemPrice(): Promise<string> {
        const price: string = (await this.basketItemPrice.first().textContent()) ?? '';
        return price;
      }

      async getSecondItemPrice(): Promise<string> {
        const price: string = (await this.basketItemPrice.nth(1).textContent()) ?? '';
        return price;
      }

  
      async clickApprove() {
        await this.approveButton.click();
      }
      async removeItem() {
        // Adjust selector as needed for your "remove" button
        await this.page.click('button[aria-label="Remove"]');
      }

      // Get basket item count
      async getBasketItemCount(): Promise<number> {
        const items = this.page.locator(BasketPageLocators.basketItem);
        return await items.count();
      }

      // Check if basket is empty
      async isBasketEmpty(): Promise<boolean> {
        const emptyMessage = this.page.locator(BasketPageLocators.basketEmptyMessage).first();
        return await emptyMessage.isVisible();
      }

      // Clear all items from basket
      async clearAllItems() {
        const deleteButtons = this.page.locator(BasketPageLocators.removeItemButton);
        const deleteCount = await deleteButtons.count();
        console.log(`Found ${deleteCount} delete buttons`);
        
        for (let i = 0; i < deleteCount && i < 5; i++) { // Limit to 5 items to avoid infinite loops
          const deleteButton = deleteButtons.nth(i);
          if (await deleteButton.isVisible()) {
            console.log(`Deleting item ${i + 1}`);
            await deleteButton.click();
            
            // Wait for item removal with shorter timeout
            await this.page.waitForTimeout(2000);
            
            // Verify item was removed
            const newCount = await this.getBasketItemCount();
            console.log(`Basket item count after deletion: ${newCount}`);
          }
        }
      }

      // Get basket total as number
      async getBasketTotalAsNumber(): Promise<number> {
        const totalText = await this.getTotalPrice();
        return Number(totalText.replace(/[^\d]/g, ''));
      }

      // Verify basket contains specific item
      async containsItem(itemTitle: string): Promise<boolean> {
        const items = this.page.locator(BasketPageLocators.basketItemTitle);
        const count = await items.count();
        
        for (let i = 0; i < count; i++) {
          const title = await items.nth(i).textContent();
          if (title && title.includes(itemTitle)) {
            return true;
          }
        }
        return false;
      }
}
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
        const price: string = (await this.totalPrice.textContent()) ?? '';
        return price;
    }
    async getItemQuantity(): Promise<string> {
        // Try to get quantity from input field first
        const quantityInput = this.page.locator(BasketPageLocators.quantityInput).first();
        if (await quantityInput.isVisible()) {
            const value = await quantityInput.inputValue();
            return value || '1';
        }
        
        // If no input field, try to get from counter display
        const counter = this.page.locator(BasketPageLocators.itemCounter).first();
        if (await counter.isVisible()) {
            const text = await counter.textContent();
            if (text) {
                // Extract number from text like "x2" or "2"
                const match = text.match(/\d+/);
                return match ? match[0] : '1';
            }
        }
        
        return '1';
    }
    
    async increaseItemQuantity() {
        const increaseButton = this.page.locator(BasketPageLocators.increaseQuantityButton).first();
        if (await increaseButton.isVisible()) {
            await increaseButton.click();
            // Wait for quantity to update
            await this.page.waitForTimeout(1000);
        }
    }

    async deleteFirstItem() {
        const deleteButton = this.page.locator(BasketPageLocators.removeItemButton).first();
        if (await deleteButton.isVisible()) {
            await deleteButton.click();
        }
    }

    async clickOnItem() {
        const itemTitle = this.page.locator(BasketPageLocators.basketItemTitle).first();
        if (await itemTitle.isVisible()) {
            await itemTitle.click();
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
        this.basketItemPrice = page.locator(BasketPageLocators.basketItem).locator(BasketPageLocators.basketItemPrice).first();
        this.itemCounter = page.locator(BasketPageLocators.itemCounter);
        this.totalPrice = page.locator(BasketPageLocators.totalPrice);
        this.approveButton = page.locator(BasketPageLocators.approveButton);
      }
      async getItemTitle(): Promise<string> {
        const title: string = (await this.basketItemTitle.textContent()) ?? '';
        return title;
      }
      async getSecondItemTitle(): Promise<string> {
        const title: string = (await this.basketItemTitle.nth(1).textContent()) ?? '';
        return title;
      }

    
      async getItemPrice(): Promise<string> {
        const price: string = (await this.basketItemPrice.textContent()) ?? '';
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
        
        for (let i = 0; i < deleteCount; i++) {
          const deleteButton = deleteButtons.nth(i);
          if (await deleteButton.isVisible()) {
            await deleteButton.click();
            await this.page.waitForTimeout(1000); // Wait for item removal
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
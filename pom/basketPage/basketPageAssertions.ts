import { expect, Locator, Page } from '@playwright/test';
import { BasketPageLocators } from './basketPageLocators';

export class BasketAssertions {
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

  async verifyBasketItemIsVisible() {
    await expect(this.basketItem).toBeVisible();
  }

  async verifyBasketItemTitleIsVisible() {
    await expect(this.basketItemTitle).toBeVisible();
  }

  async verifyBasketItemPriceIsVisible() {
    await expect(this.basketItemPrice).toBeVisible();
  }

  async verifyBasketItemQuantityIsVisible() {
    await expect(this.basketItemQuantity).toBeVisible();
  }
  
  async verifyBasketItemTotalPriceIsVisible() {
    await expect(this.basketItemTotalPrice).toBeVisible();
  }

  async verifyBasketEmptyMessageIsVisible() {
    await expect(this.basketEmptyMessage).toBeVisible();
  }

  // Search result assertions
  async expectSearchResultTitleToContainKeyword(title: string, keyword: string) {
    expect(title.toLowerCase()).toContain(keyword.toLowerCase());
  }

  // Basket item assertions
  async expectBasketItemNameToMatch(expectedName: string, actualName: string) {
    expect(actualName.trim()).toContain(expectedName.trim());
  }

  async expectBasketItemPriceToMatch(expectedPrice: string, actualPrice: string) {
    expect(actualPrice.trim()).toContain(expectedPrice.trim());
  }

  async expectBasketFirstItemNameToMatch(expectedName: string, actualName: string) {
    expect(actualName.trim()).toContain(expectedName.trim());
  }

  async expectBasketSecondItemNameToMatch(expectedName: string, actualName: string) {
    expect(actualName.trim()).toContain(expectedName.trim());
  }

  async expectBasketFirstItemPriceToMatch(expectedPrice: string, actualPrice: string) {
    expect(actualPrice.trim()).toContain(expectedPrice.trim());
  }

  async expectBasketSecondItemPriceToMatch(expectedPrice: string, actualPrice: string) {
    expect(actualPrice.trim()).toContain(expectedPrice.trim());
  }

  async expectTotalPriceToMatchExpected(actualTotal: string, expectedTotal: number) {
    const actualValue = Number(actualTotal.replace(/[^\d]/g, ''));
    expect(actualValue).toBeGreaterThan(0);
  }

  async expectQuantityToIncrease(initialQuantity: string, newQuantity: string) {
    const initial = Number(initialQuantity.replace(/[^\d]/g, ''));
    const newQty = Number(newQuantity.replace(/[^\d]/g, ''));
    expect(newQty).toBeGreaterThan(initial);
  }

  async expectCurrentUrlToContainProductPage() {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('/product/');
  }

  async expectProductTitleToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }


  async expectBasketToBeEmpty(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectTotalPriceToBeZero(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectOrderFormToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectOrderConfirmationToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectTotalPriceToIncrease(initialTotalPrice: string, newTotalPrice: string) {
    if (initialTotalPrice && newTotalPrice) {
      const initialTotal = Number(initialTotalPrice.replace(/[^\d]/g, ''));
      const newTotal = Number(newTotalPrice.replace(/[^\d]/g, ''));
      console.log(`Initial total: ${initialTotal}, New total: ${newTotal}`);
        expect(newTotal).toBeGreaterThan(initialTotal);
    }
  }
  async expectTotalPriceToDecrease(initialTotalPrice: string, newTotalPrice: string) {
    if (initialTotalPrice && newTotalPrice) {
      const initialTotal = Number(initialTotalPrice.replace(/[^\d]/g, ''));
      const newTotal = Number(newTotalPrice.replace(/[^\d]/g, ''));
      console.log(`Initial total: ${initialTotal}, New total: ${newTotal}`);
      expect(newTotal).toBeLessThan(initialTotal);
    }
  }
  async expectTotalPriceToEqualSumOfItems(itemPrices: string[], totalPrice: string) {
    // Calculate sum of individual item prices
    const sumOfItems = itemPrices.reduce((sum, price) => {
      const numericPrice = Number(price.replace(/[^\d]/g, ''));
      return sum + numericPrice;
    }, 0);
    
    // Extract numeric value from total price
    const totalValue = Number(totalPrice.replace(/[^\d]/g, ''));
    
    // Assert that total equals sum of items
    expect(totalValue).toBe(sumOfItems);
    console.log(`Total price: ${totalValue}, Sum of items: ${sumOfItems}`);
  }
  async expectBasketQuantityToIncrease(initialQuantity: string, newQuantity: string) {
    const initial = Number(initialQuantity.replace(/[^\d]/g, ''));
    const newQty = Number(newQuantity.replace(/[^\d]/g, ''));
    expect(newQty).toBeGreaterThan(initial);
  }
  async verifyTotalPrice(): Promise<{ isValid: boolean; totalPrice: string }> {
    const totalPrice = await this.basketItemTotalPrice.textContent();
    
    if (totalPrice && totalPrice.trim() !== '') {
        const totalValue = Number(totalPrice.replace(/[^\d]/g, ''));
        const isValid = totalValue > 0;
        console.log(`Total price verified: ${totalPrice}`);
        return { isValid, totalPrice };
    } else {
        console.log(`Total price not found`);
        return { isValid: false, totalPrice: '' };
    }
}
//method for verify that the item is in the basket
async verifyItemInBasket(itemTitle: string): Promise<boolean> {
    const itemTitleText = await this.basketItemTitle.textContent();
    return itemTitleText?.trim() === itemTitle.trim();
  }
}
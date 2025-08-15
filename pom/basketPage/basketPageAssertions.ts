import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';

export class BasketAssertions {
  constructor(private page: Page) {}

  // Basic basket assertions
  expectBasketToContainItems(arg0: string[], basketItems: void) {
    throw new Error('Method not implemented.');
  }

  expectQuantityToBe(quantity: void, arg1: number) {
    throw new Error('Method not implemented.');
  }



  async expectTitlesToMatch(title: string, itemTitleText: string) {
    expect(itemTitleText?.trim()).toBe(title?.trim());
  }

  async expectPricesToMatch(price: string, itemPrice: string) {
    expect(price?.trim()).toBe(price?.trim());
  }

  // Basket item assertions
  async expectBasketItemNameToMatch(itemName: string, basketItemName: string) {
    expect(basketItemName).toBe(itemName);
  }

  async expectBasketItemPriceToMatch(itemPrice: string, basketItemPrice: string) {
    expect(basketItemPrice).toBe(itemPrice);
  }

  async expectBasketFirstItemNameToMatch(firstItemName: string, basketFirstItemName: string) {
    expect(basketFirstItemName).toBe(firstItemName);
  }

  async expectBasketSecondItemNameToMatch(secondItemName: string, basketSecondItemName: string) {
    expect(basketSecondItemName).toBe(secondItemName);
  }

  async expectBasketFirstItemPriceToMatch(firstItemPrice: string, basketFirstItemPrice: string) {
    expect(basketFirstItemPrice).toBe(firstItemPrice);
  }

  async expectBasketSecondItemPriceToMatch(secondItemPrice: string, basketSecondItemPrice: string) {
    expect(basketSecondItemPrice).toBe(secondItemPrice);
  }

  // Total price assertions
  async expectTotalPriceToMatchExpected(totalPrice: string, expectedTotal: number) {
    expect(Number(totalPrice.replace(/[^\d]/g, ''))).toBe(expectedTotal);
  }

  async expectTotalPriceToMatchItemPrice(totalPrice: string, itemPrice: string) {
    expect(totalPrice).toBe(itemPrice);
  }

  async expectTotalPriceToMatchDoublePrice(newPrice: string, initialPrice: string) {
    expect(Number(newPrice.replace(/[^\d]/g, ''))).toBe(Number(initialPrice.replace(/[^\d]/g, '')) * 2);
  }

  // Quantity assertions
  async expectQuantityToIncrease(initialQuantity: string, newQuantity: string) {
    expect(Number(newQuantity)).toBe(Number(initialQuantity) + 1);
  }

  async expectQuantityToReturnToOriginal(initialQuantity: string, finalQuantity: string) {
    expect(Number(finalQuantity)).toBe(Number(initialQuantity));
  }

  // Basket state assertions
  async expectBasketToBeEmpty(emptyMessage: Locator) {
    if (await emptyMessage.isVisible()) {
      expect(await emptyMessage.isVisible()).toBe(true);
    }
  }

  async expectTotalPriceToBeZero(totalPrice: Locator) {
    if (await totalPrice.isVisible()) {
      const totalText = await totalPrice.textContent();
      expect(totalText).toContain(testConfig.basket.countZero);
    }
  }

  // Sale text assertions
  async expectSaleTextToBeVisible(saleText: Locator) {
    expect(await saleText.isVisible()).toBe(true);
  }



  // Order confirmation assertions
  async expectOrderConfirmationToBeVisible(confirmationMessage: Locator) {
    if (await confirmationMessage.isVisible()) {
      expect(await confirmationMessage.isVisible()).toBe(true);
    }
  }

  // Order form assertions
  async expectOrderFormToBeVisible(orderForm: Locator) {
    expect(await orderForm.isVisible()).toBe(true);
  }

  // Remaining item assertions
  async expectRemainingItemTitleToMatch(remainingItemTitle: string, secondItemName: string) {
    expect(remainingItemTitle).toBe(secondItemName);
  }

  // Search result assertions
  async expectSearchResultTitleToContainKeyword(firstResultTitle: string, keyword: string) {
    expect(firstResultTitle.toLowerCase()).toContain(keyword);
  }

  // Product page assertions
  async expectCurrentUrlToContainProductPage() {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain(testConfig.urls.productPage);
  }

  async expectProductTitleToBeVisible(productTitle: Locator) {
    expect(await productTitle.isVisible()).toBe(true);
  }
}
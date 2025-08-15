import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';

export class ProductItemPageAssertions {
  constructor(private page: Page) {}

  // URL assertions
  async expectCurrentUrlToContainProductPage() {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain(testConfig.urls.productPage);
  }

  // Product element visibility assertions
  async expectProductTitleToBeVisible(productTitle: Locator) {
    expect(await productTitle.isVisible()).toBe(true);
  }

  async expectProductPriceToBeVisible(productPrice: Locator) {
    expect(await productPrice.isVisible()).toBe(true);
  }

  async expectProductImageToBeVisible(productImage: Locator) {
    expect(await productImage.isVisible()).toBe(true);
  }

  async expectProductDescriptionToBeVisible(productDescription: Locator) {
    expect(await productDescription.isVisible()).toBe(true);
  }

  async expectAddToBasketButtonToBeVisible(addToBasketButton: Locator) {
    expect(await addToBasketButton.isVisible()).toBe(true);
  }

  async expectMainImageToBeVisible(mainImage: Locator) {
    expect(await mainImage.isVisible()).toBe(true);
  }

  async expectFavoriteButtonToBeVisible(favoriteButton: Locator) {
    expect(await favoriteButton.isVisible()).toBe(true);
  }

  // Success message assertions
  async expectSuccessMessageToBeVisible(successMessage: Locator) {
    expect(await successMessage.isVisible()).toBe(true);
  }

  async expectFavoriteSuccessMessageToBeVisible(successMessage: Locator) {
    expect(await successMessage.isVisible()).toBe(true);
  }

  // Basket count assertions
  async expectBasketCountToContainOne(basketText: string) {
    expect(basketText).toContain('1');
  }

  // Quantity assertions
  async expectQuantityToIncrease(initialQuantity: string, newQuantity: string) {
    expect(Number(newQuantity)).toBe(Number(initialQuantity) + 1);
  }

  async expectQuantityToReturnToOriginal(initialQuantity: string, finalQuantity: string) {
    expect(Number(finalQuantity)).toBe(Number(initialQuantity));
  }
}

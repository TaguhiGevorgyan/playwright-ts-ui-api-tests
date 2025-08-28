import { expect, Locator, Page } from '@playwright/test';
import { testConfig } from '../../config/config';
import { productItemPageLocators } from './productItemPageLocators';

export class ProductItemPageAssertions {
  readonly page: Page;
  readonly productItemTitle: Locator;
  readonly productItemPrice: Locator;
  readonly productImage: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly favoriteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItemTitle = page.locator(productItemPageLocators.productItemTitle);
    this.productItemPrice = page.locator(productItemPageLocators.productItemPrice);
    this.productImage = page.locator(productItemPageLocators.productImage);
    this.productDescription = page.locator(productItemPageLocators.productDescription);
    this.addToCartButton = page.locator(productItemPageLocators.addToCartButton);
    this.favoriteButton = page.locator(productItemPageLocators.favoriteButton);
  }         

  async expectCurrentUrlToContainProductPage() {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('/product/');
  }

  async expectProductTitleToBeVisible() {
    await expect(this.productItemTitle).toBeVisible();
  }

  async expectProductPriceToBeVisible() {
    await expect(this.productItemPrice).toBeVisible();
  }

  async expectProductImageToBeVisible() {
    await expect(this.productImage).toBeVisible();
  }

  async expectProductDescriptionToBeVisible() {
    await expect(this.productDescription).toBeVisible();
  }

  async expectAddToBasketButtonToBeVisible() {
    await expect(this.addToCartButton).toBeVisible();
  }

  async expectSuccessMessageToBeVisible() {
    const successMessage = this.page.locator(productItemPageLocators.successMessage);
    await expect(successMessage).toBeVisible();
  }

  async expectBasketCountToContainOne(basketText: string) {
    expect(basketText).toContain('1');
  }

  async expectQuantityToIncrease(initialQuantity: string, newQuantity: string) {
    const initial = Number(initialQuantity);
    const newQty = Number(newQuantity);
    expect(newQty).toBeGreaterThan(initial);
  }

  async expectQuantityToReturnToOriginal(initialQuantity: string, finalQuantity: string) {
    expect(finalQuantity).toBe(initialQuantity);
  }

  async expectMainImageToBeVisible() {
    await expect(this.productImage).toBeVisible();
  }

  async expectFavoriteButtonToBeVisible() {
    await expect(this.favoriteButton).toBeVisible();
  }

  async expectFavoriteSuccessMessageToBeVisible() {
    const favoriteSuccessMessage = this.page.locator(productItemPageLocators.favoriteSuccessMessage);
    await expect(favoriteSuccessMessage).toBeVisible();
  }
}

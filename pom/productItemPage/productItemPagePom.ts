import { Page, Locator } from '@playwright/test';
import { productItemPageLocators } from './productItemPageLocators';

export class ProductItemPagePom {
  readonly page: Page;
  readonly productItem: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly quantityIncrease: Locator;
  readonly quantityDecrease: Locator;
  readonly favoriteButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItem = page.locator(productItemPageLocators.productItem);
    this.productTitle = page.locator(productItemPageLocators.productItemTitle);
    this.productPrice = page.locator(productItemPageLocators.productItemPrice);
    this.productImage = page.locator(productItemPageLocators.productImage);
    this.productDescription = page.locator(productItemPageLocators.productDescription);
    this.addToCartButton = page.locator(productItemPageLocators.addToCartButton);
    this.quantityInput = page.locator(productItemPageLocators.quantityInput);
    this.quantityIncrease = page.locator(productItemPageLocators.quantityIncrease);
    this.quantityDecrease = page.locator(productItemPageLocators.quantityDecrease);
    this.favoriteButton = page.locator('.favorite-btn, .wishlist-btn, .like-btn, button:has-text("❤"), button:has-text("♡")');
    this.backButton = page.locator(productItemPageLocators.backButton);
  }

  // Get product title
  async getProductTitle(): Promise<string> {
    const title: string = (await this.productTitle.textContent() ?? '');
    return title;
  }

  // Get product price
  async getProductPrice(): Promise<string> {
    const price: string = (await this.productPrice.textContent() ?? '');
    return price;
  }

  // Get product description
  async getProductDescription(): Promise<string> {
    const description: string = (await this.productDescription.textContent() ?? '');
    return description;
  }

  // Check if product image is visible
  async isProductImageVisible(): Promise<boolean> {
    return await this.productImage.isVisible();
  }

  // Add product to cart
  async addToCart() {
    if (await this.addToCartButton.isVisible()) {
      await this.addToCartButton.click();
    }
  }

  // Get current quantity
  async getQuantity(): Promise<string> {
    if (await this.quantityInput.isVisible()) {
      return await this.quantityInput.inputValue();
    }
    return '1';
  }

  // Set quantity
  async setQuantity(quantity: number) {
    if (await this.quantityInput.isVisible()) {
      await this.quantityInput.fill(quantity.toString());
    }
  }

  // Increase quantity
  async increaseQuantity() {
    if (await this.quantityIncrease.isVisible()) {
      await this.quantityIncrease.click();
    }
  }

  // Decrease quantity
  async decreaseQuantity() {
    if (await this.quantityDecrease.isVisible()) {
      await this.quantityDecrease.click();
    }
  }

  // Add to favorites
  async addToFavorites() {
    if (await this.favoriteButton.isVisible()) {
      await this.favoriteButton.click();
    }
  }

  // Remove from favorites
  async removeFromFavorites() {
    if (await this.favoriteButton.isVisible()) {
      await this.favoriteButton.click();
    }
  }

  // Check if product is in favorites
  async isInFavorites(): Promise<boolean> {
    // This would depend on the specific implementation
    // For now, we'll check if the favorite button shows a filled heart
    const buttonText = await this.favoriteButton.textContent();
    return buttonText?.includes('❤') || buttonText?.includes('filled') || false;
  }

  // Navigate back
  async goBack() {
    if (await this.backButton.isVisible()) {
      await this.backButton.click();
    } else {
      await this.page.goBack();
    }
  }

  // Wait for page to load
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Get product specifications
  async getProductSpecifications(): Promise<string> {
    const specs = this.page.locator(productItemPageLocators.productSpecifications);
    if (await specs.isVisible()) {
      return await specs.textContent() ?? '';
    }
    return '';
  }

  // Get product variants
  async getProductVariants(): Promise<string[]> {
    const variants: string[] = [];
    const variantElements = this.page.locator(productItemPageLocators.productVariants);
    const count = await variantElements.count();
    
    for (let i = 0; i < count; i++) {
      const variant = await variantElements.nth(i).textContent();
      if (variant) variants.push(variant);
    }
    
    return variants;
  }

  // Select product variant
  async selectVariant(variantName: string) {
    const variants = this.page.locator(productItemPageLocators.productVariants);
    const count = await variants.count();
    
    for (let i = 0; i < count; i++) {
      const variant = variants.nth(i);
      const text = await variant.textContent();
      if (text && text.includes(variantName)) {
        await variant.click();
        break;
      }
    }
  }

  // Get related products
  async getRelatedProducts(): Promise<string[]> {
    const related: string[] = [];
    const relatedElements = this.page.locator(productItemPageLocators.relatedProducts);
    const count = await relatedElements.count();
    
    for (let i = 0; i < count; i++) {
      const product = await relatedElements.nth(i).textContent();
      if (product) related.push(product);
    }
    
    return related;
  }

  // Click on related product
  async clickRelatedProduct(index: number) {
    const relatedElements = this.page.locator(productItemPageLocators.relatedProducts);
    if (await relatedElements.nth(index).isVisible()) {
      await relatedElements.nth(index).click();
    }
  }

  // Get breadcrumb navigation
  async getBreadcrumbs(): Promise<string[]> {
    const breadcrumbs: string[] = [];
    const breadcrumbElements = this.page.locator(productItemPageLocators.breadcrumb);
    const count = await breadcrumbElements.count();
    
    for (let i = 0; i < count; i++) {
      const breadcrumb = await breadcrumbElements.nth(i).textContent();
      if (breadcrumb) breadcrumbs.push(breadcrumb);
    }
    
    return breadcrumbs;
  }

  // Navigate via breadcrumb
  async navigateViaBreadcrumb(breadcrumbText: string) {
    const breadcrumbElements = this.page.locator(productItemPageLocators.breadcrumb);
    const count = await breadcrumbElements.count();
    
    for (let i = 0; i < count; i++) {
      const breadcrumb = breadcrumbElements.nth(i);
      const text = await breadcrumb.textContent();
      if (text && text.includes(breadcrumbText)) {
        await breadcrumb.click();
        break;
      }
    }
  }

  // Check if product is available
  async isProductAvailable(): Promise<boolean> {
    // This would depend on the specific implementation
    // For now, we'll check if the add to cart button is enabled
    return await this.addToCartButton.isEnabled();
  }

  // Get product availability status
  async getAvailabilityStatus(): Promise<string> {
    // Look for availability indicators
    const availabilitySelectors = [
      '.availability, .stock-status, .in-stock, .out-of-stock',
      'text=/in stock|out of stock|available|unavailable/'
    ];
    
    for (const selector of availabilitySelectors) {
      const element = this.page.locator(selector).first();
      if (await element.isVisible()) {
        return await element.textContent() ?? '';
      }
    }
    
    return '';
  }
}

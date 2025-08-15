
export const BasketPageLocators = {
    basketItem: '.cart-item',
    basketItemTitle: 'a[href*="/product/"]',
    basketItemPrice: 'text="4 500 ֏"',
    itemCounter: '.cart-item .item-counter',
    totalPrice: '.cart-controls .total-amount',
    approveButton: '.cart-controls .button_size-l',
    totalPriceText: 'text="Ընդհանուր՝: 4 500 ֏"',
    removeItemButton: '.js-item-delete, .icon-times, button.js-item-delete, button:has-text("🗑"), button:has-text("Remove"), button:has-text("Delete"), button:has-text("×"), button:has-text("✕"), .cart-item button, [data-product-id] button',
    clearBasketButton: '.clear-basket, .clear-cart, .empty-cart',
    increaseQuantityButton: '.is-count-up, .counter-button.is-count-up, button.is-count-up, button:has-text("➕"), button:has-text("+"), .quantity-increase, .qty-plus, .cart-item .qty-plus',
    decreaseQuantityButton: '.is-count-down, .counter-button.is-count-down, button.is-count-down, button:has-text("➖"), button:has-text("-"), .quantity-decrease, .qty-minus, .cart-item .qty-minus',
    quantityInput: 'input[type="text"]:has-text("1"), .quantity-input, .qty-input, .cart-item .qty-input',
    basketEmptyMessage: '.cart-empty, .empty-cart-message, .no-items',
    basketItemCount: '.cart-item-count, .basket-count',
    checkoutButton: 'button:has-text("Հաստատել պատվերը"), .checkout-btn, .proceed-to-checkout',
    continueShoppingButton: '.continue-shopping, .back-to-shop',
    cartItemContainer: '.cart-item, [data-product-id], .product-preview',
    cartItemActions: '.cart-item .actions, .cart-item .item-actions, .product-preview .actions'
}
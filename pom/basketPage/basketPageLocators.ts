
export const BasketPageLocators = {
    basketItem: '.cart-item',
    basketItemTitle: 'a[href*="/product/"]',
    basketItemPrice: '.price, [data-cart-item-price]',
    itemCounter: '.cart-item .item-counter',
    totalPrice: '.cart-controls .total-amount',
    removeItemButton: '.js-item-delete, .remove-item-btn',
    increaseQuantityButton: '.is-count-up, .qty-plus',
    basketEmptyMessage: '.cart-empty, .empty-cart-message',
    checkoutButton: 'button:has-text("Հաստատել պատվերը"), .checkout-btn'
}
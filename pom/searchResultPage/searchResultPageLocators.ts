export const searchResultPageLocators = {
    item: '.product-preview__photo-variant, .product-preview__title',
    itemTitle: '.product-preview__title',
    itemPrice: '.product-preview__price-cur, .product-preview__price-range',
    addButton: '.add-cart-counter__btn, .button:has-text("Ավելացնել")',
    basket: '.cart-fixed-btn',
    logo: 'role=banner >> role=link[name="Sushi Mushi"]',
    // Updated selectors using CSS classes for better performance and accuracy
    searchResultItem: '.product-preview__photo-variant, .product-preview__title',
    searchResultTitle: '.product-preview__title',
    searchResultPrice: '.product-preview__price-cur, .product-preview__price-range',
    searchResultAddButton: '.add-cart-counter__btn, .button:has-text("Ավելացնել")',
    searchForm: '.search-form, .search-box',
    searchInput: '.search-input, input[name="q"]',
    searchButton: '.search-button, .search-btn, .search-submit',
    noResultsMessage: '.no-results, .no-search-results, .empty-results',
    searchFilters: '.search-filters, .filter-options, .search-options',
    sortOptions: '.sort-options, .sort-select, .sort-dropdown',
    pagination: '.pagination, .page-numbers, .pager'
}
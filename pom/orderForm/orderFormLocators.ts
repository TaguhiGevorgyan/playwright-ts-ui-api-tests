export const OrderFormLocators = {
  // Form container
  orderForm: 'form, .order-form, .checkout-form, .order-form-container',
  
  // Required form fields
  nameField: 'input[name="name"], input[placeholder*="անուն"], input[placeholder*="name"], input[required]',
  phoneField: 'input[name="phone"], input[type="tel"], input[placeholder*="հեռախոս"], input[placeholder*="phone"], input[required]',
  addressField: 'input[name="address"], textarea[name="address"], input[placeholder*="հասցե"], input[placeholder*="address"], input[required]',
  
  // Form buttons
  submitButton: 'button[type="submit"], .submit-btn, button:has-text("Submit"), button:has-text("Հաստատել")',
  
  // Validation and error messages
  errorMessages: '.error-message, .validation-error, .field-error, [data-error]',
  
  // Form navigation
  checkoutButton: 'a:has-text("Պատվիրել"), a:has-text("Checkout"), a:has-text("Proceed to checkout")',
  
  // Form confirmation
  confirmationMessage: 'text=/պատվերը հաստատվել է|order confirmed|order placed successfully/'
}; 
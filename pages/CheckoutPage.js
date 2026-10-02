// @ts-check

/**
 * Page Object Model for Product Details, Cart & Checkout Wizard
 */
class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.cartQuantityBadge = page.locator('[data-test="cart-quantity"]');
    this.cartNavButton = page.locator('[data-test="nav-cart"]');
    this.proceed1 = page.locator('[data-test="proceed-1"]');
    this.proceed2 = page.locator('[data-test="proceed-2"]');
    this.proceed3 = page.locator('[data-test="proceed-3"]');
    this.paymentMethod = page.locator('[data-test="payment-method"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.orderConfirmation = page.locator('[data-test="order-confirmation"], .alert-success, h1, h2');
  }

  async addCurrentProductToCart(quantity = 1) {
    if (quantity > 1) {
      await this.quantityInput.fill(quantity.toString());
    }
    await this.addToCartButton.click();
    await this.cartQuantityBadge.waitFor({ state: 'visible' });
  }

  async goToCart() {
    await this.cartNavButton.click();
    await this.proceed1.waitFor({ state: 'visible' });
  }

  async proceedThroughCheckoutWizard(paymentOption = 'Cash on Delivery') {
    // Step 1: Cart summary
    await this.proceed1.click();
    await this.proceed2.waitFor({ state: 'visible' });

    // Step 2: Sign-in confirmation
    await this.proceed2.click();
    await this.proceed3.waitFor({ state: 'visible' });

    // Step 3: Address confirmation
    await this.proceed3.click();
    await this.paymentMethod.waitFor({ state: 'visible' });

    // Step 4: Payment
    await this.paymentMethod.selectOption({ label: paymentOption });
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };

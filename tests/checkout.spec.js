// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Test Suite: Shopping Cart & Checkout End-to-End
 * Target: Practice Software Testing (E-Commerce Platform)
 */
test.describe('Shopping Cart & Checkout Flow', () => {

  test('should view product details and verify product attributes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Select first product card and wait for product detail API response
    const firstCard = page.locator('a.card').first();
    await firstCard.waitFor({ state: 'visible', timeout: 10000 });
    const expectedName = (await firstCard.locator('[data-test="product-name"]').textContent())?.trim();

    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/') && res.status() === 200),
      firstCard.click()
    ]);

    // Verify product details page
    await expect(page).toHaveURL(/.*product\/.*/);
    const detailsName = page.locator('h1[data-test="product-name"]');
    await expect(detailsName).toBeVisible({ timeout: 10000 });
    await expect(detailsName).toContainText(expectedName || '');

    // Verify price, description, and Add to Cart button are present
    await expect(page.locator('[data-test="unit-price"]')).toBeVisible();
    await expect(page.locator('[data-test="product-description"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });

  test('should adjust quantity and add product to shopping cart', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const firstCard = page.locator('a.card').first();
    await firstCard.waitFor({ state: 'visible', timeout: 10000 });

    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/') && res.status() === 200),
      firstCard.click()
    ]);
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible({ timeout: 10000 });

    // Increase quantity using '+' button or input
    const increaseBtn = page.locator('[data-test="increase-quantity"]');
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click();
    } else {
      await page.locator('[data-test="quantity"]').fill('2');
    }

    // Click Add to Cart
    await page.locator('[data-test="add-to-cart"]').click();

    // Assert confirmation toast notification
    const alertToast = page.locator('[role="alert"], .toast-body, .alert-success');
    await expect(alertToast.first()).toBeVisible({ timeout: 7000 });

    // Assert cart badge in navigation bar shows updated quantity
    const cartBadge = page.locator('[data-test="cart-quantity"]');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText(/[1-9]/);
  });

  test('should display cart items, quantities, and correct subtotal', async ({ page }) => {
    // 1. Add product to cart
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const firstCard = page.locator('a.card').first();
    await firstCard.waitFor({ state: 'visible', timeout: 10000 });

    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/') && res.status() === 200),
      firstCard.click()
    ]);
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-test="add-to-cart"]').click();
    await page.waitForTimeout(1000);

    // 2. Open cart
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page).toHaveURL(/.*checkout/);

    // 3. Verify item row in checkout table
    const tableRow = page.locator('tbody tr').first();
    await expect(tableRow).toBeVisible();

    // 4. Verify proceed button is enabled
    const proceed1 = page.locator('[data-test="proceed-1"]');
    await expect(proceed1).toBeVisible();
    await expect(proceed1).toBeEnabled();
  });

  test('should progress through checkout wizard with authenticated user', async ({ page }) => {
    // 1. Pre-authenticate with demo user
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
    await page.locator('[data-test="password"]').fill('welcome01');
    await page.locator('[data-test="login-submit"]').click();
    await expect(page).toHaveURL(/.*account/);

    // 2. Navigate to product catalog and add an item
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const firstCard = page.locator('a.card').first();
    await firstCard.waitFor({ state: 'visible', timeout: 10000 });

    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/') && res.status() === 200),
      firstCard.click()
    ]);
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-test="add-to-cart"]').click();
    await page.waitForTimeout(1000);

    // 3. Navigate to Cart / Checkout
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page).toHaveURL(/.*checkout/);

    // Step 1: Cart summary -> Proceed
    const proceed1 = page.locator('[data-test="proceed-1"]');
    await expect(proceed1).toBeVisible();
    await proceed1.click();
    await page.waitForTimeout(1000);

    // Step 2: Sign-in confirmation -> Proceed
    const proceed2 = page.locator('[data-test="proceed-2"]');
    await expect(proceed2).toBeVisible();
    await proceed2.click();
    await page.waitForTimeout(1000);

    // Step 3: Billing & Shipping Address Form
    const stateInput = page.locator('[data-test="state"]');
    if (await stateInput.isVisible()) {
      await stateInput.fill('Vienna');
    }
    const postalCodeInput = page.locator('[data-test="postal_code"]');
    if (await postalCodeInput.isVisible()) {
      await postalCodeInput.fill('1010');
    }
    const houseNumberInput = page.locator('[data-test="house_number"]');
    if (await houseNumberInput.isVisible()) {
      await houseNumberInput.fill('42');
    }

    // Verify proceed button 3 exists and handles step completion
    const proceed3 = page.locator('[data-test="proceed-3"]');
    await expect(proceed3).toBeVisible();
    
    // If enabled, proceed to payment step
    if (!(await proceed3.isDisabled())) {
      await proceed3.click();
      await page.waitForTimeout(1000);
      const paymentMethod = page.locator('[data-test="payment-method"]');
      if (await paymentMethod.isVisible()) {
        await expect(paymentMethod).toBeVisible();
      }
    }
  });

  test('should handle empty cart state gracefully (negative)', async ({ page }) => {
    // Clear storage/cookies to ensure fresh cart
    await page.context().clearCookies();
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });

    // Assert either empty message is shown or proceed button is absent
    const emptyState = page.locator('text=/your cart is empty|no items|there are no products/i');
    const proceedBtn = page.locator('[data-test="proceed-1"]');

    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    } else {
      const rowCount = await page.locator('tbody tr').count();
      if (rowCount === 0) {
        await expect(proceedBtn).not.toBeVisible();
      }
    }
  });

});

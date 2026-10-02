// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Test Suite: User Authentication & Login
 * Target: Practice Software Testing (E-Commerce Platform)
 */
test.describe('Login & Authentication Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate directly to the login page before each test
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-test="login-submit"]')).toBeVisible();
  });

  test('user can login successfully with valid credentials', async ({ page }) => {
    // 1. Enter valid demo account credentials
    await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
    await page.locator('[data-test="password"]').fill('welcome01');

    // 2. Submit the login form
    await page.locator('[data-test="login-submit"]').click();

    // 3. Assert redirection to account dashboard
    await expect(page).toHaveURL(/.*account/);

    // 4. Assert user profile navigation element is displayed with correct user name
    const userMenu = page.locator('[data-test="nav-menu"]');
    await expect(userMenu).toBeVisible();
    await expect(userMenu).toContainText('Jane Doe');
  });

  test('should display error message when logging in with invalid password (negative)', async ({ page }) => {
    // 1. Enter valid email with an incorrect password
    await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
    await page.locator('[data-test="password"]').fill('IncorrectPassword123!');

    // 2. Submit the form
    await page.locator('[data-test="login-submit"]').click();

    // 3. Assert error banner appears and user stays on login page
    const errorAlert = page.locator('[data-test="login-error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('should display error message for unregistered email address (negative)', async ({ page }) => {
    // 1. Enter an unregistered email address
    await page.locator('[data-test="email"]').fill('nonexistent.qa.user@example.com');
    await page.locator('[data-test="password"]').fill('AnyPassword123!');

    // 2. Submit login
    await page.locator('[data-test="login-submit"]').click();

    // 3. Assert security message does not leak account existence
    const errorAlert = page.locator('[data-test="login-error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Invalid email or password');
  });

  test('should show validation errors when submitting empty fields (negative)', async ({ page }) => {
    // 1. Leave email and password inputs blank and click Submit
    await page.locator('[data-test="login-submit"]').click();

    // 2. Assert field-level error messages
    const emailError = page.locator('[data-test="email-error"]');
    const passwordError = page.locator('[data-test="password-error"]');

    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText('Email is required');

    await expect(passwordError).toBeVisible();
    await expect(passwordError).toContainText('Password is required');
  });

  test('should validate invalid email syntax (boundary / negative)', async ({ page }) => {
    // 1. Enter malformed email without @ or domain
    await page.locator('[data-test="email"]').fill('not-an-email-address');
    await page.locator('[data-test="password"]').fill('welcome01');

    // 2. Click submit
    await page.locator('[data-test="login-submit"]').click();

    // 3. Assert email format validation warning
    const emailError = page.locator('[data-test="email-error"]');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(/Email format is invalid|Email is required/);
  });

  test('user can logout successfully and terminate active session', async ({ page }) => {
    // 1. Perform login
    await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
    await page.locator('[data-test="password"]').fill('welcome01');
    await page.locator('[data-test="login-submit"]').click();
    await expect(page).toHaveURL(/.*account/);

    // 2. Open user dropdown and click Sign out
    await page.locator('[data-test="nav-menu"]').click();
    const logoutBtn = page.locator('[data-test="nav-sign-out"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // 3. Assert user is logged out and Sign In link reappears in header
    await expect(page.locator('[data-test="nav-sign-in"]')).toBeVisible();
  });

});

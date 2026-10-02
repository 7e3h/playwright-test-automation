// @ts-check

/**
 * Page Object Model for User Login Page
 */
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
    this.errorMessage = page.locator('[data-test="login-error"]');
    this.emailError = page.locator('[data-test="email-error"]');
    this.passwordError = page.locator('[data-test="password-error"]');
    this.userMenu = page.locator('[data-test="nav-menu"]');
    this.signOutButton = page.locator('[data-test="nav-sign-out"]');
    this.signInLink = page.locator('[data-test="nav-sign-in"]');
  }

  async goto() {
    await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.userMenu.click();
    await this.signOutButton.click();
  }
}

module.exports = { LoginPage };

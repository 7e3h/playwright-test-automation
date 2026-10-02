// @ts-check

/**
 * Page Object Model for Product Search and Catalog Page
 */
class SearchPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.resetButton = page.locator('[data-test="search-reset"]');
    this.productCards = page.locator('a.card');
    this.productNames = page.locator('[data-test="product-name"]');
    this.emptyMessage = page.locator('[data-test="search_completed"]');
    this.sortDropdown = page.locator('[data-test="sort"]');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async searchFor(keyword) {
    await this.searchInput.fill(keyword);
    await Promise.all([
      this.page.waitForResponse(res => res.url().includes('products/search') && res.status() === 200),
      this.searchButton.click()
    ]);
  }

  async resetSearch() {
    if (await this.resetButton.isVisible()) {
      await Promise.all([
        this.page.waitForResponse(res => res.url().includes('products') && res.status() === 200),
        this.resetButton.click()
      ]);
    } else {
      await this.searchInput.clear();
      await this.searchButton.click();
    }
  }

  async sortBy(sortOption) {
    await Promise.all([
      this.page.waitForResponse(res => res.url().includes('products') && res.status() === 200),
      this.sortDropdown.selectOption(sortOption)
    ]);
  }
}

module.exports = { SearchPage };

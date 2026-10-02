// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Test Suite: Product Search & Filtering
 * Target: Practice Software Testing (E-Commerce Platform)
 */
test.describe('Product Search & Filter Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to home page where product catalog and search bar reside
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-test="search-query"]')).toBeVisible();
    await page.waitForSelector('a.card', { timeout: 10000 });
  });

  test('should return relevant results when searching by product name', async ({ page }) => {
    const searchKeyword = 'Pliers';

    // 1. Enter keyword in search input
    await page.locator('[data-test="search-query"]').fill(searchKeyword);

    // 2. Click Search button and wait for the search API response
    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/search') && res.status() === 200),
      page.locator('[data-test="search-submit"]').click()
    ]);

    // 3. Wait for the UI to update
    const productNames = page.locator('[data-test="product-name"]');
    await expect(productNames.first()).toBeVisible({ timeout: 5000 });

    // 4. Assert that every returned product contains the search keyword
    const titles = await productNames.allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(searchKeyword.toLowerCase());
    }
  });

  test('should support case-insensitive search queries', async ({ page }) => {
    // 1. Search in lowercase and wait for response
    await page.locator('[data-test="search-query"]').fill('hammer');
    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/search') && res.status() === 200),
      page.locator('[data-test="search-submit"]').click()
    ]);

    // 2. Wait for filtered products
    const productNames = page.locator('[data-test="product-name"]');
    await expect(productNames.first()).toBeVisible({ timeout: 5000 });

    // 3. Assert matching results
    const titles = await productNames.allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect(title.toLowerCase()).toContain('hammer');
    }
  });

  test('should display clear empty message when query returns 0 results (negative)', async ({ page }) => {
    const nonExistentQuery = 'NonExistentItemQuery9999XYZ';

    // 1. Enter query that has no matches and wait for response
    await page.locator('[data-test="search-query"]').fill(nonExistentQuery);
    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/search') && res.status() === 200),
      page.locator('[data-test="search-submit"]').click()
    ]);

    // 2. Assert no product cards are displayed
    const productCards = page.locator('a.card');
    await expect(productCards).toHaveCount(0);

    // 3. Assert empty search state message
    const emptyMsg = page.locator('[data-test="search_completed"]');
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toContainText(/There are no products found/i);
  });

  test('should reset search query and restore original product catalog', async ({ page }) => {
    // 1. First perform a search that filters the catalog
    await page.locator('[data-test="search-query"]').fill('Wrench');
    await Promise.all([
      page.waitForResponse(res => res.url().includes('products/search') && res.status() === 200),
      page.locator('[data-test="search-submit"]').click()
    ]);
    await expect(page.locator('[data-test="product-name"]').first()).toBeVisible();

    // 2. Click the Reset / Clear button and wait for full products response
    const resetBtn = page.locator('[data-test="search-reset"]');
    if (await resetBtn.isVisible()) {
      await Promise.all([
        page.waitForResponse(res => res.url().includes('products') && res.status() === 200),
        resetBtn.click()
      ]);
    } else {
      await page.locator('[data-test="search-query"]').clear();
      await page.locator('[data-test="search-submit"]').click();
    }

    // 3. Assert product cards count returns to full catalog (at least 9 default items)
    await page.waitForTimeout(1000);
    const productCards = page.locator('a.card');
    const count = await productCards.count();
    expect(count).toBeGreaterThanOrEqual(9);
  });

  test('should sort products by name or price order', async ({ page }) => {
    // 1. Locate sort dropdown
    const sortSelect = page.locator('[data-test="sort"]');
    await expect(sortSelect).toBeVisible();

    // 2. Select sort by Name (A - Z) and wait for products API response
    await Promise.all([
      page.waitForResponse(res => res.url().includes('products') && res.status() === 200),
      sortSelect.selectOption('name,asc')
    ]);

    await page.waitForTimeout(1000);
    const productNames = page.locator('[data-test="product-name"]');
    await expect(productNames.first()).toBeVisible();

    // 3. Verify products are listed
    const names = await productNames.allTextContents();
    expect(names.length).toBeGreaterThan(1);
    
    // Check first item starts with earlier letter than later items
    const cleanNames = names.map(n => n.trim().toLowerCase());
    const sortedNames = [...cleanNames].sort();
    expect(cleanNames[0]).toBe(sortedNames[0]);
  });

});

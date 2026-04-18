import { test, expect } from '@playwright/test';

test.describe('E2E Critical Paths', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add product to cart', async ({ page }) => {
    await page.click('text=Shop');
    await page.waitForSelector('.grid');
    
    // Click first product
    await page.click('.grid > div:first-child a');
    
    // Add to cart
    await page.click('text=Add to Bag');
    
    // Check cart count
    const cartCount = await page.textContent('[data-testid="cart-count"]');
    expect(Number(cartCount)).toBeGreaterThan(0);
  });

  test('should navigate to login', async ({ page }) => {
    await page.click('[aria-label="Account"]');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h2')).toContainText('Welcome Back');
  });
});

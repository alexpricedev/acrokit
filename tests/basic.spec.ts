import { test, expect } from '@playwright/test';

test.describe('AcroKit Application', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Acrokit/);

    // Check for main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/home-page.png' });
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');

    // Test navigation to builder
    await page.goto('/builder');
    await expect(page).toHaveTitle(/Acrokit/);
    await page.screenshot({ path: 'test-results/builder-page.png' });

    // Test navigation to community
    await page.goto('/community');
    await expect(page).toHaveTitle(/Acrokit/);
    await page.screenshot({ path: 'test-results/community-page.png' });
  });

  test('about page loads correctly', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Acrokit/);
    await page.screenshot({ path: 'test-results/about-page.png' });
  });
});

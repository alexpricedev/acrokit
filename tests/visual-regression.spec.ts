import { test } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage at different viewport sizes', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.screenshot({
      path: 'test-results/home-desktop.png',
      fullPage: true,
    });

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: 'test-results/home-tablet.png',
      fullPage: true,
    });

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: 'test-results/home-mobile.png',
      fullPage: true,
    });
  });

  test('builder page states', async ({ page }) => {
    await page.goto('/builder');

    // Loading state
    await page.screenshot({ path: 'test-results/builder-loading.png' });

    // Wait for content to load (if it does)
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/builder-loaded.png' });
  });

  test('community gallery page', async ({ page }) => {
    await page.goto('/community');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'test-results/community-gallery.png',
      fullPage: true,
    });
  });

  test('about page content', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'test-results/about-page-full.png',
      fullPage: true,
    });
  });
});

import { test, expect } from '@playwright/test';

test.describe('Simple State Check', () => {
  test('should check current app state', async ({ page }) => {
    console.log('🔍 Checking current app state...');
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(5000);
    
    // Take immediate screenshot
    await page.screenshot({ path: 'state-check-01-immediate.png' });
    
    // Check what's currently visible
    const loadingText = await page.locator('text=Loading').isVisible();
    const availableMovesText = await page.locator('text=Available next moves').isVisible();
    const errorText = await page.locator('text=Error').isVisible();
    const flowBuilderText = await page.locator('text=Your flow').isVisible();
    
    console.log(`Loading text visible: ${loadingText}`);
    console.log(`Available moves visible: ${availableMovesText}`);
    console.log(`Error text visible: ${errorText}`);
    console.log(`Flow builder visible: ${flowBuilderText}`);
    
    // Wait longer and check again
    await page.waitForTimeout(10000);
    await page.screenshot({ path: 'state-check-02-after-wait.png' });
    
    const loadingText2 = await page.locator('text=Loading').isVisible();
    const availableMovesText2 = await page.locator('text=Available next moves').isVisible();
    const errorText2 = await page.locator('text=Error').isVisible();
    const flowBuilderText2 = await page.locator('text=Your flow').isVisible();
    
    console.log(`After waiting - Loading text visible: ${loadingText2}`);
    console.log(`After waiting - Available moves visible: ${availableMovesText2}`);
    console.log(`After waiting - Error text visible: ${errorText2}`);
    console.log(`After waiting - Flow builder visible: ${flowBuilderText2}`);
    
    // Check the page title
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);
    
    // Get page content for debugging
    const bodyText = await page.locator('body').textContent();
    console.log(`Body text preview: ${bodyText.substring(0, 200)}...`);
    
    console.log('🎉 State check completed');
  });
});
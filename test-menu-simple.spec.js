import { test, expect } from '@playwright/test';

test.describe('Simple Menu Test', () => {
  test('should test menu navigation', async ({ page }) => {
    console.log('🔍 Testing menu navigation...');
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'menu-test-01-initial.png' });
    
    // Click menu button (text selector)
    await page.click('text=Menu');
    await page.waitForTimeout(1000);
    
    // Take screenshot of menu
    await page.screenshot({ path: 'menu-test-02-menu.png' });
    
    // Look for Poses Gallery option
    const posesGalleryVisible = await page.locator('text=Poses Gallery').isVisible();
    console.log(`Poses Gallery visible: ${posesGalleryVisible}`);
    
    if (posesGalleryVisible) {
      // Click Poses Gallery
      await page.click('text=Poses Gallery');
      await page.waitForTimeout(3000);
      
      // Take screenshot of poses gallery
      await page.screenshot({ path: 'menu-test-03-poses-gallery.png' });
      
      // Check for elements in poses gallery
      const pageTitle = await page.locator('h1, h2').first().textContent();
      console.log(`Page title/header: ${pageTitle}`);
      
      // Check for pose cards or heart buttons
      const poseElements = await page.locator('div').count();
      console.log(`Found ${poseElements} div elements on page`);
    }
    
    console.log('🎉 Menu test completed');
  });
});
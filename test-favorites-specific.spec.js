import { test, expect } from '@playwright/test';

test.describe('Favorites Specific Test', () => {
  test('should test favorites functionality specifically', async ({ page }) => {
    console.log('🔍 Testing favorites functionality specifically...');
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      console.log(`Console ${type}: ${text}`);
    });
    
    // Capture network failures
    const networkErrors = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
        console.log(`Network error: ${response.status()} ${response.url()}`);
      }
    });
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Wait for data to load
    await page.waitForSelector('text=Available next moves', { timeout: 15000 });
    
    // Take screenshot of loaded state
    await page.screenshot({ path: 'favorites-test-01-loaded.png' });
    
    // Open menu
    await page.click('[data-testid="menu-button"]');
    await page.waitForTimeout(1000);
    
    // Take screenshot of menu
    await page.screenshot({ path: 'favorites-test-02-menu.png' });
    
    // Click on Poses Gallery
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(2000);
    
    // Take screenshot of poses gallery
    await page.screenshot({ path: 'favorites-test-03-poses-gallery.png' });
    
    // Check if heart buttons are visible
    const heartButtons = await page.locator('button[aria-label*="favorite"]').count();
    console.log(`Found ${heartButtons} heart buttons`);
    
    if (heartButtons > 0) {
      // Click the first heart button
      console.log('Clicking first heart button...');
      await page.locator('button[aria-label*="favorite"]').first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking heart
      await page.screenshot({ path: 'favorites-test-04-after-heart-click.png' });
    } else {
      console.log('No heart buttons found');
    }
    
    // Now test with fake auth to see if it works differently
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForSelector('text=Available next moves', { timeout: 15000 });
    
    // Take screenshot with fake auth
    await page.screenshot({ path: 'favorites-test-05-fake-auth.png' });
    
    // Open menu and go to poses gallery with fake auth
    await page.click('[data-testid="menu-button"]');
    await page.waitForTimeout(1000);
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(2000);
    
    // Take screenshot of poses gallery with fake auth
    await page.screenshot({ path: 'favorites-test-06-poses-gallery-fake-auth.png' });
    
    // Check heart buttons with fake auth
    const heartButtonsFakeAuth = await page.locator('button[aria-label*="favorite"]').count();
    console.log(`Found ${heartButtonsFakeAuth} heart buttons with fake auth`);
    
    if (heartButtonsFakeAuth > 0) {
      // Click the first heart button with fake auth
      console.log('Clicking first heart button with fake auth...');
      await page.locator('button[aria-label*="favorite"]').first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking heart with fake auth
      await page.screenshot({ path: 'favorites-test-07-after-heart-click-fake-auth.png' });
    }
    
    // Final screenshot
    await page.screenshot({ path: 'favorites-test-08-final.png' });
    
    // Log all captured messages
    console.log('\n📋 All console messages:');
    consoleMessages.forEach(msg => {
      console.log(`  ${msg.type}: ${msg.text}`);
    });
    
    console.log('\n🌐 Network errors:');
    networkErrors.forEach(error => {
      console.log(`  ${error.status} ${error.statusText}: ${error.url}`);
    });
    
    console.log('🎉 Favorites test completed');
  });
});
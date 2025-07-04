import { test, expect } from '@playwright/test';

test.describe('Poses Gallery Test', () => {
  test('should test poses gallery and favorites', async ({ page }) => {
    console.log('🔍 Testing poses gallery and favorites...');
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      console.log(`Console ${type}: ${text}`);
    });
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'poses-gallery-01-initial.png' });
    
    // Click menu button
    await page.click('[data-testid="menu-button"]');
    await page.waitForTimeout(1000);
    
    // Take screenshot of menu
    await page.screenshot({ path: 'poses-gallery-02-menu.png' });
    
    // Click Poses Gallery
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(3000);
    
    // Take screenshot of poses gallery
    await page.screenshot({ path: 'poses-gallery-03-poses-gallery.png' });
    
    // Check for heart buttons (they might not be visible without authentication)
    const heartButtons = await page.locator('button[aria-label*="favorite"]').count();
    console.log(`Found ${heartButtons} heart buttons in poses gallery`);
    
    // Check for poses in gallery
    const poseCards = await page.locator('[data-testid="pose-card"]').count();
    console.log(`Found ${poseCards} pose cards in gallery`);
    
    // Now test with fake authentication
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForTimeout(3000);
    
    // Take screenshot with fake auth
    await page.screenshot({ path: 'poses-gallery-04-fake-auth.png' });
    
    // Click menu button
    await page.click('[data-testid="menu-button"]');
    await page.waitForTimeout(1000);
    
    // Click Poses Gallery
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(3000);
    
    // Take screenshot of poses gallery with fake auth
    await page.screenshot({ path: 'poses-gallery-05-poses-gallery-fake-auth.png' });
    
    // Check for heart buttons with fake auth
    const heartButtonsFakeAuth = await page.locator('button[aria-label*="favorite"]').count();
    console.log(`Found ${heartButtonsFakeAuth} heart buttons with fake auth`);
    
    if (heartButtonsFakeAuth > 0) {
      // Click the first heart button
      console.log('Clicking first heart button with fake auth...');
      await page.locator('button[aria-label*="favorite"]').first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking heart
      await page.screenshot({ path: 'poses-gallery-06-after-heart-click.png' });
      
      // Try clicking it again to test toggle
      console.log('Clicking heart button again to test toggle...');
      await page.locator('button[aria-label*="favorite"]').first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after second click
      await page.screenshot({ path: 'poses-gallery-07-after-second-click.png' });
    }
    
    // Final screenshot
    await page.screenshot({ path: 'poses-gallery-08-final.png' });
    
    // Log all captured messages
    console.log('\n📋 All console messages:');
    consoleMessages.forEach(msg => {
      console.log(`  ${msg.type}: ${msg.text}`);
    });
    
    console.log('🎉 Poses gallery test completed');
  });
});
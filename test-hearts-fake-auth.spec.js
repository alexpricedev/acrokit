import { test, expect } from '@playwright/test';

test.describe('Heart Buttons with Fake Auth', () => {
  test('should test heart buttons with fake authentication', async ({ page }) => {
    console.log('🔍 Testing heart buttons with fake authentication...');
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      if (type === 'error' || text.includes('favorite') || text.includes('permission')) {
        console.log(`Console ${type}: ${text}`);
      }
    });
    
    // Navigate with fake auth
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForTimeout(3000);
    
    // Take screenshot with fake auth
    await page.screenshot({ path: 'hearts-fake-01-initial.png' });
    
    // Click menu button
    await page.click('text=Menu');
    await page.waitForTimeout(1000);
    
    // Click Poses Gallery
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(3000);
    
    // Take screenshot of poses gallery with fake auth
    await page.screenshot({ path: 'hearts-fake-02-poses-gallery.png' });
    
    // Look for heart buttons now
    const heartButtons = await page.locator('button').filter({ hasText: '♡' }).count();
    const filledHeartButtons = await page.locator('button').filter({ hasText: '♥' }).count();
    const favoriteButtons = await page.locator('button[aria-label*="favorite"]').count();
    
    console.log(`Found ${heartButtons} empty heart buttons (♡)`);
    console.log(`Found ${filledHeartButtons} filled heart buttons (♥)`);
    console.log(`Found ${favoriteButtons} favorite aria-label buttons`);
    
    // Try to find any button that might be a heart
    const allButtons = await page.locator('button').count();
    console.log(`Total buttons on page: ${allButtons}`);
    
    // Look for heart symbols in any element
    const heartSymbols = await page.locator('text=♡').count();
    const filledHeartSymbols = await page.locator('text=♥').count();
    
    console.log(`Found ${heartSymbols} ♡ symbols anywhere on page`);
    console.log(`Found ${filledHeartSymbols} ♥ symbols anywhere on page`);
    
    // If we find any heart buttons, try clicking one
    if (heartButtons > 0) {
      console.log('Clicking first empty heart button...');
      await page.locator('button').filter({ hasText: '♡' }).first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'hearts-fake-03-after-click.png' });
    } else if (favoriteButtons > 0) {
      console.log('Clicking first favorite button...');
      await page.locator('button[aria-label*="favorite"]').first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'hearts-fake-03-after-click.png' });
    } else {
      console.log('No heart buttons found - taking final screenshot');
      await page.screenshot({ path: 'hearts-fake-03-no-hearts.png' });
    }
    
    // Check for any error messages or relevant console logs
    const relevantLogs = consoleMessages.filter(msg => 
      msg.text.includes('favorite') || 
      msg.text.includes('permission') || 
      msg.text.includes('error') ||
      msg.type === 'error'
    );
    
    if (relevantLogs.length > 0) {
      console.log('\n📋 Relevant console messages:');
      relevantLogs.forEach(msg => {
        console.log(`  ${msg.type}: ${msg.text}`);
      });
    }
    
    console.log('🎉 Heart buttons test completed');
  });
});
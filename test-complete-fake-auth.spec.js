import { test, expect } from '@playwright/test';

test.describe('Complete Fake Auth Test', () => {
  test('should complete fake auth login and test heart buttons', async ({ page }) => {
    console.log('🔍 Testing complete fake auth flow...');
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      if (type === 'error' || text.includes('favorite') || text.includes('permission') || text.includes('auth')) {
        console.log(`Console ${type}: ${text}`);
      }
    });
    
    // Navigate with fake auth
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'complete-fake-01-initial.png' });
    
    // Click Sign In to start the fake auth process
    await page.click('text=Sign In');
    await page.waitForTimeout(1000);
    
    // Enter a test email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('text=Send Code');
    await page.waitForTimeout(2000);
    
    // Take screenshot after sending code
    await page.screenshot({ path: 'complete-fake-02-code-sent.png' });
    
    // Enter a fake 6-digit code
    await page.fill('input[type="text"]', '123456');
    await page.click('text=Verify Code');
    await page.waitForTimeout(2000);
    
    // Take screenshot after verification
    await page.screenshot({ path: 'complete-fake-03-verified.png' });
    
    // Check if we're now logged in
    const signInVisible = await page.locator('text=Sign In').isVisible();
    const signOutVisible = await page.locator('text=Sign Out').isVisible();
    
    console.log(`After verification - Sign In visible: ${signInVisible}`);
    console.log(`After verification - Sign Out visible: ${signOutVisible}`);
    
    // Navigate to poses gallery
    await page.click('text=Menu');
    await page.waitForTimeout(1000);
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(3000);
    
    // Take screenshot of poses gallery with auth
    await page.screenshot({ path: 'complete-fake-04-poses-gallery-authed.png' });
    
    // Now check for heart buttons specifically
    const heartButtons = await page.locator('button[title*="favorite"]').count();
    const addToFavoriteButtons = await page.locator('button[title="Add to favorites"]').count();
    const removeFromFavoriteButtons = await page.locator('button[title="Remove from favorites"]').count();
    
    console.log(`Found ${heartButtons} buttons with 'favorite' in title`);
    console.log(`Found ${addToFavoriteButtons} 'Add to favorites' buttons`);
    console.log(`Found ${removeFromFavoriteButtons} 'Remove from favorites' buttons`);
    
    // Look for any SVG elements that might be hearts (in buttons)
    const buttonSvgs = await page.locator('button svg').count();
    console.log(`Found ${buttonSvgs} SVG elements inside buttons`);
    
    // If we find heart buttons, test clicking one
    if (heartButtons > 0 || addToFavoriteButtons > 0) {
      const targetButton = heartButtons > 0 
        ? page.locator('button[title*="favorite"]').first()
        : page.locator('button[title="Add to favorites"]').first();
      
      console.log('Clicking heart button...');
      await targetButton.click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'complete-fake-05-after-heart-click.png' });
      
      // Check if button state changed
      const newHeartButtons = await page.locator('button[title*="favorite"]').count();
      const newAddButtons = await page.locator('button[title="Add to favorites"]').count();
      const newRemoveButtons = await page.locator('button[title="Remove from favorites"]').count();
      
      console.log(`After click - ${newHeartButtons} buttons with 'favorite' in title`);
      console.log(`After click - ${newAddButtons} 'Add to favorites' buttons`);
      console.log(`After click - ${newRemoveButtons} 'Remove from favorites' buttons`);
    }
    
    // Final screenshot
    await page.screenshot({ path: 'complete-fake-06-final.png' });
    
    // Log relevant console messages
    const relevantLogs = consoleMessages.filter(msg => 
      msg.text.includes('favorite') || 
      msg.text.includes('permission') || 
      msg.text.includes('auth') ||
      msg.type === 'error'
    );
    
    if (relevantLogs.length > 0) {
      console.log('\n📋 Relevant console messages:');
      relevantLogs.forEach(msg => {
        console.log(`  ${msg.type}: ${msg.text}`);
      });
    }
    
    console.log('🎉 Complete fake auth test completed');
  });
});
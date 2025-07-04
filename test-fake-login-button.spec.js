import { test, expect } from '@playwright/test';

test.describe('Fake Login Button Test', () => {
  test('should use fake login button and test heart functionality', async ({ page }) => {
    console.log('🔍 Testing fake login button and heart functionality...');
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      console.log(`Console ${type}: ${text}`);
    });
    
    // Navigate with fake auth
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'fake-login-01-initial.png' });
    
    // Click the Fake Login button
    await page.click('text=Fake Login');
    await page.waitForTimeout(2000);
    
    // Take screenshot after fake login
    await page.screenshot({ path: 'fake-login-02-after-login.png' });
    
    // Check if we're now logged in
    const signInVisible = await page.locator('text=Sign In').isVisible();
    const signOutVisible = await page.locator('text=Sign Out').isVisible();
    const fakeLoginVisible = await page.locator('text=Fake Login').isVisible();
    
    console.log(`After fake login - Sign In visible: ${signInVisible}`);
    console.log(`After fake login - Sign Out visible: ${signOutVisible}`);
    console.log(`After fake login - Fake Login visible: ${fakeLoginVisible}`);
    
    // Navigate to poses gallery
    await page.click('text=Menu');
    await page.waitForTimeout(1000);
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(3000);
    
    // Take screenshot of poses gallery with auth
    await page.screenshot({ path: 'fake-login-03-poses-gallery-authed.png' });
    
    // Now check for heart buttons
    const heartButtons = await page.locator('button[title*="favorite"]').count();
    const addToFavoriteButtons = await page.locator('button[title="Add to favorites"]').count();
    const removeFromFavoriteButtons = await page.locator('button[title="Remove from favorites"]').count();
    
    console.log(`Found ${heartButtons} buttons with 'favorite' in title`);
    console.log(`Found ${addToFavoriteButtons} 'Add to favorites' buttons`);
    console.log(`Found ${removeFromFavoriteButtons} 'Remove from favorites' buttons`);
    
    // Check for show favorites filter (should be visible when authenticated)
    const showFavoritesFilter = await page.locator('text=Show Favorites Only').isVisible();
    console.log(`Show Favorites filter visible: ${showFavoritesFilter}`);
    
    // If we find heart buttons, test clicking one
    if (addToFavoriteButtons > 0) {
      console.log('Clicking first "Add to favorites" button...');
      await page.locator('button[title="Add to favorites"]').first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'fake-login-04-after-heart-click.png' });
      
      // Check if button state changed
      const newAddButtons = await page.locator('button[title="Add to favorites"]').count();
      const newRemoveButtons = await page.locator('button[title="Remove from favorites"]').count();
      
      console.log(`After click - ${newAddButtons} 'Add to favorites' buttons`);
      console.log(`After click - ${newRemoveButtons} 'Remove from favorites' buttons`);
      
      // Try clicking the remove button if it appeared
      if (newRemoveButtons > 0) {
        console.log('Clicking "Remove from favorites" button...');
        await page.locator('button[title="Remove from favorites"]').first().click();
        await page.waitForTimeout(2000);
        
        // Take screenshot after removing
        await page.screenshot({ path: 'fake-login-05-after-remove.png' });
        
        const finalAddButtons = await page.locator('button[title="Add to favorites"]').count();
        const finalRemoveButtons = await page.locator('button[title="Remove from favorites"]').count();
        
        console.log(`After remove - ${finalAddButtons} 'Add to favorites' buttons`);
        console.log(`After remove - ${finalRemoveButtons} 'Remove from favorites' buttons`);
      }
    }
    
    // Final screenshot
    await page.screenshot({ path: 'fake-login-06-final.png' });
    
    // Log error console messages
    const errorLogs = consoleMessages.filter(msg => msg.type === 'error');
    
    if (errorLogs.length > 0) {
      console.log('\n❌ Error console messages:');
      errorLogs.forEach(msg => {
        console.log(`  ${msg.text}`);
      });
    } else {
      console.log('\n✅ No error console messages found');
    }
    
    console.log('🎉 Fake login button test completed');
  });
});
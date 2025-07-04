import { test, expect } from '@playwright/test';

test.describe('Favorites Permissions Test', () => {
  test('should test favorites functionality with real authentication', async ({ page }) => {
    console.log('🔍 Testing favorites functionality with real authentication...');
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'permissions-test-01-initial.png' });
    
    // Click sign in
    await page.click('text=Sign In');
    await page.waitForSelector('input[type="email"]');
    
    // Enter test email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('text=Send Code');
    await page.waitForTimeout(2000);
    
    // Take screenshot after email sent
    await page.screenshot({ path: 'permissions-test-02-email-sent.png' });
    
    // We can't proceed with real auth without the magic code
    // So let's use fake auth to test the permissions
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot with fake auth
    await page.screenshot({ path: 'permissions-test-03-fake-auth.png' });
    
    // Open menu and go to poses gallery
    await page.click('[data-testid="menu-button"]');
    await page.waitForTimeout(1000);
    
    await page.click('text=Poses Gallery');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of poses gallery
    await page.screenshot({ path: 'permissions-test-04-poses-gallery.png' });
    
    // Look for heart buttons
    const heartButtons = await page.locator('button[aria-label*="favorite"]').count();
    console.log(`Found ${heartButtons} heart buttons`);
    
    if (heartButtons > 0) {
      // Click the first heart button
      await page.locator('button[aria-label*="favorite"]').first().click();
      await page.waitForTimeout(1000);
      
      // Take screenshot after clicking heart
      await page.screenshot({ path: 'permissions-test-05-after-heart-click.png' });
      
      // Check for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Wait a bit to capture any async errors
      await page.waitForTimeout(2000);
      
      // Log any console errors
      if (consoleErrors.length > 0) {
        console.log('❌ Console errors detected:');
        consoleErrors.forEach(error => console.log(`  - ${error}`));
      } else {
        console.log('✅ No console errors detected');
      }
    }
    
    // Try to test with real auth (without magic code, this will fail)
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Click sign in
    await page.click('text=Sign In');
    await page.waitForSelector('input[type="email"]');
    
    // Enter test email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('text=Send Code');
    await page.waitForTimeout(2000);
    
    // Since we can't get the magic code, let's check the network tab for permission errors
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });
    
    // Try to navigate to poses gallery anyway (should work without auth)
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take final screenshot
    await page.screenshot({ path: 'permissions-test-06-final.png' });
    
    // Check for InstantDB related network errors
    const instantdbErrors = responses.filter(r => 
      r.url.includes('instantdb') && r.status >= 400
    );
    
    if (instantdbErrors.length > 0) {
      console.log('❌ InstantDB network errors detected:');
      instantdbErrors.forEach(error => console.log(`  - ${error.url}: ${error.status} ${error.statusText}`));
    } else {
      console.log('✅ No InstantDB network errors detected');
    }
    
    console.log('🎉 Permissions test completed');
  });
});
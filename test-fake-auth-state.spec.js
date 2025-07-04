import { test, expect } from '@playwright/test';

test.describe('Fake Auth State Test', () => {
  test('should check fake auth state and user creation', async ({ page }) => {
    console.log('🔍 Testing fake auth state...');
    
    // Navigate with fake auth
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'fake-auth-01-initial.png' });
    
    // Check for any user indicator in the UI
    const signInText = await page.locator('text=Sign In').isVisible();
    const signOutText = await page.locator('text=Sign Out').isVisible();
    const createAccountText = await page.locator('text=Create a Free Account').isVisible();
    
    console.log(`Sign In visible: ${signInText}`);
    console.log(`Sign Out visible: ${signOutText}`);
    console.log(`Create Account visible: ${createAccountText}`);
    
    // Let's try to trigger fake login by injecting JavaScript
    const userState = await page.evaluate(() => {
      // Try to access the React context or any global user state
      return {
        localStorage: Object.keys(localStorage),
        location: window.location.href,
        fakeAuth: window.location.search.includes('fake-auth')
      };
    });
    
    console.log('User state:', userState);
    
    // Try to manually trigger fake login via console
    await page.evaluate(() => {
      // Try to trigger fake login if the function is available
      const authContext = document.querySelector('[data-testid="auth-provider"]');
      if (window.fakeLogin) {
        window.fakeLogin();
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Take screenshot after attempted login
    await page.screenshot({ path: 'fake-auth-02-after-trigger.png' });
    
    // Navigate to poses gallery to see if heart buttons appear
    await page.click('text=Menu');
    await page.waitForTimeout(1000);
    await page.click('text=Poses Gallery');
    await page.waitForTimeout(3000);
    
    // Take screenshot of poses gallery
    await page.screenshot({ path: 'fake-auth-03-poses-gallery.png' });
    
    // Check for SVG heart buttons
    const svgHearts = await page.locator('svg[viewBox="0 0 512 512"]').count();
    console.log(`Found ${svgHearts} SVG elements (could include hearts)`);
    
    // Check specifically for heart button containers
    const heartContainers = await page.locator('button[title*="favorite"]').count();
    console.log(`Found ${heartContainers} buttons with favorite in title`);
    
    console.log('🎉 Fake auth state test completed');
  });
});
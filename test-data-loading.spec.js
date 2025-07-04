import { test, expect } from '@playwright/test';

test.describe('Data Loading Test', () => {
  test('should test if poses and transitions load correctly', async ({ page }) => {
    console.log('🔍 Testing data loading...');
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Wait for the loading state to appear
    await page.waitForSelector('text=Loading poses and transitions', { timeout: 10000 });
    
    // Take screenshot of loading state
    await page.screenshot({ path: 'data-loading-01-loading.png' });
    
    // Wait for data to load (either success or error)
    await page.waitForFunction(() => {
      const loadingText = document.querySelector('text="Loading poses and transitions"');
      return !loadingText || loadingText.textContent !== 'Loading poses and transitions...';
    }, { timeout: 30000 });
    
    // Take screenshot after loading
    await page.screenshot({ path: 'data-loading-02-after-loading.png' });
    
    // Check if we have poses loaded
    const flowBuilderVisible = await page.locator('text=Flow Builder').isVisible();
    const errorVisible = await page.locator('text=Error').isVisible();
    
    if (flowBuilderVisible) {
      console.log('✅ Data loaded successfully - Flow Builder is visible');
    } else if (errorVisible) {
      console.log('❌ Error loading data - Error message visible');
    } else {
      console.log('⚠️  Unknown state - Neither Flow Builder nor Error visible');
    }
    
    // Check browser console for any errors
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // Wait a bit to capture console messages
    await page.waitForTimeout(2000);
    
    // Log console messages
    if (consoleMessages.length > 0) {
      console.log('📋 Console messages:');
      consoleMessages.forEach(msg => console.log(`  ${msg}`));
    }
    
    // Check for InstantDB related network requests
    const requests = [];
    page.on('request', request => {
      if (request.url().includes('instantdb')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
      }
    });
    
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('instantdb')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Wait for network activity to complete
    await page.waitForTimeout(5000);
    
    // Log network activity
    if (requests.length > 0) {
      console.log('📡 InstantDB requests:');
      requests.forEach(req => console.log(`  ${req.method} ${req.url}`));
    }
    
    if (responses.length > 0) {
      console.log('📡 InstantDB responses:');
      responses.forEach(res => console.log(`  ${res.status} ${res.url}`));
    }
    
    // Final screenshot
    await page.screenshot({ path: 'data-loading-03-final.png' });
    
    console.log('🎉 Data loading test completed');
  });
});
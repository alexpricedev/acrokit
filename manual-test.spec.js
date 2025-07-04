import { test, expect } from '@playwright/test';

test.describe('Manual Permission Test', () => {
  test('should capture console errors during data loading', async ({ page }) => {
    console.log('🔍 Testing console errors during data loading...');
    
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
    
    // Wait for loading to start
    await page.waitForSelector('text=Loading poses and transitions', { timeout: 10000 });
    
    // Take screenshot of loading state
    await page.screenshot({ path: 'manual-test-01-loading.png' });
    
    // Wait longer to see if data loads or errors occur
    await page.waitForTimeout(15000);
    
    // Take screenshot after waiting
    await page.screenshot({ path: 'manual-test-02-after-wait.png' });
    
    // Try to click on the page to trigger any delayed errors
    await page.click('body');
    await page.waitForTimeout(2000);
    
    // Final screenshot
    await page.screenshot({ path: 'manual-test-03-final.png' });
    
    // Log all captured messages
    console.log('\n📋 All console messages:');
    consoleMessages.forEach(msg => {
      console.log(`  ${msg.type}: ${msg.text}`);
    });
    
    console.log('\n🌐 Network errors:');
    networkErrors.forEach(error => {
      console.log(`  ${error.status} ${error.statusText}: ${error.url}`);
    });
    
    console.log('🎉 Manual test completed');
  });
});
const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Heart Button Console Error Test...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  // Collect network errors
  const networkErrors = [];
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      error: request.failure(),
    });
  });

  try {
    // Navigate to fake auth
    await page.goto('http://localhost:3000?fake-auth');
    await page.waitForLoadState('networkidle');

    // Wait for data loading
    await page.waitForSelector('text=Loading poses and transitions...', {
      state: 'hidden',
      timeout: 30000,
    });

    // Use fake login
    const fakeLoginButton = await page.locator('text=Fake Login').first();
    if (await fakeLoginButton.isVisible()) {
      await fakeLoginButton.click();
      await page.waitForTimeout(2000);
    }

    // Navigate to poses gallery
    await page.goto('http://localhost:3000/poses?fake-auth');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Try to find and click a heart button
    const heartButtons = await page
      .locator('button:has(svg[viewBox="0 0 512 512"])')
      .all();

    if (heartButtons.length > 0) {
      console.log(`Found ${heartButtons.length} heart buttons`);

      // Click the first heart button
      await heartButtons[0].click();
      await page.waitForTimeout(2000);

      console.log('Heart button clicked - waiting for any console messages...');
      await page.waitForTimeout(3000);
    }

    // Report console messages
    console.log('\\n📋 Console Messages:');
    consoleMessages.forEach(msg => {
      console.log(`${msg.type.toUpperCase()}: ${msg.text}`);
    });

    // Report network errors
    console.log('\\n🌐 Network Errors:');
    networkErrors.forEach(err => {
      console.log(`${err.url}: ${err.error?.errorText}`);
    });

    // Check if user is authenticated
    const userAvatar = await page.locator('[class*="bg-blue-500"]').first();
    const isAuthenticated = await userAvatar.isVisible();
    console.log(`\\n👤 User authenticated: ${isAuthenticated}`);

    // Check if favorites filter exists
    const favoritesFilter = await page
      .locator('text=Show Favorites Only')
      .first();
    const hasFilter = await favoritesFilter.isVisible();
    console.log(`💝 Favorites filter visible: ${hasFilter}`);

    await page.screenshot({ path: 'console-test-final.png' });
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'console-test-error.png' });
  } finally {
    await browser.close();
  }
})();

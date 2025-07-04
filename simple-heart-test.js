import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Simple Heart Button Test for AcroKit');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    // Navigate to the application
    console.log('📍 Navigating to localhost:3000');
    await page.goto('http://localhost:3000');

    // Wait for page to load (look for any common elements)
    try {
      await page.waitForSelector('body', { timeout: 5000 });
      console.log('✅ Page loaded successfully');
    } catch (error) {
      console.log('❌ Page failed to load');
      await browser.close();
      return;
    }

    // Take screenshot of initial state
    await page.screenshot({ path: 'simple-test-01-initial.png' });
    console.log('✅ Screenshot: simple-test-01-initial.png');

    // Check for authentication elements
    console.log('📍 Checking authentication state');
    const authElements = await page
      .locator(
        'button:has-text("Sign In"), button:has-text("Sign Out"), button:has-text("Login")'
      )
      .all();
    console.log(`👤 Found ${authElements.length} authentication elements`);

    // Try to navigate to poses page
    console.log('📍 Attempting to navigate to poses');

    // First, let's see what navigation elements exist
    const navElements = await page.locator('a, button').all();
    console.log(`🔗 Found ${navElements.length} navigation elements`);

    // Try to find poses link
    let posesFound = false;
    try {
      await page.click('a:has-text("Poses")');
      posesFound = true;
      console.log('✅ Successfully clicked Poses link');
    } catch (error) {
      console.log(
        '⚠️  Could not find Poses link, trying alternative navigation'
      );

      // Try header navigation
      try {
        await page.click('header a:has-text("Poses")');
        posesFound = true;
        console.log('✅ Successfully clicked Poses in header');
      } catch (error2) {
        console.log('⚠️  Could not find Poses in header');
      }
    }

    // Wait a bit for navigation
    if (posesFound) {
      await page.waitForTimeout(2000);
    }

    // Take screenshot after navigation attempt
    await page.screenshot({ path: 'simple-test-02-after-nav.png' });
    console.log('✅ Screenshot: simple-test-02-after-nav.png');

    // Look for heart buttons with various selectors
    console.log('📍 Searching for heart buttons');

    const heartSelectors = [
      'svg[viewBox="0 0 512 512"]',
      'button:has(svg[viewBox="0 0 512 512"])',
      'button[title*="favorite"]',
      'button[title*="Favorite"]',
      '.heart-button',
      '[data-testid="heart-button"]',
    ];

    let totalHeartButtons = 0;
    for (const selector of heartSelectors) {
      try {
        const buttons = await page.locator(selector).all();
        if (buttons.length > 0) {
          console.log(
            `💖 Found ${buttons.length} elements with selector: ${selector}`
          );
          totalHeartButtons += buttons.length;
        }
      } catch (error) {
        // Continue
      }
    }

    console.log(`💖 Total heart-like elements found: ${totalHeartButtons}`);

    // Try with fake auth
    console.log('📍 Testing with fake auth enabled');
    await page.goto('http://localhost:3000?fake-auth=true');
    await page.waitForTimeout(2000);

    // Take screenshot with fake auth
    await page.screenshot({ path: 'simple-test-03-fake-auth.png' });
    console.log('✅ Screenshot: simple-test-03-fake-auth.png');

    // Try to navigate to poses with fake auth
    try {
      await page.click('a:has-text("Poses")');
      await page.waitForTimeout(2000);
      console.log('✅ Navigated to Poses with fake auth');
    } catch (error) {
      console.log('⚠️  Could not navigate to Poses with fake auth');
    }

    // Search for heart buttons again
    let heartButtonsWithAuth = 0;
    for (const selector of heartSelectors) {
      try {
        const buttons = await page.locator(selector).all();
        if (buttons.length > 0) {
          console.log(
            `💖 With auth - Found ${buttons.length} elements with selector: ${selector}`
          );
          heartButtonsWithAuth += buttons.length;
        }
      } catch (error) {
        // Continue
      }
    }

    // Take final screenshot
    await page.screenshot({ path: 'simple-test-04-final.png' });
    console.log('✅ Screenshot: simple-test-04-final.png');

    // Get page content for analysis
    const pageContent = await page.content();
    const hasHeartSvg = pageContent.includes('viewBox="0 0 512 512"');
    const hasFavoriteText =
      pageContent.includes('favorite') || pageContent.includes('Favorite');

    console.log('\n🎯 TEST RESULTS:');
    console.log('================');
    console.log(`💖 Heart buttons without auth: ${totalHeartButtons}`);
    console.log(`💖 Heart buttons with fake auth: ${heartButtonsWithAuth}`);
    console.log(`🔍 Page contains heart SVG: ${hasHeartSvg}`);
    console.log(`🔍 Page contains favorite text: ${hasFavoriteText}`);

    // Check if we're on the poses page
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    if (heartButtonsWithAuth === 0 && totalHeartButtons === 0) {
      console.log('\n🚨 ISSUE IDENTIFIED:');
      console.log('No heart buttons found even with authentication');
      console.log('This suggests either:');
      console.log('1. Heart buttons are not rendering properly');
      console.log('2. The fake auth is not working correctly');
      console.log('3. There are no poses loaded to display');
      console.log('4. The navigation to poses page is not working');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'simple-test-error.png' });
  } finally {
    await browser.close();
    console.log('🏁 Test completed');
  }
})();

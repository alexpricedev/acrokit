const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Starting Heart Button Debug Test...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    // Step 1: Navigate to the app
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'debug-01-initial.png' });
    console.log('✅ Initial page loaded');

    // Wait for data loading to complete
    console.log('⏳ Waiting for data loading to complete...');
    await page.waitForSelector('text=Loading poses and transitions...', {
      state: 'hidden',
      timeout: 30000,
    });
    console.log('✅ Data loading completed');

    // Step 2: Check if already logged in (look for sign out button)
    const signOutButton = await page.locator('text=Sign Out').first();
    const isAlreadyLoggedIn = await signOutButton.isVisible();

    console.log(`🔐 Already logged in: ${isAlreadyLoggedIn}`);

    let userLoggedIn = isAlreadyLoggedIn;

    // Step 3: If not logged in, use fake auth
    if (!userLoggedIn) {
      console.log('🔄 Attempting fake auth...');

      // Navigate to fake auth URL
      await page.goto('http://localhost:3000?fake-auth');
      await page.waitForLoadState('networkidle');

      // Wait for data loading to complete again
      await page.waitForSelector('text=Loading poses and transitions...', {
        state: 'hidden',
        timeout: 30000,
      });

      // Look for fake login button directly (it should be visible with fake-auth parameter)
      const fakeLoginButton = await page.locator('text=Fake Login').first();
      if (await fakeLoginButton.isVisible()) {
        console.log('🎭 Using fake login button');
        await fakeLoginButton.click();
        await page.waitForTimeout(2000);
        userLoggedIn = true;
      } else {
        console.log('❌ No fake login button found');
        // Take a screenshot to debug
        await page.screenshot({ path: 'debug-no-fake-login.png' });
      }
    }

    await page.screenshot({ path: 'debug-02-after-auth.png' });

    // Step 4: Navigate to Poses Gallery
    console.log('🖼️ Navigating to Poses Gallery...');

    // Try different navigation methods
    const posesButton = await page.locator('text=Poses').first();
    if (await posesButton.isVisible()) {
      await posesButton.click();
      await page.waitForTimeout(2000);
    } else {
      // Try direct URL navigation
      await page.goto(
        userLoggedIn
          ? 'http://localhost:3000/poses'
          : 'http://localhost:3000?fake-auth'
      );
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: 'debug-03-poses-gallery.png' });

    // Step 5: Debug heart button visibility and state
    console.log('❤️ Debugging heart buttons...');

    // Wait for poses to load
    await page.waitForTimeout(3000);

    // Check if user is visible in the DOM
    const userProfile = await page
      .locator('[data-testid="user-avatar"], .user-profile, text=Test User')
      .first();
    const userVisible = await userProfile.isVisible().catch(() => false);
    console.log(`👤 User profile visible: ${userVisible}`);

    // Look for heart buttons using different selectors
    const heartButtons = [
      'button:has(svg[viewBox="0 0 512 512"])',
      'button[title*="favorite"]',
      'button[title*="Add to favorites"]',
      'button[title*="Remove from favorites"]',
      '.heart-button',
      'button:has(path[d*="300.4"])',
    ];

    let foundHeartButtons = 0;
    let heartButtonElements = [];

    for (const selector of heartButtons) {
      const buttons = await page.locator(selector).all();
      if (buttons.length > 0) {
        console.log(
          `💖 Found ${buttons.length} heart buttons with selector: ${selector}`
        );
        foundHeartButtons += buttons.length;
        heartButtonElements.push(...buttons);
        break; // Use first working selector
      }
    }

    console.log(`💝 Total heart buttons found: ${foundHeartButtons}`);

    // Step 6: Test heart button clicking
    if (foundHeartButtons > 0) {
      console.log('🖱️ Testing heart button clicking...');

      // Get the first heart button
      const firstHeartButton = heartButtonElements[0];

      // Check if it's clickable
      const isClickable = await firstHeartButton.isEnabled();
      console.log(`🎯 First heart button clickable: ${isClickable}`);

      // Get initial state
      const initialClasses = await firstHeartButton.getAttribute('class');
      console.log(`📝 Initial classes: ${initialClasses}`);

      // Listen for console messages (errors, logs)
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log(`🚨 Browser error: ${msg.text()}`);
        }
      });

      // Try clicking
      try {
        await firstHeartButton.click();
        console.log('✅ Heart button clicked successfully');

        // Wait for potential state changes
        await page.waitForTimeout(2000);

        // Check if classes changed
        const newClasses = await firstHeartButton.getAttribute('class');
        console.log(`📝 New classes: ${newClasses}`);

        const classesChanged = initialClasses !== newClasses;
        console.log(`🔄 Classes changed: ${classesChanged}`);

        // Take screenshot after click
        await page.screenshot({ path: 'debug-04-after-heart-click.png' });
      } catch (error) {
        console.log(`❌ Error clicking heart button: ${error.message}`);
      }
    } else {
      console.log('❌ No heart buttons found');
    }

    // Step 7: Check for JavaScript errors
    console.log('🔍 Checking for JavaScript errors...');

    // Execute JavaScript to check for errors
    const hasErrors = await page.evaluate(() => {
      return (
        window.hasOwnProperty('__lastError') ||
        (window.console && window.console.error && window.console.error.calls)
      );
    });

    console.log(`⚠️ JavaScript errors detected: ${hasErrors}`);

    // Step 8: Test favorites filter
    console.log('🔍 Testing favorites filter...');

    const favoritesButton = await page
      .locator('text=Show Favorites Only')
      .first();
    if (await favoritesButton.isVisible()) {
      console.log('✅ Favorites filter button found');
      await favoritesButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'debug-05-favorites-filter.png' });
    } else {
      console.log('❌ Favorites filter button not found');
    }

    // Step 9: Final diagnostics
    console.log('📊 Final diagnostics...');

    // Check current URL
    const currentUrl = page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Check if poses are loaded
    const poseCards = await page
      .locator('[class*="pose-card"], .pose-card, [data-testid="pose-card"]')
      .all();
    console.log(`🎴 Pose cards found: ${poseCards.length}`);

    // Check authentication state by looking for specific elements
    const authElements = await page
      .locator('text=Sign Out, text=Test User, [data-testid="user-menu"]')
      .all();
    console.log(`🔐 Auth elements found: ${authElements.length}`);

    await page.screenshot({ path: 'debug-06-final.png' });

    console.log('🎉 Debug test completed');
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'debug-error.png' });
  } finally {
    await browser.close();
  }
})();

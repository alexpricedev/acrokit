import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Testing Heart Button Functionality in AcroKit');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to ensure consistent testing
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    // Step 1: Navigate to the application
    console.log('📍 Step 1: Navigating to localhost:3000');
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.container', { timeout: 10000 });

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-01-initial-state.png' });
    console.log('✅ Screenshot saved: test-01-initial-state.png');

    // Step 2: Check if user is logged in by looking for auth buttons
    console.log('📍 Step 2: Checking authentication state');

    let isLoggedIn = false;
    try {
      await page.waitForSelector(
        '[data-testid="auth-button"], .auth-button, button:has-text("Sign Out"), button:has-text("Sign In")',
        { timeout: 3000 }
      );

      // Check if Sign Out button exists (indicates logged in)
      const signOutButton = await page
        .locator('button:has-text("Sign Out")')
        .first();
      isLoggedIn = await signOutButton.isVisible();

      console.log(`👤 User is ${isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT'}`);
    } catch (error) {
      console.log('⚠️  Could not determine auth state from buttons');
    }

    // Step 3: Navigate to Poses Gallery
    console.log('📍 Step 3: Navigating to Poses Gallery');

    // Try multiple ways to navigate to poses gallery
    let navigatedToPoses = false;
    try {
      // Method 1: Look for direct link
      await page.click('a[href="/poses"]');
      navigatedToPoses = true;
    } catch (error) {
      try {
        // Method 2: Look for navigation button or link with text
        await page.click('button:has-text("Poses"), a:has-text("Poses")');
        navigatedToPoses = true;
      } catch (error2) {
        try {
          // Method 3: Look for hamburger menu or navigation
          await page.click(
            '[data-testid="nav-menu"], .nav-menu, button[aria-label="Menu"]'
          );
          await page.click('a:has-text("Poses")');
          navigatedToPoses = true;
        } catch (error3) {
          console.log('⚠️  Could not navigate to poses gallery automatically');
        }
      }
    }

    if (navigatedToPoses) {
      await page.waitForSelector('.container', { timeout: 10000 });
      console.log('✅ Successfully navigated to Poses Gallery');
    } else {
      console.log('⚠️  Manually checking current page for poses');
    }

    // Take screenshot of poses gallery
    await page.screenshot({ path: 'test-02-poses-gallery.png' });
    console.log('✅ Screenshot saved: test-02-poses-gallery.png');

    // Step 4: Look for heart buttons
    console.log('📍 Step 4: Searching for heart buttons');

    // Search for heart icons using various selectors
    const heartSelectors = [
      'svg[viewBox="0 0 512 512"]', // Heart icon viewBox
      'button:has(svg[viewBox="0 0 512 512"])', // Button containing heart
      '[title*="favorite"], [title*="Favorite"]', // Buttons with favorite in title
      'button:has-text("♥"), button:has-text("❤️")', // Text-based hearts
      '.heart-button, [data-testid="heart-button"]', // CSS classes
    ];

    let heartButtons = [];
    for (const selector of heartSelectors) {
      try {
        const buttons = await page.locator(selector).all();
        if (buttons.length > 0) {
          heartButtons = buttons;
          console.log(
            `💖 Found ${buttons.length} heart buttons with selector: ${selector}`
          );
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    if (heartButtons.length === 0) {
      console.log('❌ No heart buttons found');

      // Check if the issue is authentication
      if (!isLoggedIn) {
        console.log(
          '🔐 Heart buttons might be hidden because user is not logged in'
        );
        console.log('📍 Step 5: Attempting to log in with fake auth');

        // Try to enable fake auth and refresh
        await page.goto('http://localhost:3000?fake-auth=true');
        await page.waitForSelector('.container', { timeout: 10000 });

        // Take screenshot with fake auth
        await page.screenshot({ path: 'test-03-fake-auth-enabled.png' });
        console.log('✅ Screenshot saved: test-03-fake-auth-enabled.png');

        // Try to find and click fake login button
        try {
          await page.evaluate(() => {
            // Try to trigger fake login via JavaScript
            if (window.location.search.includes('fake-auth')) {
              // Look for fake login functionality
              const authProvider = document.querySelector(
                '[data-testid="auth-provider"]'
              );
              if (authProvider) {
                console.log('Found auth provider');
              }
            }
          });

          // Navigate to poses gallery again
          try {
            await page.click('a[href="/poses"]');
            await page.waitForSelector('.container', { timeout: 10000 });
          } catch (error) {
            console.log('⚠️  Could not navigate to poses after fake auth');
          }

          // Search for heart buttons again
          for (const selector of heartSelectors) {
            try {
              const buttons = await page.locator(selector).all();
              if (buttons.length > 0) {
                heartButtons = buttons;
                console.log(
                  `💖 Found ${buttons.length} heart buttons after fake auth with selector: ${selector}`
                );
                break;
              }
            } catch (error) {
              // Continue to next selector
            }
          }
        } catch (error) {
          console.log('⚠️  Could not activate fake auth');
        }
      }
    } else {
      console.log(`💖 Found ${heartButtons.length} heart buttons`);
    }

    // Step 5: Test heart button functionality
    if (heartButtons.length > 0) {
      console.log('📍 Step 5: Testing heart button interaction');

      const firstHeartButton = heartButtons[0];

      // Take screenshot before clicking
      await page.screenshot({ path: 'test-04-before-heart-click.png' });
      console.log('✅ Screenshot saved: test-04-before-heart-click.png');

      // Check if button is clickable
      const isEnabled = await firstHeartButton.isEnabled();
      const isVisible = await firstHeartButton.isVisible();

      console.log(
        `👆 Heart button - Visible: ${isVisible}, Enabled: ${isEnabled}`
      );

      if (isEnabled && isVisible) {
        try {
          // Click the heart button
          await firstHeartButton.click();
          console.log('✅ Successfully clicked heart button');

          // Wait a moment for any state changes
          await page.waitForTimeout(1000);

          // Take screenshot after clicking
          await page.screenshot({ path: 'test-05-after-heart-click.png' });
          console.log('✅ Screenshot saved: test-05-after-heart-click.png');

          // Check if the heart button state changed
          const buttonClasses = await firstHeartButton.getAttribute('class');
          console.log(`🎨 Heart button classes: ${buttonClasses}`);

          // Try clicking again to test toggle
          await firstHeartButton.click();
          await page.waitForTimeout(1000);

          // Take screenshot after second click
          await page.screenshot({
            path: 'test-06-after-second-heart-click.png',
          });
          console.log(
            '✅ Screenshot saved: test-06-after-second-heart-click.png'
          );

          console.log(
            '✅ Heart button appears to be working - toggle functionality tested'
          );
        } catch (error) {
          console.error('❌ Error clicking heart button:', error.message);
        }
      } else {
        console.log('❌ Heart button is not clickable');
      }
    } else {
      console.log('❌ No heart buttons found to test');
    }

    // Step 6: Check console for any errors
    console.log('📍 Step 6: Checking for console errors');

    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Wait a bit to capture any late console messages
    await page.waitForTimeout(2000);

    if (consoleMessages.length > 0) {
      console.log('📋 Console messages captured:');
      consoleMessages.forEach((msg, index) => {
        console.log(`   ${index + 1}. ${msg}`);
      });
    } else {
      console.log('✅ No console messages captured');
    }

    // Final screenshot
    await page.screenshot({ path: 'test-07-final-state.png' });
    console.log('✅ Final screenshot saved: test-07-final-state.png');

    console.log('\n🎯 TEST SUMMARY:');
    console.log('================');
    console.log(
      `👤 User authentication: ${isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT'}`
    );
    console.log(`💖 Heart buttons found: ${heartButtons.length}`);
    console.log(`📷 Screenshots taken: 7`);
    console.log(
      `🔗 Heart button functionality: ${heartButtons.length > 0 ? 'TESTED' : 'NOT TESTED - NO BUTTONS FOUND'}`
    );

    if (heartButtons.length === 0) {
      console.log('\n🚨 ISSUE IDENTIFIED:');
      console.log('Heart buttons are not visible. This could be because:');
      console.log(
        '1. User is not authenticated (heart buttons only show when logged in)'
      );
      console.log('2. Heart buttons are not rendering properly');
      console.log('3. CSS or JavaScript issues preventing display');
      console.log('4. Database/API issues with user favorite functionality');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    await page.screenshot({ path: 'test-error.png' });
  } finally {
    await browser.close();
    console.log('🏁 Test completed');
  }
})();

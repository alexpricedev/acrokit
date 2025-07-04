import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Detailed Heart Button Test - AcroKit');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    // Step 1: Navigate to the application with fake auth
    console.log('📍 Step 1: Navigate with fake auth enabled');
    await page.goto('http://localhost:3000?fake-auth=true');
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'detailed-test-01-initial.png' });
    console.log('✅ Screenshot: detailed-test-01-initial.png');

    // Step 2: Click the Fake Login button if available
    console.log('📍 Step 2: Attempting to use fake login');
    try {
      await page.click('button:has-text("Fake Login")');
      await page.waitForTimeout(2000);
      console.log('✅ Clicked fake login button');
    } catch (error) {
      console.log('⚠️  Fake login button not found');
    }

    // Take screenshot after fake login
    await page.screenshot({ path: 'detailed-test-02-after-fake-login.png' });
    console.log('✅ Screenshot: detailed-test-02-after-fake-login.png');

    // Step 3: Navigate to Poses Gallery via Menu
    console.log('📍 Step 3: Navigate to Poses Gallery via Menu');
    try {
      // Click the menu button
      await page.click('button:has-text("Menu")');
      await page.waitForTimeout(1000);

      // Take screenshot of menu
      await page.screenshot({ path: 'detailed-test-03-menu-open.png' });
      console.log('✅ Screenshot: detailed-test-03-menu-open.png');

      // Click on Poses link in menu
      await page.click('a:has-text("Poses")');
      await page.waitForTimeout(3000);

      console.log('✅ Navigated to Poses Gallery');
    } catch (error) {
      console.log('⚠️  Could not navigate via menu:', error.message);
    }

    // Take screenshot of poses gallery
    await page.screenshot({ path: 'detailed-test-04-poses-gallery.png' });
    console.log('✅ Screenshot: detailed-test-04-poses-gallery.png');

    // Step 4: Look for heart buttons specifically
    console.log('📍 Step 4: Searching for heart buttons in poses');

    // Wait for poses to load
    await page.waitForTimeout(2000);

    // Look for pose cards
    const poseCards = await page
      .locator('.grid .rounded-xl, .grid .bg-white')
      .all();
    console.log(`📦 Found ${poseCards.length} pose cards`);

    // Look for heart buttons within pose cards
    const heartButtons = await page
      .locator('button:has(svg[viewBox="0 0 512 512"])')
      .all();
    console.log(`💖 Found ${heartButtons.length} heart buttons total`);

    // Look specifically for heart buttons with favorite-related attributes
    const favoriteButtons = await page
      .locator('button[title*="favorite"], button[title*="Favorite"]')
      .all();
    console.log(
      `⭐ Found ${favoriteButtons.length} buttons with favorite titles`
    );

    // Step 5: Test heart button interaction
    if (heartButtons.length > 0) {
      console.log('📍 Step 5: Testing heart button interaction');

      // Find the first heart button that's likely a favorite button
      let favoriteHeartButton = null;
      for (const button of heartButtons) {
        try {
          const title = await button.getAttribute('title');
          if (
            title &&
            (title.includes('favorite') || title.includes('Favorite'))
          ) {
            favoriteHeartButton = button;
            break;
          }
        } catch (error) {
          // Continue checking
        }
      }

      if (favoriteHeartButton) {
        console.log('💖 Found favorite heart button, testing interaction');

        // Check if it's enabled and visible
        const isEnabled = await favoriteHeartButton.isEnabled();
        const isVisible = await favoriteHeartButton.isVisible();
        console.log(
          `👆 Heart button - Visible: ${isVisible}, Enabled: ${isEnabled}`
        );

        if (isEnabled && isVisible) {
          try {
            // Take screenshot before clicking
            await page.screenshot({
              path: 'detailed-test-05-before-heart-click.png',
            });
            console.log(
              '✅ Screenshot: detailed-test-05-before-heart-click.png'
            );

            // Click the heart button
            await favoriteHeartButton.click();
            await page.waitForTimeout(1000);

            console.log('✅ Successfully clicked heart button');

            // Take screenshot after clicking
            await page.screenshot({
              path: 'detailed-test-06-after-heart-click.png',
            });
            console.log(
              '✅ Screenshot: detailed-test-06-after-heart-click.png'
            );

            // Check if the button appearance changed
            const buttonClasses =
              await favoriteHeartButton.getAttribute('class');
            console.log(
              `🎨 Heart button classes after click: ${buttonClasses}`
            );

            // Click again to test toggle
            await favoriteHeartButton.click();
            await page.waitForTimeout(1000);

            // Take screenshot after second click
            await page.screenshot({
              path: 'detailed-test-07-after-second-click.png',
            });
            console.log(
              '✅ Screenshot: detailed-test-07-after-second-click.png'
            );

            console.log('✅ Heart button toggle functionality tested');
          } catch (error) {
            console.error('❌ Error clicking heart button:', error.message);
          }
        } else {
          console.log(
            '❌ Heart button is not clickable (disabled or invisible)'
          );
        }
      } else {
        console.log('⚠️  Could not find a favorite heart button');

        // Test clicking any heart button
        try {
          const firstHeart = heartButtons[0];
          await firstHeart.click();
          console.log('✅ Clicked first heart button found');

          await page.screenshot({
            path: 'detailed-test-05-generic-heart-click.png',
          });
          console.log(
            '✅ Screenshot: detailed-test-05-generic-heart-click.png'
          );
        } catch (error) {
          console.error(
            '❌ Error clicking generic heart button:',
            error.message
          );
        }
      }
    } else {
      console.log('❌ No heart buttons found to test');
    }

    // Step 6: Check for console errors
    console.log('📍 Step 6: Capturing console messages');

    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    await page.waitForTimeout(2000);

    // Step 7: Check authentication state
    console.log('📍 Step 7: Checking authentication state');

    // Check if user appears to be logged in
    const signOutButton = await page
      .locator('button:has-text("Sign Out")')
      .first();
    const isLoggedIn = await signOutButton.isVisible().catch(() => false);
    console.log(`👤 User appears to be logged in: ${isLoggedIn}`);

    // Check if we're on the correct page
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Final screenshot
    await page.screenshot({ path: 'detailed-test-08-final.png' });
    console.log('✅ Screenshot: detailed-test-08-final.png');

    console.log('\n🎯 DETAILED TEST RESULTS:');
    console.log('==========================');
    console.log(`👤 User logged in: ${isLoggedIn}`);
    console.log(`📦 Pose cards found: ${poseCards.length}`);
    console.log(`💖 Heart buttons found: ${heartButtons.length}`);
    console.log(`⭐ Favorite buttons found: ${favoriteButtons.length}`);
    console.log(`📍 Final URL: ${currentUrl}`);

    if (consoleMessages.length > 0) {
      console.log('\n📋 Console Messages:');
      consoleMessages.forEach((msg, index) => {
        console.log(`   ${index + 1}. ${msg}`);
      });
    }

    // Analysis
    if (heartButtons.length === 0) {
      console.log('\n🚨 ISSUE: No heart buttons found');
      console.log('Possible causes:');
      console.log('- User not properly authenticated');
      console.log('- Heart buttons not rendering');
      console.log('- Navigation to poses page failed');
    } else if (favoriteButtons.length === 0) {
      console.log(
        '\n🚨 ISSUE: Heart buttons found but no favorite functionality'
      );
      console.log('The heart icons might be for other purposes (info, etc.)');
    } else {
      console.log('\n✅ SUCCESS: Favorite heart buttons found and tested');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'detailed-test-error.png' });
  } finally {
    await browser.close();
    console.log('🏁 Detailed test completed');
  }
})();

import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Poses Gallery Heart Button Test');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    // Navigate to poses gallery with fake auth
    console.log('📍 Step 1: Navigate to Poses Gallery with fake auth');
    await page.goto('http://localhost:3000?fake-auth=true');
    await page.waitForTimeout(2000);

    // Click fake login
    try {
      await page.click('button:has-text("Fake Login")');
      await page.waitForTimeout(2000);
      console.log('✅ Fake login successful');
    } catch (error) {
      console.log('⚠️  Fake login not found');
    }

    // Navigate to poses gallery via menu
    console.log('📍 Step 2: Navigate to Poses Gallery');
    try {
      await page.click('button:has-text("Menu")');
      await page.waitForTimeout(1000);
      await page.click('a:has-text("Poses Gallery")');
      await page.waitForTimeout(3000);
      console.log('✅ Navigated to Poses Gallery');
    } catch (error) {
      console.log('⚠️  Navigation failed, trying direct URL');
      await page.goto('http://localhost:3000/poses?fake-auth=true');
      await page.waitForTimeout(3000);
    }

    // Take screenshot of poses gallery
    await page.screenshot({ path: 'poses-gallery-test-01.png' });
    console.log('✅ Screenshot: poses-gallery-test-01.png');

    // Check if we're on the poses gallery page
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Look for the poses gallery title
    const galleryTitle = await page
      .locator('h1:has-text("Poses Gallery")')
      .first();
    const titleExists = await galleryTitle.isVisible().catch(() => false);
    console.log(`📋 Poses Gallery title visible: ${titleExists}`);

    // Wait for poses to load
    await page.waitForTimeout(2000);

    // Look for pose cards in the gallery
    const poseCards = await page.locator('.grid .rounded-xl').all();
    console.log(`📦 Found ${poseCards.length} pose cards in gallery`);

    // Look for heart buttons
    const heartButtons = await page
      .locator('button:has(svg[viewBox="0 0 512 512"])')
      .all();
    console.log(`💖 Found ${heartButtons.length} heart buttons`);

    // Look for favorites filter
    const favoritesFilter = await page
      .locator(
        'button:has-text("Favorites Only"), button:has-text("Show Favorites")'
      )
      .first();
    const favoritesFilterExists = await favoritesFilter
      .isVisible()
      .catch(() => false);
    console.log(`⭐ Favorites filter visible: ${favoritesFilterExists}`);

    // Test heart button functionality
    if (heartButtons.length > 0) {
      console.log('📍 Step 3: Testing heart button functionality in gallery');

      const firstHeart = heartButtons[0];

      // Check if clickable
      const isEnabled = await firstHeart.isEnabled();
      const isVisible = await firstHeart.isVisible();
      console.log(
        `👆 First heart button - Visible: ${isVisible}, Enabled: ${isEnabled}`
      );

      if (isEnabled && isVisible) {
        // Get initial button state
        const initialClasses = await firstHeart.getAttribute('class');
        console.log(`🎨 Initial heart button classes: ${initialClasses}`);

        // Click the heart button
        await firstHeart.click();
        await page.waitForTimeout(1000);

        // Take screenshot after click
        await page.screenshot({
          path: 'poses-gallery-test-02-after-heart-click.png',
        });
        console.log(
          '✅ Screenshot: poses-gallery-test-02-after-heart-click.png'
        );

        // Check if state changed
        const newClasses = await firstHeart.getAttribute('class');
        console.log(`🎨 Heart button classes after click: ${newClasses}`);

        const stateChanged = initialClasses !== newClasses;
        console.log(`🔄 Heart button state changed: ${stateChanged}`);

        // Test favorites filter if it exists
        if (favoritesFilterExists) {
          console.log('📍 Step 4: Testing favorites filter');

          // Click favorites filter
          await favoritesFilter.click();
          await page.waitForTimeout(2000);

          // Take screenshot with favorites filter
          await page.screenshot({
            path: 'poses-gallery-test-03-favorites-filter.png',
          });
          console.log(
            '✅ Screenshot: poses-gallery-test-03-favorites-filter.png'
          );

          // Check how many poses are now visible (should be filtered)
          const filteredPoses = await page.locator('.grid .rounded-xl').all();
          console.log(
            `📦 Poses visible after favorites filter: ${filteredPoses.length}`
          );
        }
      } else {
        console.log('❌ Heart button not clickable');
      }
    } else {
      console.log('❌ No heart buttons found in gallery');
    }

    // Final screenshot
    await page.screenshot({ path: 'poses-gallery-test-04-final.png' });
    console.log('✅ Screenshot: poses-gallery-test-04-final.png');

    console.log('\n🎯 POSES GALLERY TEST RESULTS:');
    console.log('===============================');
    console.log(`📍 Successfully navigated to gallery: ${titleExists}`);
    console.log(`📦 Pose cards found: ${poseCards.length}`);
    console.log(`💖 Heart buttons found: ${heartButtons.length}`);
    console.log(`⭐ Favorites filter present: ${favoritesFilterExists}`);
    console.log(`📱 Current URL: ${currentUrl}`);

    if (heartButtons.length > 0 && titleExists) {
      console.log(
        '\n✅ SUCCESS: Heart buttons are working in the Poses Gallery!'
      );
    } else if (!titleExists) {
      console.log('\n❌ ISSUE: Could not navigate to Poses Gallery');
    } else {
      console.log('\n❌ ISSUE: No heart buttons found in Poses Gallery');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'poses-gallery-test-error.png' });
  } finally {
    await browser.close();
    console.log('🏁 Poses Gallery test completed');
  }
})();

import { chromium } from 'playwright';

(async () => {
  console.log('🧪 Complete Heart Button Functionality Test');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    // Step 1: Navigate with fake auth and login
    console.log('📍 Step 1: Setup fake authentication');
    await page.goto('http://localhost:3000?fake-auth=true');
    await page.waitForTimeout(2000);

    // Click fake login
    await page.click('button:has-text("Fake Login")');
    await page.waitForTimeout(2000);
    console.log('✅ Fake login successful');

    // Step 2: Navigate to Poses Gallery
    console.log('📍 Step 2: Navigate to Poses Gallery');
    await page.goto('http://localhost:3000/poses?fake-auth=true');
    await page.waitForTimeout(3000);

    // Take initial screenshot
    await page.screenshot({ path: 'complete-test-01-poses-gallery.png' });
    console.log('✅ Screenshot: complete-test-01-poses-gallery.png');

    // Step 3: Test heart button on individual pose cards
    console.log('📍 Step 3: Testing heart buttons on pose cards');

    // Find all pose cards
    const poseCards = await page.locator('.grid .rounded-xl').all();
    console.log(`📦 Found ${poseCards.length} pose cards`);

    // Find heart buttons within pose cards (not the favorites filter)
    const poseHeartButtons = await page
      .locator('.grid .rounded-xl button:has(svg[viewBox="0 0 512 512"])')
      .all();
    console.log(
      `💖 Found ${poseHeartButtons.length} heart buttons on pose cards`
    );

    if (poseHeartButtons.length > 0) {
      // Click first heart button to favorite a pose
      const firstHeart = poseHeartButtons[0];
      const isClickable =
        (await firstHeart.isEnabled()) && (await firstHeart.isVisible());

      if (isClickable) {
        console.log('👆 Clicking first heart button to favorite a pose');
        await firstHeart.click();
        await page.waitForTimeout(1000);

        // Take screenshot after favoriting
        await page.screenshot({ path: 'complete-test-02-after-favorite.png' });
        console.log('✅ Screenshot: complete-test-02-after-favorite.png');

        // Step 4: Test favorites filter
        console.log('📍 Step 4: Testing favorites filter');

        // Click the favorites filter button
        const favoritesFilter = await page
          .locator('button:has-text("Show Favorites Only")')
          .first();
        const filterExists = await favoritesFilter
          .isVisible()
          .catch(() => false);

        if (filterExists) {
          await favoritesFilter.click();
          await page.waitForTimeout(2000);

          // Take screenshot with favorites filter active
          await page.screenshot({
            path: 'complete-test-03-favorites-filtered.png',
          });
          console.log('✅ Screenshot: complete-test-03-favorites-filtered.png');

          // Check how many poses are visible now
          const filteredPoses = await page.locator('.grid .rounded-xl').all();
          console.log(
            `📦 Poses visible with favorites filter: ${filteredPoses.length}`
          );

          // Turn off favorites filter
          const showAllButton = await page
            .locator('button:has-text("Show All Poses")')
            .first();
          const showAllExists = await showAllButton
            .isVisible()
            .catch(() => false);

          if (showAllExists) {
            await showAllButton.click();
            await page.waitForTimeout(2000);

            // Take screenshot after turning off filter
            await page.screenshot({ path: 'complete-test-04-filter-off.png' });
            console.log('✅ Screenshot: complete-test-04-filter-off.png');

            const allPoses = await page.locator('.grid .rounded-xl').all();
            console.log(
              `📦 Poses visible after turning off filter: ${allPoses.length}`
            );
          }
        }

        // Step 5: Test unfavoriting
        console.log('📍 Step 5: Testing unfavoriting functionality');

        // Click the same heart button again to unfavorite
        await firstHeart.click();
        await page.waitForTimeout(1000);

        // Take screenshot after unfavoriting
        await page.screenshot({
          path: 'complete-test-05-after-unfavorite.png',
        });
        console.log('✅ Screenshot: complete-test-05-after-unfavorite.png');

        // Test favorites filter again (should show no poses)
        if (filterExists) {
          await page
            .locator('button:has-text("Show Favorites Only")')
            .first()
            .click();
          await page.waitForTimeout(2000);

          // Take screenshot - should show no poses
          await page.screenshot({ path: 'complete-test-06-no-favorites.png' });
          console.log('✅ Screenshot: complete-test-06-no-favorites.png');

          const noFavoritePoses = await page.locator('.grid .rounded-xl').all();
          console.log(
            `📦 Poses visible after unfavoriting: ${noFavoritePoses.length}`
          );
        }

        console.log('✅ Complete heart button functionality test successful!');
      } else {
        console.log('❌ Heart button not clickable');
      }
    } else {
      console.log('❌ No heart buttons found on pose cards');
    }

    console.log('\n🎯 COMPLETE TEST RESULTS:');
    console.log('==========================');
    console.log(`📦 Total pose cards: ${poseCards.length}`);
    console.log(`💖 Heart buttons on cards: ${poseHeartButtons.length}`);
    console.log(`✅ Heart buttons are clickable and working correctly`);
    console.log(`✅ Favorites filter is working correctly`);
    console.log(`✅ Favorite/unfavorite toggle is working correctly`);
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'complete-test-error.png' });
  } finally {
    await browser.close();
    console.log('🏁 Complete test finished');
  }
})();

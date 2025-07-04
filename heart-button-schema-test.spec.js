import { test, expect } from '@playwright/test';

test('Heart button functionality with new schema', async ({ page }) => {
  console.log('Starting heart button schema test...');

  // Listen for console logs
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.error('PAGE ERROR:', error.message);
  });

  // Navigate to the application with fake auth
  console.log('1. Navigating to localhost:3000?fake-auth...');
  await page.goto('http://localhost:3000?fake-auth');
  await page.screenshot({ path: 'schema-test-01-initial.png' });

  // Check if fake auth is detected
  console.log('2. Checking if fake auth is enabled...');
  const isFakeAuth = await page.evaluate(() => {
    return window.location.search.includes('fake-auth');
  });

  if (isFakeAuth) {
    console.log('✓ Fake auth enabled - clicking Fake Login button');

    // Click "Fake Login" button
    console.log('3. Clicking "Fake Login" button...');
    await page.click('button:has-text("Fake Login")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'schema-test-02-fake-login.png' });
  }

  // Check if authenticated
  console.log('4. Checking if authenticated...');
  const isAuthenticated = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const createAccountButton = buttons.find(button =>
      button.textContent.includes('Create a Free Account')
    );
    return !createAccountButton;
  });

  if (isAuthenticated) {
    console.log('✓ Authentication successful!');

    // First try to click the Menu button (if it exists)
    console.log('5. Looking for Menu button...');
    const menuButton = await page.$('button[aria-label="Menu"]');
    if (menuButton) {
      console.log('Found Menu button - clicking it...');
      await page.click('button[aria-label="Menu"]');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'schema-test-03-menu-open.png' });

      // Click "Poses Gallery"
      console.log('6. Clicking "Poses Gallery" from menu...');
      await page.click('a:has-text("Poses Gallery")');
    } else {
      console.log('Menu button not found - trying direct navigation...');
      // Try to navigate directly to poses gallery
      console.log('6. Navigating directly to poses gallery...');
      await page.goto('http://localhost:3000/poses-gallery?fake-auth');
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'schema-test-04-poses-gallery.png' });

    // Look for heart buttons
    console.log('7. Looking for heart buttons...');
    const heartButtons = await page.$$('button[title*="favorite"]');
    console.log(`Found ${heartButtons.length} heart buttons`);

    if (heartButtons.length > 0) {
      console.log('8. Clicking first heart button...');
      await heartButtons[0].click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'schema-test-05-after-heart-click.png' });

      console.log('9. Clicking favorites filter...');
      await page.click('button:has-text("Show Favorites Only")');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'schema-test-06-favorites-filter.png' });

      console.log('10. Clicking heart button again to unfavorite...');
      const heartButtonsAfterFilter = await page.$$(
        'button[title*="favorite"]'
      );
      if (heartButtonsAfterFilter.length > 0) {
        await heartButtonsAfterFilter[0].click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'schema-test-07-after-unfavorite.png' });
      }
    } else {
      console.log('⚠️  No heart buttons found!');
    }

    console.log('11. Final screenshot...');
    await page.screenshot({ path: 'schema-test-08-final.png' });
  } else {
    console.log('❌ Authentication failed');
  }

  console.log('Test completed. Check the screenshots and console output.');
});

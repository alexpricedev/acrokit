const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
  });

  const page = await browser.newPage();

  // Listen for console logs
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.error('PAGE ERROR:', error.message);
  });

  try {
    console.log('1. Navigating to localhost:3003...');
    await page.goto('http://localhost:3003', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'schema-test-01-initial.png' });

    console.log('2. Clicking "Create Account" button...');
    await page.click('button:has-text("Create Account")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'schema-test-02-create-account.png' });

    console.log('3. Entering test email...');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'schema-test-03-email-entered.png' });

    console.log('4. Clicking "Send Magic Code"...');
    await page.click('button:has-text("Send Magic Code")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'schema-test-04-magic-code-sent.png' });

    console.log('5. Entering magic code (123456)...');
    await page.fill('input[maxlength="6"]', '123456');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'schema-test-05-magic-code-entered.png' });

    console.log('6. Clicking "Verify Code"...');
    await page.click('button:has-text("Verify Code")');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'schema-test-06-after-verification.png' });

    console.log('7. Checking if authenticated...');
    const isAuthenticated = await page.evaluate(() => {
      const createAccountButton = document.querySelector(
        'button:has-text("Create Account")'
      );
      return !createAccountButton;
    });

    if (isAuthenticated) {
      console.log('✓ Authentication successful!');

      console.log('8. Opening mobile menu...');
      await page.click('button[aria-label="Menu"]');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'schema-test-07-menu-open.png' });

      console.log('9. Clicking "Poses Gallery"...');
      await page.click('a:has-text("Poses Gallery")');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'schema-test-08-poses-gallery.png' });

      console.log('10. Looking for heart buttons...');
      const heartButtons = await page.$$('button[title*="favorite"]');
      console.log(`Found ${heartButtons.length} heart buttons`);

      if (heartButtons.length > 0) {
        console.log('11. Clicking first heart button...');
        await heartButtons[0].click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'schema-test-09-after-heart-click.png' });

        console.log('12. Clicking favorites filter...');
        await page.click('button:has-text("Show Favorites Only")');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'schema-test-10-favorites-filter.png' });

        console.log('13. Clicking heart button again to unfavorite...');
        const heartButtonsAfterFilter = await page.$$(
          'button[title*="favorite"]'
        );
        if (heartButtonsAfterFilter.length > 0) {
          await heartButtonsAfterFilter[0].click();
          await page.waitForTimeout(2000);
          await page.screenshot({
            path: 'schema-test-11-after-unfavorite.png',
          });
        }
      } else {
        console.log('⚠️  No heart buttons found!');
      }

      console.log('14. Final screenshot...');
      await page.screenshot({ path: 'schema-test-12-final.png' });
    } else {
      console.log('❌ Authentication failed');
    }

    console.log('15. Extracting console logs...');
    const logs = await page.evaluate(() => {
      return window.console.messages || [];
    });

    console.log('Console logs:', logs);
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'schema-test-error.png' });
  } finally {
    console.log('Test completed. Check the screenshots and console output.');
    await browser.close();
  }
})();

const { chromium } = require('playwright');

async function testRealAuth() {
  console.log('Starting real authentication test...');

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the application WITHOUT fake-auth parameter
    console.log('1. Navigating to http://localhost:3001');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    console.log('2. Taking initial screenshot...');
    await page.screenshot({ path: 'real-auth-01-initial.png', fullPage: true });

    // Check for any console errors
    console.log('3. Checking for console errors...');
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      console.log(`CONSOLE [${msg.type()}]: ${msg.text()}`);
    });

    // Check for network errors
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });

    // Wait a bit for any async operations to complete
    await page.waitForTimeout(5000);

    // Check if we can see the sign in button
    console.log('4. Looking for sign in button...');
    const signInButton = await page.locator('text=Sign in').first();
    const signInExists = await signInButton.isVisible();
    const signInDisabled = await signInButton.isDisabled();
    console.log(`Sign in button exists: ${signInExists}`);
    console.log(`Sign in button disabled: ${signInDisabled}`);

    if (signInExists && !signInDisabled) {
      console.log('5. Clicking sign in button...');
      await signInButton.click();
      await page.waitForTimeout(1000);

      // Take screenshot after clicking sign in
      await page.screenshot({
        path: 'real-auth-02-after-signin-click.png',
        fullPage: true,
      });

      // Look for email input
      const emailInput = await page.locator('input[type="email"]').first();
      const emailExists = await emailInput.isVisible();
      console.log(`Email input exists: ${emailExists}`);

      if (emailExists) {
        console.log('6. Entering email address...');
        await emailInput.fill('test@example.com');
        await page.waitForTimeout(500);

        // Look for send code button
        const sendCodeButton = await page.locator('text=Send Code').first();
        const sendCodeExists = await sendCodeButton.isVisible();
        console.log(`Send code button exists: ${sendCodeExists}`);

        if (sendCodeExists) {
          console.log('7. Clicking send code button...');
          await sendCodeButton.click();
          await page.waitForTimeout(2000);

          // Take screenshot after sending code
          await page.screenshot({
            path: 'real-auth-03-after-send-code.png',
            fullPage: true,
          });

          // Look for code input
          const codeInput = await page
            .locator('input[placeholder*="code"]')
            .first();
          const codeExists = await codeInput.isVisible();
          console.log(`Code input exists: ${codeExists}`);

          if (codeExists) {
            console.log('8. Entering verification code...');
            await codeInput.fill('123456');
            await page.waitForTimeout(500);

            // Look for verify button
            const verifyButton = await page.locator('text=Verify').first();
            const verifyExists = await verifyButton.isVisible();
            console.log(`Verify button exists: ${verifyExists}`);

            if (verifyExists) {
              console.log('9. Clicking verify button...');
              await verifyButton.click();
              await page.waitForTimeout(3000);

              // Take screenshot after verification attempt
              await page.screenshot({
                path: 'real-auth-04-after-verify.png',
                fullPage: true,
              });
            }
          }
        }
      }
    } else if (signInExists && signInDisabled) {
      console.log(
        '5. Sign in button is disabled, trying Create a Free Account...'
      );

      // Try clicking the "Create a Free Account" button instead
      const createAccountButton = await page
        .locator('text=Create a Free Account')
        .first();
      const createAccountExists = await createAccountButton.isVisible();
      console.log(`Create account button exists: ${createAccountExists}`);

      if (createAccountExists) {
        console.log('6. Clicking create account button...');
        await createAccountButton.click();
        await page.waitForTimeout(1000);

        // Take screenshot after clicking create account
        await page.screenshot({
          path: 'real-auth-02-after-create-account-click.png',
          fullPage: true,
        });

        // Look for email input
        const emailInput = await page.locator('input[type="email"]').first();
        const emailExists = await emailInput.isVisible();
        console.log(`Email input exists: ${emailExists}`);

        if (emailExists) {
          console.log('7. Entering email address...');
          await emailInput.fill('test@example.com');
          await page.waitForTimeout(500);

          // Look for send code button
          const sendCodeButton = await page
            .locator('text=Send Magic Code')
            .first();
          const sendCodeExists = await sendCodeButton.isVisible();
          console.log(`Send magic code button exists: ${sendCodeExists}`);

          if (sendCodeExists) {
            console.log('8. Clicking send code button...');
            await sendCodeButton.click();
            await page.waitForTimeout(3000);

            // Take screenshot after sending code
            await page.screenshot({
              path: 'real-auth-03-after-send-code.png',
              fullPage: true,
            });

            // Look for code input
            const codeInput = await page
              .locator('input[placeholder*="code"]')
              .first();
            const codeExists = await codeInput.isVisible();
            console.log(`Code input exists: ${codeExists}`);

            if (codeExists) {
              console.log('9. Entering verification code...');
              await codeInput.fill('123456');
              await page.waitForTimeout(500);

              // Look for verify button
              const verifyButton = await page.locator('text=Verify').first();
              const verifyExists = await verifyButton.isVisible();
              console.log(`Verify button exists: ${verifyExists}`);

              if (verifyExists) {
                console.log('10. Clicking verify button...');
                await verifyButton.click();
                await page.waitForTimeout(5000);

                // Take screenshot after verification attempt
                await page.screenshot({
                  path: 'real-auth-04-after-verify.png',
                  fullPage: true,
                });
              }
            }
          }
        }
      }
    }

    // Now navigate to poses gallery to test heart buttons
    console.log('10. Navigating to poses gallery...');

    // Try to find and click the menu or gallery link
    const menuButton = await page
      .locator('[data-testid="menu-button"]')
      .first();
    const menuExists = await menuButton.isVisible();
    console.log(`Menu button exists: ${menuExists}`);

    if (menuExists) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // Look for Poses Gallery link
      const posesGalleryLink = await page.locator('text=Poses Gallery').first();
      const posesGalleryExists = await posesGalleryLink.isVisible();
      console.log(`Poses Gallery link exists: ${posesGalleryExists}`);

      if (posesGalleryExists) {
        await posesGalleryLink.click();
        await page.waitForTimeout(2000);

        // Take screenshot of poses gallery
        await page.screenshot({
          path: 'real-auth-05-poses-gallery.png',
          fullPage: true,
        });

        // Look for heart buttons
        const heartButtons = await page
          .locator('button[aria-label*="favorite"]')
          .all();
        console.log(`Found ${heartButtons.length} heart buttons`);

        if (heartButtons.length > 0) {
          console.log('11. Testing heart button click...');
          await heartButtons[0].click();
          await page.waitForTimeout(1000);

          // Take screenshot after heart button click
          await page.screenshot({
            path: 'real-auth-06-after-heart-click.png',
            fullPage: true,
          });
        }
      }
    }

    // Print all console messages
    console.log('\n=== Console Messages ===');
    consoleMessages.forEach(msg => console.log(msg));

    // Check network activity
    console.log('\n=== Network Activity ===');
    const networkRequests = [];
    page.on('request', request => {
      networkRequests.push(`${request.method()} ${request.url()}`);
    });

    await page.waitForTimeout(1000);
    networkRequests.forEach(req => console.log(req));
  } catch (error) {
    console.error('Error during test:', error);
    await page.screenshot({ path: 'real-auth-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Run the test
testRealAuth().catch(console.error);

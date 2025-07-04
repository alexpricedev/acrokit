const { chromium } = require('playwright');

async function testEmailValidation() {
  console.log('Testing email validation issues...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Set up console logging
    page.on('console', msg => {
      console.log(`CONSOLE [${msg.type()}]: ${msg.text()}`);
    });

    // Click Create a Free Account
    await page.locator('text=Create a Free Account').click();
    await page.waitForTimeout(1000);

    // Test different email formats
    const emailFormats = [
      'user@gmail.com',
      'testuser@hotmail.com',
      'real.user@outlook.com',
      'test123@yahoo.com',
      'example@domain.co.uk',
    ];

    for (let i = 0; i < emailFormats.length; i++) {
      const email = emailFormats[i];
      console.log(`\n=== Testing email format: ${email} ===`);

      // Clear and fill email input
      const emailInput = page.locator('input[type="email"]');
      await emailInput.clear();
      await emailInput.fill(email);
      await page.waitForTimeout(500);

      // Click send magic code button
      await page.locator('text=Send Magic Code').click();
      await page.waitForTimeout(2000);

      // Check for error message
      const errorMessage = await page
        .locator('text=Validation failed for email')
        .isVisible();
      console.log(`Error for ${email}: ${errorMessage}`);

      // Take screenshot
      await page.screenshot({
        path: `email-test-${i + 1}-${email.replace(/[@.]/g, '_')}.png`,
        fullPage: true,
      });

      // If no error, we found a working email format
      if (!errorMessage) {
        console.log(`SUCCESS: ${email} works!`);
        break;
      }
    }
  } catch (error) {
    console.error('Error during email validation test:', error);
  } finally {
    await browser.close();
  }
}

testEmailValidation().catch(console.error);

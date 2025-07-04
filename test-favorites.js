// Simple test script to check favorites functionality
const puppeteer = require('puppeteer');

async function testFavoritesButton() {
  let browser;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
      console.log('BROWSER LOG:', msg.text());
    });

    // Navigate to the app with fake auth
    console.log('Navigating to app...');
    await page.goto('http://localhost:3002/?fake-auth', {
      waitUntil: 'networkidle2',
    });

    // Wait for the page to load
    await page.waitForTimeout(2000);

    // Check if fake login is working
    console.log('Checking for fake login...');
    const loginElements = await page.$$(
      '[data-testid="fake-login"], .fake-login, button[contains(text(), "Fake Login")]'
    );

    if (loginElements.length > 0) {
      console.log('Found fake login button, clicking...');
      await loginElements[0].click();
      await page.waitForTimeout(1000);
    }

    // Navigate to poses gallery
    console.log('Looking for poses gallery navigation...');
    const posesLink = await page.$(
      'a[href*="poses"], button[contains(text(), "Poses")]'
    );

    if (posesLink) {
      console.log('Found poses link, clicking...');
      await posesLink.click();
      await page.waitForTimeout(2000);
    }

    // Look for heart buttons
    console.log('Looking for heart buttons...');
    const heartButtons = await page.$$(
      'button[title*="favorite"], button[title*="Add to favorites"]'
    );

    if (heartButtons.length > 0) {
      console.log(`Found ${heartButtons.length} heart buttons`);

      // Click the first heart button
      console.log('Clicking first heart button...');
      await heartButtons[0].click();

      // Wait for any async operations
      await page.waitForTimeout(2000);

      console.log(
        'Heart button clicked, check console logs above for debug info'
      );
    } else {
      console.log('No heart buttons found');
    }

    // Keep browser open for manual inspection
    console.log(
      'Browser will stay open for manual inspection. Press Ctrl+C to close.'
    );
    await page.waitForTimeout(30000);
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testFavoritesButton();

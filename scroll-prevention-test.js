import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set mobile viewport (iPhone SE size)
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to the app
  await page.goto('http://localhost:3000');

  // Wait for the page to load
  await page.waitForSelector('header');

  // Add some content to the page that would be scrollable
  await page.evaluate(() => {
    // Add a tall div to make the page scrollable
    const tallDiv = document.createElement('div');
    tallDiv.style.height = '2000px';
    tallDiv.style.background = 'linear-gradient(to bottom, #f0f0f0, #ffffff)';
    tallDiv.style.position = 'relative';
    tallDiv.innerHTML =
      '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: #666;">Scroll Test Content</div>';
    document.body.appendChild(tallDiv);
  });

  // Take screenshot of initial state
  await page.screenshot({ path: 'scroll-test-initial.png' });

  // Check initial scroll position and body overflow
  const initialState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    documentHeight: document.documentElement.scrollHeight,
    windowHeight: window.innerHeight,
  }));

  console.log('Initial State:');
  console.log('- Scroll position:', initialState.scrollTop);
  console.log('- Body overflow:', initialState.bodyOverflow);
  console.log('- Document height:', initialState.documentHeight);
  console.log('- Window height:', initialState.windowHeight);
  console.log(
    '- Is scrollable:',
    initialState.documentHeight > initialState.windowHeight
  );

  // Try to scroll the page before menu is open
  await page.evaluate(() => {
    window.scrollTo(0, 500);
  });

  const afterScrollState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
  }));

  console.log('\nAfter Manual Scroll (Menu Closed):');
  console.log('- Scroll position:', afterScrollState.scrollTop);
  console.log('- Body overflow:', afterScrollState.bodyOverflow);

  // Reset scroll position
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // Find and click the menu button
  const menuButton = await page.locator('button:has-text("Menu")');
  await menuButton.click();

  // Wait for dropdown to appear
  await page.waitForSelector(
    '[class*="fixed"][class*="left-4"], [class*="absolute"][class*="right-0"]',
    { state: 'visible' }
  );

  // Take screenshot with menu open
  await page.screenshot({ path: 'scroll-test-menu-open.png' });

  // Check body overflow when menu is open
  const menuOpenState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    bodyOverflowStyle: document.body.style.overflow,
  }));

  console.log('\nWith Menu Open:');
  console.log('- Scroll position:', menuOpenState.scrollTop);
  console.log('- Body computed overflow:', menuOpenState.bodyOverflow);
  console.log('- Body style overflow:', menuOpenState.bodyOverflowStyle);

  // Try to scroll when menu is open
  await page.evaluate(() => {
    window.scrollTo(0, 500);
  });

  const afterScrollWithMenuState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
  }));

  console.log('\nAfter Scroll Attempt (Menu Open):');
  console.log('- Scroll position:', afterScrollWithMenuState.scrollTop);
  console.log('- Body overflow:', afterScrollWithMenuState.bodyOverflow);

  // Try mouse wheel scroll
  await page.mouse.wheel(0, 500);

  const afterWheelScrollState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
  }));

  console.log('\nAfter Mouse Wheel Scroll (Menu Open):');
  console.log('- Scroll position:', afterWheelScrollState.scrollTop);

  // Try keyboard scroll (Page Down)
  await page.keyboard.press('PageDown');

  const afterKeyboardScrollState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
  }));

  console.log('\nAfter Keyboard Scroll (Menu Open):');
  console.log('- Scroll position:', afterKeyboardScrollState.scrollTop);

  // Click outside to close menu
  await page.click('body', { position: { x: 200, y: 500 } });

  // Wait a bit for state to update
  await page.waitForTimeout(100);

  // Check that overflow is restored
  const menuClosedState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    bodyOverflowStyle: document.body.style.overflow,
  }));

  console.log('\nAfter Menu Closed:');
  console.log('- Scroll position:', menuClosedState.scrollTop);
  console.log('- Body computed overflow:', menuClosedState.bodyOverflow);
  console.log('- Body style overflow:', menuClosedState.bodyOverflowStyle);

  // Try to scroll again after menu is closed
  await page.evaluate(() => {
    window.scrollTo(0, 300);
  });

  const finalScrollState = await page.evaluate(() => ({
    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
  }));

  console.log('\nFinal Scroll Test (Menu Closed):');
  console.log('- Scroll position:', finalScrollState.scrollTop);

  // Take final screenshot
  await page.screenshot({ path: 'scroll-test-final.png' });

  // Test results summary
  console.log('\n=== SCROLL PREVENTION TEST RESULTS ===');
  console.log(
    '✓ Initial scroll functionality:',
    afterScrollState.scrollTop > 0 ? 'WORKING' : 'NOT WORKING'
  );
  console.log(
    '✓ Menu opens and sets overflow hidden:',
    menuOpenState.bodyOverflowStyle === 'hidden' ? 'WORKING' : 'NOT WORKING'
  );
  console.log(
    '✓ Scroll prevented when menu open:',
    afterScrollWithMenuState.scrollTop === menuOpenState.scrollTop
      ? 'WORKING'
      : 'NOT WORKING'
  );
  console.log(
    '✓ Wheel scroll prevented:',
    afterWheelScrollState.scrollTop === menuOpenState.scrollTop
      ? 'WORKING'
      : 'NOT WORKING'
  );
  console.log(
    '✓ Keyboard scroll prevented:',
    afterKeyboardScrollState.scrollTop === menuOpenState.scrollTop
      ? 'WORKING'
      : 'NOT WORKING'
  );
  console.log(
    '✓ Overflow restored after menu close:',
    menuClosedState.bodyOverflowStyle === '' ? 'WORKING' : 'NOT WORKING'
  );
  console.log(
    '✓ Scroll restored after menu close:',
    finalScrollState.scrollTop > 0 ? 'WORKING' : 'NOT WORKING'
  );

  await browser.close();
})();

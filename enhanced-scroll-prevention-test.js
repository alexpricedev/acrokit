import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ hasTouch: true });
  const page = await context.newPage();

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
    tallDiv.innerHTML = `
      <div style="position: absolute; top: 200px; left: 20px; font-size: 16px; color: #333;">
        <h2>Scroll Test Content</h2>
        <p>This content extends beyond the viewport to test scroll prevention.</p>
        <div style="margin-top: 50px; padding: 20px; background: #e0e0e0; border-radius: 8px;">
          <h3>Section 1</h3>
          <p>Some test content here...</p>
        </div>
        <div style="margin-top: 50px; padding: 20px; background: #d0d0d0; border-radius: 8px;">
          <h3>Section 2</h3>
          <p>More test content...</p>
        </div>
        <div style="margin-top: 50px; padding: 20px; background: #c0c0c0; border-radius: 8px;">
          <h3>Section 3</h3>
          <p>Even more test content...</p>
        </div>
      </div>
    `;
    document.body.appendChild(tallDiv);
  });

  // Take screenshot of initial state
  await page.screenshot({ path: 'enhanced-scroll-test-initial.png' });

  // Test initial scrolling capability
  console.log('=== TESTING INITIAL SCROLL CAPABILITY ===');

  const initialState = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    documentHeight: document.documentElement.scrollHeight,
    windowHeight: window.innerHeight,
  }));

  console.log('Initial state:');
  console.log('- Scroll position:', initialState.scrollTop);
  console.log('- Body overflow:', initialState.bodyOverflow);
  console.log('- Document height:', initialState.documentHeight);
  console.log('- Window height:', initialState.windowHeight);

  // Try to scroll the page
  await page.evaluate(() => {
    window.scrollTo(0, 400);
  });

  const afterScroll = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
  }));

  console.log('After scrolling to 400px:', afterScroll.scrollTop);

  // Reset scroll position
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  console.log('\n=== TESTING MENU OPEN AND SCROLL PREVENTION ===');

  // Find and click the menu button
  const menuButton = await page.locator('button:has-text("Menu")');
  await menuButton.click();

  // Wait for dropdown to appear
  await page.waitForSelector('.fixed', { state: 'visible' });

  // Take screenshot with menu open
  await page.screenshot({ path: 'enhanced-scroll-test-menu-open.png' });

  // Check body overflow and scroll behavior when menu is open
  const menuOpenState = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    bodyOverflowStyle: document.body.style.overflow,
    bodyPosition: window.getComputedStyle(document.body).position,
  }));

  console.log('Menu open state:');
  console.log('- Scroll position:', menuOpenState.scrollTop);
  console.log('- Body computed overflow:', menuOpenState.bodyOverflow);
  console.log('- Body style overflow:', menuOpenState.bodyOverflowStyle);
  console.log('- Body position:', menuOpenState.bodyPosition);

  // Test different scroll methods when menu is open
  console.log('\n=== TESTING SCROLL METHODS WITH MENU OPEN ===');

  // Method 1: window.scrollTo()
  await page.evaluate(() => {
    window.scrollTo(0, 400);
  });

  const scrollTest1 = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
  }));
  console.log('After window.scrollTo(0, 400):', scrollTest1.scrollTop);

  // Method 2: Mouse wheel
  await page.mouse.wheel(0, 300);

  const scrollTest2 = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
  }));
  console.log('After mouse wheel:', scrollTest2.scrollTop);

  // Method 3: Touch simulation (mobile swipe)
  await page.touchscreen.tap(200, 400);
  await page.touchscreen.tap(200, 200);

  const scrollTest3 = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
  }));
  console.log('After touch simulation:', scrollTest3.scrollTop);

  // Method 4: Keyboard
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');

  const scrollTest4 = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
  }));
  console.log('After keyboard arrows:', scrollTest4.scrollTop);

  // Method 5: Page Down
  await page.keyboard.press('PageDown');

  const scrollTest5 = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
  }));
  console.log('After PageDown:', scrollTest5.scrollTop);

  console.log('\n=== TESTING MENU CLOSE AND SCROLL RESTORATION ===');

  // Click outside to close menu
  await page.click('body', { position: { x: 200, y: 500 } });

  // Wait for state to update
  await page.waitForTimeout(200);

  // Check that overflow is restored
  const menuClosedState = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    bodyOverflowStyle: document.body.style.overflow,
  }));

  console.log('Menu closed state:');
  console.log('- Scroll position:', menuClosedState.scrollTop);
  console.log('- Body computed overflow:', menuClosedState.bodyOverflow);
  console.log('- Body style overflow:', menuClosedState.bodyOverflowStyle);

  // Test scrolling after menu is closed
  await page.evaluate(() => {
    window.scrollTo(0, 600);
  });

  const finalScrollTest = await page.evaluate(() => ({
    scrollTop: window.pageYOffset,
  }));
  console.log('Final scroll test (to 600px):', finalScrollTest.scrollTop);

  // Take final screenshot
  await page.screenshot({ path: 'enhanced-scroll-test-final.png' });

  console.log('\n=== COMPREHENSIVE TEST RESULTS ===');

  // Determine scroll prevention effectiveness
  const scrollPrevented =
    scrollTest1.scrollTop === 0 &&
    scrollTest2.scrollTop === 0 &&
    scrollTest3.scrollTop === 0 &&
    scrollTest4.scrollTop === 0 &&
    scrollTest5.scrollTop === 0;

  console.log(
    '✓ Initial scroll works:',
    afterScroll.scrollTop > 0 ? 'PASS' : 'FAIL'
  );
  console.log(
    '✓ Menu sets overflow hidden:',
    menuOpenState.bodyOverflowStyle === 'hidden' ? 'PASS' : 'FAIL'
  );
  console.log('✓ Scroll prevention active:', scrollPrevented ? 'PASS' : 'FAIL');
  console.log(
    '✓ Overflow restored after close:',
    menuClosedState.bodyOverflowStyle === '' ? 'PASS' : 'FAIL'
  );
  console.log(
    '✓ Scroll restored after close:',
    finalScrollTest.scrollTop > 0 ? 'PASS' : 'FAIL'
  );

  console.log('\n=== DETAILED SCROLL PREVENTION ANALYSIS ===');
  console.log(
    'window.scrollTo() prevented:',
    scrollTest1.scrollTop === 0 ? 'YES' : 'NO'
  );
  console.log(
    'Mouse wheel prevented:',
    scrollTest2.scrollTop === scrollTest1.scrollTop ? 'YES' : 'NO'
  );
  console.log(
    'Touch scroll prevented:',
    scrollTest3.scrollTop === scrollTest2.scrollTop ? 'YES' : 'NO'
  );
  console.log(
    'Keyboard scroll prevented:',
    scrollTest4.scrollTop === scrollTest3.scrollTop ? 'YES' : 'NO'
  );
  console.log(
    'Page scroll prevented:',
    scrollTest5.scrollTop === scrollTest4.scrollTop ? 'YES' : 'NO'
  );

  // Overall assessment
  if (scrollPrevented) {
    console.log('\n🎉 SCROLL PREVENTION IS WORKING CORRECTLY!');
  } else {
    console.log('\n⚠️  SCROLL PREVENTION NEEDS IMPROVEMENT');
    console.log('Consider implementing additional scroll prevention methods:');
    console.log('- preventDefault on touchmove events');
    console.log('- position: fixed on body with scroll position preservation');
    console.log('- passive: false event listeners');
  }

  await browser.close();
})();

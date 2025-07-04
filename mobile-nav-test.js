import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set mobile viewport (iPhone size)
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to the app
  await page.goto('http://localhost:3000');

  // Wait for the page to load
  await page.waitForSelector('header');

  // Take screenshot before clicking
  await page.screenshot({ path: 'mobile-nav-initial.png' });

  // Find the menu button
  const menuButton = await page.locator('button:has-text("Menu")');

  // Get menu button position
  const menuButtonBox = await menuButton.boundingBox();
  console.log('Menu button position:', menuButtonBox);

  // Click the menu button to open dropdown
  await menuButton.click();

  // Wait for dropdown to appear
  await page.waitForSelector('[class*="absolute"][class*="right-0"]', {
    state: 'visible',
  });

  // Get dropdown position and size
  const dropdown = await page
    .locator('[class*="absolute"][class*="right-0"]')
    .first();
  const dropdownBox = await dropdown.boundingBox();
  console.log('Dropdown position and size:', dropdownBox);

  // Take screenshot after clicking
  await page.screenshot({ path: 'mobile-nav-dropdown-open.png' });

  // Get viewport width
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  console.log('Viewport width:', viewportWidth);

  // Calculate how much the dropdown extends beyond the left edge
  const leftOverflow = dropdownBox.x < 0 ? Math.abs(dropdownBox.x) : 0;
  const rightEdge = dropdownBox.x + dropdownBox.width;
  const rightOverflow =
    rightEdge > viewportWidth ? rightEdge - viewportWidth : 0;

  console.log('Left overflow (pixels beyond left edge):', leftOverflow);
  console.log('Right overflow (pixels beyond right edge):', rightOverflow);

  // Check if dropdown content is visible
  const dropdownItems = await page
    .locator('[class*="absolute"][class*="right-0"] button')
    .all();
  console.log('Number of dropdown items found:', dropdownItems.length);

  // Get first and last item positions
  if (dropdownItems.length > 0) {
    const firstItemBox = await dropdownItems[0].boundingBox();
    const lastItemBox =
      await dropdownItems[dropdownItems.length - 1].boundingBox();
    console.log('First item position:', firstItemBox);
    console.log('Last item position:', lastItemBox);
  }

  await browser.close();
})();

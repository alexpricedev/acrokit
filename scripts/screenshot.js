#!/usr/bin/env node
import { chromium } from 'playwright';

// Configuration mapping screen keys to specific UI states
const SCREEN_CONFIG = {
  // Main screens
  'flow-builder': {
    description: 'Flow builder main screen (empty state)',
    url: 'http://localhost:3000',
    actions: [],
    waitFor: 'button:has-text("Create random flow")',
    filename: 'flow-builder-main',
  },

  'flow-builder-with-poses': {
    description: 'Flow builder with some poses added',
    url: 'http://localhost:3000',
    actions: [
      { type: 'click', selector: 'button:has-text("Add to flow")' },
      { type: 'wait', duration: 1000 },
    ],
    waitFor: 'h3:has-text("Your flow")',
    filename: 'flow-builder-with-poses',
  },

  'flows-gallery': {
    description: 'Flows gallery page (requires login)',
    url: 'http://localhost:3000',
    actions: [
      { type: 'login' },
      { type: 'click', selector: 'button:has-text("Your Flows")' },
    ],
    waitFor: 'h2:has-text("Your flows")',
    filename: 'flows-gallery',
  },

  'delete-confirmation-modal': {
    description: 'Delete confirmation modal for flows',
    url: 'http://localhost:3000',
    actions: [
      { type: 'login' },
      { type: 'click', selector: 'button:has-text("Your Flows")' },
      { type: 'wait', duration: 2000 },
      { type: 'click', selector: 'button[title="Delete flow"]' },
    ],
    waitFor: 'h2:has-text("Delete Flow")',
    filename: 'delete-confirmation-modal',
  },

  // Header states
  'header-logged-out': {
    description: 'Header with login/signup buttons (logged out state)',
    url: 'http://localhost:3000',
    actions: [],
    waitFor: 'button:has-text("Log in")',
    filename: 'header-logged-out',
  },

  'header-logged-in': {
    description: 'Header with user menu (logged in state)',
    url: 'http://localhost:3000',
    actions: [{ type: 'login' }],
    waitFor: 'div[class*="bg-blue-100 rounded-full"]',
    filename: 'header-logged-in',
  },

  // Modals
  'login-modal': {
    description: 'Login modal with welcome back copy',
    url: 'http://localhost:3000',
    actions: [{ type: 'click', selector: 'nav button:has-text("Log in")' }],
    waitFor: 'h2:has-text("Welcome back to AcroKit")',
    filename: 'login-modal',
  },

  'signup-modal': {
    description: 'Signup modal with join benefits copy',
    url: 'http://localhost:3000',
    actions: [{ type: 'click', selector: 'nav button:has-text("Sign up")' }],
    waitFor: 'h2:has-text("Join AcroKit")',
    filename: 'signup-modal',
  },

  'login-modal-code-sent': {
    description: 'Login modal after code is sent',
    url: 'http://localhost:3000',
    actions: [
      { type: 'click', selector: 'button:has-text("Log in"):visible' },
      {
        type: 'fill',
        selector: 'input[type="email"]',
        value: 'test@example.com',
      },
      { type: 'click', selector: 'button:has-text("Send magic code")' },
    ],
    waitFor: 'h2:has-text("Check your email")',
    filename: 'login-modal-code-sent',
  },

  'flow-save-modal': {
    description: 'Flow save modal (requires login and flow)',
    url: 'http://localhost:3000',
    actions: [
      { type: 'login' },
      { type: 'click', selector: 'button:has-text("Add to flow")' },
      { type: 'wait', duration: 1000 },
      { type: 'click', selector: 'button:has-text("Save flow")' },
    ],
    waitFor: 'h2:has-text("Save your flow")',
    filename: 'flow-save-modal',
  },

  'random-flow-modal': {
    description: 'Random flow creation modal',
    url: 'http://localhost:3000',
    actions: [
      { type: 'click', selector: 'button:has-text("Create random flow")' },
    ],
    waitFor: 'h2:has-text("Create random flow")',
    filename: 'random-flow-modal',
  },

  // Specific UI states
  'pose-cards': {
    description: 'Available pose cards on the right side',
    url: 'http://localhost:3000',
    actions: [],
    waitFor: 'div:has-text("Starting moves")',
    filename: 'pose-cards',
  },

  'difficulty-filters': {
    description: 'Difficulty filter buttons',
    url: 'http://localhost:3000',
    actions: [],
    waitFor: 'button:has-text("Easy")',
    filename: 'difficulty-filters',
  },

  'user-menu-open': {
    description: 'User dropdown menu (requires login)',
    url: 'http://localhost:3000',
    actions: [
      { type: 'login' },
      { type: 'click', selector: 'div[class*="bg-blue-100 rounded-full"]' },
    ],
    waitFor: 'button:has-text("Sign out")',
    filename: 'user-menu-open',
  },

  'mobile-view': {
    description: 'Mobile responsive view',
    url: 'http://localhost:3000',
    actions: [{ type: 'viewport', width: 375, height: 667 }],
    waitFor: 'h1:has-text("AcroKit")',
    filename: 'mobile-view',
  },

  // Error states
  'empty-flow-state': {
    description: 'Empty flow state with helpful message',
    url: 'http://localhost:3000',
    actions: [],
    waitFor: 'text="Add your first move or load a flow to get started"',
    filename: 'empty-flow-state',
  },
};

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(
    'Usage: node scripts/screenshot.js <screen-key> [screen-key2,screen-key3...]'
  );
  console.log('\nAvailable screens:');
  Object.keys(SCREEN_CONFIG).forEach(key => {
    console.log(`  ${key}: ${SCREEN_CONFIG[key].description}`);
  });
  process.exit(1);
}

const screenKeys = args[0].split(',');
const baseUrl = process.env.SCREENSHOT_URL || 'http://localhost:3000';

const CONFIG = {
  outputDir: 'docs/screenshots',
  renderDelay: 2000,
  defaultTimeout: 10000,
};

// Mock login action that simulates a logged-in user
async function performLogin(page) {
  await page.evaluate(() => {
    // This simulates a logged-in user by directly setting mock user data
    // In a real app, you might use cookies or localStorage
    window.localStorage.setItem(
      'mock-user',
      JSON.stringify({
        id: 'demo-user',
        email: 'demo@example.com',
      })
    );
    // Reload to trigger auth state change
    window.location.reload();
  });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

// Execute actions defined in screen config
async function executeActions(page, actions) {
  for (const action of actions) {
    switch (action.type) {
      case 'click':
        try {
          await page.click(action.selector, { timeout: CONFIG.defaultTimeout });
        } catch (e) {
          // Try to find visible element if first attempt fails
          await page.evaluate(selector => {
            const elements = Array.from(document.querySelectorAll('*')).filter(
              el =>
                el.textContent?.includes(
                  selector.replace('button:has-text("', '').replace('")', '')
                )
            );
            const visibleEl = elements.find(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            });
            if (visibleEl) visibleEl.click();
          }, action.selector);
        }
        break;

      case 'fill':
        await page.fill(action.selector, action.value);
        break;

      case 'wait':
        await page.waitForTimeout(action.duration);
        break;

      case 'login':
        await performLogin(page);
        break;

      case 'viewport':
        await page.setViewportSize({
          width: action.width,
          height: action.height,
        });
        break;

      default:
        console.log(`Unknown action type: ${action.type}`);
    }

    // Small delay between actions
    await page.waitForTimeout(500);
  }
}

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    for (const screenKey of screenKeys) {
      const screenConfig = SCREEN_CONFIG[screenKey];

      if (!screenConfig) {
        console.log(`❌ Unknown screen key: ${screenKey}`);
        continue;
      }

      console.log(
        `📸 Taking screenshot: ${screenKey} (${screenConfig.description})`
      );

      // Navigate to the URL
      await page.goto(screenConfig.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(CONFIG.renderDelay);

      // Execute actions to get to the desired state
      if (screenConfig.actions.length > 0) {
        await executeActions(page, screenConfig.actions);
      }

      // Wait for the expected element to ensure we're in the right state
      if (screenConfig.waitFor) {
        try {
          await page.waitForSelector(screenConfig.waitFor, {
            timeout: CONFIG.defaultTimeout,
          });
        } catch (e) {
          console.log(
            `⚠️  Warning: Expected element not found for ${screenKey}: ${screenConfig.waitFor}`
          );
        }
      }

      // Final delay to ensure everything is rendered
      await page.waitForTimeout(CONFIG.renderDelay);

      // Take the screenshot
      const filename = `${screenConfig.filename || screenKey}.png`;
      await page.screenshot({
        path: `${CONFIG.outputDir}/${filename}`,
        fullPage: true,
      });
      console.log(`✅ Saved: ${filename}`);
    }
  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Validate screen keys before starting
const invalidKeys = screenKeys.filter(key => !SCREEN_CONFIG[key]);
if (invalidKeys.length > 0) {
  console.log(`❌ Invalid screen keys: ${invalidKeys.join(', ')}`);
  console.log('\nAvailable screens:');
  Object.keys(SCREEN_CONFIG).forEach(key => {
    console.log(`  ${key}: ${SCREEN_CONFIG[key].description}`);
  });
  process.exit(1);
}

takeScreenshots().catch(console.error);

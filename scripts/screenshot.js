#!/usr/bin/env node
import { chromium } from 'playwright';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/screenshot.js <name> [url] [selector]');
  process.exit(1);
}

const names = args[0].split(',');
const url = args[1] || process.env.SCREENSHOT_URL || 'http://localhost:3000';
const waitSelector = args[2];

const CONFIG = {
  url,
  outputDir: 'docs/screenshots',
  readySelectors: waitSelector ? [waitSelector] : ['button', '[data-testid]', 'main'],
  renderDelay: 2000
};

async function waitForReady(page) {
  for (const selector of CONFIG.readySelectors) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      await page.waitForTimeout(CONFIG.renderDelay);
      return;
    } catch (e) {}
  }
  await page.waitForLoadState('networkidle');
}

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(CONFIG.url);
  await waitForReady(page);
  
  for (const name of names) {
    await page.screenshot({ 
      path: `${CONFIG.outputDir}/${name}.png`,
      fullPage: true 
    });
    console.log(`✅ Saved: ${name}.png`);
  }
  
  await browser.close();
}

takeScreenshots().catch(console.error);
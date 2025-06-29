#!/usr/bin/env node

import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to app...');
  await page.goto('http://localhost:3000');
  
  console.log('Waiting for data to load...');
  // Wait for specific elements to appear instead of text content
  await page.waitForSelector('button:has-text("Add to flow")', { timeout: 30000 });
  
  // Extra wait to ensure everything is fully rendered
  await page.waitForTimeout(2000);
  
  console.log('Taking starting moves screenshot...');
  await page.screenshot({ 
    path: 'docs/screenshots/starting-moves-working.png',
    fullPage: true 
  });
  
  console.log('Clicking on first pose...');
  await page.click('button:has-text("Add to flow")');
  
  // Wait for constraint system to load
  await page.waitForSelector('text=Available next moves', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  console.log('Taking constraint system screenshot...');
  await page.screenshot({ 
    path: 'docs/screenshots/constraint-system-working.png',
    fullPage: true 
  });
  
  await browser.close();
  console.log('Screenshots saved successfully!');
}

takeScreenshots().catch(console.error);
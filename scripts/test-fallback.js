#!/usr/bin/env node

/**
 * Fallback testing script for when MCP Playwright is not working
 * This script provides a reliable way to test the application using regular Playwright
 */

const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const TEST_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'test-results');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function testWithFirefox() {
  console.log('🔥 Starting Firefox testing...');
  
  const browser = await firefox.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test 1: Homepage loading
    console.log('📱 Testing homepage...');
    await page.goto(TEST_URL);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fallback-home.png') });
    console.log('✅ Homepage loaded successfully');
    
    // Test 2: Builder page
    console.log('🏗️ Testing builder page...');
    await page.goto(TEST_URL + '/builder');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fallback-builder.png') });
    console.log('✅ Builder page loaded successfully');
    
    // Test 3: Community page
    console.log('👥 Testing community page...');
    await page.goto(TEST_URL + '/community');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fallback-community.png') });
    console.log('✅ Community page loaded successfully');
    
    // Test 4: About page
    console.log('ℹ️ Testing about page...');
    await page.goto(TEST_URL + '/about');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fallback-about.png') });
    console.log('✅ About page loaded successfully');
    
    // Test 5: Responsive design
    console.log('📱 Testing responsive design...');
    await page.goto(TEST_URL);
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fallback-desktop.png') });
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fallback-tablet.png') });
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fallback-mobile.png') });
    
    console.log('✅ Responsive design tested successfully');
    
    // Test 6: Console logs
    console.log('📝 Checking console logs...');
    const logs = [];
    page.on('console', (msg) => {
      logs.push({ type: msg.type(), text: msg.text() });
    });
    
    await page.goto(TEST_URL);
    await page.waitForTimeout(2000);
    
    const logFile = path.join(OUTPUT_DIR, 'fallback-console-logs.json');
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    console.log(`✅ Console logs saved to ${logFile}`);
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function main() {
  try {
    await testWithFirefox();
  } catch (error) {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { testWithFirefox };
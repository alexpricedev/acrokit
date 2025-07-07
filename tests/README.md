# AcroKit Testing Guide

This directory contains Playwright tests for visual regression and functionality testing.

## Test Files

- **`basic.spec.ts`** - Core functionality tests (navigation, page loads, basic UI)
- **`visual-regression.spec.ts`** - Responsive design and visual regression tests

## Running Tests

```bash
# Run all tests
npm run test

# Run only visual regression tests  
npm run test:visual

# Run tests with visible browser (for debugging)
npm run test:headed

# View detailed HTML test report
npm run test:report
```

## Browser Compatibility

- **Firefox**: ✅ Full support on ARM64 Linux
- **Chrome/Chromium**: ❌ Not compatible with ARM64 architecture

## Test Results

Tests automatically generate screenshots in `test-results/` directory:
- `home-desktop.png` - Homepage at 1920px width
- `home-tablet.png` - Homepage at 768px width  
- `home-mobile.png` - Homepage at 375px width
- `builder-loading.png` - Builder page loading state
- `community-gallery.png` - Community flows gallery
- `about-page-full.png` - Complete about page

## Visual Regression Testing

Screenshots serve multiple purposes:
1. **Regression Detection** - Compare before/after changes
2. **Responsive Design Validation** - Ensure mobile/tablet/desktop compatibility
3. **Documentation** - Visual proof of current UI state
4. **Stakeholder Communication** - Show implementation progress

## Configuration

- **Config File**: `../playwright.config.ts`
- **Base URL**: `http://localhost:3000`
- **Test Directory**: `./tests/`
- **Results**: `../test-results/` (gitignored)

## CI/CD Integration

These tests can be integrated into CI/CD pipelines to:
- Automatically detect visual regressions
- Validate responsive design across viewport sizes
- Generate visual documentation for each deployment
- Fail builds if unexpected UI changes occur
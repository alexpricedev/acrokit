# Screenshot Helper for PRs

## The Problem
Puppeteer MCP tool creates screenshots visible in Claude conversation but doesn't save actual files to disk.

## Solutions

### Option 1: Manual Process (Current)
1. Take screenshots using Puppeteer during development (for validation)
2. Manually save screenshots from Claude conversation interface 
3. Add to `docs/screenshots/[descriptive-name].png`
4. Commit and reference in PR

### Option 2: Alternative Tools
```bash
# Use system screenshot tools
# macOS
screencapture -w docs/screenshots/before-fix.png

# Or use browser dev tools
# 1. Open dev tools (F12)
# 2. Device toolbar (Ctrl+Shift+M)
# 3. Screenshot icon in device toolbar
```

### Option 3: Playwright (if available)
```bash
npx playwright screenshot --browser chromium --url http://localhost:3000 docs/screenshots/app-state.png
```

## Current Workflow
For now, the Puppeteer screenshots serve as validation during development, and we document the visual changes in PR descriptions with detailed before/after descriptions.
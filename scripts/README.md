# Database Seeding Scripts

## Usage

### Node.js Seeding (Recommended)

The preferred method uses the InstantDB Admin SDK for reliable, automated seeding.

1. **Get your admin token:**
   - Visit [InstantDB Dashboard](https://www.instantdb.com/dash)
   - Copy your admin token

2. **Set environment variable:**
   ```bash
   export INSTANT_ADMIN_TOKEN=your_admin_token_here
   ```

3. **Run the seed script:**
   ```bash
   npm run seed
   ```

4. **Verify seeding:**
   - Check console output for success messages
   - Refresh the app to see poses loaded in the UI

### Browser-based Seeding (Legacy)

⚠️ **Note:** This method has known issues and is not recommended for production use.

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the application:**
   Open http://localhost:3000 in your browser

3. **Open browser console:**
   - Press F12 (or Cmd+Option+I on Mac)
   - Go to the "Console" tab

4. **Copy and run the seeding script:**
   - Open `scripts/seed-browser.js`
   - Copy the entire contents
   - Paste into the browser console
   - Press Enter

5. **Verify seeding:**
   - You should see success messages in the console
   - Refresh the page to see poses loaded in the UI

## What Gets Seeded

- **8 Poses:** Including Shin to Shin (starting pose), Bird, Throne, Whale, Star, etc.
- **13 Transitions:** Connecting the poses in logical acroyoga sequences
- **Proper IDs:** Uses crypto.randomUUID() for valid InstantDB identifiers
- **Metadata:** Includes creation timestamps and proper difficulty levels

## Troubleshooting

### Node.js Script Issues

**Error: "INSTANT_ADMIN_TOKEN environment variable is required"**
- Get your admin token from [InstantDB Dashboard](https://www.instantdb.com/dash)
- Set it with: `export INSTANT_ADMIN_TOKEN=your_token_here`

**Connection or authentication errors:**
- Verify your admin token is correct and not expired
- Check your internet connection
- Ensure the app ID in the script matches your InstantDB app

### Browser Script Issues

If browser-based seeding fails:

1. **Check authentication:** Make sure you're signed in to the app
2. **Check console:** Look for any error messages
3. **Verify database:** Check that InstantDB schema is properly set up
4. **Clear database:** If needed, clear existing data before re-seeding

## Schema

The seeding script creates data for:

- `poses` - Individual acroyoga poses with names, descriptions, and difficulty
- `transitions` - Named transitions between specific poses
- `flows` - (Not seeded, created by users)

All entities include proper InstantDB fields like `id`, `createdAt`, etc.
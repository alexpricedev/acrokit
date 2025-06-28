# Database Seeding Scripts

## Usage

This script uses the InstantDB Admin SDK for reliable, automated database seeding.

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

## What Gets Seeded

- **8 Poses:** Including Shin to Shin (starting pose), Bird, Throne, Whale, Star, etc.
- **13 Transitions:** Connecting the poses in logical acroyoga sequences
- **Proper IDs:** Uses crypto.randomUUID() for valid InstantDB identifiers
- **Metadata:** Includes creation timestamps and proper difficulty levels

## Troubleshooting

**Error: "INSTANT_ADMIN_TOKEN environment variable is required"**
- Get your admin token from [InstantDB Dashboard](https://www.instantdb.com/dash)
- Set it with: `export INSTANT_ADMIN_TOKEN=your_token_here`

**Connection or authentication errors:**
- Verify your admin token is correct and not expired
- Check your internet connection
- Ensure the app ID in the script matches your InstantDB app

**Database errors:**
- Check that InstantDB schema is properly set up
- Clear existing data if needed before re-seeding

## Schema

The seeding script creates data for:

- `poses` - Individual acroyoga poses with names, descriptions, and difficulty
- `transitions` - Named transitions between specific poses
- `flows` - (Not seeded, created by users)

All entities include proper InstantDB fields like `id`, `createdAt`, etc.
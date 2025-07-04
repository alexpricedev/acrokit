# InstantDB Permissions Configuration Guide

## Overview

The AcroKit application is experiencing permission issues with the favorites functionality. Users are unable to create, read, or delete favorites due to missing permission configurations in InstantDB.

## App Details

- **App ID**: `63c65c15-20c2-418f-b504-a823ecadb2d0`
- **Issue**: Heart button functionality fails with permission errors
- **Root Cause**: InstantDB permissions not configured for the `favorites` entity

## Required Permission Configuration

### 1. **favorites** Entity

```javascript
{
  "allow": {
    "create": "auth.id != null && auth.id == data.profile.$user.id",
    "read": "auth.id == data.profile.$user.id", 
    "delete": "auth.id == data.profile.$user.id"
  }
}
```

**Why these rules:**
- `create`: Users can only create favorites for their own profile
- `read`: Users can only read their own favorites
- `delete`: Users can only delete their own favorites
- The `data.profile.$user.id` follows the relationship chain: `favorites` → `profile` → `$user`

### 2. **profiles** Entity

```javascript
{
  "allow": {
    "read": "auth.id == data.$user.id",
    "update": "auth.id == data.$user.id"
  }
}
```

**Why these rules:**
- Users need to read their own profile to load favorites
- Users can update their own profile information

### 3. **poses** Entity

```javascript
{
  "allow": {
    "read": "true"
  }
}
```

**Why this rule:**
- All users need to read poses for the gallery and flow builder
- Poses are public information

### 4. **transitions** Entity

```javascript
{
  "allow": {
    "read": "true"
  }
}
```

**Why this rule:**
- All users need to read transitions for the flow builder
- Transitions are public information

### 5. **flows** Entity

```javascript
{
  "allow": {
    "create": "auth.id == data.userId",
    "read": "data.isPublic == true || auth.id == data.userId",
    "update": "auth.id == data.userId",
    "delete": "auth.id == data.userId"
  }
}
```

**Why these rules:**
- Users can create flows for themselves
- Users can read public flows or their own private flows
- Users can only modify their own flows

### 6. **comments** Entity

```javascript
{
  "allow": {
    "create": "auth.id == data.author.$user.id",
    "read": "true",
    "update": "auth.id == data.author.$user.id",
    "delete": "auth.id == data.author.$user.id"
  }
}
```

**Why these rules:**
- Users can create comments as themselves
- All users can read all comments
- Users can only modify their own comments

## How to Configure

### Step 1: Access InstantDB Dashboard
1. Go to https://instantdb.com/dash
2. Sign in with your InstantDB account
3. Find the app with ID `63c65c15-20c2-418f-b504-a823ecadb2d0`

### Step 2: Navigate to Permissions
1. Click on your app to open it
2. Look for "Permissions", "Rules", or "Security" tab
3. Click on it to open the permissions configuration

### Step 3: Configure Each Entity
For each entity listed above:
1. Select the entity (e.g., "favorites")
2. Add the permission rules for each operation (create, read, update, delete)
3. Copy the exact rules from the sections above
4. Save the configuration

### Step 4: Test the Configuration
1. Run the application: `npm run dev`
2. Sign in with real authentication (not fake auth)
3. Navigate to Poses Gallery
4. Click heart buttons to test favorites functionality
5. Check browser console for any remaining permission errors

## Current Code Implementation

The favorites functionality is implemented in:
- `/src/hooks/useFavoritePoses.ts` - Main favorites logic
- `/src/components/PoseCard.tsx` - Heart button component
- `/src/components/PosesGallery.tsx` - Gallery with heart buttons

### Key Operations That Need Permissions:

1. **Create Favorite** (line 95-101 in useFavoritePoses.ts):
   ```typescript
   await db.transact([
     db.tx.favorites[crypto.randomUUID()].update({
       profileId: profile.id,
       poseId: pose.id,
     })
   ]);
   ```

2. **Read Favorites** (line 14-25 in useFavoritePoses.ts):
   ```typescript
   const { data } = db.useQuery({
     profiles: {
       $: { where: { id: profile.id } },
       favorites: {
         pose: {},
       },
     },
   });
   ```

3. **Delete Favorite** (line 91 in useFavoritePoses.ts):
   ```typescript
   await db.transact([db.tx.favorites[favoriteRecord.id].delete()]);
   ```

## Troubleshooting

### If Heart Button Still Doesn't Work:

1. **Check Console**: Look for permission errors in browser console
2. **Verify Authentication**: Make sure user is properly signed in
3. **Check Profile**: Ensure user has a profile created
4. **Network Issues**: Check if InstantDB is reachable
5. **Schema Sync**: Ensure the latest schema is deployed

### Common Error Messages:

- `"Permission denied"` - Permissions not configured correctly
- `"Profile not found"` - User doesn't have a profile
- `"Unauthorized"` - User not authenticated

## Files Created for Diagnosis

1. **`scripts/configure-permissions.js`** - Shows required permission rules
2. **`scripts/test-permissions.js`** - Tests permission configuration
3. **`scripts/diagnose-favorites.js`** - Diagnoses favorites functionality
4. **`scripts/test-favorites-browser.js`** - Browser-based testing
5. **`scripts/permission-summary.md`** - Detailed permission summary

## Next Steps

1. **Configure permissions** in InstantDB dashboard using the exact rules above
2. **Test the application** with real authentication
3. **Monitor console** for any remaining errors
4. **Verify functionality** by testing heart button interactions

## Support

If you continue to experience issues after configuring permissions:
1. Check the browser console for specific error messages
2. Verify the app ID is correct
3. Ensure you're using the latest schema version
4. Contact InstantDB support if permission rules are not working as expected

The permissions configuration is the most likely solution to the current favorites functionality issues.
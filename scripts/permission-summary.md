# InstantDB Permissions Configuration Summary

## App ID: 63c65c15-20c2-418f-b504-a823ecadb2d0

## Required Permissions for Favorites Functionality

Based on the code analysis, the following permissions need to be configured in the InstantDB dashboard:

### 1. **favorites** entity

```javascript
{
  "allow": {
    "create": "auth.id != null && auth.id == data.profile.$user.id",
    "read": "auth.id == data.profile.$user.id", 
    "delete": "auth.id == data.profile.$user.id"
  }
}
```

**Explanation:**
- Users can create favorites only if they are authenticated and the favorite belongs to their profile
- Users can only read their own favorites
- Users can only delete their own favorites

### 2. **profiles** entity

```javascript
{
  "allow": {
    "read": "auth.id == data.$user.id",
    "update": "auth.id == data.$user.id"
  }
}
```

**Explanation:**
- Users can read their own profile
- Users can update their own profile

### 3. **poses** entity

```javascript
{
  "allow": {
    "read": "true"
  }
}
```

**Explanation:**
- All users (including unauthenticated) can read all poses
- This is needed for the poses gallery to work

### 4. **transitions** entity

```javascript
{
  "allow": {
    "read": "true"
  }
}
```

**Explanation:**
- All users can read all transitions
- This is needed for the flow builder to work

### 5. **flows** entity

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

**Explanation:**
- Users can create flows for themselves
- Users can read public flows or their own private flows
- Users can update/delete their own flows

### 6. **comments** entity

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

**Explanation:**
- Users can create comments as themselves
- All users can read all comments
- Users can update/delete their own comments

## How to Configure These Permissions

1. **Go to InstantDB Dashboard**: https://instantdb.com/dash
2. **Select Your App**: Look for app ID `63c65c15-20c2-418f-b504-a823ecadb2d0`
3. **Navigate to Permissions**: Click on the "Permissions" or "Rules" tab
4. **Configure Each Entity**: For each entity listed above, set the permission rules

## Current Issue with Favorites

The heart button functionality is failing because the `favorites` entity permissions are not configured. When a user tries to:

1. **Create a favorite**: The `db.tx.favorites[uuid].update()` call fails with permission denied
2. **Read favorites**: The query `profiles: { favorites: { pose: {} } }` fails with permission denied  
3. **Delete favorites**: The `db.tx.favorites[id].delete()` call fails with permission denied

## Testing After Configuration

After configuring permissions, test the favorites functionality:

1. **Start the app**: `npm run dev`
2. **Sign in with real email**: Use the magic link authentication
3. **Navigate to Poses Gallery**: Click on the menu → Poses Gallery
4. **Click heart buttons**: Should work without console errors
5. **Check browser console**: Should show no permission errors

## Schema Relationships

The favorites system uses these relationships:

```
User (auth.id) → Profile (profile.$user.id) → Favorites (favorites.profileId) → Pose (favorites.poseId)
```

This is why the permission rules reference `data.profile.$user.id` - it follows the relationship chain to verify the authenticated user owns the profile that owns the favorite.

## Next Steps

1. **Configure permissions** in InstantDB dashboard using the rules above
2. **Test in browser** with real authentication
3. **Monitor console** for any remaining permission errors
4. **Verify heart button** changes color and persists state

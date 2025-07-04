#!/usr/bin/env node

import { init } from '@instantdb/admin';
import { i } from '@instantdb/react';

// App configuration - public APP_ID (safe to inline)
const APP_ID = '63c65c15-20c2-418f-b504-a823ecadb2d0';

// Schema definition matching the current schema
const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    poses: i.entity({
      name: i.string().indexed(),
      description: i.string(),
      difficulty: i.string(),
      isStartingPose: i.boolean().optional(),
      imageUrl: i.string().optional(),
      baseImageUrl: i.string().optional(),
      flyerImageUrl: i.string().optional(),
      createdAt: i.number(),
    }),
    transitions: i.entity({
      name: i.string(),
      description: i.string().optional(),
      fromPoseId: i.string(),
      toPoseId: i.string(),
      createdAt: i.number(),
    }),
    flows: i.entity({
      name: i.string(),
      description: i.string().optional(),
      isPublic: i.boolean(),
      userId: i.string(),
      stepsData: i.string(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    profiles: i.entity({
      displayName: i.string().unique().indexed(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    favorites: i.entity({
      profileId: i.string(),
      poseId: i.string(),
    }),
    comments: i.entity({
      content: i.string(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
  },
  links: {
    profileUser: {
      forward: { on: 'profiles', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },
    commentsPose: {
      forward: { on: 'comments', has: 'one', label: 'pose' },
      reverse: { on: 'poses', has: 'many', label: 'comments' },
    },
    commentsAuthor: {
      forward: { on: 'comments', has: 'one', label: 'author' },
      reverse: { on: 'profiles', has: 'many', label: 'comments' },
    },
    profileFavorites: {
      forward: { on: 'favorites', has: 'one', label: 'profile' },
      reverse: { on: 'profiles', has: 'many', label: 'favorites' },
    },
    poseFavorites: {
      forward: { on: 'favorites', has: 'one', label: 'pose' },
      reverse: { on: 'poses', has: 'many', label: 'favorites' },
    },
  },
});

// Initialize admin client
const db = init({
  appId: APP_ID,
  schema,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

console.log('🔍 Diagnosing favorites functionality...');

async function diagnoseFavorites() {
  try {
    // Check if poses exist
    console.log('\n1️⃣ Checking if poses exist...');
    const posesResult = await db.query({ poses: {} });
    console.log(`✅ Found ${posesResult.poses.length} poses`);
    
    if (posesResult.poses.length === 0) {
      console.log('❌ No poses found! Run "node scripts/seed.js" first');
      return;
    }
    
    // Check if profiles exist
    console.log('\n2️⃣ Checking if profiles exist...');
    const profilesResult = await db.query({ profiles: {} });
    console.log(`✅ Found ${profilesResult.profiles.length} profiles`);
    
    // Check if favorites exist
    console.log('\n3️⃣ Checking if favorites exist...');
    const favoritesResult = await db.query({ favorites: {} });
    console.log(`✅ Found ${favoritesResult.favorites.length} favorites`);
    
    // Check favorites with relationships
    console.log('\n4️⃣ Checking favorites with relationships...');
    const favoritesWithRelationships = await db.query({
      favorites: {
        profile: {},
        pose: {},
      },
    });
    console.log(`✅ Found ${favoritesWithRelationships.favorites.length} favorites with relationships`);
    
    // Check profiles with their favorites
    console.log('\n5️⃣ Checking profiles with their favorites...');
    const profilesWithFavorites = await db.query({
      profiles: {
        favorites: {
          pose: {},
        },
      },
    });
    console.log(`✅ Found ${profilesWithFavorites.profiles.length} profiles with favorites`);
    
    // Print detailed information
    console.log('\n📊 Detailed Analysis:');
    
    if (posesResult.poses.length > 0) {
      console.log(`  Sample poses: ${posesResult.poses.slice(0, 3).map(p => p.name).join(', ')}`);
    }
    
    if (profilesResult.profiles.length > 0) {
      console.log(`  Sample profiles: ${profilesResult.profiles.slice(0, 3).map(p => p.displayName).join(', ')}`);
    }
    
    if (favoritesResult.favorites.length > 0) {
      console.log(`  Sample favorites: ${favoritesResult.favorites.slice(0, 3).map(f => `${f.profileId} -> ${f.poseId}`).join(', ')}`);
    }
    
    console.log('\n🎯 Favorites Functionality Requirements:');
    console.log('  For the heart button to work, the system needs:');
    console.log('  1. ✅ Poses to exist (found)');
    console.log('  2. ✅ Profiles to exist (created when user signs up)');
    console.log('  3. ✅ Ability to create favorites entities');
    console.log('  4. ✅ Ability to query favorites with relationships');
    console.log('  5. ✅ Ability to delete favorites entities');
    
    console.log('\n🔐 Permission Requirements:');
    console.log('  The following permissions are needed:');
    console.log('  - favorites: create, read, delete (for own favorites)');
    console.log('  - profiles: read (for own profile)');
    console.log('  - poses: read (for all poses)');
    
    console.log('\n💡 If heart button is not working, check:');
    console.log('  1. User is authenticated');
    console.log('  2. User has a profile');
    console.log('  3. InstantDB permissions are configured');
    console.log('  4. Network connection is stable');
    
  } catch (error) {
    console.error('❌ Error diagnosing favorites:', error);
    
    // Provide specific error guidance
    if (error.message.includes('Permission denied')) {
      console.log('\n🚨 PERMISSION DENIED ERROR');
      console.log('This confirms that permissions are not configured correctly.');
      console.log('Please configure these permissions in the InstantDB dashboard:');
      console.log('');
      console.log('Entity: favorites');
      console.log('  - create: auth.id != null && auth.id == data.profile.$user.id');
      console.log('  - read: auth.id == data.profile.$user.id');
      console.log('  - delete: auth.id == data.profile.$user.id');
      console.log('');
      console.log('Entity: profiles');
      console.log('  - read: auth.id == data.$user.id');
      console.log('  - update: auth.id == data.$user.id');
      console.log('');
      console.log('Entity: poses');
      console.log('  - read: true');
    }
    
    process.exit(1);
  }
}

diagnoseFavorites();
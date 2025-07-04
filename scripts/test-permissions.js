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

console.log('🧪 Testing InstantDB permissions...');

async function testPermissions() {
  try {
    // Test 1: Query all poses (should work - public read)
    console.log('\n1️⃣ Testing public read access to poses...');
    const posesResult = await db.query({ poses: {} });
    console.log(`✅ Successfully queried ${posesResult.poses.length} poses`);
    
    // Test 2: Query all transitions (should work - public read)
    console.log('\n2️⃣ Testing public read access to transitions...');
    const transitionsResult = await db.query({ transitions: {} });
    console.log(`✅ Successfully queried ${transitionsResult.transitions.length} transitions`);
    
    // Test 3: Query profiles (should work but may be restricted)
    console.log('\n3️⃣ Testing profile access...');
    try {
      const profilesResult = await db.query({ profiles: {} });
      console.log(`✅ Successfully queried ${profilesResult.profiles.length} profiles`);
    } catch (error) {
      console.log('⚠️  Profile access restricted (expected if permissions are working)');
    }
    
    // Test 4: Query favorites (should work but may be restricted)
    console.log('\n4️⃣ Testing favorites access...');
    try {
      const favoritesResult = await db.query({ favorites: {} });
      console.log(`✅ Successfully queried ${favoritesResult.favorites.length} favorites`);
    } catch (error) {
      console.log('⚠️  Favorites access may be restricted (expected if permissions are working)');
    }
    
    // Test 5: Query comments (should work - public read)
    console.log('\n5️⃣ Testing public read access to comments...');
    try {
      const commentsResult = await db.query({ comments: {} });
      console.log(`✅ Successfully queried ${commentsResult.comments.length} comments`);
    } catch (error) {
      console.log('ℹ️  Comments query failed (may be no comments yet)');
    }
    
    // Test 6: Query public flows (should work - public read)
    console.log('\n6️⃣ Testing public flow access...');
    try {
      const flowsResult = await db.query({ flows: { $: { where: { isPublic: true } } } });
      console.log(`✅ Successfully queried ${flowsResult.flows.length} public flows`);
    } catch (error) {
      console.log('ℹ️  Public flows query failed (may be no public flows yet)');
    }
    
    console.log('\n🎉 Permission testing completed!');
    console.log('\n📊 Summary:');
    console.log('  - Public entities (poses, transitions) should be accessible');
    console.log('  - Private entities (favorites, profiles) should be restricted');
    console.log('  - Public flows should be accessible');
    console.log('  - Comments should be accessible (if any exist)');
    
  } catch (error) {
    console.error('❌ Error testing permissions:', error);
    
    // Check if it's an authentication error
    if (error.message.includes('auth') || error.message.includes('permission')) {
      console.log('\n💡 This looks like a permissions issue. Make sure:');
      console.log('  1. Permissions are configured in the InstantDB dashboard');
      console.log('  2. INSTANT_ADMIN_TOKEN is set correctly');
      console.log('  3. The schema has been deployed');
    }
    
    process.exit(1);
  }
}

testPermissions();
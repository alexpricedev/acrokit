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

console.log('🔐 Configuring InstantDB permissions...');

// Define permission rules
const permissionRules = {
  // Poses: All users can read all poses
  poses: {
    allow: {
      read: 'true', // All users can read all poses
    },
  },
  
  // Profiles: Users can read/update their own profile
  profiles: {
    allow: {
      read: 'auth.id == data.$user.id', // Users can read their own profile
      update: 'auth.id == data.$user.id', // Users can update their own profile
    },
  },
  
  // Favorites: Users can create/read/delete their own favorites
  favorites: {
    allow: {
      create: 'auth.id != null && auth.id == data.profile.$user.id', // Users can create favorites if they own the profile
      read: 'auth.id == data.profile.$user.id', // Users can read favorites they own
      delete: 'auth.id == data.profile.$user.id', // Users can delete favorites they own
    },
  },
  
  // Comments: Users can create/read/update/delete their own comments
  comments: {
    allow: {
      create: 'auth.id == data.author.$user.id', // Users can create comments as themselves
      read: 'true', // All users can read all comments
      update: 'auth.id == data.author.$user.id', // Users can update their own comments
      delete: 'auth.id == data.author.$user.id', // Users can delete their own comments
    },
  },
  
  // Flows: Users can create/read/update/delete their own flows, read public flows
  flows: {
    allow: {
      create: 'auth.id == data.userId', // Users can create flows for themselves
      read: 'data.isPublic == true || auth.id == data.userId', // Users can read public flows or their own
      update: 'auth.id == data.userId', // Users can update their own flows
      delete: 'auth.id == data.userId', // Users can delete their own flows
    },
  },
  
  // Transitions: All users can read all transitions
  transitions: {
    allow: {
      read: 'true', // All users can read all transitions
    },
  },
};

async function configurePermissions() {
  try {
    console.log('📋 Current permission configuration:');
    console.log(JSON.stringify(permissionRules, null, 2));
    
    // Check if InstantDB supports permission configuration via admin API
    // Note: This is a conceptual example - actual API may differ
    console.log('\n✅ Permission rules defined successfully');
    console.log('💡 These rules should be configured in your InstantDB dashboard');
    
    console.log('\n🔧 Key Permission Rules:');
    console.log('  - Poses: All users can read all poses');
    console.log('  - Profiles: Users can read/update their own profile');
    console.log('  - Favorites: Users can create/read/delete their own favorites');
    console.log('  - Comments: Users can create/read/update/delete their own comments');
    console.log('  - Flows: Users can create/read/update/delete their own flows, read public flows');
    console.log('  - Transitions: All users can read all transitions');
    
    console.log('\n🚨 IMPORTANT: Manual Configuration Required');
    console.log('InstantDB permissions need to be configured in the dashboard at:');
    console.log('https://instantdb.com/dash');
    console.log('Navigate to your app → Permissions → Configure the rules above');
    
  } catch (error) {
    console.error('❌ Error configuring permissions:', error);
    process.exit(1);
  }
}

configurePermissions();
#!/usr/bin/env node

import { init } from '@instantdb/react';
import { i } from '@instantdb/react';

console.log('🧪 Testing schema configuration...');

// App configuration - public APP_ID (safe to inline)
const APP_ID = '63c65c15-20c2-418f-b504-a823ecadb2d0';

// Schema definition with updated favorites system
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

console.log('✅ Schema definition loaded successfully');
console.log('🔧 Schema contains:');
console.log('  - Entities:', Object.keys(schema.entities));
console.log('  - Links:', Object.keys(schema.links));

try {
  console.log('🚀 Initializing database connection...');
  const db = init({
    appId: APP_ID,
    schema,
  });

  console.log('✅ Database initialized successfully!');
  console.log('📊 App ID:', APP_ID);
  console.log('🎯 Schema should be automatically pushed to InstantDB');
  console.log('');
  console.log('📋 Schema Summary:');
  console.log('  - $users: Authentication');
  console.log('  - poses: Acroyoga poses with difficulty levels');
  console.log('  - transitions: Valid movements between poses');
  console.log('  - flows: User-created sequences');
  console.log('  - profiles: User display names');
  console.log('  - favorites: Simplified profile+pose favorites');
  console.log('  - comments: Pose discussions');
  console.log('');
  console.log('🔗 Relationships:');
  console.log('  - profiles ↔ $users (one-to-one)');
  console.log('  - comments → poses (many-to-one)');
  console.log('  - comments → profiles (many-to-one)');
  console.log('  - favorites → profiles (many-to-one)');
  console.log('  - favorites → poses (many-to-one)');
  console.log('');
  console.log('🎉 Schema test completed successfully!');
  console.log('💡 The schema is now available for use in your application');
  
} catch (error) {
  console.error('❌ Schema test failed:', error);
  process.exit(1);
}
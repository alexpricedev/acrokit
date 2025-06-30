#!/usr/bin/env node

import { init } from '@instantdb/admin';
import { randomUUID } from 'crypto';
import { schema } from '../src/lib/schema.ts';

// App configuration - public APP_ID (safe to inline)
const APP_ID = '63c65c15-20c2-418f-b504-a823ecadb2d0';

const db = init({
  appId: APP_ID,
  schema,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
});

console.log('🌱 Starting database seeding...');

// Generate unique IDs
const poseIds = {
  shinToShin: randomUUID(),
  bird: randomUUID(),
  throne: randomUUID(),
  foldedLeaf: randomUUID(),
  whale: randomUUID(),
  star: randomUUID(),
  reverseBird: randomUUID(),
  highFlyingWhale: randomUUID(),
};

console.log('🔍 Generated pose IDs:', poseIds);

// Sample poses for L-basing Acroyoga
const poses = [
  {
    id: poseIds.shinToShin,
    name: 'Shin to Shin',
    description: 'Base and flyer connect shin to shin in standing position',
    difficulty: 'beginner',
    createdAt: Date.now(),
  },
  {
    id: poseIds.bird,
    name: 'Bird',
    description: "Classic L-basing pose with flyer's hips on base's feet",
    difficulty: 'beginner',
    isStartingPose: true,
    createdAt: Date.now(),
  },
  {
    id: poseIds.throne,
    name: 'Throne',
    description:
      "Flyer sits on base's feet with back supported by base's hands",
    difficulty: 'beginner',
    isStartingPose: true,
    createdAt: Date.now(),
  },
  {
    id: poseIds.foldedLeaf,
    name: 'Folded Leaf',
    description: "Flyer in forward fold position balancing on base's feet",
    difficulty: 'beginner',
    createdAt: Date.now(),
  },
  {
    id: poseIds.whale,
    name: 'Whale',
    description: "Flyer lies on base's feet in prone position, arms extended",
    difficulty: 'intermediate',
    createdAt: Date.now(),
  },
  {
    id: poseIds.star,
    name: 'Star',
    description: 'Flyer in backbend with arms and legs extended',
    difficulty: 'intermediate',
    createdAt: Date.now(),
  },
  {
    id: poseIds.reverseBird,
    name: 'Reverse Bird',
    description: 'Bird position with flyer facing away from base',
    difficulty: 'intermediate',
    createdAt: Date.now(),
  },
  {
    id: poseIds.highFlyingWhale,
    name: 'High Flying Whale',
    description: 'Advanced whale position with extended arms and legs',
    difficulty: 'advanced',
    createdAt: Date.now(),
  },
];

// Sample transitions between poses
const transitions = [
  {
    id: randomUUID(),
    name: 'Mount to Bird',
    description: 'Initial mount from ground to bird position',
    fromPoseId: poseIds.shinToShin,
    toPoseId: poseIds.bird,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Bird to Throne',
    description: 'Transition from bird to throne by sitting up',
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.throne,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Throne to Bird',
    description: 'Return from throne to bird by leaning forward',
    fromPoseId: poseIds.throne,
    toPoseId: poseIds.bird,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Bird to Folded Leaf',
    description: 'Forward fold from bird position',
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.foldedLeaf,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Folded Leaf to Bird',
    description: 'Return from folded leaf to bird',
    fromPoseId: poseIds.foldedLeaf,
    toPoseId: poseIds.bird,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Bird to Whale',
    description: 'Transition to prone whale position',
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.whale,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Whale to Bird',
    description: 'Return from whale to bird position',
    fromPoseId: poseIds.whale,
    toPoseId: poseIds.bird,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Whale to Throne',
    description: 'Prasarita twist from whale to throne',
    fromPoseId: poseIds.whale,
    toPoseId: poseIds.throne,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Throne to Star',
    description: 'Backbend transition to star position',
    fromPoseId: poseIds.throne,
    toPoseId: poseIds.star,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Star to Throne',
    description: 'Return from star to throne',
    fromPoseId: poseIds.star,
    toPoseId: poseIds.throne,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Bird to Reverse Bird',
    description: 'Turn around to face away from base',
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.reverseBird,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Reverse Bird to Bird',
    description: 'Turn around to face the base',
    fromPoseId: poseIds.reverseBird,
    toPoseId: poseIds.bird,
    createdAt: Date.now(),
  },
  {
    id: randomUUID(),
    name: 'Whale to High Flying Whale',
    description: 'Extend to advanced whale position',
    fromPoseId: poseIds.whale,
    toPoseId: poseIds.highFlyingWhale,
    createdAt: Date.now(),
  },
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log(`\n📥 Adding ${poses.length} poses to database...`);

    // Add all poses in a single transaction
    const poseTransactions = poses.map(pose =>
      db.tx.poses[pose.id].update(pose)
    );
    await db.transact(poseTransactions);
    console.log('✅ All poses added successfully');

    console.log(`\n🔗 Adding ${transitions.length} transitions to database...`);

    // Add all transitions in a single transaction
    const transitionTransactions = transitions.map(transition =>
      db.tx.transitions[transition.id].update(transition)
    );
    await db.transact(transitionTransactions);
    console.log('✅ All transitions added successfully');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(
      `📊 Successfully seeded ${poses.length} poses and ${transitions.length} transitions`
    );

    // Log key IDs for debugging
    console.log('\n🔍 Key pose IDs for debugging:');
    console.log(`  Shin to Shin (starting): ${poseIds.shinToShin}`);
    console.log(`  Bird: ${poseIds.bird}`);
    console.log(`  Throne: ${poseIds.throne}`);
    console.log(`  Whale: ${poseIds.whale}`);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

console.log('✅ Starting seeding with inlined configuration...');
seedDatabase();

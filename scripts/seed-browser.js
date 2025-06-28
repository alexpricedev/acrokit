// Browser-based seeding script
// Copy and paste this into the browser console at http://localhost:3000

console.log('🌱 Starting browser-based database seeding...')

// Generate unique IDs using crypto API (available in browser)
const poseIds = {
  shinToShin: crypto.randomUUID(),
  bird: crypto.randomUUID(),
  throne: crypto.randomUUID(),
  foldedLeaf: crypto.randomUUID(),
  whale: crypto.randomUUID(),
  star: crypto.randomUUID(),
  reverseBird: crypto.randomUUID(),
  highFlyingWhale: crypto.randomUUID()
}

console.log('🔍 Generated pose IDs:', poseIds)

// Sample poses for L-basing Acroyoga
const poses = [
  {
    id: poseIds.shinToShin,
    name: "Shin to Shin",
    description: "Base and flyer connect shin to shin in standing position",
    difficulty: "beginner",
    createdAt: Date.now()
  },
  {
    id: poseIds.bird,
    name: "Bird",
    description: "Classic L-basing pose with flyer's hips on base's feet",
    difficulty: "beginner",
    createdAt: Date.now()
  },
  {
    id: poseIds.throne,
    name: "Throne",
    description: "Flyer sits on base's feet with back supported by base's hands",
    difficulty: "beginner",
    createdAt: Date.now()
  },
  {
    id: poseIds.foldedLeaf,
    name: "Folded Leaf",
    description: "Flyer in forward fold position balancing on base's feet",
    difficulty: "beginner",
    createdAt: Date.now()
  },
  {
    id: poseIds.whale,
    name: "Whale",
    description: "Flyer lies on base's feet in prone position, arms extended",
    difficulty: "intermediate",
    createdAt: Date.now()
  },
  {
    id: poseIds.star,
    name: "Star",
    description: "Flyer in backbend with arms and legs extended",
    difficulty: "intermediate",
    createdAt: Date.now()
  },
  {
    id: poseIds.reverseBird,
    name: "Reverse Bird",
    description: "Bird position with flyer facing away from base",
    difficulty: "intermediate",
    createdAt: Date.now()
  },
  {
    id: poseIds.highFlyingWhale,
    name: "High Flying Whale",
    description: "Advanced whale position with extended arms and legs",
    difficulty: "advanced",
    createdAt: Date.now()
  }
]

// Sample transitions between poses
const transitions = [
  {
    id: crypto.randomUUID(),
    name: "Mount to Bird",
    description: "Initial mount from ground to bird position",
    fromPoseId: poseIds.shinToShin,
    toPoseId: poseIds.bird,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Bird to Throne",
    description: "Transition from bird to throne by sitting up",
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.throne,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Throne to Bird",
    description: "Return from throne to bird by leaning forward",
    fromPoseId: poseIds.throne,
    toPoseId: poseIds.bird,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Bird to Folded Leaf",
    description: "Forward fold from bird position",
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.foldedLeaf,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Folded Leaf to Bird",
    description: "Return from folded leaf to bird",
    fromPoseId: poseIds.foldedLeaf,
    toPoseId: poseIds.bird,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Bird to Whale",
    description: "Transition to prone whale position",
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.whale,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Whale to Bird",
    description: "Return from whale to bird position",
    fromPoseId: poseIds.whale,
    toPoseId: poseIds.bird,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Whale to Throne",
    description: "Prasarita twist from whale to throne",
    fromPoseId: poseIds.whale,
    toPoseId: poseIds.throne,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Throne to Star",
    description: "Backbend transition to star position",
    fromPoseId: poseIds.throne,
    toPoseId: poseIds.star,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Star to Throne",
    description: "Return from star to throne",
    fromPoseId: poseIds.star,
    toPoseId: poseIds.throne,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Bird to Reverse Bird",
    description: "Turn around to face away from base",
    fromPoseId: poseIds.bird,
    toPoseId: poseIds.reverseBird,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Reverse Bird to Bird",
    description: "Turn around to face the base",
    fromPoseId: poseIds.reverseBird,
    toPoseId: poseIds.bird,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    name: "Whale to High Flying Whale",
    description: "Extend to advanced whale position",
    fromPoseId: poseIds.whale,
    toPoseId: poseIds.highFlyingWhale,
    createdAt: Date.now()
  }
]

// Function to seed the database
async function seedDatabase() {
  try {
    console.log(`\n📥 Adding ${poses.length} poses to database...`)
    
    // Add all poses
    for (const pose of poses) {
      console.log(`🧪 Adding pose: ${pose.name}`)
      try {
        await db.transact([db.tx.poses[pose.id].update(pose)])
        console.log(`✅ Successfully added: ${pose.name}`)
      } catch (error) {
        console.error(`❌ Failed to add pose ${pose.name}:`, error)
        throw error
      }
    }
    console.log('✅ All poses added successfully')

    console.log(`\n🔗 Adding ${transitions.length} transitions to database...`)
    
    // Add all transitions
    for (const transition of transitions) {
      console.log(`🧪 Adding transition: ${transition.name}`)
      try {
        await db.transact([db.tx.transitions[transition.id].update(transition)])
        console.log(`✅ Successfully added: ${transition.name}`)
      } catch (error) {
        console.error(`❌ Failed to add transition ${transition.name}:`, error)
        throw error
      }
    }
    console.log('✅ All transitions added successfully')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log(`📊 Successfully seeded ${poses.length} poses and ${transitions.length} transitions`)
    
    // Log key IDs for debugging
    console.log('\n🔍 Key pose IDs for debugging:')
    console.log(`  Shin to Shin (starting): ${poseIds.shinToShin}`)
    console.log(`  Bird: ${poseIds.bird}`)
    console.log(`  Throne: ${poseIds.throne}`)
    console.log(`  Whale: ${poseIds.whale}`)

  } catch (error) {
    console.error('\n❌ Error seeding database:', error)
  }
}

// Check if db is available (should be global in the app)
if (typeof db !== 'undefined') {
  console.log('✅ Database connection found, starting seeding...')
  seedDatabase()
} else {
  console.error('❌ Database connection not found. Make sure you are on the AcroKit page at http://localhost:3000')
  console.log('🔧 To seed the database:')
  console.log('   1. Navigate to http://localhost:3000')
  console.log('   2. Open browser console (F12)')
  console.log('   3. Copy and paste this entire script')
  console.log('   4. Press Enter')
}
import { Pose, Transition } from '../lib/instant'

// Sample poses for L-basing Acroyoga
export const samplePoses: Omit<Pose, 'id' | 'createdAt'>[] = [
  {
    name: "Bird",
    description: "Classic L-basing pose with flyer's hips on base's feet",
    difficulty: "beginner",
  },
  {
    name: "Throne",
    description: "Flyer sits on base's feet with back supported by base's hands",
    difficulty: "beginner",
  },
  {
    name: "Folded Leaf",
    description: "Flyer in forward fold position balancing on base's feet",
    difficulty: "beginner",
  },
  {
    name: "Whale",
    description: "Flyer lies on base's feet in prone position, arms extended",
    difficulty: "intermediate",
  },
  {
    name: "Star",
    description: "Flyer in backbend with arms and legs extended",
    difficulty: "intermediate",
  },
  {
    name: "High Flying Whale",
    description: "Advanced whale position with extended arms and legs",
    difficulty: "advanced",
  },
  {
    name: "Reverse Bird",
    description: "Bird position with flyer facing away from base",
    difficulty: "intermediate",
  },
  {
    name: "Shin to Shin",
    description: "Base and flyer connect shin to shin in standing position",
    difficulty: "beginner",
  }
]

// Sample transitions between poses
export const sampleTransitions: Omit<Transition, 'id' | 'createdAt'>[] = [
  {
    name: "Mount to Bird",
    description: "Initial mount from ground to bird position",
    fromPoseId: "shin-to-shin",
    toPoseId: "bird",
  },
  {
    name: "Bird to Throne",
    description: "Transition from bird to throne by sitting up",
    fromPoseId: "bird",
    toPoseId: "throne",
  },
  {
    name: "Throne to Bird",
    description: "Return from throne to bird by leaning forward",
    fromPoseId: "throne",
    toPoseId: "bird",
  },
  {
    name: "Bird to Folded Leaf",
    description: "Forward fold from bird position",
    fromPoseId: "bird",
    toPoseId: "folded-leaf",
  },
  {
    name: "Folded Leaf to Bird",
    description: "Return from folded leaf to bird",
    fromPoseId: "folded-leaf",
    toPoseId: "bird",
  },
  {
    name: "Bird to Whale",
    description: "Transition to prone whale position",
    fromPoseId: "bird",
    toPoseId: "whale",
  },
  {
    name: "Whale to Bird",
    description: "Return from whale to bird position",
    fromPoseId: "whale",
    toPoseId: "bird",
  },
  {
    name: "Whale to Throne",
    description: "Prasarita twist from whale to throne",
    fromPoseId: "whale",
    toPoseId: "throne",
  },
  {
    name: "Throne to Star",
    description: "Backbend transition to star position",
    fromPoseId: "throne",
    toPoseId: "star",
  },
  {
    name: "Star to Throne",
    description: "Return from star to throne",
    fromPoseId: "star",
    toPoseId: "throne",
  },
  {
    name: "Bird to Reverse Bird",
    description: "Turn around to face away from base",
    fromPoseId: "bird",
    toPoseId: "reverse-bird",
  },
  {
    name: "Reverse Bird to Bird",
    description: "Turn around to face the base",
    fromPoseId: "reverse-bird",
    toPoseId: "bird",
  },
  {
    name: "Whale to High Flying Whale",
    description: "Extend to advanced whale position",
    fromPoseId: "whale",
    toPoseId: "high-flying-whale",
  }
]
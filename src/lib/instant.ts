import { init } from '@instantdb/react'

// Database schema definition for InstantDB
export const schema = {
  entities: {
    poses: {
      name: { type: 'string' },
      description: { type: 'string' },
      difficulty: { type: 'string' },
      imageUrl: { type: 'string' },
      baseImageUrl: { type: 'string' },
      flyerImageUrl: { type: 'string' },
      createdAt: { type: 'number' }
    },
    transitions: {
      name: { type: 'string' },
      description: { type: 'string' },
      fromPoseId: { type: 'string' },
      toPoseId: { type: 'string' },
      createdAt: { type: 'number' }
    },
    flows: {
      name: { type: 'string' },
      description: { type: 'string' },
      isPublic: { type: 'boolean' },
      userId: { type: 'string' },
      stepsData: { type: 'string' },
      createdAt: { type: 'number' },
      updatedAt: { type: 'number' }
    }
  },
  links: {},
  rooms: {}
} as const

// TypeScript types derived from schema
export type Schema = {
  poses: {
    id: string
    name: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    imageUrl?: string
    baseImageUrl?: string
    flyerImageUrl?: string
    createdAt: number
  }
  transitions: {
    id: string
    name: string
    description?: string
    fromPoseId: string
    toPoseId: string
    createdAt: number
  }
  flows: {
    id: string
    name: string
    description?: string
    isPublic: boolean
    userId: string
    stepsData: string
    createdAt: number
    updatedAt: number
  }
}

// Real InstantDB app ID
const APP_ID = '63c65c15-20c2-418f-b504-a823ecadb2d0'

export const db = init({
  appId: APP_ID,
})

export type Pose = Schema['poses']
export type Transition = Schema['transitions']
export type Flow = Schema['flows']
export type User = {
  id: string
  email: string
  createdAt: number
}

// Local flow step interface for the builder
export interface FlowStep {
  pose: Pose
  transition?: Transition
}
import { init } from '@instantdb/react'

// Database schema definition
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
    stepsData: string // JSON serialized flow steps
    createdAt: number
    updatedAt: number
  }
  users: {
    id: string
    email: string
    createdAt: number
  }
}

// For demo purposes, we'll use a placeholder app ID
// In production, you'd get this from InstantDB dashboard
const APP_ID = 'acrokit-demo-app-id'

export const db = init({
  appId: APP_ID,
})

export type Pose = Schema['poses']
export type Transition = Schema['transitions']
export type Flow = Schema['flows']
export type User = Schema['users']

// Local flow step interface for the builder
export interface FlowStep {
  pose: Pose
  transition?: Transition
}
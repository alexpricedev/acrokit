import { i } from '@instantdb/react'

// Shared schema definition for InstantDB
export const schema = i.schema({
  entities: {
    poses: i.entity({
      name: i.string(),
      description: i.string(),
      difficulty: i.string(),
      imageUrl: i.string().optional(),
      baseImageUrl: i.string().optional(),
      flyerImageUrl: i.string().optional(),
      createdAt: i.number()
    }),
    transitions: i.entity({
      name: i.string(),
      description: i.string().optional(),
      fromPoseId: i.string(),
      toPoseId: i.string(),
      createdAt: i.number()
    }),
    flows: i.entity({
      name: i.string(),
      description: i.string().optional(),
      isPublic: i.boolean(),
      userId: i.string(),
      stepsData: i.string(),
      createdAt: i.number(),
      updatedAt: i.number()
    })
  }
})

// App configuration - public APP_ID (safe to inline)
export const APP_ID = '63c65c15-20c2-418f-b504-a823ecadb2d0'

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
import { init, i, id } from '@instantdb/react'

// Database schema definition for InstantDB
const _schema = i.schema({
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

type _AppSchema = typeof _schema
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema

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
  schema
})

export type Pose = Schema['poses']
export type Transition = Schema['transitions']
export type Flow = Schema['flows']
export type User = {
  id: string
  email: string
  createdAt: number
}

// Export id function for transactions
export { id }

// Local flow step interface for the builder
export interface FlowStep {
  pose: Pose
  transition?: Transition
}
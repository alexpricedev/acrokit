import { i } from '@instantdb/react';

// Shared schema definition for InstantDB
export const schema = i.schema({
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
    userFavoritePoses: {
      forward: { on: '$users', has: 'many', label: 'favoritePoses' },
      reverse: { on: 'poses', has: 'many', label: 'favoritedByUsers' },
    },
  },
});

// App configuration - public APP_ID (safe to inline)
export const APP_ID = '63c65c15-20c2-418f-b504-a823ecadb2d0';

// TypeScript types derived from schema
export type Schema = {
  $users: {
    id: string;
    email: string;
  };
  poses: {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    isStartingPose?: boolean;
    imageUrl?: string;
    baseImageUrl?: string;
    flyerImageUrl?: string;
    createdAt: number;
  };
  transitions: {
    id: string;
    name: string;
    description?: string;
    fromPoseId: string;
    toPoseId: string;
    createdAt: number;
  };
  flows: {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    userId: string;
    stepsData: string;
    createdAt: number;
    updatedAt: number;
  };
  profiles: {
    id: string;
    displayName: string;
    createdAt: number;
    updatedAt: number;
  };
  comments: {
    id: string;
    content: string;
    createdAt: number;
    updatedAt: number;
  };
};

export type Pose = Schema['poses'];
export type Transition = Schema['transitions'];
export type Flow = Schema['flows'];
export type Profile = Schema['profiles'];
export type Comment = Schema['comments'];
export type User = {
  id: string;
  email: string;
  createdAt: number;
};

// Local flow step interface for the builder
export interface FlowStep {
  pose: Pose;
  transition?: Transition;
}

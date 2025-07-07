import { i } from '@instantdb/react';

// Shared schema definition for InstantDB
export const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    poses: i.entity({
      name: i.string().indexed(),
      description: i.string(),
      difficulty: i.string(),
      isStartingPose: i.boolean().optional(),
      createdAt: i.date(),
    }),
    transitions: i.entity({
      name: i.string(),
      description: i.string().optional(),
      fromPoseId: i.string(),
      toPoseId: i.string(),
      createdAt: i.date(),
    }),
    flows: i.entity({
      name: i.string(),
      description: i.string().optional(),
      isPublic: i.boolean(),
      userId: i.string(),
      stepsData: i.string(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    profiles: i.entity({
      displayName: i.string().unique().indexed(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    comments: i.entity({
      content: i.string(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    favorites: i.entity({
      poseId: i.string(),
      profileId: i.string(),
    }),
  },
  links: {
    profileUser: {
      forward: { on: 'profiles', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },
    poseImageFile: {
      forward: { on: 'poses', has: 'one', label: 'imageFile' },
      reverse: { on: '$files', has: 'many', label: 'posesWithImage' },
    },
    commentsPose: {
      forward: { on: 'comments', has: 'one', label: 'pose' },
      reverse: { on: 'poses', has: 'many', label: 'comments' },
    },
    commentsAuthor: {
      forward: { on: 'comments', has: 'one', label: 'author' },
      reverse: { on: 'profiles', has: 'many', label: 'comments' },
    },
    favoritesPose: {
      forward: { on: 'favorites', has: 'one', label: 'pose' },
      reverse: { on: 'poses', has: 'many', label: 'favorites' },
    },
    favoritesProfile: {
      forward: { on: 'favorites', has: 'one', label: 'profile' },
      reverse: { on: 'profiles', has: 'many', label: 'favorites' },
    },
  },
});

// App configuration - public APP_ID (safe to inline)
export const APP_ID = '63c65c15-20c2-418f-b504-a823ecadb2d0';

// TypeScript types derived from schema
// Note: InstantDB returns dates as strings in queries, but we define them as Date for type safety
export type Schema = {
  $users: {
    id: string;
    email?: string; // Optional per InstantDB schema
  };
  $files: {
    id: string;
    path: string;
    url: string;
  };
  poses: {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    isStartingPose?: boolean;
    createdAt: string | number; // InstantDB returns as string/number despite i.date() schema
  };
  transitions: {
    id: string;
    name: string;
    description?: string;
    fromPoseId: string;
    toPoseId: string;
    createdAt: string | number; // InstantDB returns as string/number despite i.date() schema
  };
  flows: {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    userId: string;
    stepsData: string;
    createdAt: string | number; // InstantDB returns as string/number despite i.date() schema
    updatedAt: string | number; // InstantDB returns as string/number despite i.date() schema
  };
  profiles: {
    id: string;
    displayName: string;
    createdAt: string | number; // InstantDB returns as string/number despite i.date() schema
    updatedAt: string | number; // InstantDB returns as string/number despite i.date() schema
  };
  comments: {
    id: string;
    content: string;
    createdAt: string | number; // InstantDB returns as string/number despite i.date() schema
    updatedAt: string | number; // InstantDB returns as string/number despite i.date() schema
  };
  favorites: {
    id: string;
    poseId: string;
    profileId: string;
  };
};

export type Pose = Schema['poses'];
export type File = Schema['$files'];

// Extended types with linked data for components
export type PoseWithFiles = Pose & {
  imageFile?: File;
};
export type Transition = Schema['transitions'];
export type Flow = Schema['flows'];
export type Profile = Schema['profiles'];
export type Comment = Schema['comments'];
export type Favorite = Schema['favorites'];
export type User = {
  id: string;
  email?: string; // Optional per InstantDB schema
};

// Local flow step interface for the builder
export interface FlowStep {
  pose: PoseWithFiles;
  transition?: Transition;
}

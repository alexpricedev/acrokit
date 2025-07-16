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
      createdAt: i.date(),
    }),
    flows: i.entity({
      name: i.string(),
      description: i.string().optional(),
      isPublic: i.boolean(),
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
      createdAt: i.date().optional(),
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
    transitionFromPose: {
      forward: { on: 'transitions', has: 'one', label: 'fromPose' },
      reverse: { on: 'poses', has: 'many', label: 'transitionsFrom' },
    },
    transitionToPose: {
      forward: { on: 'transitions', has: 'one', label: 'toPose' },
    },
    flowUser: {
      forward: { on: 'flows', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'many', label: 'flows' },
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
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isStartingPose?: boolean;
    createdAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
  };
  transitions: {
    id: string;
    name: string;
    description?: string;
    createdAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
  };
  flows: {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    stepsData: string;
    createdAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
    updatedAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
  };
  profiles: {
    id: string;
    displayName: string;
    createdAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
    updatedAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
  };
  comments: {
    id: string;
    content: string;
    createdAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
    updatedAt: string; // ISO date string like "2025-07-07T20:50:38.091Z"
  };
  favorites: {
    id: string;
    createdAt?: string; // ISO date string like "2025-07-07T20:50:38.091Z", optional field
  };
};

export type Pose = Schema['poses'];
export type File = Schema['$files'];

// Extended types with linked data for components
export type PoseWithFiles = Pose & {
  imageFile?: File;
};
export type Transition = Schema['transitions'];
export type TransitionWithPoses = Transition & {
  fromPose?: Pose;
  toPose?: Pose;
};
export type FavoriteWithLinkedData = Favorite & {
  pose?: PoseWithFiles;
  profile?: Profile;
};
export type Flow = Schema['flows'];
export type FlowWithUser = Flow & {
  $user?: User;
};
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
  transition?: TransitionWithPoses;
}

import { init, id } from '@instantdb/react';
import { schema, APP_ID } from './schema';

export const db = init({
  appId: APP_ID,
  schema,
});

// Re-export types and utilities
export type {
  Schema,
  Pose,
  PoseWithFiles,
  File,
  Transition,
  TransitionWithPoses,
  Flow,
  FlowWithUser,
  User,
  Profile,
  Comment,
  Favorite,
  FavoriteWithLinkedData,
  FlowStep,
} from './schema';
export { id };

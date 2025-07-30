import { db, TransitionWithPoses } from '../lib/instant';

/**
 * Hook to fetch all transitions from InstantDB
 * Follows InstantDB patterns with proper loading/error handling
 */
export function useTransitions() {
  const { data, isLoading, error } = db.useQuery({
    transitions: {
      fromPose: {
        imageFile: {},
      },
      toPose: {
        imageFile: {},
      },
    },
  });

  // Extract transitions array from data according to InstantDB query structure
  // Query now includes linked poses - handle the array relationship for fromPose
  const transitions: TransitionWithPoses[] = (data?.transitions || []).map(
    (transition: any) => ({
      ...transition,
      fromPose: Array.isArray(transition.fromPose) 
        ? transition.fromPose[0] 
        : transition.fromPose,
    })
  );

  return {
    transitions,
    isLoading,
    error,
    // Helper computed values
    isEmpty: !isLoading && !error && transitions.length === 0,
    hasData: !isLoading && !error && transitions.length > 0,
  };
}

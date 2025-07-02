import { db, Pose } from '../lib/instant';

/**
 * Hook to fetch all poses from InstantDB
 * Follows InstantDB patterns with proper loading/error handling
 */
export function usePoses() {
  const { data, isLoading, error } = db.useQuery({ poses: {} });

  // Extract poses array from data according to InstantDB query structure
  // Query { poses: {} } should return { poses: [...] }
  const poses: Pose[] = (data?.poses || []) as Pose[];

  return {
    poses,
    isLoading,
    error,
    // Helper computed values
    isEmpty: !isLoading && !error && poses.length === 0,
    hasData: !isLoading && !error && poses.length > 0,
  };
}

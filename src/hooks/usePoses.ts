import { db, PoseWithFiles } from '../lib/instant';

/**
 * Hook to fetch all poses from InstantDB
 * Follows InstantDB patterns with proper loading/error handling
 */
export function usePoses() {
  const { data, isLoading, error } = db.useQuery({
    poses: {
      imageFile: {},
    },
  });

  // Extract poses array from data according to InstantDB query structure
  // Query { poses: {} } should return { poses: [...] }
  const poses: PoseWithFiles[] = (data?.poses || []) as PoseWithFiles[];

  return {
    poses,
    isLoading,
    error,
    // Helper computed values
    isEmpty: !isLoading && !error && poses.length === 0,
    hasData: !isLoading && !error && poses.length > 0,
  };
}

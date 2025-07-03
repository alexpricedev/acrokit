import { db, Transition } from '../lib/instant';

/**
 * Hook to fetch all transitions from InstantDB
 * Follows InstantDB patterns with proper loading/error handling
 */
export function useTransitions() {
  const { data, isLoading, error } = db.useQuery({ transitions: {} });

  // Extract transitions array from data according to InstantDB query structure
  // Query { transitions: {} } should return { transitions: [...] }
  const transitions: Transition[] = (data?.transitions || []) as Transition[];

  return {
    transitions,
    isLoading,
    error,
    // Helper computed values
    isEmpty: !isLoading && !error && transitions.length === 0,
    hasData: !isLoading && !error && transitions.length > 0,
  };
}

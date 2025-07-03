import { db, Flow } from '../lib/instant';

/**
 * Hook to fetch flows from InstantDB with proper database filtering
 * Supports fetching user-specific flows or public flows
 */
export function useFlows(userId?: string, includePublic = false) {
  // For now, fetch all flows and filter client-side due to TypeScript complexity
  // This can be optimized later with proper InstantDB type definitions
  const { data, isLoading, error } = db.useQuery({ flows: {} });

  // Extract flows array from data
  const allFlows: Flow[] = (data?.flows || []) as Flow[];

  // Filter flows based on parameters
  const flows = allFlows.filter(flow => {
    if (userId && includePublic) {
      return flow.userId === userId || flow.isPublic;
    }
    if (userId) {
      return flow.userId === userId;
    }
    if (includePublic) {
      return flow.isPublic;
    }
    return true;
  });

  // Compute user-specific and public flows for helper properties
  const userFlows = userId
    ? allFlows.filter(flow => flow.userId === userId)
    : [];
  const publicFlows = allFlows.filter(flow => flow.isPublic);

  return {
    flows,
    isLoading,
    error,
    // Helper computed values
    isEmpty: !isLoading && !error && flows.length === 0,
    hasData: !isLoading && !error && flows.length > 0,
    // User-specific flows
    userFlows,
    publicFlows,
  };
}

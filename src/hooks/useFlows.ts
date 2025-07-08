import { db, FlowWithUser } from '../lib/instant';

/**
 * Hook to fetch flows from InstantDB with proper database filtering
 * Supports fetching user-specific flows or public flows
 */
export function useFlows(userId?: string, includePublic = false) {
  // Fetch flows with linked user data
  const { data, isLoading, error } = db.useQuery({
    flows: {
      $user: {},
    },
  });

  // Extract flows array from data
  const allFlows: FlowWithUser[] = (data?.flows || []) as FlowWithUser[];

  // Filter flows based on parameters
  const flows = allFlows.filter(flow => {
    if (userId && includePublic) {
      return flow.$user?.id === userId || flow.isPublic;
    }
    if (userId) {
      return flow.$user?.id === userId;
    }
    if (includePublic) {
      return flow.isPublic;
    }
    return true;
  });

  // Compute user-specific and public flows for helper properties
  const userFlows = userId
    ? allFlows.filter(flow => flow.$user?.id === userId)
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

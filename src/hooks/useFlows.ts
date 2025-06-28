import { db, Flow } from '../lib/instant'

/**
 * Hook to fetch flows from InstantDB with optional filtering
 * Supports fetching user-specific flows or public flows
 */
export function useFlows(userId?: string, includePublic = false) {
  // For now, let's just fetch all flows and filter in memory
  // This avoids TypeScript issues with complex where clauses
  const query = { flows: {} }
      
  const { data, isLoading, error } = db.useQuery(query)
  
  // Debug logging
  console.log('🔍 useFlows debug:', {
    userId,
    includePublic,
    isLoading,
    error: error?.message,
    rawData: data,
    query,
    flowsProperty: data?.flows,
    flowsType: typeof data?.flows,
    flowsLength: Array.isArray(data?.flows) ? data.flows.length : 'not array'
  })
  
  // Extract flows array from data
  const allFlows: Flow[] = (data?.flows || []) as Flow[]
  
  // Filter flows based on parameters
  const flows = allFlows.filter(flow => {
    if (userId && includePublic) {
      return flow.userId === userId || flow.isPublic
    }
    if (userId) {
      return flow.userId === userId
    }
    if (includePublic) {
      return flow.isPublic
    }
    return true
  })
  
  return {
    flows,
    isLoading,
    error,
    // Helper computed values
    isEmpty: !isLoading && !error && flows.length === 0,
    hasData: !isLoading && !error && flows.length > 0,
    // User-specific flows
    userFlows: allFlows.filter(flow => flow.userId === userId),
    publicFlows: allFlows.filter(flow => flow.isPublic),
  }
}
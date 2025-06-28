import { db, Transition } from '../lib/instant'

/**
 * Hook to fetch all transitions from InstantDB
 * Follows InstantDB patterns with proper loading/error handling
 */
export function useTransitions() {
  const { data, isLoading, error } = db.useQuery({ transitions: {} })
  
  // Debug logging to understand data structure
  console.log('🔍 useTransitions debug:', {
    isLoading,
    error: error?.message,
    rawData: data,
    dataKeys: data ? Object.keys(data) : null,
    transitionsProperty: data?.transitions,
    transitionsType: typeof data?.transitions,
    transitionsLength: Array.isArray(data?.transitions) ? data.transitions.length : 'not array',
    firstTransition: Array.isArray(data?.transitions) && data.transitions.length > 0 ? data.transitions[0] : null
  })
  
  // Extract transitions array from data according to InstantDB query structure
  // Query { transitions: {} } should return { transitions: [...] }
  const transitions: Transition[] = (data?.transitions || []) as Transition[]
  
  return {
    transitions,
    isLoading,
    error,
    // Helper computed values
    isEmpty: !isLoading && !error && transitions.length === 0,
    hasData: !isLoading && !error && transitions.length > 0
  }
}
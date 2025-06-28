import { usePoses } from './usePoses'
import { useTransitions } from './useTransitions'
import { Pose, Transition } from '../lib/instant'

/**
 * Combined hook for poses and transitions needed for flow building
 * Provides computed values and flow-specific helpers
 */
export function useFlowData() {
  const posesResult = usePoses()
  const transitionsResult = useTransitions()
  
  const isLoading = posesResult.isLoading || transitionsResult.isLoading
  const error = posesResult.error || transitionsResult.error
  const hasError = !!(posesResult.error || transitionsResult.error)
  
  // Debug combined state
  console.log('🔍 useFlowData debug:', {
    poses: {
      loading: posesResult.isLoading,
      count: posesResult.poses.length,
      hasData: posesResult.hasData,
      error: posesResult.error?.message
    },
    transitions: {
      loading: transitionsResult.isLoading,
      count: transitionsResult.transitions.length,
      hasData: transitionsResult.hasData,
      error: transitionsResult.error?.message
    },
    combined: {
      isLoading,
      hasError,
      isEmpty: posesResult.isEmpty && transitionsResult.isEmpty
    }
  })
  
  /**
   * Get poses that can be starting poses (have transitions from shin-to-shin)
   */
  const getStartingPoses = (): Pose[] => {
    const startingPoses = posesResult.poses.filter(pose => 
      transitionsResult.transitions.some(t => t.toPoseId === pose.id && t.fromPoseId === 'shin-to-shin')
    )
    
    console.log('🎯 getStartingPoses debug:', {
      totalPoses: posesResult.poses.length,
      totalTransitions: transitionsResult.transitions.length,
      startingPosesFound: startingPoses.length,
      allPoseIds: posesResult.poses.map(p => p.id),
      allTransitions: transitionsResult.transitions.map(t => ({ name: t.name, from: t.fromPoseId, to: t.toPoseId })),
      startingTransitions: transitionsResult.transitions.filter(t => t.fromPoseId === 'shin-to-shin')
    })
    
    return startingPoses
  }
  
  /**
   * Get valid next poses from a given pose
   */
  const getValidNextPoses = (fromPoseId: string): Array<{ pose: Pose, transition: Transition }> => {
    const validTransitions = transitionsResult.transitions.filter(t => t.fromPoseId === fromPoseId)
    
    return validTransitions.map(transition => ({
      pose: posesResult.poses.find(p => p.id === transition.toPoseId),
      transition
    })).filter(item => item.pose) as Array<{ pose: Pose, transition: Transition }>
  }
  
  return {
    // Raw data
    poses: posesResult.poses,
    transitions: transitionsResult.transitions,
    
    // Loading states
    isLoading,
    error,
    hasError,
    
    // Computed states
    isEmpty: posesResult.isEmpty && transitionsResult.isEmpty,
    hasData: posesResult.hasData && transitionsResult.hasData,
    
    // Flow-specific helpers
    getStartingPoses,
    getValidNextPoses,
    
    // Individual hook results for advanced usage
    posesResult,
    transitionsResult
  }
}
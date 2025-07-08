import { usePoses } from './usePoses';
import { useTransitions } from './useTransitions';
import { PoseWithFiles, TransitionWithPoses } from '../lib/instant';

/**
 * Combined hook for poses and transitions needed for flow building
 * Provides computed values and flow-specific helpers
 */
export function useFlowData() {
  const posesResult = usePoses();
  const transitionsResult = useTransitions();

  const isLoading = posesResult.isLoading || transitionsResult.isLoading;
  const error = posesResult.error || transitionsResult.error;
  const hasError = !!(posesResult.error || transitionsResult.error);

  /**
   * Get poses that are marked as starting poses
   */
  const getStartingPoses = (): PoseWithFiles[] => {
    const startingPoses = posesResult.poses.filter(
      pose => pose.isStartingPose === true
    );

    return startingPoses;
  };

  /**
   * Get valid next poses from a given pose
   */
  const getValidNextPoses = (
    fromPoseId: string
  ): Array<{ pose: PoseWithFiles; transition: TransitionWithPoses }> => {
    const validTransitions = transitionsResult.transitions.filter(
      t => t.fromPose?.id === fromPoseId
    );

    return validTransitions
      .map(transition => ({
        pose: transition.toPose,
        transition,
      }))
      .filter(item => item.pose) as Array<{
      pose: PoseWithFiles;
      transition: TransitionWithPoses;
    }>;
  };

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
    transitionsResult,
  };
}

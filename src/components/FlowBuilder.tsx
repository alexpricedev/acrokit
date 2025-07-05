import { useState, useEffect } from 'react';
import { Pose, Transition, FlowStep } from '../lib/instant';
import { PoseCard } from './PoseCard';
import { FlowSaveModal } from './FlowSaveModal';
import { RandomFlowModal } from './RandomFlowModal';
import { PoseDetailModal } from './PoseDetailModal';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';
import { useFlowData, useFavorites } from '../hooks';

interface FlowBuilderProps {
  initialFlow?: FlowStep[];
  editingFlowId?: string;
}

export function FlowBuilder({ initialFlow, editingFlowId }: FlowBuilderProps) {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [currentFlow, setCurrentFlow] = useState<FlowStep[]>(initialFlow || []);
  const [originalFlow, setOriginalFlow] = useState<FlowStep[]>(
    initialFlow || []
  );
  const [isStartingPose, setIsStartingPose] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  // Use the new well-architected hook for data loading
  const flowData = useFlowData();
  const { transitions, isLoading, hasError } = flowData;

  // Favorites functionality
  const { isFavorited, toggleFavorite } = useFavorites(profile);

  // Database is now seeded via Node.js script: npm run seed

  // Show error message if database queries fail
  useEffect(() => {
    if (hasError) {
      showToast('Failed to load poses and transitions from database', 'error');
    }
  }, [hasError, showToast]);

  // Update flow state when initialFlow changes
  useEffect(() => {
    if (initialFlow) {
      setCurrentFlow(initialFlow);
      setOriginalFlow(initialFlow);
      setIsStartingPose(initialFlow.length === 0);
    }
  }, [initialFlow]);

  // Check if flow has been modified
  const hasChanges = () => {
    return JSON.stringify(currentFlow) !== JSON.stringify(originalFlow);
  };

  const getValidNextPoses = () => {
    if (isStartingPose) {
      // Use the helper from the hook for starting poses
      return flowData.getStartingPoses();
    }

    if (currentFlow.length === 0) return [];

    const lastPose = currentFlow[currentFlow.length - 1].pose;
    // Use the helper from the hook for next valid poses
    return flowData.getValidNextPoses(lastPose.id);
  };

  const getFilteredOptions = () => {
    let options = getValidNextPoses();

    // Apply favorites filter
    if (showOnlyFavorites) {
      if (isStartingPose) {
        options = (options as Pose[]).filter(pose => isFavorited(pose.id));
      } else {
        options = (options as { pose: Pose; transition: Transition }[]).filter(
          ({ pose }) => isFavorited(pose.id)
        );
      }
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      if (isStartingPose) {
        options = (options as Pose[]).filter(
          pose => pose.difficulty === selectedDifficulty
        );
      } else {
        options = (options as { pose: Pose; transition: Transition }[]).filter(
          ({ pose }) => pose.difficulty === selectedDifficulty
        );
      }
    }

    return options;
  };

  const addPoseToFlow = (pose: Pose, transition?: Transition) => {
    setCurrentFlow(prev => [...prev, { pose, transition }]);
    setIsStartingPose(false);
  };

  const removeLastPose = () => {
    setCurrentFlow(prev => {
      const newFlow = prev.slice(0, -1);
      if (newFlow.length === 0) {
        setIsStartingPose(true);
      }
      return newFlow;
    });
  };

  const clearFlow = () => {
    setCurrentFlow([]);
    setIsStartingPose(true);
  };

  const handleSaveFlow = () => {
    if (!user) {
      showToast('Please sign in to save flows', 'info');
      return;
    }
    setShowSaveModal(true);
  };

  const handleShowPoseDetails = (pose: Pose) => {
    setSelectedPose(pose);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPose(null);
  };

  const generateRandomFlow = async (moveCount: number) => {
    try {
      // Clear existing flow
      setCurrentFlow([]);
      setIsStartingPose(true);

      const newFlow: FlowStep[] = [];
      let currentPoseOptions = flowData.getStartingPoses();

      for (let i = 0; i < moveCount; i++) {
        if (currentPoseOptions.length === 0) break;

        // Select random pose from valid options
        const randomPose =
          currentPoseOptions[
            Math.floor(Math.random() * currentPoseOptions.length)
          ];

        // Find transition for this pose (if not the first pose)
        let transition: Transition | undefined;
        if (newFlow.length > 0) {
          const lastPose = newFlow[newFlow.length - 1].pose;
          transition = transitions.find(
            t => t.fromPoseId === lastPose.id && t.toPoseId === randomPose.id
          );
        }

        // Add to flow
        newFlow.push({ pose: randomPose, transition });

        // Get next valid poses for the next iteration
        const nextOptions = flowData.getValidNextPoses(randomPose.id);
        currentPoseOptions = nextOptions.map(item => item.pose);
      }

      setCurrentFlow(newFlow);
      setIsStartingPose(newFlow.length === 0);

      showToast(
        `Generated random flow with ${newFlow.length} moves!`,
        'success'
      );
    } catch (error) {
      showToast('Error generating random flow. Please try again.', 'error');
    }
  };

  const validOptions = getValidNextPoses();
  const filteredOptions = getFilteredOptions();

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading poses and transitions...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the data from the database.
          </p>
        </div>
      </div>
    );
  }

  // Show error state if database queries failed
  if (hasError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load data
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error loading poses and transitions from the database.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Your Flow */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your flow</h2>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                {currentFlow.length}
              </span>
            </div>

            {currentFlow.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">👋</div>
                <p className="text-gray-600 mb-4">
                  Add your first move or load a flow to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentFlow.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {step.pose.name}
                      </div>
                      {step.transition && (
                        <div className="text-sm text-gray-500">
                          via {step.transition.name}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleShowPoseDetails(step.pose)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="View Pose Details"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3 sm:space-y-4">
              {currentFlow.length === 0 && (
                <button
                  onClick={() => setShowRandomModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium min-h-[44px] sm:min-h-0"
                >
                  Create Random Flow
                </button>
              )}

              <button
                onClick={handleSaveFlow}
                disabled={
                  currentFlow.length === 0 || (!!editingFlowId && !hasChanges())
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-[44px] sm:min-h-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
                </svg>
                {user
                  ? editingFlowId
                    ? 'Update Flow'
                    : 'Save Flow'
                  : 'Sign In to Save'}
              </button>

              {currentFlow.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={removeLastPose}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Remove Last
                  </button>
                  <button
                    onClick={clearFlow}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Available Moves */}
        <div className="lg:col-span-2">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {isStartingPose ? 'Starting moves' : 'Available next moves'}
                </h2>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                  {showOnlyFavorites
                    ? filteredOptions.length
                    : validOptions.length}
                </span>
              </div>
            </div>

            {/* Filter Pills - Mobile Friendly */}
            <div className="flex flex-wrap gap-2 justify-start">
              {profile && (
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    showOnlyFavorites
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                  </svg>
                  Favorites
                </button>
              )}

              <button
                onClick={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === 'beginner' ? null : 'beginner'
                  )
                }
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors border ${
                  selectedDifficulty === 'beginner'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                }`}
              >
                Easy
              </button>

              <button
                onClick={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === 'intermediate'
                      ? null
                      : 'intermediate'
                  )
                }
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors border ${
                  selectedDifficulty === 'intermediate'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                }`}
              >
                Medium
              </button>

              <button
                onClick={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === 'advanced' ? null : 'advanced'
                  )
                }
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors border ${
                  selectedDifficulty === 'advanced'
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                }`}
              >
                Hard
              </button>
            </div>
          </div>

          {filteredOptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-3">🤸‍♀️</div>
              <p className="text-gray-600">
                {(showOnlyFavorites || selectedDifficulty) &&
                validOptions.length > 0
                  ? 'No poses match the current filters'
                  : isStartingPose
                    ? 'Loading poses...'
                    : 'No valid transitions available from current pose.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {isStartingPose
                ? (filteredOptions as Pose[]).map(pose => (
                    <PoseCard
                      key={pose.id}
                      pose={pose}
                      onClick={() => addPoseToFlow(pose)}
                      onShowDetails={handleShowPoseDetails}
                      isFavorited={profile ? isFavorited(pose.id) : false}
                      onToggleFavorite={profile ? toggleFavorite : undefined}
                    />
                  ))
                : (
                    filteredOptions as { pose: Pose; transition: Transition }[]
                  ).map(({ pose, transition }) => (
                    <div key={pose.id} className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-sm text-gray-500 font-medium px-1">
                        Via: {transition.name}
                      </div>
                      <PoseCard
                        pose={pose}
                        onClick={() => addPoseToFlow(pose, transition)}
                        onShowDetails={handleShowPoseDetails}
                        isFavorited={profile ? isFavorited(pose.id) : false}
                        onToggleFavorite={profile ? toggleFavorite : undefined}
                      />
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>

      <FlowSaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentFlow={currentFlow}
        user={user}
        editingFlowId={editingFlowId}
        onSaveComplete={() => {
          setOriginalFlow([...currentFlow]);
        }}
      />

      <RandomFlowModal
        isOpen={showRandomModal}
        onClose={() => setShowRandomModal(false)}
        onGenerate={generateRandomFlow}
      />

      <PoseDetailModal
        pose={selectedPose}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
}

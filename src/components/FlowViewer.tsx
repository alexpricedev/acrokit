import { useState, useEffect } from 'react';
import { Flow, FlowStep, db, id, Pose } from '../lib/instant';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';
import { PoseCard } from './PoseCard';
import { PoseDetailModal } from './PoseDetailModal';

interface FlowViewerProps {
  flowId: string;
  onBack: () => void;
  onLoadFlow: (flow: FlowStep[], flowId?: string) => void;
  onEditFlow: (flow: Flow) => void;
}

export function FlowViewer({
  flowId,
  onBack,
  onLoadFlow,
  onEditFlow,
}: FlowViewerProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [flow, setFlow] = useState<Flow | null>(null);
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);
  const [isPoseModalOpen, setIsPoseModalOpen] = useState(false);

  // Query the specific flow by ID
  const {
    isLoading: dbLoading,
    data,
    error,
  } = db.useQuery({
    flows: {
      $: {
        where: {
          id: flowId,
        },
      },
    },
  });

  useEffect(() => {
    if (!dbLoading) {
      if (error) {
        showToast('Failed to load flow', 'error');
        return;
      }

      if (data?.flows && data.flows.length > 0) {
        const flowData = data.flows[0] as Flow;

        // Check if flow is public or belongs to current user
        if (!flowData.isPublic && (!user || flowData.userId !== user.id)) {
          showToast('This flow is private and cannot be viewed', 'error');
          onBack();
          return;
        }

        setFlow(flowData);

        // Parse the flow steps
        try {
          const steps = JSON.parse(flowData.stepsData) as FlowStep[];
          setFlowSteps(steps);
        } catch (parseError) {
          showToast('Invalid flow data', 'error');
          onBack();
          return;
        }
      } else {
        showToast('Flow not found', 'error');
        onBack();
        return;
      }

      setIsLoading(false);
    }
  }, [dbLoading, data, error, flowId, user, showToast, onBack]);

  const remixFlow = async () => {
    if (!user || !flow) {
      showToast('Please sign in to remix flows', 'error');
      return;
    }

    try {
      await db.transact(
        db.tx.flows[id()].update({
          name: `Remix of ${flow.name}`,
          description: flow.description
            ? `${flow.description} (remixed)`
            : 'Remixed from public gallery',
          isPublic: false,
          userId: user.id,
          stepsData: flow.stepsData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      );

      showToast(`Remixed "${flow.name}" to your flows!`, 'success');

      // Navigate to flow builder with the remixed flow loaded
      onLoadFlow(flowSteps);
    } catch (error) {
      showToast('Failed to remix flow. Please try again.', 'error');
    }
  };

  const shareFlow = () => {
    if (!flow) return;

    const shareUrl = `${window.location.origin}/flow/${flow.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        showToast('Flow link copied to clipboard!', 'success');
      })
      .catch(() => {
        showToast(
          'Failed to copy to clipboard. Check console for link.',
          'error'
        );
      });
  };

  const nextStep = () => {
    if (currentStep < flowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleShowPoseDetails = (pose: Pose) => {
    setSelectedPose(pose);
    setIsPoseModalOpen(true);
  };

  const handleClosePoseModal = () => {
    setIsPoseModalOpen(false);
    setSelectedPose(null);
  };

  if (isLoading || dbLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading flow...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the flow for you.
          </p>
        </div>
      </div>
    );
  }

  if (!flow || flowSteps.length === 0) {
    return null;
  }

  const currentPose = flowSteps[currentStep];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-8 sm:pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {flow.name}
            </h1>
            {flow.description && (
              <p className="text-gray-600">{flow.description}</p>
            )}
          </div>

          {/* Edit button for flow owner */}
          {user && flow.userId === user.id && (
            <button
              onClick={() => onEditFlow(flow)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors"
              title="Edit Flow"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 w-full sm:w-auto mb-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={currentStep === flowSteps.length - 1}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Next
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            Step {currentStep + 1} of {flowSteps.length}
          </span>
          <span>{flow.isPublic ? 'Public Flow' : 'Private Flow'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / flowSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main content - two column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Current pose display */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentPose.pose.name}
              </h2>
              {currentPose.transition && (
                <p className="text-blue-600 font-medium">
                  via {currentPose.transition.name}
                </p>
              )}
            </div>

            <PoseCard
              pose={currentPose.pose}
              showAddButton={false}
              onClick={() => handleShowPoseDetails(currentPose.pose)}
            />

            <div className="mt-6 text-center">
              <p className="text-gray-600">{currentPose.pose.description}</p>
            </div>
          </div>
        </div>

        {/* Flow overview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Flow Overview
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {flowSteps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentStep
                      ? 'bg-blue-100 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {index + 1}. {step.pose.name}
                      </div>
                      {step.transition && (
                        <div className="text-sm text-blue-600">
                          via {step.transition.name}
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-2 py-1 text-xs rounded-full ${
                        step.pose.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-800'
                          : step.pose.difficulty === 'intermediate'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {step.pose.difficulty}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-center gap-4">
          <button
            onClick={shareFlow}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="Share Flow"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16,6 12,2 8,6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          {user && (
            <button
              onClick={remixFlow}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Remix this flow
            </button>
          )}
        </div>
      </div>

      {/* Pose Detail Modal */}
      <PoseDetailModal
        pose={selectedPose}
        isOpen={isPoseModalOpen}
        onClose={handleClosePoseModal}
      />
    </div>
  );
}

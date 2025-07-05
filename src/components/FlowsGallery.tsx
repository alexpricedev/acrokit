import { useState, useEffect } from 'react';
import { Flow, FlowStep, db } from '../lib/instant';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';
import { ConfirmationModal } from './ConfirmationModal';
import { LoginModal } from './LoginModal';

interface FlowsGalleryProps {
  onLoadFlow: (flow: FlowStep[], flowId?: string) => void;
  onPageChange: (page: 'home' | 'builder' | 'gallery') => void;
  onPracticeFlow?: (flowId: string) => void;
}

export function FlowsGallery({
  onLoadFlow,
  onPageChange,
  onPracticeFlow,
}: FlowsGalleryProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<Flow | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');

  // Load flows from InstantDB
  const shouldSkipQuery = !user;
  const { isLoading: dbLoading, data } = db.useQuery(
    shouldSkipQuery
      ? {}
      : {
          flows: {
            $: {
              where: {
                userId: user?.id,
              },
            },
          },
        }
  );

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    if (!dbLoading && data?.flows) {
      setFlows(data.flows as Flow[]);
      setIsLoading(false);
    }
  }, [user, dbLoading, data]);

  const handleLoadFlow = (flow: Flow) => {
    try {
      const steps = JSON.parse(flow.stepsData) as FlowStep[];
      onLoadFlow(steps, flow.id); // Pass the flow ID for editing
      // Don't call onPageChange - onLoadFlow already handles page navigation
    } catch (error) {
      // Silently ignore flow loading errors
    }
  };

  const handleDeleteFlow = async (flowId: string) => {
    try {
      await db.transact(db.tx.flows[flowId].delete());
      showToast('Flow deleted successfully', 'success');
      // The flows will be automatically updated through the real-time subscription
    } catch (error) {
      showToast('Error deleting flow. Please try again.', 'error');
    }
  };

  const handleDeleteClick = (flow: Flow) => {
    setFlowToDelete(flow);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (flowToDelete) {
      handleDeleteFlow(flowToDelete.id);
    }
    setShowDeleteConfirm(false);
    setFlowToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFlowToDelete(null);
  };

  const openLoginModal = (mode: 'login' | 'signup') => {
    setLoginMode(mode);
    setShowLoginModal(true);
  };

  const togglePublic = async (flowId: string) => {
    try {
      const flow = flows.find(f => f.id === flowId);
      if (!flow) return;

      await db.transact(
        db.tx.flows[flowId].update({
          isPublic: !flow.isPublic,
          updatedAt: Date.now(),
        })
      );
      // The flows will be automatically updated through the real-time subscription
    } catch (error) {
      showToast('Error updating flow. Please try again.', 'error');
    }
  };

  const getFlowPreview = (stepsData: string) => {
    try {
      const steps = JSON.parse(stepsData) as FlowStep[];
      return steps.map(step => step.pose.name).join(' → ');
    } catch {
      return 'Invalid flow data';
    }
  };

  const shareFlow = (flow: Flow) => {
    const shareUrl = `${window.location.origin}/flow/${flow.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        showToast('Public flow link copied to clipboard!', 'success');
      })
      .catch(() => {
        showToast(
          'Failed to copy to clipboard. Check console for link.',
          'error'
        );
      });
  };

  if (!user) {
    return (
      <>
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-6">🤸‍♀️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Unlock Your Flow Library
            </h2>
            <p className="text-gray-600 text-lg mb-2">
              Save your favorite acroyoga sequences and access them anywhere.
            </p>
            <p className="text-gray-500 mb-8">
              Build once, practice anytime. Your flows are waiting.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => openLoginModal('signup')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg min-h-[44px]"
              >
                Create Free Account
              </button>
              <button
                onClick={() => openLoginModal('login')}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-lg min-h-[44px]"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          mode={loginMode}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your flows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Flows
            </h1>
            <p className="text-gray-600">
              Manage your saved acroyoga flow sequences
            </p>
          </div>

          <button
            onClick={() => onPageChange('builder')}
            className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium min-h-[44px] sm:min-h-0 w-full sm:w-auto"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create new flow
          </button>
        </div>
      </div>

      {flows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🤸‍♀️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No flows yet
          </h2>
          <p className="text-gray-600">
            Create your first acroyoga flow sequence to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map(flow => (
            <div
              key={flow.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {flow.name}
                    </h3>
                    {flow.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {flow.description}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm mb-3">
                      {getFlowPreview(flow.stepsData)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(flow.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublic(flow.id)}
                      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                        flow.isPublic
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={`Click to make ${flow.isPublic ? 'private' : 'public'}`}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-110"
                      >
                        {flow.isPublic ? (
                          // Globe icon for public
                          <>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </>
                        ) : (
                          // Lock icon for private
                          <>
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="12" cy="16" r="1" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </>
                        )}
                      </svg>
                      <span className="text-xs font-medium">
                        {flow.isPublic ? 'Public' : 'Private'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  {onPracticeFlow && (
                    <button
                      onClick={() => onPracticeFlow(flow.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Practice
                    </button>
                  )}

                  <button
                    onClick={() => handleLoadFlow(flow)}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                    title="Edit Flow"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                    >
                      <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                    </svg>
                  </button>

                  {flow.isPublic && (
                    <button
                      onClick={() => shareFlow(flow)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Share Flow"
                    >
                      <svg
                        width="16"
                        height="16"
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
                  )}

                  <button
                    onClick={() => handleDeleteClick(flow)}
                    className="px-3 py-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors text-sm"
                    title="Delete Flow"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Gradient bottom border */}
              <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-600" />
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Flow"
        message={
          flowToDelete
            ? `Are you sure you want to delete "${flowToDelete.name}"? This action cannot be undone.`
            : 'Are you sure you want to delete this flow? This action cannot be undone.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDangerous={true}
      />
    </div>
  );
}

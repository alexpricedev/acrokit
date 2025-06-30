import { useState, useEffect } from 'react';
import { Flow, FlowStep, db } from '../lib/instant';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';
import { ConfirmationModal } from './ConfirmationModal';

interface FlowsGalleryProps {
  onLoadFlow: (flow: FlowStep[]) => void;
  onPageChange: (page: 'builder' | 'gallery') => void;
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

  // Check if we're using fake auth for testing
  const useFakeAuth = window.location.search.includes('fake-auth');

  // Load flows from InstantDB (only if not using fake auth)
  const shouldSkipQuery = useFakeAuth || !user;
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

    if (useFakeAuth) {
      // Load fake flows for testing
      const fakeFlows: Flow[] = [
        {
          id: 'fake-flow-1',
          name: 'My Test Flow',
          description: 'A test flow for demonstrating the delete confirmation',
          isPublic: false,
          userId: 'fake-user-id',
          stepsData: JSON.stringify([
            { pose: { name: 'Bird' }, transition: null },
            {
              pose: { name: 'Throne' },
              transition: { name: 'Bird to Throne' },
            },
          ]),
          createdAt: Date.now() - 86400000, // 1 day ago
          updatedAt: Date.now() - 86400000,
        },
        {
          id: 'fake-flow-2',
          name: 'Another Flow',
          description: 'Another flow to test with',
          isPublic: true,
          userId: 'fake-user-id',
          stepsData: JSON.stringify([
            { pose: { name: 'Throne' }, transition: null },
            { pose: { name: 'Star' }, transition: { name: 'Throne to Star' } },
          ]),
          createdAt: Date.now() - 172800000, // 2 days ago
          updatedAt: Date.now() - 172800000,
        },
      ];
      setFlows(fakeFlows);
      setIsLoading(false);
      return;
    }

    if (!dbLoading && data?.flows) {
      setFlows(data.flows as Flow[]);
      setIsLoading(false);
    }
  }, [user, dbLoading, data, useFakeAuth]);

  const handleLoadFlow = (flow: Flow) => {
    try {
      const steps = JSON.parse(flow.stepsData) as FlowStep[];
      onLoadFlow(steps);
      // Don't call onPageChange - onLoadFlow already handles page navigation
    } catch (error) {
      console.error('Error loading flow:', error);
    }
  };

  const handleDeleteFlow = async (flowId: string) => {
    try {
      if (useFakeAuth) {
        // For fake auth, just remove from local state
        setFlows(prev => prev.filter(flow => flow.id !== flowId));
        showToast('Flow deleted successfully', 'success');
        return;
      }

      await db.transact(db.tx.flows[flowId].delete());
      showToast('Flow deleted successfully', 'success');
      // The flows will be automatically updated through the real-time subscription
    } catch (error) {
      console.error('Error deleting flow:', error);
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

  const togglePublic = async (flowId: string) => {
    try {
      const flow = flows.find(f => f.id === flowId);
      if (!flow) return;

      if (useFakeAuth) {
        // For fake auth, just update local state
        setFlows(prev =>
          prev.map(f =>
            f.id === flowId
              ? { ...f, isPublic: !f.isPublic, updatedAt: Date.now() }
              : f
          )
        );
        return;
      }

      await db.transact(
        db.tx.flows[flowId].update({
          isPublic: !flow.isPublic,
          updatedAt: Date.now(),
        })
      );
      // The flows will be automatically updated through the real-time subscription
    } catch (error) {
      console.error('Error updating flow:', error);
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
        console.log('Share link:', shareUrl);
      });
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in required
          </h2>
          <p className="text-gray-600">
            You need to be signed in to view your saved flows.
          </p>
        </div>
      </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My flows</h1>
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
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
                      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                        flow.isPublic
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={`Click to make ${flow.isPublic ? 'private' : 'public'}`}
                    >
                      <svg
                        width="14"
                        height="14"
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
                      <span className="text-sm font-medium">
                        {flow.isPublic ? 'Public' : 'Private'}
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
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
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    Load & Edit
                  </button>

                  {flow.isPublic && (
                    <button
                      onClick={() => shareFlow(flow)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Share flow"
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
                    title="Delete flow"
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

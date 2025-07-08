import { useState, useEffect } from 'react';
import { Flow, FlowStep, FlowWithUser, db, id } from '../lib/instant';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

interface PublicGalleryProps {
  onViewFlow: (flowId: string) => void;
  onLoadFlow: (flow: FlowStep[], flowId?: string) => void;
}

export function PublicGallery({ onViewFlow, onLoadFlow }: PublicGalleryProps) {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [flows, setFlows] = useState<FlowWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load public flows from InstantDB with linked users and profiles
  const { isLoading: dbLoading, data } = db.useQuery({
    flows: {
      $: {
        where: {
          isPublic: true,
        },
      },
      $user: {
        profile: {},
      },
    },
  });

  useEffect(() => {
    if (!dbLoading && data?.flows) {
      // Sort by most recently updated first
      const sortedFlows = (data.flows as FlowWithUser[]).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setFlows(sortedFlows);
      setIsLoading(false);
    }
  }, [dbLoading, data]);

  const getFlowPreview = (stepsData: string) => {
    try {
      const steps = JSON.parse(stepsData) as FlowStep[];
      return steps.map(step => step.pose.name).join(' → ');
    } catch {
      return 'Invalid flow data';
    }
  };

  const getFlowLength = (stepsData: string) => {
    try {
      const steps = JSON.parse(stepsData) as FlowStep[];
      return `${steps.length} poses`;
    } catch {
      return 'Unknown';
    }
  };

  const getCreatorName = (flow: {
    $user?: { id: string; profile?: { displayName?: string } };
  }) => {
    // Check if the flow is by the current user
    if (user && flow.$user?.id === user.id) {
      return profile?.displayName || user.email || 'You';
    }

    // Use the linked user's profile
    if (flow.$user?.profile?.displayName) {
      return flow.$user.profile.displayName;
    }

    return 'Community Member';
  };

  const remixFlow = async (flow: Flow) => {
    if (!user) {
      showToast('Please sign in to remix flows', 'error');
      return;
    }

    try {
      // Parse the flow steps for loading into the builder
      const steps = JSON.parse(flow.stepsData) as FlowStep[];

      const flowId = id();
      await db.transact(
        db.tx.flows[flowId]
          .update({
            name: `Remix of ${flow.name}`,
            description: flow.description
              ? `${flow.description} (remixed)`
              : 'Remixed from public gallery',
            isPublic: false,
            stepsData: flow.stepsData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .link({ $user: user.id })
      );

      showToast(`Remixed "${flow.name}" to your flows!`, 'success');

      // Navigate to flow builder with the remixed flow loaded
      onLoadFlow(steps);
    } catch (error) {
      showToast('Failed to remix flow. Please try again.', 'error');
    }
  };

  const shareFlow = (flow: Flow) => {
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading public flows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Community Flows
        </h1>
        <p className="text-gray-600">
          Discover acroyoga flows shared by the community. Click any flow to
          practice it, or remix it to your collection.
        </p>
      </div>

      {flows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🌟</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No public flows yet
          </h2>
          <p className="text-gray-600">
            Be the first to share a flow with the community!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map(flow => (
            <div
              key={flow.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <div className="mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {flow.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      by {getCreatorName(flow)}
                    </p>
                  </div>

                  {flow.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {flow.description}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm mb-2">
                    {getFlowPreview(flow.stepsData)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>{getFlowLength(flow.stepsData)}</span>
                    <span>
                      Updated: {new Date(flow.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => onViewFlow(flow.id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Practice Flow
                  </button>

                  <button
                    onClick={() => shareFlow(flow)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
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

                  {user && (
                    <button
                      onClick={() => remixFlow(flow)}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      title="Make a copy of this flow"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Gradient bottom border */}
              <div className="h-1 bg-gradient-to-r from-green-400 to-blue-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

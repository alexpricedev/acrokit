import { useEffect, useState } from 'react';
import { FlowStep, Flow, db } from '../lib/instant';
import { useToast } from './ToastProvider';

interface SharedFlowLoaderProps {
  flowId: string;
  onFlowLoad: (flow: FlowStep[]) => void;
  onError: () => void;
}

export function SharedFlowLoader({
  flowId,
  onFlowLoad,
  onError,
}: SharedFlowLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Query the specific flow by ID from InstantDB
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
        showToast('Failed to load shared flow', 'error');
        onError();
        return;
      }

      if (data?.flows && data.flows.length > 0) {
        const sharedFlow = data.flows[0] as Flow;

        // Check if flow is public
        if (!sharedFlow.isPublic) {
          showToast('This flow is private and cannot be shared', 'error');
          onError();
          return;
        }

        // Parse the flow steps and load into builder
        try {
          const steps = JSON.parse(sharedFlow.stepsData) as FlowStep[];
          onFlowLoad(steps);
          showToast(`Loaded shared flow: "${sharedFlow.name}"`, 'success');
        } catch (parseError) {
          showToast('Invalid flow data', 'error');
          onError();
        }
      } else {
        showToast('Shared flow not found', 'error');
        onError();
      }

      setIsLoading(false);
    }
  }, [dbLoading, data, error, flowId, onFlowLoad, onError, showToast]);

  if (isLoading || dbLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading shared flow...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the flow for you.
          </p>
        </div>
      </div>
    );
  }

  // This component will be unmounted once the flow is loaded or error occurs
  return null;
}

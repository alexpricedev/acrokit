import { useState } from 'react';
import * as React from 'react';
import { FlowStep, db, User } from '../lib/instant';
import { id } from '@instantdb/react';
import { useToast } from './ToastProvider';

interface FlowSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFlow: FlowStep[];
  user: User | null;
  editingFlowId?: string;
  onSaveComplete?: () => void;
}

export function FlowSaveModal({
  isOpen,
  onClose,
  currentFlow,
  user,
  editingFlowId,
  onSaveComplete,
}: FlowSaveModalProps) {
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  // Load existing flow data when editing
  const { data: existingFlowData } = db.useQuery(
    editingFlowId ? { flows: { $: { where: { id: editingFlowId } } } } : {}
  );

  // Populate form when editing existing flow
  React.useEffect(() => {
    if (editingFlowId && existingFlowData?.flows?.[0]) {
      const flow = existingFlowData.flows[0];
      setFlowName(flow.name || '');
      setFlowDescription(flow.description || '');
      setIsPublic(flow.isPublic || false);
    } else if (!editingFlowId) {
      // Reset form for new flow
      setFlowName('');
      setFlowDescription('');
      setIsPublic(false);
    }
  }, [editingFlowId, existingFlowData]);

  const getFlowPreview = (steps: FlowStep[]) => {
    return steps.map(step => step.pose.name).join(' → ');
  };

  const handleSave = async () => {
    if (!flowName.trim() || currentFlow.length === 0 || !user) return;

    setIsSaving(true);

    try {
      const now = Date.now();

      if (editingFlowId) {
        // Update existing flow
        const updateData = {
          name: flowName.trim(),
          description: flowDescription.trim() || undefined,
          isPublic,
          stepsData: JSON.stringify(currentFlow),
          updatedAt: now,
        };

        await db.transact(db.tx.flows[editingFlowId].update(updateData));
        showToast('Flow updated successfully!', 'success');
      } else {
        // Create new flow
        const flowId = id(); // Generate proper InstantDB ID

        const flowData = {
          name: flowName.trim(),
          description: flowDescription.trim() || undefined,
          isPublic,
          userId: user.id,
          stepsData: JSON.stringify(currentFlow),
          createdAt: now,
          updatedAt: now,
        };

        await db.transact(db.tx.flows[flowId].update(flowData));
        showToast('Flow saved successfully!', 'success');
      }

      // Reset form and close
      setFlowName('');
      setFlowDescription('');
      setIsPublic(false);
      onClose();

      // Notify parent that save is complete
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      showToast('Error saving flow. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFlowName('');
    setFlowDescription('');
    setIsPublic(false);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingFlowId ? 'Update Flow' : 'Save Flow'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flow name *
            </label>
            <input
              type="text"
              value={flowName}
              onChange={e => setFlowName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter flow name"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={flowDescription}
              onChange={e => setFlowDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Optional description"
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="mr-2"
              disabled={isSaving}
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make public (shareable with others)
            </label>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Preview:
            </div>
            <div className="text-sm text-gray-600">
              {getFlowPreview(currentFlow)}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!flowName.trim() || isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving
              ? editingFlowId
                ? 'Updating...'
                : 'Saving...'
              : editingFlowId
                ? 'Update Flow'
                : 'Save Flow'}
          </button>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

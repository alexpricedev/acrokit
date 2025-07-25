import { useEffect, useRef } from 'react';
import { PoseWithFiles } from '../lib/instant';
import { TipsAccordion } from './TipsAccordion';

interface PoseDetailModalProps {
  pose: PoseWithFiles | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PoseDetailModal({
  pose,
  isOpen,
  onClose,
}: PoseDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!pose) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500 text-white';
      case 'Medium':
        return 'bg-blue-500 text-white';
      case 'Hard':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'Easy';
      case 'Medium':
        return 'Medium';
      case 'Hard':
        return 'Hard';
      default:
        return difficulty;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl shadow-2xl border-0 bg-transparent p-0 backdrop:bg-black backdrop:bg-opacity-50 max-w-2xl w-full mx-auto"
      onClick={e => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{pose.name}</h2>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(pose.difficulty)}`}
            >
              {getDifficultyLabel(pose.difficulty)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Section */}
          <div className="mb-6">
            <div className="grid gap-4">
              {/* Main image - square aspect ratio */}
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center max-w-md mx-auto">
                {pose.imageFile?.url ? (
                  <img
                    src={pose.imageFile.url}
                    alt={pose.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-6xl font-light">
                    {pose.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {pose.description || 'No description available for this pose.'}
            </p>
          </div>

          {/* Tips Section */}
          <TipsAccordion
            flyerTips={pose.flyerTips}
            baseTips={pose.baseTips}
            spotterTips={pose.spotterTips}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

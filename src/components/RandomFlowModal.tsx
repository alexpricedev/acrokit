import { useState } from 'react';

interface RandomFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (moveCount: number) => void;
}

export function RandomFlowModal({
  isOpen,
  onClose,
  onGenerate,
}: RandomFlowModalProps) {
  const [moveCount, setMoveCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (moveCount < 1 || moveCount > 20) return;

    setIsGenerating(true);
    try {
      await onGenerate(moveCount);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setMoveCount(5);
    setIsGenerating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Create random flow
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

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How many moves would you like?
            </label>

            {/* Quick action buttons */}
            <div className="flex gap-2 mb-4">
              {[5, 10, 15].map(count => (
                <button
                  key={count}
                  onClick={() => setMoveCount(count)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    moveCount === count
                      ? 'bg-slate-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count} moves
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Or enter a custom number (1-20):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={moveCount}
                onChange={e =>
                  setMoveCount(
                    Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-lg">🎲</div>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  About random flows
                </h3>
                <p className="text-xs text-blue-700">
                  We&apos;ll create a valid sequence by randomly selecting poses
                  and transitions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || moveCount < 1 || moveCount > 20}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>Create</>
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={isGenerating}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

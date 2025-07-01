import { Pose } from '../lib/instant';

interface PoseCardProps {
  pose: Pose;
  onClick?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  showAddButton?: boolean;
  onShowDetails?: (pose: Pose) => void;
}

export function PoseCard({
  pose,
  onClick,
  isSelected,
  isDisabled,
  showAddButton = true,
  onShowDetails,
}: PoseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-blue-500 text-white';
      case 'advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Easy';
      case 'intermediate':
        return 'Medium';
      case 'advanced':
        return 'Hard';
      default:
        return difficulty;
    }
  };

  const getCardBorderGradient = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'from-green-400 to-green-600';
      case 'intermediate':
        return 'from-blue-400 to-blue-600';
      case 'advanced':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 relative
        ${
          isSelected
            ? 'ring-2 ring-blue-500 ring-offset-2'
            : 'hover:shadow-md hover:-translate-y-1'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={!isDisabled ? onClick : undefined}
    >
      {/* Difficulty tag - positioned absolutely in top right */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(pose.difficulty)}`}
        >
          {getDifficultyLabel(pose.difficulty)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-3">{pose.name}</h3>

        {/* Image placeholder area */}
        <div className="h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          {pose.imageUrl ? (
            <img
              src={pose.imageUrl}
              alt={pose.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400 text-4xl font-light">
              {pose.name}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          {showAddButton && (
            <button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={e => {
                e.stopPropagation();
                if (!isDisabled && onClick) onClick();
              }}
            >
              Add to Flow
            </button>
          )}
          
          {onShowDetails && (
            <button
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              onClick={e => {
                e.stopPropagation();
                onShowDetails(pose);
              }}
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
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
              </svg>
              View Details
            </button>
          )}
        </div>
      </div>

      {/* Gradient bottom border */}
      <div
        className={`h-1 bg-gradient-to-r ${getCardBorderGradient(pose.difficulty)}`}
      />
    </div>
  );
}

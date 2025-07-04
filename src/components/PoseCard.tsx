import { Pose } from '../lib/instant';

interface PoseCardProps {
  pose: Pose;
  onClick?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  showAddButton?: boolean;
  onShowDetails?: (pose: Pose) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (pose: Pose) => void;
}

export function PoseCard({
  pose,
  onClick,
  isSelected,
  isDisabled,
  showAddButton = true,
  onShowDetails,
  isFavorited = false,
  onToggleFavorite,
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
        <div className="flex gap-2">
          {showAddButton && (
            <button
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={e => {
                e.stopPropagation();
                if (!isDisabled && onClick) onClick();
              }}
            >
              Add to Flow
            </button>
          )}

          {onToggleFavorite && (
            <button
              className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                isFavorited
                  ? 'bg-red-100 hover:bg-red-200 text-red-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
              }`}
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite(pose);
              }}
              title={isFavorited ? 'Remove From Favorites' : 'Add to Favorites'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
              </svg>
            </button>
          )}

          {onShowDetails && (
            <button
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 w-10 h-10 rounded-lg transition-colors flex items-center justify-center"
              onClick={e => {
                e.stopPropagation();
                onShowDetails(pose);
              }}
              title="View Details"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
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

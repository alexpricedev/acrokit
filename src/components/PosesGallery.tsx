import { useState } from 'react';
import { db, Pose } from '../lib/instant';
import { useAuth } from './AuthProvider';
import { useFavorites } from '../hooks';

interface PosesGalleryProps {
  onViewPose: (poseId: string) => void;
}

export function PosesGallery({ onViewPose }: PosesGalleryProps) {
  const { profile } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites(profile);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { isLoading, data, error } = db.useQuery({
    poses: {
      $:
        selectedDifficulty !== 'all'
          ? { where: { difficulty: selectedDifficulty } }
          : {},
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading poses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading poses: {error.message}</p>
        </div>
      </div>
    );
  }

  const allPoses = data?.poses || [];

  // Apply favorites filtering
  const poses = showOnlyFavorites
    ? allPoses.filter(pose => isFavorited(pose.id))
    : allPoses;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'from-green-200 to-green-300';
      case 'intermediate':
        return 'from-blue-200 to-blue-300';
      case 'advanced':
        return 'from-red-200 to-red-300';
      default:
        return 'from-gray-200 to-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Poses Gallery
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore all available acroyoga poses with detailed information, tips,
          and variations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {profile && (
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${
              showOnlyFavorites
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
            </svg>
            Favorites
          </button>
        )}

        <button
          onClick={() => setSelectedDifficulty('beginner')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
            selectedDifficulty === 'beginner'
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
          }`}
        >
          Easy
        </button>
        <button
          onClick={() => setSelectedDifficulty('intermediate')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
            selectedDifficulty === 'intermediate'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setSelectedDifficulty('advanced')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
            selectedDifficulty === 'advanced'
              ? 'bg-purple-100 text-purple-800 border-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
          }`}
        >
          Hard
        </button>
      </div>

      {/* Poses Grid */}
      {poses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {showOnlyFavorites
              ? 'No favorite poses found. Start adding poses to your favorites!'
              : 'No poses found for the selected difficulty.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {poses.map(pose => (
            <div
              key={pose.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => onViewPose(pose.id)}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {pose.imageUrl ? (
                  <img
                    src={pose.imageUrl}
                    alt={pose.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Heart button - Top Left */}
                {profile && (
                  <div className="absolute top-3 left-3 z-10">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(pose as Pose);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isFavorited(pose.id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'
                      }`}
                      title={
                        isFavorited(pose.id)
                          ? 'Remove From Favorites'
                          : 'Add to Favorites'
                      }
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
                  </div>
                )}

                {/* Difficulty Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(
                      pose.difficulty
                    )}`}
                  >
                    {pose.difficulty.charAt(0).toUpperCase() +
                      pose.difficulty.slice(1)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {pose.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {pose.description}
                </p>
              </div>

              {/* Gradient Border */}
              <div
                className={`h-1 bg-gradient-to-r ${getDifficultyGradient(pose.difficulty)}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

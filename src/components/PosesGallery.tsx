import { useState } from 'react';
import { db } from '../lib/instant';
import { PoseCard } from './PoseCard';
import { useFavoritePoses } from '../hooks/useFavoritePoses';
import { useAuth } from './AuthProvider';
import { Pose } from '../lib/instant';

interface PosesGalleryProps {
  onViewPose: (poseId: string) => void;
}

export function PosesGallery({ onViewPose }: PosesGalleryProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { user } = useAuth();
  const { favoritePoses, toggleFavorite, isFavorited } = useFavoritePoses();

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

  let poses = data?.poses || [];

  // Filter by favorites if enabled
  if (showFavoritesOnly && user) {
    const favoritePoseIds = new Set(
      favoritePoses.map(p => p?.id).filter(id => id !== undefined)
    );
    poses = poses.filter(pose => favoritePoseIds.has(pose.id));
  }

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
      <div className="space-y-4 mb-8">
        {/* Favorites Filter - Only show if user is logged in */}
        {user && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                showFavoritesOnly
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="m47.6 300.4 180.7 168.7c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
              </svg>
              {showFavoritesOnly ? 'Show All Poses' : 'Show Favorites Only'}
            </button>
          </div>
        )}

        {/* Difficulty Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDifficulty === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Poses
          </button>
          <button
            onClick={() => setSelectedDifficulty('beginner')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDifficulty === 'beginner'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setSelectedDifficulty('intermediate')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDifficulty === 'intermediate'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setSelectedDifficulty('advanced')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDifficulty === 'advanced'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Poses Grid */}
      {poses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No poses found for the selected difficulty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {poses.map(pose => (
            <PoseCard
              key={pose.id}
              pose={pose as Pose}
              onClick={() => onViewPose(pose.id)}
              showAddButton={false}
              onShowDetails={() => onViewPose(pose.id)}
              isFavorited={isFavorited(pose.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

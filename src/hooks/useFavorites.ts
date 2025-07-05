import { useState } from 'react';
import { db, id, Pose, Favorite, Profile } from '../lib/instant';

interface UseFavoritesResult {
  favorites: Favorite[];
  isLoading: boolean;
  error: Error | null;
  isFavorited: (poseId: string) => boolean;
  toggleFavorite: (pose: Pose) => void;
}

export function useFavorites(profile: Profile | null): UseFavoritesResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Query favorites for the current profile
  const {
    data: favoritesData,
    isLoading: queryLoading,
    error: queryError,
  } = db.useQuery(
    profile
      ? {
          favorites: {
            $: {
              where: {
                profileId: profile.id,
              },
            },
            pose: {},
          },
        }
      : null // Defer query if no profile
  );

  const favorites = favoritesData?.favorites || [];

  // Check if a pose is favorited
  const isFavorited = (poseId: string): boolean => {
    return favorites.some(fav => fav.poseId === poseId);
  };

  // Toggle favorite status
  const toggleFavorite = async (pose: Pose) => {
    if (!profile) return;

    setIsLoading(true);
    setError(null);

    try {
      const existingFavorite = favorites.find(fav => fav.poseId === pose.id);

      if (existingFavorite) {
        // Remove from favorites
        await db.transact(db.tx.favorites[existingFavorite.id].delete());
      } else {
        // Add to favorites
        await db.transact(
          db.tx.favorites[id()].update({
            poseId: pose.id,
            profileId: profile.id,
          })
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('An unknown error occurred')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    favorites,
    isLoading: queryLoading || isLoading,
    error: (queryError instanceof Error ? queryError : null) || error,
    isFavorited,
    toggleFavorite,
  };
}

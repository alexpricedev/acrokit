import { useState } from 'react';
import { db, id, Pose, FavoriteWithLinkedData, Profile } from '../lib/instant';

interface UseFavoritesResult {
  favorites: FavoriteWithLinkedData[];
  isLoading: boolean;
  error: Error | null;
  isFavorited: (poseId: string) => boolean;
  toggleFavorite: (pose: Pose) => void;
}

export function useFavorites(profile: Profile | null): UseFavoritesResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Query favorites for the current profile using linked entities
  const {
    data: favoritesData,
    isLoading: queryLoading,
    error: queryError,
  } = db.useQuery(
    profile
      ? {
          profiles: {
            $: {
              where: {
                id: profile.id,
              },
            },
            favorites: {
              pose: {
                imageFile: {},
              },
            },
          },
        }
      : null // Defer query if no profile
  );

  const favorites = (favoritesData?.profiles?.[0]?.favorites ||
    []) as FavoriteWithLinkedData[];

  // Check if a pose is favorited
  const isFavorited = (poseId: string): boolean => {
    return favorites.some(fav => fav.pose?.id === poseId);
  };

  // Toggle favorite status
  const toggleFavorite = async (pose: Pose) => {
    if (!profile) return;

    setIsLoading(true);
    setError(null);

    try {
      const existingFavorite = favorites.find(fav => fav.pose?.id === pose.id);

      if (existingFavorite) {
        // Remove from favorites
        await db.transact(db.tx.favorites[existingFavorite.id].delete());
      } else {
        // Add to favorites using entity linking
        const favoriteId = id();
        await db.transact(
          db.tx.favorites[favoriteId]
            .update({
              createdAt: new Date().toISOString(),
            })
            .link({
              pose: pose.id,
              profile: profile.id,
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

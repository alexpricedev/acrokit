import { useMemo } from 'react';
import { db } from '../lib/instant';
import { useAuth } from '../components/AuthProvider';
import { Pose } from '../lib/instant';

export function useFavoritePoses() {
  const { user } = useAuth();

  // Query user's favorite poses
  const { data, isLoading, error } = db.useQuery(
    user
      ? {
          $users: {
            $: { where: { id: user.id } },
            favoritePoses: {},
          },
        }
      : null
  );

  const favoritePoses = useMemo(() => {
    if (!data?.$users?.[0]?.favoritePoses) return [];
    return data.$users[0].favoritePoses;
  }, [data]);

  const favoritePoseIds = useMemo(() => {
    return new Set(favoritePoses.map(pose => pose.id));
  }, [favoritePoses]);

  const toggleFavorite = async (pose: Pose) => {
    if (!user) return;

    try {
      const isFavorited = favoritePoseIds.has(pose.id);

      if (isFavorited) {
        // Remove from favorites
        await db.transact(
          db.tx.$users[user.id].unlink({ favoritePoses: pose.id })
        );
      } else {
        // Add to favorites
        await db.transact(
          db.tx.$users[user.id].link({ favoritePoses: pose.id })
        );
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorited = (poseId: string) => {
    return favoritePoseIds.has(poseId);
  };

  return {
    favoritePoses,
    isLoading,
    error,
    toggleFavorite,
    isFavorited,
  };
}

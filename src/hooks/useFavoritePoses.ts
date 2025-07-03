import { useMemo, useState, useEffect } from 'react';
import { db } from '../lib/instant';
import { useAuth } from '../components/AuthProvider';
import { Pose } from '../lib/instant';

export function useFavoritePoses() {
  const { user, profile } = useAuth();
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

  // Check if we're using fake auth
  const isFakeAuth = window.location.search.includes('fake-auth');

  // Query user's favorite poses via profile (only for real users)
  const { data, isLoading, error } = db.useQuery(
    user && profile && !isFakeAuth
      ? {
          profiles: {
            $: { where: { id: profile.id } },
            favorites: {
              pose: {},
            },
          },
        }
      : null
  );

  // Load local favorites for fake auth
  useEffect(() => {
    if (isFakeAuth && user) {
      const stored = localStorage.getItem(`fake-favorites-${user.id}`);
      if (stored) {
        try {
          setLocalFavorites(JSON.parse(stored));
        } catch (err) {
          console.error('Error loading local favorites:', err);
          setLocalFavorites([]);
        }
      }
    }
  }, [isFakeAuth, user]);


  const favoritePoses = useMemo(() => {
    if (isFakeAuth) {
      // For fake auth, return empty array since we only track IDs locally
      return [];
    }
    if (!data?.profiles?.[0]?.favorites) return [];
    return data.profiles[0].favorites
      .map(fav => fav.pose)
      .filter(pose => pose !== undefined);
  }, [data, isFakeAuth]);

  const favoritePoseIds = useMemo(() => {
    if (isFakeAuth) {
      return new Set(localFavorites);
    }
    return new Set(favoritePoses.map(pose => pose.id));
  }, [favoritePoses, localFavorites, isFakeAuth]);

  const toggleFavorite = async (pose: Pose) => {
    if (!user) return;

    try {
      const isFavorited = favoritePoseIds.has(pose.id);

      if (isFakeAuth) {
        // Handle fake auth with localStorage
        const newFavorites = isFavorited
          ? localFavorites.filter(id => id !== pose.id)
          : [...localFavorites, pose.id];

        setLocalFavorites(newFavorites);
        localStorage.setItem(
          `fake-favorites-${user.id}`,
          JSON.stringify(newFavorites)
        );
      } else {
        // Handle real auth with InstantDB using the new schema
        if (!profile) {
          console.error('No profile found for user');
          return;
        }

        if (isFavorited) {
          // Remove from favorites - find and delete the favorites entity
          const favoriteRecord = data?.profiles?.[0]?.favorites?.find(
            fav => fav.pose?.id === pose.id
          );
          if (favoriteRecord) {
            await db.transact([db.tx.favorites[favoriteRecord.id].delete()]);
          }
        } else {
          // Add to favorites - create new favorites entity
          await db.transact([
            db.tx.favorites[crypto.randomUUID()].update({
              profileId: profile.id,
              poseId: pose.id,
            })
          ]);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      console.error('User ID:', user.id);
      console.error('Pose ID:', pose.id);
    }
  };

  const isFavorited = (poseId: string) => {
    return favoritePoseIds.has(poseId);
  };

  return {
    favoritePoses,
    isLoading: isFakeAuth ? false : isLoading,
    error: isFakeAuth ? null : error,
    toggleFavorite,
    isFavorited,
  };
}

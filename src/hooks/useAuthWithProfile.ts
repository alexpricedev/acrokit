import { db, User, Profile } from '../lib/instant';

interface AuthWithProfile {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  needsDisplayName: boolean;
}

export function useAuthWithProfile(): AuthWithProfile {
  const { user, isLoading: authLoading } = db.useAuth();

  // Only query for profile data if user is authenticated
  const { data, isLoading: profileLoading } = db.useQuery(
    user
      ? {
          $users: {
            $: {
              where: {
                id: user.id,
              },
            },
            profile: {},
          },
        }
      : null // Return null when no user - this defers the query
  );

  // Extract profile from the linked data
  const profile = data?.$users?.[0]?.profile || null;

  // Overall loading state
  const isLoading = authLoading || Boolean(user && profileLoading);

  // User needs display name if they're authenticated but have no profile
  const needsDisplayName = Boolean(user && !isLoading && !profile);

  return {
    user: user || null,
    profile,
    isLoading,
    needsDisplayName,
  };
}

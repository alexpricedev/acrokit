import { db } from '../lib/instant';

interface AuthWithProfile {
  user: any | null;
  profile: any | null;
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
  const isLoading = authLoading || (user && profileLoading);
  
  // User needs display name if they're authenticated but have no profile
  const needsDisplayName = !!(user && !isLoading && !profile);

  return {
    user,
    profile,
    isLoading,
    needsDisplayName,
  };
}
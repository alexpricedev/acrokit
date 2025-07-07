import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';
import { db } from '../lib/instant';

export function AccountPage() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  // Load user's flows for statistics
  const { data: flowsData } = db.useQuery(
    user
      ? {
          flows: {
            $: {
              where: {
                userId: user.id,
              },
            },
          },
        }
      : {}
  );

  // Profile is now available from auth context
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
    }
  }, [profile]);

  // Calculate flow statistics
  const totalFlows = flowsData?.flows?.length || 0;
  const publicFlows =
    flowsData?.flows?.filter(flow => flow.isPublic).length || 0;

  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();

    if (displayName.length < 3) {
      setError('Display name must be at least 3 characters long');
      return;
    }

    if (displayName === profile?.displayName) {
      return; // No change
    }

    setIsUpdating(true);
    setError('');

    try {
      // Update the user's profile
      if (profile && profile.id) {
        await db.transact(
          db.tx.profiles[profile.id].update({
            displayName: displayName.trim(),
            updatedAt: Date.now(),
          })
        );
      }

      showToast('Display name updated successfully!', 'success');
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('unique')) {
        setError('This display name is already taken. Please choose another.');
      } else {
        setError('Failed to update display name. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in required
          </h2>
          <p className="text-gray-600">
            You need to be signed in to view your account settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>

          <div className="space-y-6">
            {/* Email Address (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                {user.email}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Your email address cannot be changed
              </p>
            </div>

            {/* Display Name */}
            <form onSubmit={handleUpdateDisplayName}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => {
                      setDisplayName(e.target.value);
                      setError('');
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your display name"
                    disabled={isUpdating}
                    minLength={3}
                    maxLength={30}
                  />
                  <button
                    type="submit"
                    disabled={
                      displayName.length < 3 ||
                      displayName === profile?.displayName ||
                      isUpdating
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isUpdating ? 'Updating...' : 'Update'}
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                <p className="text-gray-500 text-sm mt-1">
                  This name will be shown in the public gallery when you share
                  flows. Minimum 3 characters, must be unique.
                </p>
              </div>
            </form>

            {/* Account Stats */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Account Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalFlows}
                  </div>
                  <div className="text-sm text-gray-600">Total Flows</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {publicFlows}
                  </div>
                  <div className="text-sm text-gray-600">Community Flows</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

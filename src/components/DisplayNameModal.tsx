import { useState } from 'react';
import { useToast } from './ToastProvider';
import { useAuth } from './AuthProvider';
import { db, id } from '../lib/instant';

interface DisplayNameModalProps {
  isOpen: boolean;
  onClose: (displayName: string) => void;
  userEmail: string;
}

export function DisplayNameModal({
  isOpen,
  onClose,
  userEmail,
}: DisplayNameModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (displayName.length < 3) {
      setError('Display name must be at least 3 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create or update the user's profile with display name
      if (user) {
        const profileId = id();
        await db.transact(
          db.tx.profiles[profileId]
            .update({
              displayName: displayName.trim(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
            .link({ $user: user.id })
        );
      }

      showToast('Display name saved successfully!', 'success');
      onClose(displayName.trim());
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('unique')) {
        setError('This display name is already taken. Please choose another.');
      } else {
        setError(
          `Failed to save display name: ${error instanceof Error ? error.message : 'Please try again.'}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Choose your display name
          </h2>
          <p className="text-gray-600 text-sm">
            We need a display name to show who created flows in the public
            gallery. This helps the community connect with flow creators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => {
                setDisplayName(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your display name"
              disabled={isSubmitting}
              autoFocus
              minLength={3}
              maxLength={30}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            <p className="text-gray-500 text-xs mt-1">
              Minimum 3 characters, must be unique
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Account email:
            </div>
            <div className="text-sm text-gray-600">{userEmail}</div>
          </div>

          <button
            type="submit"
            disabled={displayName.length < 3 || isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? 'Saving...' : 'Save Display Name'}
          </button>
        </form>
      </div>
    </div>
  );
}

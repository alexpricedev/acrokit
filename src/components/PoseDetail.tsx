import { useState } from 'react';
import { db, id } from '../lib/instant';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

interface PoseDetailProps {
  poseId: string;
}

export function PoseDetail({ poseId }: PoseDetailProps) {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, data, error } = db.useQuery({
    poses: {
      $: { where: { id: poseId } },
      comments: {
        $: { order: { createdAt: 'desc' } },
        author: {},
      },
    },
  });

  const pose = data?.poses?.[0];
  const comments = pose?.comments || [];

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !profile || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const commentId = id();
      const now = Date.now();

      await db.transact([
        db.tx.comments[commentId]
          .update({
            content: newComment.trim(),
            createdAt: now,
            updatedAt: now,
          })
          .link({
            pose: poseId,
            author: profile.id,
          }),
      ]);

      setNewComment('');
    } catch (error) {
      showToast('Failed to add comment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading pose details...</p>
        </div>
      </div>
    );
  }

  if (error || !pose) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">
            {error ? `Error: ${error.message}` : 'Pose not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Pose Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Images */}
          <div className="space-y-4">
            {/* Primary Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {pose.imageUrl ? (
                <img
                  src={pose.imageUrl}
                  alt={pose.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-20 h-20"
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
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-2 gap-2">
              {pose.baseImageUrl && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={pose.baseImageUrl}
                    alt={`${pose.name} - Base view`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {pose.flyerImageUrl && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={pose.flyerImageUrl}
                    alt={`${pose.name} - Flyer view`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{pose.name}</h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(
                  pose.difficulty
                )}`}
              >
                {pose.difficulty.charAt(0).toUpperCase() +
                  pose.difficulty.slice(1)}
              </span>
            </div>

            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">
                {pose.description}
              </p>
            </div>

            {/* Tips Section - Placeholder for now */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <p className="text-blue-800 text-sm">
                Practice this pose with a qualified instructor. Focus on
                communication and safety.
              </p>
            </div>

            {/* Other Names Section - Placeholder for now */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                🏷️ Also Known As
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {pose.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user && profile ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this pose..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Sign in to share your thoughts and tips about this pose.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {comment.author?.displayName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.author?.displayName || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

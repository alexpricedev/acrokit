import { db } from '../lib/instant';

export function DebugPoses() {
  const { data, isLoading, error } = db.useQuery({
    poses: {
      imageFile: {},
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="font-bold mb-2">Debug Poses Data:</h3>
      <pre className="text-xs overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
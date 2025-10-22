export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="h-96 bg-gray-200 rounded-lg mb-8 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}


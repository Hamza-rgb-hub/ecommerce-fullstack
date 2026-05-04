export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`${s} border-2 border-primary/30 border-t-primary rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner size="lg" />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between mt-3">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-7 bg-gray-200 rounded w-14" />
        </div>
      </div>
    </div>
  )
}

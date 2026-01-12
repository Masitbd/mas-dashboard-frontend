export function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card">
      <div className="h-48 w-full rounded-t-2xl bg-accent" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-24 rounded bg-border" />
        <div className="h-5 w-3/4 rounded bg-border" />
        <div className="h-3 w-full rounded bg-border" />
        <div className="h-3 w-2/3 rounded bg-border" />
      </div>
    </div>
  );
}

export function PostBodySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-3/4 rounded bg-border" />
      <div className="h-4 w-full rounded bg-border" />
      <div className="h-4 w-5/6 rounded bg-border" />
    </div>
  );
}

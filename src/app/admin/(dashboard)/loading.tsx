/**
 * Loading state mostrato istantaneamente durante le navigazioni tra pagine admin.
 * Il layout (sidebar) rimane visibile — questo riempie solo l'area content.
 *
 * Pattern Next.js App Router: file `loading.tsx` accanto a `layout.tsx` viene
 * usato come fallback automatico del <Suspense> implicito.
 */
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 bg-white/5 rounded" />
        <div className="h-9 w-48 bg-white/10 rounded" />
        <div className="h-4 w-64 bg-white/5 rounded mt-2" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="card !p-4 sm:!p-6 border-[var(--color-border)]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="h-3 w-20 bg-white/5 rounded mb-3" />
            <div className="h-8 w-16 bg-white/10 rounded" />
            <div className="h-3 w-24 bg-white/5 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Pipeline / table skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="card !py-4 !px-2 text-center border-[var(--color-border)]"
          >
            <div className="h-6 w-8 bg-white/10 rounded mx-auto" />
            <div className="h-4 w-16 bg-white/5 rounded mx-auto mt-3" />
          </div>
        ))}
      </div>

      {/* List rows skeleton */}
      <div className="card !p-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border-b border-[var(--color-border)] last:border-0"
          >
            <div className="h-3 w-20 bg-white/5 rounded shrink-0" />
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-3 w-40 bg-white/5 rounded hidden sm:block" />
            <div className="h-5 w-16 bg-white/5 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

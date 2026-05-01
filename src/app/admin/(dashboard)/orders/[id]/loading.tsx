export default function AdminOrderDetailLoading() {
  const pulse = "animate-pulse rounded-lg bg-zinc-200";

  return (
    <div className="space-y-8">
      <div className="space-y-3 border-b border-zinc-200 pb-6">
        <div className={`h-4 w-32 ${pulse}`} />
        <div className={`h-10 w-[min(280px,100%)] max-w-xl ${pulse}`} />
        <div className="flex gap-2">
          <div className={`h-6 w-20 ${pulse}`} />
          <div className={`h-4 w-48 ${pulse}`} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className={`mb-5 h-4 w-28 ${pulse}`} />
              <div className="space-y-3">
                <div className={`h-4 w-full ${pulse}`} />
                <div className={`h-4 w-[90%] ${pulse}`} />
                <div className={`h-16 w-full ${pulse}`} />
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className={`mb-4 h-4 w-36 ${pulse}`} />
              <div className={`h-10 w-full ${pulse}`} />
              <div className={`mt-3 h-9 w-full ${pulse}`} />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

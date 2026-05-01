export default function AdminOrdersLoading() {
  const pulse = "animate-pulse rounded-lg bg-zinc-200";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className={`h-9 w-40 ${pulse}`} />
        <div className={`h-4 max-w-md ${pulse}`} />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="flex flex-1 flex-col gap-4 min-[520px]:flex-row">
          <div className="w-full space-y-2 md:w-56">
            <div className={`h-3 w-14 ${pulse}`} />
            <div className={`h-10 w-full ${pulse}`} />
          </div>
          <div className="w-full space-y-2 md:w-56">
            <div className={`h-3 w-20 ${pulse}`} />
            <div className={`h-10 w-full ${pulse}`} />
          </div>
        </div>
        <div className="flex w-full flex-1 gap-2 lg:max-w-xs">
          <div className={`h-10 flex-1 ${pulse}`} />
          <div className={`h-10 w-[4.75rem] shrink-0 ${pulse}`} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className={`h-11 border-b border-zinc-100 ${pulse} rounded-none rounded-t-xl`} />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-14 border-b border-zinc-50 px-4 last:border-0`}>
            <div className="flex h-full items-center gap-4">
              <div className={`h-5 w-24 ${pulse}`} />
              <div className={`h-5 flex-1 max-w-[8rem] ${pulse}`} />
              <div className={`hidden h-5 w-28 sm:block ${pulse}`} />
              <div className={`hidden h-5 w-20 md:block ${pulse}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <div className={`h-10 w-32 ${pulse}`} />
        <div className={`h-10 w-40 ${pulse}`} />
      </div>
    </div>
  );
}

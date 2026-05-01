function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[color-mix(in_srgb,var(--color-brand-pink-soft)_46%,white)] ${className}`}
    />
  );
}

export default function SiteLoading() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-5 py-6 md:gap-9 md:px-8 md:py-8">
      <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="space-y-4">
          <SkeletonBlock className="h-5 w-32 rounded-full" />
          <SkeletonBlock className="h-8 w-[92%] md:h-11" />
          <SkeletonBlock className="h-8 w-3/4 md:h-11" />
          <SkeletonBlock className="h-4 w-full max-w-xl" />
          <SkeletonBlock className="h-4 w-[88%] max-w-lg" />
          <div className="flex gap-3 pt-1">
            <SkeletonBlock className="h-11 w-40 rounded-full" />
            <SkeletonBlock className="h-11 w-32 rounded-full" />
          </div>
        </div>
        <SkeletonBlock className="aspect-[4/3] w-full rounded-[1.75rem]" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        <SkeletonBlock className="aspect-square w-full" />
        <SkeletonBlock className="aspect-square w-full" />
        <SkeletonBlock className="aspect-square w-full" />
        <SkeletonBlock className="aspect-square w-full" />
      </div>

      <div className="grid gap-3 md:grid-cols-3 md:gap-5">
        <SkeletonBlock className="h-36 w-full" />
        <SkeletonBlock className="h-36 w-full" />
        <SkeletonBlock className="h-36 w-full" />
      </div>
    </section>
  );
}

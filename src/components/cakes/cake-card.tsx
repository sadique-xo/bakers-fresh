import Link from "next/link";
import { Leaf, ShoppingCart } from "lucide-react";

import { CatalogCakeImage } from "@/components/cakes/catalog-cake-image";
import type { CatalogCake } from "@/lib/catalog";

import { cn } from "@/lib/utils";

type Props = {
  cake: CatalogCake;
  className?: string;
  /** First screenful on /cakes: eager-load for LCP. */
  imagePriority?: boolean;
};

export function CakeCard({ cake, className, imagePriority }: Props) {
  return (
    <article
      className={cn(
        "group relative grid w-full min-w-0 max-w-full grid-cols-[8.25rem_minmax(0,1fr)] overflow-hidden rounded-[1.35rem] bg-white shadow-[var(--shadow-ambient-pink)] sm:flex sm:flex-col sm:rounded-[1.5rem]",
        className,
      )}
    >
      {cake.eggless ? (
        <div className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-border-soft)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-cream-soft)_92%,white)] px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">
          <Leaf className="size-3.5 text-[var(--color-brand-pink)]" aria-hidden />
          eggless
        </div>
      ) : null}

      <div className="relative min-h-[10rem] w-full min-w-0 max-w-full overflow-hidden bg-[var(--color-cream-soft)] sm:aspect-square sm:min-h-0">
        <CatalogCakeImage
          src={cake.image}
          alt={cake.name}
          priority={imagePriority}
          sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 8.25rem"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out md:group-hover:scale-105"
        />
        {(cake.bestseller || cake.badge) && (
          <span
            className={cn(
              "pointer-events-none absolute bottom-2 right-2 rotate-[-6deg] rounded bg-[color-mix(in_srgb,var(--color-cream)_88%,transparent)] px-2 py-0.5 font-[family-name:var(--font-handwritten)] text-base shadow-sm backdrop-blur-sm sm:bottom-3 sm:right-4 sm:text-lg",
              cake.badge ? "text-[var(--color-ink-soft)]" : "text-[var(--color-brand-pink)]",
            )}
          >
            {cake.bestseller ? "bestseller!" : cake.badge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 bg-[color-mix(in_srgb,white_88%,transparent)] p-3.5 backdrop-blur-md sm:gap-3 sm:p-5">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h2 className="min-w-0 break-words font-serif text-base font-semibold leading-snug text-[var(--color-ink)] sm:text-xl sm:leading-tight">
            {cake.name}
          </h2>
          <span className="shrink-0 font-sans text-sm font-bold text-[var(--color-brand-pink)] sm:text-lg">
            from ₹{cake.priceFrom}
          </span>
        </div>
        <p className="line-clamp-2 min-w-0 flex-1 break-words font-sans text-xs leading-snug text-[var(--color-ink-soft)] sm:text-sm">
          {cake.description}
        </p>
        <Link
          href={`/order?cake=${cake.slug}`}
          className="group/btn mt-auto flex min-h-10 w-full min-w-0 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--color-cream-soft)] px-3 py-2.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-pink-deep)] transition-colors duration-300 hover:bg-[var(--color-brand-pink)] hover:text-white sm:mt-2 sm:min-h-11 sm:gap-2 sm:px-4 sm:py-3.5 sm:text-[11px]"
        >
          <ShoppingCart
            className="size-4 shrink-0 transition-transform group-hover/btn:scale-110 sm:size-[18px]"
            aria-hidden
          />
          order this cake
        </Link>
      </div>
    </article>
  );
}

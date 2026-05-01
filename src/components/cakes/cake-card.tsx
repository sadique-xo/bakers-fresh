import Image from "next/image";
import Link from "next/link";
import { Leaf, ShoppingCart } from "lucide-react";

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
        "group relative flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[var(--shadow-ambient-pink)]",
        className,
      )}
    >
      {cake.eggless ? (
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-border-soft)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-cream-soft)_92%,white)] px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
          <Leaf className="size-3.5 text-[var(--color-brand-pink)]" aria-hidden />
          eggless
        </div>
      ) : null}

        <div className="relative aspect-[3/4] w-full min-w-0 max-w-full overflow-hidden bg-[var(--color-cream-soft)] sm:aspect-square">
          <Image
            src={cake.image}
            alt={cake.name}
            fill
            priority={imagePriority}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, min(100vw, 560px)"
            className="h-full w-full object-contain object-center transition-transform duration-700 ease-out sm:object-cover sm:object-center md:group-hover:scale-105"
          />
        {(cake.bestseller || cake.badge) && (
          <span
            className={cn(
              "pointer-events-none absolute bottom-3 right-4 rotate-[-6deg] rounded bg-[color-mix(in_srgb,var(--color-cream)_85%,transparent)] px-2 py-0.5 font-[family-name:var(--font-handwritten)] text-lg shadow-sm backdrop-blur-sm",
              cake.badge ? "text-[var(--color-ink-soft)]" : "text-[var(--color-brand-pink)]",
            )}
          >
            {cake.bestseller ? "bestseller!" : cake.badge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 bg-[color-mix(in_srgb,white_88%,transparent)] p-4 backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h2 className="min-w-0 break-words font-serif text-lg font-semibold leading-snug text-[var(--color-ink)] sm:text-xl sm:leading-tight">
            {cake.name}
          </h2>
          <span className="shrink-0 font-sans text-base font-bold text-[var(--color-brand-pink)] sm:text-lg">
            from ₹{cake.priceFrom}
          </span>
        </div>
        <p className="line-clamp-2 min-w-0 flex-1 break-words font-sans text-sm leading-snug text-[var(--color-ink-soft)]">
          {cake.description}
        </p>
        <Link
          href={`/order?cake=${cake.slug}`}
          className="group/btn mt-1 flex min-h-11 w-full min-w-0 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-cream-soft)] px-3 py-3 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-pink-deep)] transition-colors duration-300 hover:bg-[var(--color-brand-pink)] hover:text-white sm:mt-2 sm:px-4 sm:py-3.5"
        >
          <ShoppingCart
            className="size-[18px] transition-transform group-hover/btn:scale-110"
            aria-hidden
          />
          order this cake
        </Link>
      </div>
    </article>
  );
}

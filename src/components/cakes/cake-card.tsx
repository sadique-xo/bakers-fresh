import Image from "next/image";
import Link from "next/link";
import { Leaf, ShoppingCart } from "lucide-react";

import type { CatalogCake } from "@/lib/catalog";

import { cn } from "@/lib/utils";

type Props = {
  cake: CatalogCake;
  className?: string;
};

export function CakeCard({ cake, className }: Props) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[var(--shadow-ambient-pink)]",
        className,
      )}
    >
      {cake.eggless ? (
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-border-soft)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-cream-soft)_92%,white)] px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
          <Leaf className="size-3.5 text-[var(--color-brand-pink)]" aria-hidden />
          eggless
        </div>
      ) : null}

        <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-cream-soft)]">
          <Image
            src={cake.image}
            alt={cake.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
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

      <div className="flex flex-1 flex-col gap-3 bg-[color-mix(in_srgb,white_88%,transparent)] p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-xl font-semibold leading-tight text-[var(--color-ink)]">
            {cake.name}
          </h2>
          <span className="shrink-0 font-sans text-lg font-bold text-[var(--color-brand-pink)]">
            from ₹{cake.priceFrom}
          </span>
        </div>
        <p className="line-clamp-2 flex-1 font-sans text-sm leading-snug text-[var(--color-ink-soft)]">
          {cake.description}
        </p>
        <Link
          href={`/order?cake=${cake.slug}`}
          className="group/btn mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-cream-soft)] py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-pink-deep)] transition-colors duration-300 hover:bg-[var(--color-brand-pink)] hover:text-white"
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

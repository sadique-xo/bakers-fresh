"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";

import { CakeCard } from "@/components/cakes/cake-card";
import type { CatalogCake } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

/** Catalog filter tabs */
type TabId =
  | "all"
  | "classic"
  | "premium"
  | "mithai"
  | "cheesecakes"
  | "photo"
  | "kids"
  | "wedding";

type SortId = "featured" | "price-asc" | "price-desc";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "all" },
  { id: "classic", label: "classic" },
  { id: "premium", label: "premium" },
  { id: "mithai", label: "mithai" },
  { id: "cheesecakes", label: "cheesecakes" },
  { id: "photo", label: "photo cakes" },
  { id: "kids", label: "kids" },
  { id: "wedding", label: "wedding" },
];

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "featured", label: "featured first" },
  { id: "price-asc", label: "price, low to high" },
  { id: "price-desc", label: "price, high to low" },
];

const PREMIUM_SLUGS = new Set(["midnight-truffle", "belgian-chocolate-anniversary"]);

function matchesTab(cake: CatalogCake, tab: TabId): boolean {
  if (tab === "all") return true;

  const slug = cake.slug.toLowerCase();
  const haystack = `${slug} ${cake.name} ${cake.description}`.toLowerCase();

  switch (tab) {
    case "classic": {
      if (PREMIUM_SLUGS.has(slug)) return false;
      if (
        cake.categorySlug === "photo-cake" ||
        cake.categorySlug === "kids" ||
        cake.categorySlug === "designer" ||
        cake.categorySlug === "wedding"
      )
        return false;
      return cake.categorySlug === "birthday" || cake.categorySlug === "anniversary";
    }
    case "premium":
      return (
        PREMIUM_SLUGS.has(slug) ||
        cake.categorySlug === "designer" ||
        /\bpremium\b|tiered|tier\b|designer/i.test(haystack)
      );
    case "mithai":
      return /\bgulab|jamun|rasmalai|kesar|pista|mithai\b/i.test(haystack);
    case "cheesecakes":
      return /cheesecake|\bcheese\s*cake\b/i.test(haystack);
    case "photo":
      return cake.categorySlug === "photo-cake";
    case "kids":
      return cake.categorySlug === "kids";
    case "wedding":
      return cake.categorySlug === "wedding";
    default:
      return false;
  }
}

function filterByTab(list: CatalogCake[], tab: TabId): CatalogCake[] {
  return list.filter((c) => matchesTab(c, tab));
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function filterBySearch(cakes: CatalogCake[], q: string): CatalogCake[] {
  if (!q.trim()) return cakes;
  const n = normalize(q);
  return cakes.filter(
    (c) => normalize(c.name).includes(n) || normalize(c.description).includes(n),
  );
}

function sortCatalog(cakes: CatalogCake[], sort: SortId): CatalogCake[] {
  const copy = [...cakes];
  if (sort === "featured") {
    copy.sort((a, b) => {
      if (a.bestseller !== b.bestseller) return a.bestseller ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  } else if (sort === "price-asc") {
    copy.sort((a, b) => a.priceFrom - b.priceFrom || a.name.localeCompare(b.name));
  } else {
    copy.sort((a, b) => b.priceFrom - a.priceFrom || a.name.localeCompare(b.name));
  }
  return copy;
}

type CatalogProps = {
  cakes: CatalogCake[];
};

export function CakesCatalog({ cakes }: CatalogProps) {
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortId>("featured");
  const [sheetOpen, setSheetOpen] = useState(false);

  const tabCounts = useMemo(() => {
    const counts = {} as Record<TabId, number>;
    for (const t of TABS) {
      counts[t.id] = cakes.filter((c) => matchesTab(c, t.id)).length;
    }
    return counts;
  }, [cakes]);

  const visible = useMemo(() => {
    const byTab = filterByTab(cakes, tab);
    const searched = filterBySearch(byTab, search);
    return sortCatalog(searched, sort);
  }, [cakes, tab, search, sort]);

  return (
    <section className="w-full max-w-[100vw] overflow-x-clip">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-5 md:px-8 md:pt-12 lg:px-10">
        <div className="rounded-[2rem] border border-[var(--color-border-soft)] bg-white/55 p-4 shadow-[var(--shadow-ambient-pink)] backdrop-blur-sm sm:p-6 md:p-8">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-handwritten)] text-xl leading-none text-[var(--color-brand-pink-deep)] sm:text-2xl">
                freshly baked
              </p>
              <h1 className="mt-2 font-serif text-[2rem] font-semibold leading-none tracking-tight text-[var(--color-ink)] sm:text-4xl md:text-5xl">
                our cakes
              </h1>
            </div>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-white shadow-[var(--shadow-ambient-pink)] outline-none transition-colors hover:bg-[var(--color-cream-soft)] md:hidden"
                aria-label="sort cakes"
              >
                <SlidersHorizontal className="size-[21px] text-[var(--color-ink-soft)]" />
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="max-h-[88vh] rounded-t-2xl pb-[max(1.25rem,env(safe-area-inset-bottom))]"
              >
                <SheetHeader>
                  <SheetTitle className="text-left font-serif text-xl font-semibold normal-case text-[var(--color-ink)]">
                    sort cakes
                  </SheetTitle>
                </SheetHeader>
                <div className="space-y-4 px-4 pb-6 [&_label]:min-w-0 [&_label]:leading-snug">
                  <RadioGroup
                    className="grid gap-3"
                    value={sort}
                    onValueChange={(v) => setSort(v as SortId)}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <div key={opt.id} className="flex items-start gap-3">
                        <RadioGroupItem value={opt.id} id={`sort-${opt.id}`} />
                        <Label htmlFor={`sort-${opt.id}`} className="cursor-pointer font-normal">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {search.trim() ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => setSearch("")}
                    >
                      clear search
                    </Button>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <p className="mt-4 max-w-2xl text-pretty font-sans text-sm leading-relaxed text-[var(--color-ink-soft)] sm:text-base">
            browse celebration cakes, photo cakes, mithai fusion, kids themes, and wedding styles.
            order any cake as-is or ask us to customise it for your occasion.
          </p>

          <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-[minmax(0,24rem)_1fr] md:items-center">
            <div className="relative min-w-0">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                placeholder="search cakes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full min-w-0 rounded-full border-[var(--color-border-soft)] bg-white pl-10 pr-4 font-sans text-base shadow-sm md:text-sm"
                aria-label="search cakes"
              />
            </div>

            <div className="hidden items-center justify-end gap-4 md:flex">
              <span className="font-sans text-xs font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
                sort
              </span>
              <RadioGroup
                className="flex w-auto flex-wrap gap-4"
                value={sort}
                onValueChange={(v) => setSort(v as SortId)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.id} id={`desk-sort-${opt.id}`} />
                    <Label htmlFor={`desk-sort-${opt.id}`} className="cursor-pointer font-normal">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {TABS.map((t) => {
            const active = tab === t.id;
            const count = tabCounts[t.id];
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "min-w-0 rounded-full px-3 py-2.5 text-center font-sans text-[10px] font-bold uppercase tracking-wider transition-[transform,box-shadow,color,background] active:scale-[0.98] sm:px-5 sm:text-[11px]",
                  active
                    ? "bg-[var(--color-brand-pink)] text-white shadow-[var(--shadow-ambient-pink)]"
                    : "bg-[color-mix(in_srgb,var(--color-cream-soft)_92%,white)] text-[var(--color-ink)] shadow-sm hover:bg-[color-mix(in_srgb,var(--color-cream-soft)_100%,transparent)]",
                )}
              >
                <span className="truncate">{t.label}</span>
                <span className={cn("ml-1 tabular-nums opacity-70", active && "opacity-90")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="font-sans text-xs font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
            showing {visible.length} cake{visible.length === 1 ? "" : "s"}
          </p>
          {search.trim() ? (
            <button
              type="button"
              className="font-sans text-xs font-semibold text-[var(--color-brand-pink)]"
              onClick={() => setSearch("")}
            >
              clear search
            </button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-[var(--color-border-soft)] bg-white/70 px-5 py-14 text-center font-sans text-[var(--color-ink-soft)]">
            no cakes in this category yet. take a look at our other collections.
          </p>
        ) : (
          <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 [&>*]:min-w-0">
            {visible.map((cake, i) => (
              <CakeCard key={cake.slug} cake={cake} imagePriority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

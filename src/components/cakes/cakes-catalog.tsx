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
    <>
      <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-12 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--color-ink)] md:text-5xl">
            our cakes
          </h1>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-input bg-background shadow-[var(--shadow-ambient-pink)] outline-none transition-colors hover:bg-muted md:hidden",
              )}
              aria-label="sort and filters">
              <SlidersHorizontal className="size-[22px] text-[var(--color-ink-soft)]" />
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[88vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-left font-serif text-xl font-semibold normal-case text-[var(--color-ink)]">
                  sort
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <RadioGroup
                  className="grid gap-3"
                  value={sort}
                  onValueChange={(v) => setSort(v as SortId)}>
                  {SORT_OPTIONS.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-3">
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
                    onClick={() => setSearch("")}>
                    clear search
                  </Button>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-[var(--color-ink-soft)] md:text-[1.05rem]">
          made fresh, customized for you. from classic flavours to mithai fusion.
        </p>

        <div className="relative mt-6 md:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="search by name or style…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-full border-[var(--color-border-soft)] bg-white pl-10 pr-4 font-sans shadow-sm"
            aria-label="search cakes"
          />
        </div>

        <div className="hide-scrollbar mb-2 mt-8 flex gap-3 overflow-x-auto pb-1 md:mb-12 md:flex-wrap md:overflow-visible">
          {TABS.map((t) => {
            const active = tab === t.id;
            const count = tabCounts[t.id];
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-shrink-0 rounded-full px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider transition-[transform,box-shadow,color,background]",
                  active
                    ? "bg-[var(--color-brand-pink)] text-white shadow-[var(--shadow-ambient-pink)]"
                    : "bg-[color-mix(in_srgb,var(--color-cream-soft)_92%,white)] text-[var(--color-ink)] shadow-sm hover:bg-[color-mix(in_srgb,var(--color-cream-soft)_100%,transparent)] active:scale-95",
                )}
              >
                {t.label}
                <span className={cn("ml-1.5 tabular-nums opacity-70", active && "opacity-90")}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-10 hidden items-center gap-4 md:flex">
          <span className="font-sans text-xs font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
            sort
          </span>
          <RadioGroup
            className="flex flex-wrap gap-4"
            value={sort}
            onValueChange={(v) => setSort(v as SortId)}>
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

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-[var(--color-border-soft)] bg-white/70 py-14 text-center font-sans text-[var(--color-ink-soft)]">
            no cakes in this category yet. take a look at our other collections.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((cake, i) => (
              <CakeCard key={cake.slug} cake={cake} imagePriority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

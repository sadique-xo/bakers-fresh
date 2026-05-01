import type { Metadata } from "next";

import { CakesCatalog } from "@/components/cakes/cakes-catalog";
import { getCatalogCakes } from "@/lib/queries/public-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "our cakes",
  description:
    "browse baker's fresh cakes across classic, premium, mithai fusion, weddings, photo cakes, and more in ranchi.",
  pathname: "/cakes",
});

export default async function CakesPage() {
  const cakes = await getCatalogCakes();
  return (
    <>
      <CakesCatalog cakes={cakes} />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-2 sm:px-5 md:px-8 md:pb-20">
        <p className="mx-auto max-w-3xl font-sans text-xs leading-relaxed text-[var(--color-ink-soft)] sm:text-sm">
          prices shown are starting prices for 1kg. eggless option available on most cakes (10-15%
          extra). all prices include taxes. delivery within ranchi only. for outside-ranchi orders,
          contact us.
        </p>
      </div>
    </>
  );
}

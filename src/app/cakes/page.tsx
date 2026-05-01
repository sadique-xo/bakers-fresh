import type { Metadata } from "next";

import { CakesCatalog } from "@/components/cakes/cakes-catalog";
import { getCatalogCakes } from "@/lib/queries/public-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "our cakes",
  description:
    "browse baker's fresh cakes across birthdays, weddings, eggless picks, and more in ranchi.",
  pathname: "/cakes",
});

export default async function CakesPage() {
  const cakes = await getCatalogCakes();
  return <CakesCatalog cakes={cakes} />;
}

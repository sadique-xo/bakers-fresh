import type { Metadata } from "next";

import { CakesCatalog } from "@/components/cakes/cakes-catalog";
import { getCatalogCakes } from "@/lib/queries/public-content";

export const metadata: Metadata = {
  title: "our cakes",
  description: "browse baker's fresh cakes across birthdays, weddings, eggless picks, and more.",
};

export default async function CakesPage() {
  const cakes = await getCatalogCakes();
  return <CakesCatalog cakes={cakes} />;
}

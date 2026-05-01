import type { Tables } from "@/lib/database.types";

export type CatalogCake = {
  slug: string;
  name: string;
  description: string;
  priceFrom: number;
  image: string;
  eggless: boolean;
  bestseller: boolean;
  badge?: string;
  categorySlug: string | null;
};

export type SiteOutlet = {
  slug: string;
  name: string;
  shortAddress: string;
  phone: string;
  googleMapsEmbed: string | null;
  hoursNote: string | null;
};

export type SiteTestimonial = {
  quote: string;
  author: string;
  rating: number;
  rotate: "-1deg" | "1deg";
};

export type CakeWithCategory = Tables<"cakes"> & {
  categories: { slug: string } | null;
};

export function mapCakeRow(row: CakeWithCategory): CatalogCake {
  const name = row.name.trim().toLowerCase();
  const description = (row.description ?? "").trim().toLowerCase();
  return {
    slug: row.slug,
    name,
    description,
    priceFrom: row.base_price_inr,
    image: row.image_url ?? "",
    eggless: Boolean(row.is_eggless),
    bestseller: Boolean(row.is_featured),
    badge: undefined,
    categorySlug: row.categories?.slug ?? null,
  };
}

export function mapLocationRow(row: Tables<"locations">): SiteOutlet {
  return {
    slug: row.slug,
    name: row.name.trim().toLowerCase(),
    shortAddress: row.address.trim().toLowerCase(),
    phone: row.phone,
    googleMapsEmbed: row.google_maps_embed,
    hoursNote: formatHoursHint(row.hours),
  };
}

function formatHoursHint(hours: Tables<"locations">["hours"]): string | null {
  if (!hours || typeof hours !== "object") return null;
  const first = Object.values(hours as Record<string, string>)[0];
  return first ? `hours: ${String(first).toLowerCase()}` : null;
}

export function mapTestimonialRow(
  row: Tables<"testimonials">,
  index: number,
): SiteTestimonial {
  const source = row.source ? ` (${row.source})` : "";
  return {
    quote: row.review.trim().toLowerCase(),
    author: `${row.customer_name.trim().toLowerCase()}${source}`,
    rating: row.rating ?? 5,
    rotate: index % 2 === 0 ? "-1deg" : "1deg",
  };
}

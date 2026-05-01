import { cache } from "react";

import type { CatalogCake, SiteOutlet, SiteTestimonial } from "@/lib/catalog";
import {
  mapCakeRow,
  mapLocationRow,
  mapTestimonialRow,
  type CakeWithCategory,
} from "@/lib/catalog";
import { HOME_PROMO_CAKE_SLUGS } from "@/lib/home-promo-cakes";
import { createSupabaseServer } from "@/lib/supabase/server";

export type HomePromoSlide = { src: string; alt: string };

export const getHomePromoCakes = cache(async (): Promise<HomePromoSlide[]> => {
  const slugs = [...HOME_PROMO_CAKE_SLUGS];
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("cakes")
    .select("*, categories(slug)")
    .eq("is_active", true)
    .in("slug", slugs);

  if (error) {
    console.error("getHomePromoCakes", error.message);
    return [];
  }

  const rows = (data as CakeWithCategory[]).map(mapCakeRow).filter((c) => c.image);
  const bySlug = new Map(rows.map((c) => [c.slug, c]));

  const ordered: HomePromoSlide[] = [];
  for (const slug of slugs) {
    const cake = bySlug.get(slug);
    if (cake) ordered.push({ src: cake.image, alt: `${cake.name}, custom cake reference` });
  }
  return ordered;
});

export const getCatalogCakes = cache(async (): Promise<CatalogCake[]> => {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("cakes")
    .select("*, categories(slug)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("getCatalogCakes", error.message);
    return [];
  }
  return (data as CakeWithCategory[]).map(mapCakeRow).filter((c) => c.image);
});

export const getFeaturedCakes = cache(async (limit = 6): Promise<CatalogCake[]> => {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("cakes")
    .select("*, categories(slug)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getFeaturedCakes", error.message);
    return [];
  }
  const rows = (data as CakeWithCategory[]).map(mapCakeRow).filter((c) => c.image);
  if (rows.length > 0) return rows;
  return (await getCatalogCakes()).slice(0, limit);
});

export const getSiteOutlets = cache(async (): Promise<SiteOutlet[]> => {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("getSiteOutlets", error.message);
    return [];
  }
  return (data ?? []).map(mapLocationRow);
});

export const getFeaturedTestimonials = cache(
  async (limit = 6): Promise<SiteTestimonial[]> => {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .order("display_order", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("getFeaturedTestimonials", error.message);
      return [];
    }
    return (data ?? []).map((row, index) => mapTestimonialRow(row, index));
  },
);

export const getCakeIdBySlug = cache(async (slug: string): Promise<string | null> => {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("cakes")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getCakeIdBySlug", error.message);
    return null;
  }
  return data?.id ?? null;
});

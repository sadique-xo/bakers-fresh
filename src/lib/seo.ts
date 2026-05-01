import type { Metadata } from "next";

/**
 * Production: set NEXT_PUBLIC_SITE_URL (e.g. https://bakers-fresh.sadique.co).
 * Vercel sets VERCEL_URL automatically as a fallback when the env is missing.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Default Open Graph / Twitter card image in `/public` (1200×630). */
export const defaultOgImageUrl = "/og-default.webp";

/** Site-wide default title and description (root layout + share cards). */
export const defaultShareTitle = "baker's fresh | custom cakes ranchi";
export const defaultShareDescription =
  "handcrafted custom cakes and bakes in ranchi. order online, we call you back within 2 hours.";

export const siteName = "baker's fresh";

export const defaultKeywords: string[] = [
  "custom cakes ranchi",
  "birthday cake ranchi",
  "wedding cake ranchi",
  "eggless cake ranchi",
  "baker's fresh",
  "bakery ranchi",
  "cake order ranchi",
];

export type PageMetaInput = {
  /** Short title; layout template adds ` | baker's fresh`. */
  title: string;
  description: string;
  pathname: string;
  ogImage?: string;
  index?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  pathname,
  ogImage = defaultOgImageUrl,
  index = true,
}: PageMetaInput): Metadata {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = `${base}${path === "//" ? "/" : path}`;
  const fullTitle = `${title} | ${siteName}`;

  const meta: Metadata = {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} — ${siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };

  if (!index) {
    meta.robots = { index: false, follow: true };
  }

  return meta;
}

/** Home uses an absolute title so the layout template does not double the brand. */
export function buildHomeMetadata(): Metadata {
  const base = getSiteUrl();
  const url = `${base}/`;

  return {
    title: { absolute: defaultShareTitle },
    description: defaultShareDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title: defaultShareTitle,
      description: defaultShareDescription,
      siteName,
      images: [
        {
          url: defaultOgImageUrl,
          width: 1200,
          height: 630,
          alt: "custom celebration cake — baker's fresh ranchi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultShareTitle,
      description: defaultShareDescription,
      images: [defaultOgImageUrl],
    },
  };
}

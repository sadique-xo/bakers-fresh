/**
 * Hero: local photography in /public. Featured strip uses local cake shots.
 */
import type { CatalogCake } from "@/lib/catalog";

export const STITCH_HOME_HERO = "/hero-image.webp";

/** Home “our most-loved cakes”: image + copy for the first four cards (matches `public/4cake/`). */
export const HOME_MOST_LOVED_SLOTS = [
  {
    image: "/4cake/chocolate.webp",
    name: "chocolate",
    description:
      "rich cocoa sponge and silky frosting. the flavour guests ask for first.",
  },
  {
    image: "/4cake/strawberry.webp",
    name: "strawberry",
    description:
      "bright berry notes with a light sponge. sweet, fresh, baked same day.",
  },
  {
    image: "/4cake/vanilla.webp",
    name: "vanilla",
    description:
      "soft vanilla layers that pair with anything. simple, comforting, never boring.",
  },
  {
    image: "/4cake/red-velvet.webp",
    name: "red velvet",
    description:
      "a whisper of cocoa and cream cheese frosting. indulgent without the heaviness.",
  },
] as const;

/** When the catalog is empty, four demo rows aligned with local photography and demo DB slugs. */
export const STITCH_FALLBACK_FEATURED: CatalogCake[] = [
  {
    slug: "classic-truffle",
    name: HOME_MOST_LOVED_SLOTS[0].name,
    description: HOME_MOST_LOVED_SLOTS[0].description,
    priceFrom: 550,
    image: HOME_MOST_LOVED_SLOTS[0].image,
    eggless: false,
    bestseller: true,
    categorySlug: "birthday",
  },
  {
    slug: "berry-delight",
    name: HOME_MOST_LOVED_SLOTS[1].name,
    description: HOME_MOST_LOVED_SLOTS[1].description,
    priceFrom: 550,
    image: HOME_MOST_LOVED_SLOTS[1].image,
    eggless: false,
    bestseller: false,
    categorySlug: "birthday",
  },
  {
    slug: "strawberry-cloud",
    name: HOME_MOST_LOVED_SLOTS[2].name,
    description: HOME_MOST_LOVED_SLOTS[2].description,
    priceFrom: 580,
    image: HOME_MOST_LOVED_SLOTS[2].image,
    eggless: false,
    bestseller: false,
    categorySlug: "birthday",
  },
  {
    slug: "velvet-dream",
    name: HOME_MOST_LOVED_SLOTS[3].name,
    description: HOME_MOST_LOVED_SLOTS[3].description,
    priceFrom: 620,
    image: HOME_MOST_LOVED_SLOTS[3].image,
    eggless: true,
    bestseller: false,
    categorySlug: "eggless",
  },
];

/**
 * Hero + spotlight photography from the Stitch “Home - Baker's Fresh” export
 * (design-references/stitch-html/01_home.html). Remote host is allowlisted in next.config.ts.
 */
import type { CatalogCake } from "@/lib/catalog";

export const STITCH_HOME_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzju2kBqqQ0DH0UOId5qH5pgjOsehsKPfQ1R-FuWaJdB1vVj0rLqHXy35B4uu5b0hCZuZq6DC4x7ciOZHUTXGnnqUkgfnAwLyVMHh-iYEfHzIMMNi_jvBj_g7aIrMtK3Y7x-N8B_qrVWSWuphpTbI_sFFzAsdbj_f-CYYRWDxGyPiwxD4WjKMLTr0U-TnV-VWJuWS3pTm7BKQtMxzpA0i3CnoeWfusLDjGfGn5v8uyrcT_Ed0SADoAyAW9hjUIKj4kOjeR0_6fkTwb";

/** Featured card 1 in Stitch: “Classic Truffle” chocolate shot */
export const STITCH_HOME_FEATURED_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAaRxCQUCniepJ3FQfI_n98LMHbl1gzvrXM-uS4gILjFqhM6LXRIObOIVY6EjgprDiDEbgJRGLj8M30MaBhLem8OHd3Ypy5MeL6aC5L9gGi0N4Pfrs4I4Ok3JInQC1RkycD-2aFvU7HqP4iLzx4RYnC-hWMf0HLjLEWjQr6q16QQzuOaNGicJtiAJyxUk7z4wgs7p8rJDMUk_V7rtG8cjIKaF-LxFXM2W8E6GUVuLS70JwKM2zQpYlumBiJjC6dYCPGWmNk23QHKiz8";

/** Featured card 2 in Stitch: “Berry Delight” strawberry cake */
export const STITCH_HOME_FEATURED_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCahI896z_JHbvVKLSGOh9jV1FpDzbai7jX2ZJnPwy_Nwr0popmjva2KGayJoTe3YwY2yO789e7BgLvCtc-iRSaPZ9OyrG4B97tMYrrgUsU4805prUv-F-1EUJBOeBks2r_lnlMiFQUDjTII0JkG-HHprqyveQfCtvjqw6vgY_6m7VYQejetCMaYN51yd8irvNqPrAa5cd4qJgt0ZDIJE1ZOOulzp7M7Lq9vFUVixT_vKinUIeTpjsdQZ1Rlavd64d6bX7gJRFxXNjz";

export const STITCH_HOME_SPOTLIGHT_IMAGES = [
  STITCH_HOME_FEATURED_1,
  STITCH_HOME_FEATURED_2,
] as const;

/** When the catalog is empty, keep the homepage on-brand with the Stitch export. */
export const STITCH_FALLBACK_FEATURED: CatalogCake[] = [
  {
    slug: "classic-truffle",
    name: "classic truffle",
    description: "dark, rich, and incredibly moist chocolate layers.",
    priceFrom: 550,
    image: STITCH_HOME_FEATURED_1,
    eggless: false,
    bestseller: true,
    categorySlug: "birthday",
  },
  {
    slug: "berry-delight",
    name: "berry delight",
    description: "light vanilla sponge with fresh seasonal berries.",
    priceFrom: 550,
    image: STITCH_HOME_FEATURED_2,
    eggless: false,
    bestseller: false,
    categorySlug: "birthday",
  },
];

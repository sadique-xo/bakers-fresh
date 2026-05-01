import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Cake, Star } from "lucide-react";

import type { CatalogCake, SiteOutlet, SiteTestimonial } from "@/lib/catalog";
import {
  getCatalogCakes,
  getFeaturedCakes,
  getFeaturedTestimonials,
  getHomePromoCakes,
  getSiteOutlets,
  type HomePromoSlide,
} from "@/lib/queries/public-content";
import { buildHomeMetadata } from "@/lib/seo";
import {
  HOME_MOST_LOVED_SLOTS,
  STITCH_FALLBACK_FEATURED,
  STITCH_HOME_HERO,
} from "@/lib/stitch-home-assets";
import { formatIndiaPhone, siteWhatsappUrl } from "@/lib/site";

export const metadata: Metadata = buildHomeMetadata();

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-buttercream)]">
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-x-14 lg:gap-y-12 lg:py-[4.5rem]">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-4 inline-flex items-center rounded-full border border-[var(--color-navbar-line)] bg-white/55 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="font-[family-name:var(--font-handwritten)] text-xl text-[var(--color-brand-pink-deep)] md:text-[1.35rem]">
              fresh from our oven
            </span>
          </span>
          <h1 className="max-w-xl font-serif text-4xl font-bold leading-[1.06] tracking-tight text-[var(--color-ink)] md:text-5xl lg:text-[3.35rem]">
            bite into pure joy.
          </h1>
          <p className="mt-5 max-w-[28rem] font-sans text-base leading-relaxed text-[var(--color-ink-soft)] md:text-lg">
            handcrafted cakes, made fresh daily in ranchi. share what you imagine, we&apos;ll bake it.
          </p>
          <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-pink)] px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_12px_32px_-8px_rgba(233,30,99,0.42)] ring-2 ring-[color-mix(in_srgb,var(--color-brand-pink)_35%,transparent)] transition-[filter,transform] hover:brightness-[1.03] active:scale-[0.985]"
            >
              <Cake className="size-[18px]" aria-hidden />
              order custom cake
            </Link>
            <Link
              href="/cakes"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-ink)]/[0.08] bg-white/85 px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-pink-deep)] shadow-[0_8px_24px_-10px_rgba(40,23,26,0.1)] backdrop-blur-sm transition-colors hover:bg-white"
            >
              view our cakes
            </Link>
          </div>
          <ul
            className="mt-8 flex max-w-xl list-none flex-wrap justify-center gap-1.5 lg:justify-start"
            aria-label="Trust and credentials"
          >
            <li>
              <span className="inline-flex items-center rounded-full border border-[var(--color-navbar-line)] bg-white/70 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-ink)] shadow-sm backdrop-blur-sm md:px-2.5 md:py-1 md:text-[10px] md:tracking-[0.07em]">
                5,000+ celebrations
              </span>
            </li>
            <li>
              <span className="inline-flex items-center rounded-full border border-[var(--color-navbar-line)] bg-white/70 px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-soft)] shadow-sm backdrop-blur-sm md:px-2.5 md:py-1 md:text-[10px] md:tracking-[0.07em]">
                2 ranchi counters
              </span>
            </li>
            <li>
              <span className="inline-flex items-center rounded-full border border-[var(--color-navbar-line)] bg-white/70 px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-soft)] shadow-sm backdrop-blur-sm md:px-2.5 md:py-1 md:text-[10px] md:tracking-[0.07em]">
                pure veg options
              </span>
            </li>
            <li>
              <span className="inline-flex items-center rounded-full border border-[var(--color-navbar-line)] bg-white/70 px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-subtle)] shadow-sm backdrop-blur-sm md:px-2.5 md:py-1 md:text-[10px] md:tracking-[0.07em]">
                fssai certified
              </span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 mt-12 flex w-full justify-center lg:mt-0">
          <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-[1.85rem] md:rounded-[2.25rem]">
            <Image
              src={STITCH_HOME_HERO}
              alt="baker&apos;s fresh celebration cake"
              fill
              priority
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute bottom-4 right-4 rotate-[-4deg] rounded-full bg-[color-mix(in_srgb,white_82%,transparent)] px-4 py-2.5 backdrop-blur-md">
              <span className="font-[family-name:var(--font-handwritten)] text-xl text-[var(--color-brand-pink-deep)] md:text-[1.35rem]">
                fresh out the oven!
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[2] mt-[-1px] w-full overflow-hidden text-[color-mix(in_srgb,var(--color-cream-soft)_58%,white)]">
        <svg
          className="relative block h-12 w-full min-w-[100%] sm:h-14 xl:h-[3.65rem]"
          viewBox="0 0 1440 54"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path fill="currentColor" d="M0 36c120-22 288-38 448-34 192 4 368 42 572 38 208-5 368-56 420-72v86H0V36z" />
        </svg>
      </div>
    </section>
  );
}

function FeaturedSection({ cakes }: { cakes: CatalogCake[] }) {
  if (cakes.length === 0) {
    return (
      <section className="w-full bg-[color-mix(in_srgb,var(--color-cream-soft)_55%,white)] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-sans text-[var(--color-ink-soft)]">
            cakes will show here once the catalog sync finishes. refresh in a
            moment or browse from the nav.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[color-mix(in_srgb,var(--color-cream-soft)_55%,white)] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[var(--color-ink)]">
              our most-loved cakes
            </h2>
            <p className="mt-2 max-w-lg font-sans text-sm leading-relaxed text-[var(--color-ink-soft)] md:text-[0.95rem]">
              from classic flavours to mithai fusion, freshly baked every day.
            </p>
          </div>
          <Link
            href="/cakes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand-pink)] hover:underline"
          >
            browse all cakes
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {cakes.map((cake, index) => (
            <article
              key={cake.slug}
              className="group relative flex w-[min(100%,18rem)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-[var(--color-cream)] ambient-shadow md:w-auto"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={cake.image}
                  alt={cake.name}
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 40vw, 72vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {cake.bestseller ? (
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--color-cream-soft)] px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                    bestseller
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                  {cake.name}
                </h3>
                <p className="mt-1 flex-1 font-sans text-sm leading-snug text-[var(--color-ink-soft)]">
                  {cake.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-sans text-lg font-bold text-[var(--color-brand-pink)]">
                    from ₹{cake.priceFrom}
                  </span>
                  <Link
                    href={`/order?cake=${cake.slug}`}
                    className="rounded-full bg-[#e2165f] p-2.5 text-white transition-transform active:scale-90"
                    aria-label={`order ${cake.name}`}
                  >
                    <ArrowRight className="size-4 rotate-[-45deg]" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomPromoSection({ slides }: { slides: HomePromoSlide[] }) {
  return (
    <section className="bg-[var(--color-brand-pink-soft)] py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-brand-pink-deep)] md:text-4xl">
            got a vision? we&apos;ll bake it.
          </h2>
          <p className="mt-4 font-sans text-lg leading-relaxed text-[var(--color-ink-soft)]">
            share a reference image, your size, your flavor. we&apos;ll call within 2 hours to confirm
            and walk you through the details. no payment until you say yes.
          </p>
          <Link
            href="/order"
            className="mt-8 inline-flex rounded-full bg-[var(--color-brand-pink)] px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_28px_-6px_rgba(233,30,99,0.35)] transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
          >
            order custom cake
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {slides.map((slide, i) => (
            <div
              key={`${slide.src}-${i}`}
              className="relative aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white shadow-[var(--shadow-ambient-pink)]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i < 2}
                sizes="(min-width: 768px) 20vw, 42vw"
                className="object-cover"
              />
              {i === 1 ? (
                <div className="absolute inset-0 bg-[var(--color-brand-pink)]/10" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const cards = [
    {
      title: "5,000+ celebrations",
      body: "birthdays, weddings, anniversaries, and we have baked for ranchi's biggest moments for years.",
    },
    {
      title: "we make our own",
      body: "everything bakes fresh in our ranchi kitchen daily. no resellers, no shortcuts.",
    },
    {
      title: "pure veg options",
      body: "eggless versions across our cakes. fully vegetarian where it matters.",
    },
  ];
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="text-center font-serif text-3xl font-semibold text-[var(--color-ink)]">
          why ranchi loves us
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[var(--color-border-soft)] bg-white/80 p-6 shadow-[var(--shadow-ambient-pink)]"
            >
              <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                {c.title}
              </h3>
              <p className="mt-3 font-sans text-[var(--color-ink-soft)] leading-relaxed">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationsPreview({ outlets }: { outlets: SiteOutlet[] }) {
  return (
    <section className="bg-[color-mix(in_srgb,var(--color-cream-soft)_50%,white)] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[var(--color-ink)]">
              find us in ranchi
            </h2>
            <p className="mt-2 max-w-lg font-sans text-sm leading-relaxed text-[var(--color-ink-soft)]">
              lalpur for the flagship counter and neori for the second stop. tap through for maps and hours.
            </p>
          </div>
          <Link
            href="/locations"
            className="shrink-0 text-sm font-semibold text-[var(--color-brand-pink)] hover:underline"
          >
            full map &amp; hours
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {outlets.map((o) => (
            <div
              key={o.slug}
              className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-cream)] p-5 shadow-sm"
            >
              <h3 className="font-serif text-lg font-semibold capitalize text-[var(--color-ink)]">
                {o.name}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {o.shortAddress}
              </p>
              <a
                href={`tel:${o.phone.replace(/\s/g, "")}`}
                className="mt-4 inline-block font-sans text-sm font-semibold text-[var(--color-brand-pink)] hover:underline"
              >
                call {formatIndiaPhone(o.phone)}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: SiteTestimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="text-center font-serif text-3xl font-semibold text-[var(--color-ink)]">
          kind words from our customers
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <blockquote
              key={`${t.author}-${i}`}
              className="rounded-2xl border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-ambient-pink)]"
              style={{ transform: `rotate(${t.rotate})` }}
            >
              <div className="flex gap-0.5 text-[var(--color-gold)]" aria-label={`${t.rating} stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-4 font-sans text-[var(--color-ink-soft)] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 font-sans text-sm font-medium text-[var(--color-ink)]">
                {t.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <section className="bg-[var(--color-brand-pink)] py-14 text-white md:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
        <h2 className="font-serif text-3xl font-semibold md:text-4xl">
          ready to make someone&apos;s day?
        </h2>
        <p className="mt-4 font-sans text-lg text-white/90">
          tell us what you have in mind. we&apos;ll take it from there.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/order"
            className="rounded-full bg-white px-10 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-[var(--color-brand-pink)] shadow-lg transition-[transform] hover:bg-[var(--color-cream-soft)] active:scale-[0.98]"
          >
            order custom cake
          </Link>
          <a
            href={siteWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-white/80 px-10 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/15"
          >
            chat on whatsapp
          </a>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [featured, catalog, outlets, testimonials, promoSlides] =
    await Promise.all([
      getFeaturedCakes(8),
      getCatalogCakes(),
      getSiteOutlets(),
      getFeaturedTestimonials(3),
      getHomePromoCakes(),
    ]);

  const displayFeaturedRaw =
    featured.length >= 4 ? featured.slice(0, 4) : catalog.slice(0, 4);
  const displayFeatured =
    displayFeaturedRaw.length > 0 ? displayFeaturedRaw : STITCH_FALLBACK_FEATURED;

  /** First four cards use `public/4cake/` photography and matching names or blurbs; catalog keeps prices and order links. */
  const homeFeatured: CatalogCake[] = displayFeatured.map((cake, i) => {
    const slot = HOME_MOST_LOVED_SLOTS[i];
    if (!slot) return cake;
    return {
      ...cake,
      image: slot.image,
      name: slot.name,
      description: slot.description,
    };
  });

  return (
    <>
      <HeroSection />
      <FeaturedSection cakes={homeFeatured} />
      <CustomPromoSection slides={promoSlides} />
      <WhySection />
      <LocationsPreview outlets={outlets} />
      <TestimonialsSection testimonials={testimonials} />
      <BottomCta />
    </>
  );
}

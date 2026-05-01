import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Cake, Star } from "lucide-react";

import type { CatalogCake, SiteOutlet, SiteTestimonial } from "@/lib/catalog";
import {
  getCatalogCakes,
  getFeaturedCakes,
  getFeaturedTestimonials,
  getSiteOutlets,
} from "@/lib/queries/public-content";
import { buildHomeMetadata } from "@/lib/seo";
import {
  STITCH_FALLBACK_FEATURED,
  STITCH_HOME_HERO,
  STITCH_HOME_SPOTLIGHT_IMAGES,
} from "@/lib/stitch-home-assets";

export const metadata: Metadata = buildHomeMetadata();

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (!u || seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden px-5 py-10 md:mx-auto md:max-w-7xl md:px-8 md:py-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_10%_20%,rgba(233,30,99,0.12),transparent_55%),radial-gradient(ellipse_70%_45%_at_90%_10%,rgba(252,228,236,0.9),transparent_50%)]"
      />
      <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
        <p className="mb-3 font-[family-name:var(--font-handwritten)] text-2xl text-[var(--color-brand-pink)] md:text-[1.65rem]">
          fresh from our oven
        </p>
        <h1 className="max-w-xl font-serif text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-ink)] md:text-5xl">
          bite into pure joy, one slice at a time.
        </h1>
        <p className="mt-4 max-w-lg font-sans text-lg leading-relaxed text-[var(--color-ink-soft)]">
          handcrafted pastries and custom cakes made with love, fresh daily in
          ranchi.
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-[var(--color-brand-pink)] px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_28px_-6px_rgba(233,30,99,0.4)] transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
          >
            <Cake className="size-[18px]" aria-hidden />
            order custom cake
          </Link>
          <Link
            href="/cakes"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-white/90 px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-[var(--color-brand-pink-deep)] shadow-sm transition-colors hover:bg-[var(--color-cream-soft)]"
          >
            view our cakes
          </Link>
        </div>
      </div>
      <div className="relative z-10 mt-10 w-full lg:mt-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] ambient-shadow md:aspect-[5/4] lg:max-h-[min(28rem,70vh)] lg:rounded-3xl">
          <Image
            src={STITCH_HOME_HERO}
            alt="layered pink buttercream celebration cake with berries and gold accents"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 right-4 rotate-[-5deg] rounded-full bg-[color-mix(in_srgb,var(--color-cream)_88%,transparent)] px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="font-[family-name:var(--font-handwritten)] text-xl text-[var(--color-brand-pink)]">
              fresh out the oven!
            </span>
          </div>
        </div>
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
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-ink)]">
            featured bakes
          </h2>
          <Link
            href="/cakes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand-pink)] hover:underline"
          >
            browse all cakes
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {cakes.map((cake) => (
            <article
              key={cake.slug}
              className="group relative flex w-[min(100%,18rem)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-[var(--color-cream)] ambient-shadow md:w-auto"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={cake.image}
                  alt={cake.name}
                  fill
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

function CustomPromoSection({ images }: { images: string[] }) {
  const slides = images.length > 0 ? images : [];
  return (
    <section className="bg-[var(--color-brand-pink-soft)] py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-brand-pink-deep)] md:text-4xl">
            got a vision? we&apos;ll bake it.
          </h2>
          <p className="mt-4 font-sans text-lg leading-relaxed text-[var(--color-ink-soft)]">
            share a reference photo, tell us the vibe, and we&apos;ll shape the
            layers, colors, and finish with you. optional upload on the order
            form helps us get closer on the first call.
          </p>
          <Link
            href="/order"
            className="mt-8 inline-flex rounded-full bg-[var(--color-brand-pink)] px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_28px_-6px_rgba(233,30,99,0.35)] transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
          >
            start your custom order
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {slides.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-square overflow-hidden rounded-2xl shadow-[var(--shadow-ambient-pink)]"
            >
              <Image
                src={src}
                alt="custom cake inspiration collage"
                fill
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
      title: "5,000+ happy customers",
      body: "birthdays, weddings, and midnight cravings. we have been part of the table for years.",
    },
    {
      title: "4 outlets in ranchi",
      body: "pick up near you or ask about delivery when we confirm your order on the phone.",
    },
    {
      title: "baked fresh daily",
      body: "small batches, real cream, and frosting that does not feel mass made.",
    },
  ];
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="text-center font-serif text-3xl font-semibold text-[var(--color-ink)]">
          why baker&apos;s fresh
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
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-ink)]">
            visit our outlets
          </h2>
          <Link
            href="/locations"
            className="text-sm font-semibold text-[var(--color-brand-pink)] hover:underline"
          >
            full map &amp; hours
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                call {o.phone.replace("+91", "+91 ")}
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
          kind words from ranchi
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
          ready when you are
        </h2>
        <p className="mt-4 font-sans text-lg text-white/90">
          tell us date, flavor, and mood. we&apos;ll call you within two hours to
          lock details and payment.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/order"
            className="rounded-full bg-white px-10 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-[var(--color-brand-pink)] shadow-lg transition-[transform] hover:bg-[var(--color-cream-soft)] active:scale-[0.98]"
          >
            order custom cake
          </Link>
          <Link
            href="/cakes"
            className="rounded-full border-2 border-white/80 px-10 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/15"
          >
            browse catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [featured, catalog, outlets, testimonials] = await Promise.all([
    getFeaturedCakes(8),
    getCatalogCakes(),
    getSiteOutlets(),
    getFeaturedTestimonials(3),
  ]);

  const displayFeaturedRaw =
    featured.length >= 4 ? featured.slice(0, 4) : catalog.slice(0, 4);
  const displayFeatured =
    displayFeaturedRaw.length > 0 ? displayFeaturedRaw : STITCH_FALLBACK_FEATURED;

  /** First two cards use Stitch photography; names, prices, and links stay from the catalog. */
  const homeFeatured: CatalogCake[] = displayFeatured.map((cake, i) =>
    i < STITCH_HOME_SPOTLIGHT_IMAGES.length
      ? { ...cake, image: STITCH_HOME_SPOTLIGHT_IMAGES[i]! }
      : cake,
  );

  const promoImages = dedupeUrls([
    ...STITCH_HOME_SPOTLIGHT_IMAGES,
    ...displayFeatured.map((c) => c.image).filter(Boolean),
  ]).slice(0, 4);

  return (
    <>
      <HeroSection />
      <FeaturedSection cakes={homeFeatured} />
      <CustomPromoSection images={promoImages} />
      <WhySection />
      <LocationsPreview outlets={outlets} />
      <TestimonialsSection testimonials={testimonials} />
      <BottomCta />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "about",
  description:
    "story, values, and the team behind baker's fresh in ranchi. two counters, thousands of celebrations.",
  pathname: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
      <section className="rounded-3xl border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-ambient-pink)] sm:p-8 md:p-12">
        <p className="font-[family-name:var(--font-handwritten)] text-xl text-[var(--color-brand-pink)] sm:text-2xl">
          our corner of ranchi
        </p>
        <h1 className="mt-4 font-serif text-[1.625rem] font-semibold leading-snug text-[var(--color-ink)] sm:text-3xl md:text-[2.65rem] md:leading-tight">
          started as a tiny kitchen line, grew with every birthday whispered at the counter.
        </h1>
        <p className="mt-6 font-sans text-base text-[var(--color-ink-soft)] leading-relaxed sm:text-lg">
          baker&apos;s fresh now serves north of five thousand celebrations a
          year across our ranchi counters. we still frost by hand and taste every
          new batch before it hits the shelf.
        </p>
        <p className="mt-5 font-sans text-base text-[var(--color-ink-soft)] leading-relaxed sm:text-lg">
          monika guides the brand as founder, a ranchi entrepreneur with a
          background in business management. we bake everything in-house, fresh
          daily, so you are never getting a pass-through cake from a mystery
          kitchen.
        </p>
        <div className="relative mt-10 grid grid-cols-2 gap-3 overflow-hidden rounded-2xl md:grid-cols-3">
          <div className="relative col-span-2 aspect-[21/14] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[14rem]">
            <Image
              src="https://lh3.googleusercontent.com/p/AF1QipMdqCShhD22WJ9vBDD6WHzzADKlQcKAecN95NFA=s1360-w1360-h1020-rw"
              alt="baker&apos;s fresh lalpur counter, cake display and refrigerated cases"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="relative aspect-square md:min-h-[12rem]">
            <Image
              src="https://content3.jdmagicbox.com/comp/ranchi/g3/0651px651.x651.220527162753.l9g3/catalogue/bakers-fresh-lalpur-ranchi-cake-shops-3r20t4x6dt.jpg"
              alt="interior of baker&apos;s fresh lalpur, shelves and service counter"
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square md:col-start-3 md:min-h-[12rem]">
            <Image
              src="https://lh3.googleusercontent.com/p/AF1QipN5aAB8Hx50xfqYs0wii8sf4b8sCO6u8B-WVzQb=s1360-w1360-h1020-rw"
              alt="baker&apos;s fresh outlet aisle with cakes in the display case"
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center font-serif text-3xl font-semibold text-[var(--color-ink)]">
          what we refuse to compromise on
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "fresh ingredients",
              body: "local dairy, real fruit, chocolates we would snack on ourselves.",
            },
            {
              title: "traditional methods",
              body: "slow mixing, rested sponges, and buttercream whipped in small bowls.",
            },
            {
              title: "made with love",
              body: "if it would not fly at our family table it does not leave the bakery.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-[color-mix(in_srgb,var(--color-cream-soft)_70%,white)] p-5 sm:p-6"
            >
              <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)]">
                {v.title}
              </h3>
              <p className="mt-3 font-sans text-[var(--color-ink-soft)] leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

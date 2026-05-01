import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "about",
  description: "story, values, and the people behind baker's fresh in ranchi.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
      <section className="rounded-3xl border border-[var(--color-border-soft)] bg-white p-8 shadow-[var(--shadow-ambient-pink)] md:p-12">
        <p className="font-[family-name:var(--font-handwritten)] text-2xl text-[var(--color-brand-pink)]">
          our corner of ranchi
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-[var(--color-ink)] md:text-[2.65rem]">
          started as a tiny kitchen line, grew with every birthday whispered at the counter.
        </h1>
        <p className="mt-6 font-sans text-lg text-[var(--color-ink-soft)] leading-relaxed">
          baker&apos;s fresh now serves north of five thousand celebrations a
          year across four outlets. we still frost by hand and taste every new
          batch before it hits the shelf.
        </p>
        <div className="relative mt-10 grid grid-cols-2 gap-3 overflow-hidden rounded-2xl md:grid-cols-3">
          <div className="relative col-span-2 aspect-[21/14] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[14rem]">
            <Image
              src="https://placehold.co/1200x800/fce4ec/28171a/png?text=bakery%20warmth"
              alt="bakery workspace placeholder until owner supplies photos"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square md:min-h-[12rem]">
            <Image
              src="https://placehold.co/600x600/fff0f1/e91e63/png?text=frosting"
              alt="frosting detail placeholder"
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square md:col-start-3 md:min-h-[12rem]">
            <Image
              src="https://placehold.co/600x600/ffdcbc/900038/png?text=team"
              alt="team collage placeholder"
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
              className="rounded-2xl bg-[color-mix(in_srgb,var(--color-cream-soft)_70%,white)] p-6"
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

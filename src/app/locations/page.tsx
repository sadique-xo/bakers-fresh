import type { Metadata } from "next";
import Link from "next/link";

import type { SiteOutlet } from "@/lib/catalog";
import { getSiteOutlets } from "@/lib/queries/public-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "locations",
  description:
    "visit baker's fresh at lalpur, bit mesra, neori, and bariatu road. hours, maps, and phone.",
  pathname: "/locations",
});

const mapsBase = "https://www.google.com/maps/search/?api=1&query=";

function mapIframeSrc(o: SiteOutlet) {
  const embed = o.googleMapsEmbed?.trim();
  if (embed?.startsWith("http")) return embed;
  return `https://maps.google.com/maps?q=${encodeURIComponent(o.shortAddress)}&output=embed`;
}

export default async function LocationsPage() {
  const outlets = await getSiteOutlets();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="font-serif text-4xl font-semibold text-[var(--color-ink)]">
        visit our outlets
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-lg text-[var(--color-ink-soft)] leading-relaxed">
        four bakeries across ranchi, same warmth at the counter and the same cake
        line up.
      </p>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {outlets.map((o) => (
          <article
            key={o.slug}
            className="overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-[var(--shadow-ambient-pink)]"
          >
            <div className="aspect-[21/10] bg-[var(--color-cream-soft)]">
              <iframe
                title={`map ${o.name}`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapIframeSrc(o)}
              />
            </div>
            <div className="p-6">
              <h2 className="font-serif text-2xl font-semibold capitalize text-[var(--color-ink)]">
                {o.name}
              </h2>
              <p className="mt-2 font-sans text-[var(--color-ink-soft)] leading-relaxed">
                {o.shortAddress}
              </p>
              <p className="mt-2 font-sans text-sm text-[var(--color-ink-subtle)]">
                {o.hoursNote ?? "hours vary on festivals, call ahead if unsure"}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href={`tel:${o.phone.replace(/\s/g, "")}`}
                  className="inline-flex rounded-full bg-[var(--color-brand-pink)] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white"
                >
                  call outlet
                </a>
                <Link
                  href={`${mapsBase}${encodeURIComponent(o.shortAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[var(--color-border-soft)] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-pink-deep)]"
                >
                  open in maps
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

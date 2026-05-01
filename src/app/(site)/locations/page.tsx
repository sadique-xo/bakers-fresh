import type { Metadata } from "next";
import Link from "next/link";

import type { SiteOutlet } from "@/lib/catalog";
import { getSiteOutlets } from "@/lib/queries/public-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "locations",
  description:
    "visit baker's fresh at lalpur and neori. hours, maps, and phone.",
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
      <h1 className="font-serif text-[1.875rem] font-semibold leading-tight text-[var(--color-ink)] md:text-4xl">
        visit our outlets
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-[var(--color-ink-soft)] md:text-lg">
        two counters in ranchi, same warmth at the counter and the same cake line
        up.
      </p>
      {outlets.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]/40 px-6 py-10 text-center md:px-12">
          <p className="font-sans text-[var(--color-ink-soft)] leading-relaxed">
            outlet details are syncing. call us for directions, or check back soon.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-[var(--color-brand-pink)] px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white shadow-[var(--shadow-ambient-pink)]"
          >
            contact &amp; phones
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {outlets.map((o) => (
            <article
              key={o.slug}
              className="overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-[var(--shadow-ambient-pink)]"
            >
              {/* Padding-bottom preserves 21:10 on all widths; h-full iframe inside aspect-ratio breaks on mobile Safari */}
              <div className="relative h-0 w-full overflow-hidden bg-[var(--color-cream-soft)] pb-[calc(100%*10/21)]">
                <iframe
                  title={`map ${o.name}`}
                  className="absolute inset-0 block size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapIframeSrc(o)}
                />
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="font-serif text-xl font-semibold capitalize text-[var(--color-ink)] sm:text-2xl">
                  {o.name}
                </h2>
                <p className="mt-2 font-sans text-[var(--color-ink-soft)] leading-relaxed">
                  {o.shortAddress}
                </p>
                <p className="mt-2 font-sans text-sm text-[var(--color-ink-subtle)]">
                  {o.hoursNote ?? "hours vary on festivals, call ahead if unsure"}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  <a
                    href={`tel:${o.phone.replace(/\s/g, "")}`}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-brand-pink)] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white sm:w-auto sm:min-h-0"
                  >
                    call outlet
                  </a>
                  <Link
                    href={`${mapsBase}${encodeURIComponent(o.shortAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--color-border-soft)] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-pink-deep)] sm:w-auto sm:min-h-0"
                  >
                    open in maps
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

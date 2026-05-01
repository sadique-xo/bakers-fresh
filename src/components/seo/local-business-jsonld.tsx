import { getSiteUrl, siteName } from "@/lib/seo";
import { sitePhoneDisplay, sitePhoneLalpurDisplay } from "@/lib/site";

function e164Tel(display: string): string {
  const d = display.replace(/\D/g, "");
  if (d.length === 10) return `+91${d}`;
  if (d.startsWith("91") && d.length >= 12) return `+${d.slice(0, 12)}`;
  return `+${d}`;
}

/** JSON-LD for main retail / brand entity (ranchi bakery). Not on admin routes — include from site layout only. */
export function LocalBusinessJsonLd() {
  const url = getSiteUrl();
  const base = url.replace(/\/$/, "");
  const phones = Array.from(new Set([e164Tel(sitePhoneDisplay), e164Tel(sitePhoneLalpurDisplay)]));

  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${base}/#bakery`,
    name: `Baker's Fresh`,
    alternateName: siteName,
    url: base,
    telephone: phones,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ranchi",
      addressRegion: "Jharkhand",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
    servesCuisine: "bakery desserts",
    areaServed: { "@type": "City", name: "Ranchi" },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

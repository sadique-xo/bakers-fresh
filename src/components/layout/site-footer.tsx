import Image from "next/image";
import Link from "next/link";

import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Phone,
  MapPinned,
  ExternalLink,
} from "lucide-react";

import type { SiteOutlet } from "@/lib/catalog";
import {
  formatIndiaPhone,
  sitePhoneDisplay,
  sitePhoneTel,
  siteWhatsappUrl,
} from "@/lib/site";

const quickLinks = [
  { href: "/", label: "home" },
  { href: "/cakes", label: "our cakes" },
  { href: "/order", label: "order custom cake" },
  { href: "/locations", label: "locations" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

type FooterProps = {
  outlets: SiteOutlet[];
};

export function SiteFooter({ outlets }: FooterProps) {
  return (
    <footer className="border-t-4 border-double border-[var(--color-border-soft)] bg-stone-50 pt-14 pb-8 text-[var(--color-ink-soft)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="inline-flex">
            <Image
              src="/bakers-fresh-pink-logo.webp"
              alt="baker&apos;s fresh"
              width={360}
              height={100}
              className="h-14 w-auto sm:h-16 md:h-[4.25rem]"
            />
          </Link>
          <p className="font-sans text-sm leading-relaxed">
            custom cakes and bakes across ranchi since day one we&apos;ve cared
            about fresh ingredients and a warm counter chat.
          </p>
          <a
            href={siteWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand-pink)] hover:text-[var(--color-brand-pink)]"
          >
            <span className="inline-flex rounded-full bg-[#25D366]/15 p-1.5 text-[#128C7E]">
              <MessageCircle className="size-4" aria-hidden />
            </span>
            whatsapp us
          </a>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-lg text-[var(--color-ink)]">
            quick links
          </h2>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-[var(--color-brand-pink)] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-lg text-[var(--color-ink)]">
            outlets
          </h2>
          <ul className="space-y-4 text-sm">
            {outlets.map((o) => (
              <li key={o.slug} className="flex min-w-0 gap-2">
                <MapPinned className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-pink)]" aria-hidden />
                <span className="min-w-0">
                  <span className="font-medium text-[var(--color-ink)]">
                    {o.name}
                  </span>
                  <br />
                  {o.shortAddress}
                  <br />
                  <a
                    href={`tel:${o.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1 text-[var(--color-brand-pink)] hover:underline"
                  >
                    <Phone className="size-3.5" aria-hidden />
                    {formatIndiaPhone(o.phone)}
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-lg text-[var(--color-ink)]">
            follow us
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/bakers.fresh/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-white hover:border-[var(--color-brand-pink)] hover:text-[var(--color-brand-pink)] transition-colors"
              aria-label="instagram"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="https://www.facebook.com/bakerybakersfresh/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-white hover:border-[var(--color-brand-pink)] hover:text-[var(--color-brand-pink)] transition-colors"
              aria-label="facebook"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href="https://www.youtube.com/@BakersFresh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-white hover:border-[var(--color-brand-pink)] hover:text-[var(--color-brand-pink)] transition-colors"
              aria-label="youtube"
            >
              <Youtube className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-[var(--color-border-soft)] px-5 pt-8 text-center md:px-8">
        <p className="text-xs leading-relaxed text-[var(--color-ink-subtle)]">
          fssai 21121002000126 · 21121017000404
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-subtle)]">
          <a
            href={sitePhoneTel}
            className="inline-flex items-center justify-center gap-1 font-medium text-[var(--color-brand-pink)] underline-offset-4 hover:underline"
          >
            <Phone className="size-3.5" aria-hidden />
            {sitePhoneDisplay}
          </a>
        </p>
        <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-subtle)]">
          © {new Date().getFullYear()} baker&apos;s fresh. handcrafted in
          ranchi.
        </p>
        <p className="mt-2 font-sans text-sm text-[var(--color-ink-subtle)]">
          <a
            href="https://sadique.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-[var(--color-brand-pink)] underline-offset-4 hover:underline"
          >
            built by sadique.co
            <ExternalLink className="size-3 opacity-70" aria-hidden />
          </a>
        </p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { getSiteOutlets } from "@/lib/queries/public-content";
import {
  sitePhoneDisplay,
  sitePhoneTel,
  sitePhoneLalpurDisplay,
  sitePhoneLalpurTel,
  siteWhatsappUrl,
} from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "contact",
  description:
    "call, whatsapp, or message baker's fresh in ranchi. lalpur, neori, one friendly team.",
  pathname: "/contact",
});

export default async function ContactPage() {
  const outlets = await getSiteOutlets();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:grid md:grid-cols-2 md:gap-12 md:px-8 md:py-16">
      <section>
        <h1 className="font-serif text-[1.875rem] font-semibold leading-tight text-[var(--color-ink)] md:text-4xl">
          say hello
        </h1>
        <p className="mt-4 font-sans text-base text-[var(--color-ink-soft)] leading-relaxed md:text-lg">
          call for same day possibilities, whatsapp references, or email slower
          questions. we read everything even if replies take an evening shift.
        </p>
        <ul className="mt-10 space-y-6 font-sans">
          <li>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
              neori outlet &amp; custom orders
            </p>
            <a
              href={sitePhoneTel}
              className="mt-1 inline-flex max-w-full min-w-0 items-start gap-3 text-[var(--color-brand-pink)] hover:underline"
            >
              <Phone className="mt-0.5 size-6 shrink-0" aria-hidden />
              <span className="min-w-0 break-words text-base font-semibold text-[var(--color-ink)] sm:text-lg">
                {sitePhoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
              lalpur chowk (main retail counter)
            </p>
            <a
              href={sitePhoneLalpurTel()}
              className="mt-1 inline-flex max-w-full min-w-0 items-start gap-3 text-[var(--color-brand-pink)] hover:underline"
            >
              <Phone className="mt-0.5 size-6 shrink-0" aria-hidden />
              <span className="min-w-0 break-words text-base font-semibold text-[var(--color-ink)] sm:text-lg">
                {sitePhoneLalpurDisplay}
              </span>
            </a>
          </li>
          <li>
            <a
              href={siteWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[#128C7E] hover:underline"
            >
              <MessageCircle className="size-6 shrink-0" aria-hidden />
              <span className="text-lg font-semibold text-[var(--color-ink)]">
                chat on whatsapp
              </span>
            </a>
          </li>
          <li className="text-[var(--color-ink-soft)]">
            email (coming soon) — for now whatsapp photos work great.
          </li>
        </ul>
      </section>

      <section className="mt-14 md:mt-0">
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
          tiny contact form later
        </h2>
        <p className="mt-3 font-sans text-[var(--color-ink-soft)]">
          the full jot form will land with admin notifications in a later sprint.
          order flow already captures the details we need.
        </p>
        <Link
          href="/order"
          className="mt-10 inline-flex min-h-11 w-full max-w-xs items-center justify-center rounded-full bg-[var(--color-brand-pink)] px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white shadow-[var(--shadow-ambient-pink-lg)] sm:w-auto sm:max-w-none sm:min-h-0 sm:px-8"
        >
          jump to custom order
        </Link>

        <div className="mt-14 rounded-2xl border border-[var(--color-border-soft)] bg-white p-5 shadow-sm sm:p-6">
          <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
            quick outlets
          </h3>
          <ul className="mt-4 space-y-3 font-sans text-sm text-[var(--color-ink-soft)]">
            {outlets.map((o) => (
              <li key={o.slug}>
                <span className="font-medium capitalize text-[var(--color-ink)]">
                  {o.name}
                </span>
                {" — "}
                {o.shortAddress}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="col-span-full mx-[-0.25rem] mt-16 rounded-3xl bg-[#25d366]/15 px-4 py-8 text-center sm:mx-0 sm:px-6 sm:py-10">
        <p className="font-serif text-xl leading-snug text-[var(--color-ink)] sm:text-2xl">
          prefer whatsapp typing over forms?
        </p>
        <a
          href={siteWhatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 w-full max-w-[min(100%,20rem)] items-center justify-center rounded-full bg-[#25d366] px-6 py-3.5 font-sans text-sm font-bold text-white hover:brightness-105 sm:w-auto sm:max-w-none sm:px-10"
        >
          chat with us on whatsapp
        </a>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { getSiteOutlets } from "@/lib/queries/public-content";
import { sitePhoneDisplay, sitePhoneTel, siteWhatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "contact",
  description: "call, whatsapp, or write to baker's fresh in ranchi.",
};

export default async function ContactPage() {
  const outlets = await getSiteOutlets();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:grid md:grid-cols-2 md:gap-12 md:px-8 md:py-16">
      <section>
        <h1 className="font-serif text-4xl font-semibold text-[var(--color-ink)]">
          say hello
        </h1>
        <p className="mt-4 font-sans text-lg text-[var(--color-ink-soft)] leading-relaxed">
          call for same day possibilities, whatsapp references, or email slower
          questions. we read everything even if replies take an evening shift.
        </p>
        <ul className="mt-10 space-y-6 font-sans">
          <li>
            <a
              href={sitePhoneTel}
              className="inline-flex items-center gap-3 text-[var(--color-brand-pink)] hover:underline"
            >
              <Phone className="size-6 shrink-0" aria-hidden />
              <span className="text-lg font-semibold text-[var(--color-ink)]">
                {sitePhoneDisplay}
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
          className="mt-10 inline-flex rounded-full bg-[var(--color-brand-pink)] px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white shadow-[var(--shadow-ambient-pink-lg)]"
        >
          jump to custom order
        </Link>

        <div className="mt-14 rounded-2xl border border-[var(--color-border-soft)] bg-white p-6 shadow-sm">
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

      <div className="col-span-full mt-16 rounded-3xl bg-[#25d366]/15 px-6 py-10 text-center">
        <p className="font-serif text-2xl text-[var(--color-ink)]">
          prefer whatsapp typing over forms?
        </p>
        <a
          href={siteWhatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#25d366] px-10 py-3.5 font-sans text-sm font-bold text-white hover:brightness-105"
        >
          chat with us on whatsapp
        </a>
      </div>
    </div>
  );
}

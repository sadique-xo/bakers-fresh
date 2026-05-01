"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  BF_ORDER_SUCCESS_KEY,
  type OrderSuccessPayload,
} from "@/lib/orders/success-storage";
import { siteWhatsappUrl } from "@/lib/site";

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 41 + 7) % 94}%`,
        delay: (i % 10) * 0.06,
        hue:
          i % 3 === 0
            ? "var(--color-brand-pink)"
            : i % 3 === 1
              ? "var(--color-gold)"
              : "var(--color-mint)",
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 size-2 rounded-[2px] opacity-90"
          style={{ left: p.left, backgroundColor: p.hue }}
          initial={{ y: -24, opacity: 1, rotate: 0 }}
          animate={{ y: "120%", opacity: 0, rotate: 320 }}
          transition={{ duration: 2.6, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function slotWords(slot: string) {
  if (slot === "morning") return "morning (10am to 12pm)";
  if (slot === "afternoon") return "afternoon (12pm to 4pm)";
  if (slot === "evening") return "evening (4pm to 8pm)";
  return slot;
}

export function OrderSuccessContent() {
  const [data, setData] = useState<OrderSuccessPayload | "missing" | "loading">("loading");

  useEffect(() => {
    queueMicrotask(() => {
      const raw = sessionStorage.getItem(BF_ORDER_SUCCESS_KEY);
      if (!raw) {
        setData("missing");
        return;
      }
      try {
        setData(JSON.parse(raw) as OrderSuccessPayload);
        sessionStorage.removeItem(BF_ORDER_SUCCESS_KEY);
      } catch {
        setData("missing");
      }
    });
  }, []);

  if (data === "loading") {
    return (
      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-12 text-center font-sans text-[var(--color-ink-soft)] shadow-[var(--shadow-ambient-pink)]">
        loading…
      </div>
    );
  }

  if (data === "missing") {
    return (
      <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-8 shadow-[var(--shadow-ambient-pink)]">
        <p className="font-sans text-[var(--color-ink-soft)] leading-relaxed">
          if you refreshed or landed here directly, we don&apos;t have your order id in this tab anymore.
          no stress, call us or whatsapp and we&apos;ll find you in the queue.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex justify-center rounded-full border border-[var(--color-border-soft)] bg-[var(--color-cream-soft)] px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
            back to home
          </Link>
          <a
            href={siteWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center rounded-full bg-[#25d366] px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white">
            chat on whatsapp
          </a>
        </div>
      </div>
    );
  }

  const waText = `Hi Baker's Fresh, I just placed a custom cake order ${data.orderNumber}. Please confirm when you can.`;
  const s = data.summary;

  return (
    <div className="relative">
      <ConfettiBurst />
      <div className="relative rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-8 shadow-[var(--shadow-ambient-pink)] md:p-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="font-[family-name:var(--font-handwritten)] text-2xl text-[var(--color-brand-pink-deep)]">
            thank you!
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
            your request is in.
          </h1>
          <p className="mt-6 font-mono text-2xl font-bold tracking-tight text-[var(--color-brand-pink)] md:text-3xl">
            {data.orderNumber}
          </p>
          <p className="mt-4 font-sans text-[var(--color-ink-soft)] leading-relaxed">
            we&apos;ll call you on{" "}
            <span className="font-semibold text-[var(--color-ink)]">{data.customerPhone}</span> within two hours to
            confirm flavours, price, and pickup or delivery.
          </p>

          {s ? (
            <div className="mt-8 space-y-3 rounded-2xl bg-[var(--color-cream-soft)] p-6 font-sans text-sm text-[var(--color-ink-soft)]">
              <p>
                <span className="font-semibold text-[var(--color-ink)]">{s.customerName}</span>
                {", "}
                {s.cakeType}, {s.cakeFlavor}, {s.cakeSize}
                {s.isEggless ? ", eggless" : ""}
              </p>
              {s.messageOnCake ? (
                <p>
                  <span className="text-[var(--color-ink)]">message:</span> {s.messageOnCake}
                </p>
              ) : null}
              <p>
                <span className="text-[var(--color-ink)]">when:</span> {s.deliveryDate}, {slotWords(s.deliveryTimeSlot)}
              </p>
              <p>
                <span className="text-[var(--color-ink)]">how:</span>{" "}
                {s.deliveryMethod === "delivery"
                  ? `delivery${s.deliveryAddress ? `, ${s.deliveryAddress}` : ""}`
                  : "pickup from outlet"}
              </p>
              {s.specialInstructions ? (
                <p>
                  <span className="text-[var(--color-ink)]">notes:</span> {s.specialInstructions}
                </p>
              ) : null}
              {s.referenceCount > 0 ? (
                <p className="text-[var(--color-ink-subtle)]">
                  {s.referenceCount} reference image{s.referenceCount > 1 ? "s" : ""} uploaded
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={siteWhatsappUrl(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full bg-[#25d366] px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white shadow-sm hover:brightness-105">
              share on whatsapp
            </a>
            <Link
              href="/cakes"
              className="inline-flex justify-center rounded-full bg-[var(--color-brand-pink)] px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white shadow-[var(--shadow-ambient-pink-lg)]">
              browse more cakes
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center rounded-full border border-[var(--color-border-soft)] bg-white px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
              back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

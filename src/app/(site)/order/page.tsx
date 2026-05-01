import type { Metadata } from "next";

import { OrderForm } from "@/components/order/order-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "order custom cake",
  description:
    "place a custom cake order online. upload references, pick date and slot, we call you within two hours to confirm.",
  pathname: "/order",
});

type Props = {
  searchParams: Promise<{ cake?: string }>;
};

export default async function OrderPage({ searchParams }: Props) {
  const { cake } = await searchParams;
  const initialCakeSlug = cake?.trim() || null;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-14 pt-10 sm:px-5 md:px-8 md:pb-16 md:pt-16">
      <h1 className="font-serif text-[1.75rem] font-semibold leading-tight text-[var(--color-ink)] md:text-4xl">
        order a custom cake
      </h1>
      <p className="mt-4 font-sans text-[var(--color-ink-soft)] leading-relaxed">
        one simple form, no payment online. we&apos;ll ring you on the number below within two hours to
        confirm everything.
      </p>

      <OrderForm initialCakeSlug={initialCakeSlug} className="mt-12" />
    </div>
  );
}

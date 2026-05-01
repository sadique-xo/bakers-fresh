import type { Metadata } from "next";

import { OrderForm } from "@/components/order/order-form";

export const metadata: Metadata = {
  title: "order custom cake",
  description:
    "place a custom cake order. we upload references and confirm by phone within two hours.",
};

type Props = {
  searchParams: Promise<{ cake?: string }>;
};

export default async function OrderPage({ searchParams }: Props) {
  const { cake } = await searchParams;
  const initialCakeSlug = cake?.trim() || null;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="font-serif text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
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

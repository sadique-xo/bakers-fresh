import type { Metadata } from "next";

import { OrderSuccessContent } from "@/components/order/order-success-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "order received",
  description:
    "thank you for your custom cake order at baker's fresh. we will call you soon to confirm.",
  pathname: "/order/success",
  index: false,
});

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 md:px-8 md:py-16">
      <OrderSuccessContent />
    </div>
  );
}

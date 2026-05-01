import type { Metadata } from "next";

import { OrderSuccessContent } from "@/components/order/order-success-content";

export const metadata: Metadata = {
  title: "order received",
  description: "thank you for your custom cake order at baker's fresh.",
};

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 md:px-8 md:py-16">
      <OrderSuccessContent />
    </div>
  );
}

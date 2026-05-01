import type { Metadata } from "next";

import { OrderSuccessContent } from "@/components/order/order-success-content";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return buildPageMetadata({
    title: "order received",
    description:
      "thank you for your custom cake order at baker's fresh. we will call you soon to confirm.",
    pathname: `/order/success/${id}`,
    index: false,
  });
}

export default async function OrderSuccessDetailPage(props: PageProps) {
  const { id } = await props.params;
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-5 md:px-8 md:py-16">
      <OrderSuccessContent expectedOrderId={id} />
    </div>
  );
}

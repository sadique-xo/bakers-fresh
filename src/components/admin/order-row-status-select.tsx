"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateOrderStatus } from "@/lib/admin/order-mutations";
import { Constants } from "@/lib/database.types";
import type { Database } from "@/lib/database.types";
import type { Tables } from "@/lib/database.types";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type OrderRow = Tables<"orders">;

const STATUSES = Constants.public.Enums.order_status;

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export function OrderRowStatusSelect({ order }: { order: OrderRow }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const current = order.status ?? "pending";

  return (
    <Select
      value={current}
      disabled={busy}
      onValueChange={(value) => {
        const next = value as OrderStatus;
        if (next === current) return;
        setBusy(true);
        void (async () => {
          try {
            await updateOrderStatus(order.id, next);
            toast.success(`${order.order_number} → ${LABELS[next]}`);
            router.refresh();
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not update status");
          } finally {
            setBusy(false);
          }
        })();
      }}
    >
      <SelectTrigger
        size="sm"
        className="h-8 w-full min-w-[9.5rem] max-w-[11rem] border-zinc-200 bg-white text-left text-zinc-900 shadow-sm"
        aria-label={`Status for order ${order.order_number}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[400] bg-white">
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

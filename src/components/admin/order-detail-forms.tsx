"use client";

import { formatDistanceToNow } from "date-fns";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Constants } from "@/lib/database.types";
import type { Database } from "@/lib/database.types";
import type { Tables } from "@/lib/database.types";
import { updateOrderNotes, updateOrderPricing, updateOrderStatus } from "@/lib/admin/order-mutations";

import { StatusBadge } from "@/components/admin/status-badge";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type OrderRow = Tables<"orders">;

const STATUSES = Constants.public.Enums.order_status;

export function OrderDetailActions({ order }: { order: OrderRow }) {
  const [pending, startTransition] = useTransition();
  const current = order.status ?? "pending";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">Order status</h3>
      <p className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
        Current: <StatusBadge status={current} />
      </p>
      <form
        className="mt-4 flex flex-col gap-3"
        action={(fd) =>
          startTransition(async () => {
            const next = fd.get("status") as OrderStatus;
            try {
              await updateOrderStatus(order.id, next);
              toast.success("Status updated");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Could not update status");
            }
          })
        }
      >
        <select
          name="status"
          defaultValue={current}
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {humanStatus(s)}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Update status"}
        </Button>
      </form>
    </div>
  );
}

export function OrderPricingForm({ order }: { order: OrderRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">Pricing after call</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Use whole rupee amounts. Leave blank if not set yet.
      </p>
      <form
        className="mt-4 flex flex-col gap-3"
        action={(fd) =>
          startTransition(async () => {
            try {
              await updateOrderPricing(
                order.id,
                fd.get("estimated_price_inr"),
                fd.get("final_price_inr"),
              );
              toast.success("Pricing saved");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Could not save pricing");
            }
          })
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="estimated">Quoted price (₹)</Label>
          <Input
            id="estimated"
            name="estimated_price_inr"
            type="number"
            min={0}
            step={1}
            defaultValue={order.estimated_price_inr ?? ""}
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="final">Final collected (₹)</Label>
          <Input
            id="final"
            name="final_price_inr"
            type="number"
            min={0}
            step={1}
            defaultValue={order.final_price_inr ?? ""}
            className="bg-white"
          />
        </div>
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "Saving…" : "Save pricing"}
        </Button>
      </form>
    </div>
  );
}

export function OrderNotesField({ order }: { order: OrderRow }) {
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const initial = order.admin_notes ?? "";
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [chars, setChars] = useState(initial.length);

  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function saveNotes(text: string) {
    startTransition(async () => {
      try {
        await updateOrderNotes(order.id, text);
        setSaved(true);
        toast.success("Notes saved");
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Notes could not save");
      }
    });
  }

  function onBlur() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    blurTimer.current = setTimeout(() => saveNotes(taRef.current?.value ?? ""), 500);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">Internal notes</h3>
        {saved ? <span className="text-[11px] font-medium text-emerald-700">Saved</span> : null}
        {pending ? <span className="text-[11px] text-zinc-400">Saving…</span> : null}
      </div>
      <textarea
        ref={taRef}
        className="mt-3 min-h-[120px] w-full rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-300"
        maxLength={1000}
        defaultValue={initial}
        onInput={(e) => setChars(e.currentTarget.value.length)}
        onBlur={onBlur}
        placeholder="Private notes visible only inside admin…"
        key={`${order.id}-${order.updated_at ?? ""}`}
      />
      <p className="mt-2 text-[11px] text-zinc-400">{chars}/1000</p>
    </div>
  );
}

export function RecentActivityTimeline({ order }: { order: OrderRow }) {
  const rows = [
    { label: "Created", at: order.created_at },
    { label: "Confirmed", at: order.confirmed_at },
    { label: "Completed", at: order.completed_at },
    { label: "Last updated", at: order.updated_at },
  ].filter((r): r is { label: string; at: string } => Boolean(r.at));

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">Activity</h3>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map(({ label, at }) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</dt>
            <dd className="mt-0.5 tabular-nums text-zinc-700" suppressHydrationWarning>
              {new Date(at).toLocaleString("en-IN", { hour12: true })}{" "}
              <span className="text-zinc-400">
                (
                {formatDistanceToNow(new Date(at), { addSuffix: true })})
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function humanStatus(s: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };
  return map[s];
}

export function CopyAddressButton({ address }: { address: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await navigator.clipboard.writeText(address);
            toast.success("Address copied");
          } catch {
            toast.error("Could not copy");
          }
        })
      }
    >
      Copy address
    </Button>
  );
}

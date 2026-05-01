"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/lib/database.types";

type StatusFilter = Database["public"]["Enums"]["order_status"] | "all";

const STATUSES: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "rejected", label: "Rejected" },
];

const RANGES = [
  { id: "all", label: "All time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
] as const;

type RangeId = (typeof RANGES)[number]["id"];

function buildOrdersListQuery(status: StatusFilter, range: RangeId, q: string) {
  const u = new URLSearchParams();
  if (status !== "all") u.set("status", status);
  if (range !== "all") u.set("range", range);
  if (q) u.set("q", q);
  const qs = u.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

type Props = {
  status: StatusFilter;
  range: RangeId;
  q: string;
};

export function OrdersToolbar(props: Props) {
  const { status, range, q } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
      <div className="flex w-full flex-1 flex-col gap-4 min-[560px]:max-w-xl min-[560px]:flex-row min-[560px]:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Status</p>
          <Select
            value={status}
            onValueChange={(val) => {
              const next = val as StatusFilter;
              router.push(buildOrdersListQuery(next, range, q));
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-10 w-full border-zinc-200 bg-white text-zinc-900 shadow-sm md:min-w-[11rem]"
              aria-label="Filter orders by status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[400] bg-white">
              {STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Date range</p>
          <Select
            value={range}
            onValueChange={(val) => {
              const rangeId = val as RangeId;
              router.push(buildOrdersListQuery(status, rangeId, q));
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-10 w-full border-zinc-200 bg-white text-zinc-900 shadow-sm md:min-w-[11rem]"
              aria-label="Filter orders by date range"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[400] bg-white">
              {RANGES.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <form className="w-full lg:max-w-xs" action="/admin/orders" method="get">
        {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
        {range !== "all" ? <input type="hidden" name="range" value={range} /> : null}
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <div className="flex gap-2">
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Order # or phone"
            className="h-10 w-full flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

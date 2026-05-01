import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { OrdersToolbar } from "@/components/admin/orders-toolbar";
import { parseCreatedAfter } from "@/lib/admin/order-filters";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Database } from "@/lib/database.types";

export const ORDER_PAGE_SIZE = 20;

type Search = {
  status?: string;
  range?: string;
  q?: string;
  page?: string;
};

function parseStatus(raw: string | undefined): Database["public"]["Enums"]["order_status"] | "all" {
  const allowed: Database["public"]["Enums"]["order_status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "completed",
    "cancelled",
    "rejected",
  ];
  if (raw && raw !== "all" && allowed.includes(raw as Database["public"]["Enums"]["order_status"])) {
    return raw as Database["public"]["Enums"]["order_status"];
  }
  return "all";
}

function parseRange(raw: string | undefined): "all" | "today" | "week" | "month" {
  if (raw === "today" || raw === "week" || raw === "month") return raw;
  return "all";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const status = parseStatus(sp.status);
  const range = parseRange(sp.range);
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const pageUncapped = Math.max(1, Math.floor(Number(sp.page) || 1));

  const { supabase } = await requireAdmin();

  let countQb = supabase.from("orders").select("id", { count: "exact", head: true });
  if (status !== "all") countQb = countQb.eq("status", status);
  const createdAfter = parseCreatedAfter(range);
  if (createdAfter) countQb = countQb.gte("created_at", createdAfter);
  if (q.length >= 2) {
    const safe = q.replace(/[%_*]/g, "");
    countQb = countQb.or(`order_number.ilike.%${safe}%,customer_phone.ilike.%${safe}%`);
  }

  const { count, error: countError } = await countQb;
  if (countError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Could not load orders: {countError.message}
      </div>
    );
  }

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / ORDER_PAGE_SIZE));
  const page = Math.min(pageUncapped, pageCount);

  let dataQb = supabase.from("orders").select("*");
  if (status !== "all") dataQb = dataQb.eq("status", status);
  if (createdAfter) dataQb = dataQb.gte("created_at", createdAfter);
  if (q.length >= 2) {
    const safe = q.replace(/[%_*]/g, "");
    dataQb = dataQb.or(`order_number.ilike.%${safe}%,customer_phone.ilike.%${safe}%`);
  }

  const from = (page - 1) * ORDER_PAGE_SIZE;
  const to = from + ORDER_PAGE_SIZE - 1;

  const { data: orders, error } = await dataQb.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Could not load orders: {error.message}
      </div>
    );
  }

  const paginationSp: Record<string, string> = {};
  if (status !== "all") paginationSp.status = status;
  if (range !== "all") paginationSp.range = range;
  if (q) paginationSp.q = q;
  if (page > 1) paginationSp.page = String(page);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Orders</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Incoming custom cake orders. Filter by status, date, or phone.
        </p>
      </div>

      <OrdersToolbar status={status} range={range} q={q} />

      <AdminOrdersTable
        orders={orders ?? []}
        pagination={{
          page,
          pageCount,
          total,
          searchParams: paginationSp,
        }}
      />
    </div>
  );
}

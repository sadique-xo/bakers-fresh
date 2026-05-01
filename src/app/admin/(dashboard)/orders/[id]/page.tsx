import Link from "next/link";
import { notFound } from "next/navigation";

import { ReferenceGallery } from "@/components/admin/reference-gallery";
import {
  CopyAddressButton,
  OrderDetailActions,
  OrderNotesField,
  OrderPricingForm,
  RecentActivityTimeline,
} from "@/components/admin/order-detail-forms";
import { StatusBadge } from "@/components/admin/status-badge";
import { requireAdmin } from "@/lib/auth/require-admin";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from "@/lib/database.types";

type PageProps = { params: Promise<{ id: string }> };

async function resolveSignedUrls(
  supabase: SupabaseClient<Database>,
  pathsOrUrls: string[] | null | undefined,
): Promise<string[]> {
  const items = pathsOrUrls ?? [];
  const out: string[] = [];

  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      out.push(trimmed);
      continue;
    }
    const { data, error } = await supabase.storage
      .from("order-references")
      .createSignedUrl(trimmed, 3600);
    if (!error && data?.signedUrl) out.push(data.signedUrl);
  }

  return out;
}

function formatSlot(slot: string | null | undefined) {
  const s = slot?.trim();
  if (!s) return "—";
  if (s === "10-12") return "Morning (10–12)";
  if (s === "12-16") return "Afternoon (12–4)";
  if (s === "16-20") return "Evening (4–8)";
  return s;
}

function waDigits(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  if (d.startsWith("91") && d.length >= 12) return d.slice(0, 12);
  return d || "917004502102";
}

export default async function AdminOrderDetailPage(props: PageProps) {
  const { id } = await props.params;
  const { supabase } = await requireAdmin();

  const { data: order, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();

  if (error || !order) notFound();

  const row = order as Tables<"orders">;
  const signedImages = await resolveSignedUrls(supabase, row.reference_image_urls);

  const waPrefill = `Hi Baker's Fresh, about order ${row.order_number} —`;
  const waHref =
    `https://wa.me/${waDigits(row.customer_phone)}` + `?text=${encodeURIComponent(waPrefill)}`;

  const mapsQuery =
    row.delivery_method === "delivery" && row.delivery_address
      ? row.delivery_address
      : null;
  const mapsHref = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:underline"
          >
            ← Back to orders
          </Link>
          <h1 className="mt-3 font-mono text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
            {row.order_number}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={row.status} />
            {row.created_at ? (
              <span className="text-xs text-zinc-500" suppressHydrationWarning>
                Created {new Date(row.created_at).toLocaleString("en-IN", { hour12: true })}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Customer</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-lg font-semibold text-zinc-900">{row.customer_name}</p>
              <p>
                <a
                  href={`tel:${row.customer_phone.replace(/\s/g, "")}`}
                  className="font-medium text-blue-700 hover:underline"
                >
                  {row.customer_phone}
                </a>
              </p>
              {row.customer_email ? (
                <p>
                  <a href={`mailto:${row.customer_email}`} className="text-blue-700 hover:underline">
                    {row.customer_email}
                  </a>
                </p>
              ) : (
                <p className="text-zinc-400">No email on file.</p>
              )}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                WhatsApp customer
              </a>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Cake</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Type</dt>
                <dd className="mt-1 text-zinc-800">{row.cake_type ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Size</dt>
                <dd className="mt-1 text-zinc-800">{row.cake_size ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Flavor</dt>
                <dd className="mt-1 text-zinc-800">{row.cake_flavor ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Eggless</dt>
                <dd className="mt-1 text-zinc-800">{row.is_eggless ? "Yes" : "No"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Cake message
                </dt>
                <dd className="mt-1 text-zinc-800">{row.message_on_cake?.trim() || "—"}</dd>
              </div>
              {row.special_instructions?.trim() ? (
                <div className="sm:col-span-2 rounded-lg bg-zinc-50 p-4 text-zinc-800 ring-1 ring-zinc-100">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Special instructions
                  </dt>
                  <dd className="mt-2 whitespace-pre-wrap">{row.special_instructions}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Reference images</h2>
            <div className="mt-4">
              <ReferenceGallery urls={signedImages} />
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Delivery</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Method</dt>
                <dd className="mt-1 capitalize text-zinc-800">{row.delivery_method}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Date</dt>
                <dd className="mt-1 tabular-nums text-zinc-800">{row.delivery_date}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Slot</dt>
                <dd className="mt-1 text-zinc-800">{formatSlot(row.delivery_time_slot)}</dd>
              </div>
              {row.delivery_method === "delivery" && row.delivery_address ? (
                <div className="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-100">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Address</dt>
                  <dd className="mt-2 whitespace-pre-wrap text-zinc-900">{row.delivery_address}</dd>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mapsHref ? (
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
                      >
                        Open in Maps
                      </a>
                    ) : null}
                    <CopyAddressButton address={row.delivery_address} />
                  </div>
                </div>
              ) : null}
            </dl>
          </section>

          <RecentActivityTimeline order={row} />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <OrderDetailActions order={row} />
          <OrderPricingForm order={row} />
          <OrderNotesField order={row} />
        </aside>
      </div>
    </div>
  );
}

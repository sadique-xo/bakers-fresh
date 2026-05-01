"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";

import type { Database, TablesUpdate } from "@/lib/database.types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

function emptyToNull(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN;
  if (Number.isNaN(n)) return null;
  return n;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { supabase } = await requireAdmin();

  const updates: TablesUpdate<"orders"> = { status };
  if (status === "confirmed") updates.confirmed_at = new Date().toISOString();
  if (status === "completed") updates.completed_at = new Date().toISOString();

  const { error } = await supabase.from("orders").update(updates).eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function updateOrderPricing(orderId: string, estimated: unknown, finalInr: unknown) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("orders")
    .update({
      estimated_price_inr: emptyToNull(estimated),
      final_price_inr: emptyToNull(finalInr),
    })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function updateOrderNotes(orderId: string, notes: string) {
  const { supabase } = await requireAdmin();
  const cleaned = notes.slice(0, 1000).trimEnd();

  const { error } = await supabase.from("orders").update({ admin_notes: cleaned || null }).eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

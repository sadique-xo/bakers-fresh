import { addHours, addDays, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

import { orderBodySchema, orderTimeSlotSchema } from "@/lib/orders/schema";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

import type { z } from "zod";

function slotLabel(slot: z.infer<typeof orderTimeSlotSchema>) {
  switch (slot) {
    case "morning":
      return "10-12";
    case "afternoon":
      return "12-16";
    case "evening":
      return "16-20";
  }
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = orderBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const body = parsed.data;
  const deliveryDate = startOfDay(parseISO(body.deliveryDate));
  if (Number.isNaN(deliveryDate.getTime())) {
    return NextResponse.json({ error: "invalid delivery date" }, { status: 400 });
  }

  const minDate = startOfDay(addHours(new Date(), 24));
  const maxDate = startOfDay(addDays(new Date(), 30));
  if (isBefore(deliveryDate, minDate)) {
    return NextResponse.json(
      { error: "delivery must be at least 24 hours from now" },
      { status: 400 },
    );
  }
  if (isAfter(deliveryDate, maxDate)) {
    return NextResponse.json(
      { error: "delivery cannot be more than 30 days ahead" },
      { status: 400 },
    );
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }

  let cakeId: string | null = null;
  if (body.cakeSlug) {
    const { data: row } = await admin
      .from("cakes")
      .select("id")
      .eq("slug", body.cakeSlug)
      .eq("is_active", true)
      .maybeSingle();
    cakeId = row?.id ?? null;
  }

  const insert = {
    customer_name: body.customerName.trim(),
    customer_phone: body.customerPhone.trim(),
    customer_email: body.customerEmail?.trim() || null,
    cake_id: cakeId,
    cake_type: body.cakeType.trim(),
    cake_size: body.cakeSize.trim(),
    cake_flavor: body.cakeFlavor.trim(),
    is_eggless: body.isEggless,
    message_on_cake: body.messageOnCake?.trim() || null,
    reference_image_urls: body.referenceImageUrls?.length ? body.referenceImageUrls : null,
    special_instructions: body.specialInstructions?.trim() || null,
    delivery_method: body.deliveryMethod,
    delivery_date: body.deliveryDate,
    delivery_time_slot: slotLabel(body.deliveryTimeSlot),
    delivery_address:
      body.deliveryMethod === "delivery" ? body.deliveryAddress!.trim() : null,
    estimated_price_inr: body.estimatedPriceInr ?? null,
  };

  const { data: order, error } = await admin
    .from("orders")
    .insert(insert)
    .select("id, order_number, customer_phone, status")
    .single();

  if (error) {
    console.error("order insert", error);
    return NextResponse.json({ error: "could not save order" }, { status: 500 });
  }

  return NextResponse.json({
    id: order.id,
    orderNumber: order.order_number,
    customerPhone: order.customer_phone,
    status: order.status,
  });
}

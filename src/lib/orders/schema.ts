import { z } from "zod";

export const orderTimeSlotSchema = z.enum(["morning", "afternoon", "evening"]);

export const orderBodySchema = z
  .object({
    customerName: z.string().min(1).max(120),
    customerPhone: z.string().regex(/^[6-9]\d{9}$/),
    customerEmail: z.string().max(200).optional().nullable(),
    cakeSlug: z.string().max(120).optional().nullable(),
    cakeType: z.string().min(1).max(120),
    cakeSize: z.string().min(1).max(120),
    cakeFlavor: z.string().min(1).max(120),
    isEggless: z.boolean(),
    messageOnCake: z.string().max(60).optional().nullable(),
    referenceImageUrls: z.array(z.string().max(800)).max(5).optional(),
    specialInstructions: z.string().max(500).optional().nullable(),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    deliveryTimeSlot: orderTimeSlotSchema,
    deliveryAddress: z.string().max(2000).optional().nullable(),
    estimatedPriceInr: z.number().int().positive().optional().nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.deliveryMethod === "delivery" && !val.deliveryAddress?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "delivery address required",
        path: ["deliveryAddress"],
      });
    }
  });

export type OrderBodyInput = z.infer<typeof orderBodySchema>;

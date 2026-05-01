"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO, startOfDay } from "date-fns";
import { CalendarIcon, CloudUpload, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { orderBodySchema, type OrderBodyInput } from "@/lib/orders/schema";
import { orderDeliveryDateBounds } from "@/lib/orders/delivery-bounds";
import {
  BF_ORDER_SUCCESS_KEY,
  type OrderSuccessPayload,
  type OrderSuccessSummary,
} from "@/lib/orders/success-storage";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPT_MIME = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const CAKE_TYPES = [
  "birthday",
  "anniversary",
  "wedding",
  "photo cake",
  "designer / tiered",
  "kids theme",
  "custom brief",
];

const CAKE_SIZES = [
  "0.5 kg (small gathering)",
  "1 kg (up to 10 slices)",
  "1.5 kg",
  "2 kg (party size)",
  "3+ kg (ask in notes)",
];

const CAKE_FLAVORS = [
  "chocolate",
  "vanilla",
  "black forest",
  "red velvet",
  "butterscotch",
  "fruit / fresh cream",
  "custom mix",
];

const TIME_LABELS: Record<OrderBodyInput["deliveryTimeSlot"], string> = {
  morning: "morning, 10am to 12pm",
  afternoon: "afternoon, 12pm to 4pm",
  evening: "evening, 4pm to 8pm",
};

type LocalFile = { id: string; file: File; previewUrl: string };

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "image";
}

type Props = {
  initialCakeSlug?: string | null;
  className?: string;
};

export function OrderForm({ initialCakeSlug = null, className }: Props) {
  const router = useRouter();
  const bounds = useMemo(() => orderDeliveryDateBounds(), []);
  const calendarFrom = useMemo(() => startOfDay(parseISO(bounds.min)), [bounds.min]);
  const calendarTo = useMemo(() => startOfDay(parseISO(bounds.max)), [bounds.max]);
  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const defaultValues = useMemo<Partial<OrderBodyInput>>(
    () => ({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      cakeSlug: initialCakeSlug || null,
      cakeType: CAKE_TYPES[0]!,
      cakeSize: CAKE_SIZES[0]!,
      cakeFlavor: CAKE_FLAVORS[0]!,
      isEggless: false,
      messageOnCake: "",
      referenceImageUrls: [],
      specialInstructions: "",
      deliveryMethod: "pickup",
      deliveryDate: bounds.min,
      deliveryTimeSlot: "morning",
      deliveryAddress: "",
      estimatedPriceInr: null,
    }),
    [initialCakeSlug, bounds.min],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OrderBodyInput>({
    resolver: zodResolver(orderBodySchema),
    defaultValues,
  });

  const deliveryMethod = useWatch({ control, name: "deliveryMethod" });

  const filesRef = useRef<LocalFile[]>([]);
  useEffect(() => {
    filesRef.current = localFiles;
  }, [localFiles]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length) {
      toast.error("some files were skipped. use jpg, png, or webp under 10mb each.");
    }
    setLocalFiles((prev) => {
      const room = MAX_FILES - prev.length;
      const next = accepted.slice(0, room);
      if (accepted.length > room) {
        toast.error(`you can add up to ${MAX_FILES} reference images.`);
      }
      const additions: LocalFile[] = next.map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...additions];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT_MIME,
    maxSize: MAX_FILE_BYTES,
    disabled: localFiles.length >= MAX_FILES || isSubmitting,
  });

  function removeLocalFile(id: string) {
    setLocalFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  }

  async function uploadReferenceImages(): Promise<string[]> {
    if (localFiles.length === 0) return [];
    let supabase;
    try {
      supabase = createSupabaseBrowser();
    } catch {
      throw new Error("could not connect to upload. check your connection and try again.");
    }

    const folder = crypto.randomUUID();
    const paths: string[] = [];

    for (let i = 0; i < localFiles.length; i++) {
      const { file } = localFiles[i]!;
      const path = `${folder}/${safeFileName(file.name)}`;
      setUploadProgress(`uploading ${i + 1} of ${localFiles.length}…`);
      const { error } = await supabase.storage.from("order-references").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (error) {
        console.error(error);
        throw new Error("could not upload images. try again or skip references for now.");
      }
      paths.push(path);
    }
    setUploadProgress(null);
    return paths;
  }

  async function onSubmit(data: OrderBodyInput) {
    let referenceImageUrls: string[] = [];
    try {
      referenceImageUrls = await uploadReferenceImages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "upload failed");
      return;
    }

    const body = {
      ...data,
      customerPhone: normalizePhone(data.customerPhone),
      customerEmail: data.customerEmail?.trim() || null,
      cakeSlug: data.cakeSlug?.trim() || null,
      messageOnCake: data.messageOnCake?.trim() || null,
      specialInstructions: data.specialInstructions?.trim() || null,
      deliveryAddress:
        data.deliveryMethod === "delivery" ? data.deliveryAddress?.trim() || null : null,
      referenceImageUrls: referenceImageUrls.length ? referenceImageUrls : undefined,
      estimatedPriceInr: data.estimatedPriceInr ?? null,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      details?: { fieldErrors?: Record<string, string[]> };
      id?: string;
      orderNumber?: string;
      customerPhone?: string;
      status?: string | null;
    };

    if (!res.ok) {
      const detailMsg = json.details?.fieldErrors
        ? Object.values(json.details.fieldErrors).flat()[0]
        : undefined;
      toast.error(detailMsg || json.error || "something went wrong. try again or call us.");
      return;
    }

    if (!json.id || !json.orderNumber || !json.customerPhone) {
      toast.error("saved but response was incomplete. call us with your details.");
      return;
    }

    const summary: OrderSuccessSummary = {
      customerName: data.customerName.trim(),
      cakeType: data.cakeType,
      cakeSize: data.cakeSize,
      cakeFlavor: data.cakeFlavor,
      isEggless: data.isEggless,
      messageOnCake: data.messageOnCake?.trim() || null,
      deliveryDate: data.deliveryDate,
      deliveryTimeSlot: data.deliveryTimeSlot,
      deliveryMethod: data.deliveryMethod,
      deliveryAddress:
        data.deliveryMethod === "delivery" ? data.deliveryAddress?.trim() || null : null,
      specialInstructions: data.specialInstructions?.trim() || null,
      referenceCount: referenceImageUrls.length,
    };

    const payload: OrderSuccessPayload = {
      id: json.id,
      orderNumber: json.orderNumber,
      customerPhone: json.customerPhone,
      status: json.status ?? null,
      summary,
    };

    try {
      sessionStorage.setItem(BF_ORDER_SUCCESS_KEY, JSON.stringify(payload));
    } catch {
      // storage full or disabled; still navigate
    }

    router.push("/order/success");
  }

  const triggerClass =
    "h-11 min-h-11 w-full min-w-0 max-w-full justify-between rounded-full border-input px-4 py-2 text-left font-sans text-base shadow-[var(--shadow-ambient-pink)] md:text-sm";
  const inputClass =
    "h-11 min-h-11 min-w-0 rounded-full px-4 font-sans text-base shadow-[var(--shadow-ambient-pink)] md:text-sm";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-12 font-sans", className)}
      noValidate>
      <p className="font-[family-name:var(--font-handwritten)] text-xl text-[var(--color-brand-pink-deep)]">
        tell us everything, we&apos;ll call within two hours
      </p>

      <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-ambient-pink)] md:p-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
          about the cake
        </h2>

        {initialCakeSlug ? (
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            starting from catalog:{" "}
            <span className="font-medium text-[var(--color-ink)]">{initialCakeSlug}</span>
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2 md:items-start">
          <div className="min-w-0 md:col-span-2 space-y-2">
            <Label htmlFor="cakeType" className="font-sans text-[var(--color-ink-soft)]">
              type
            </Label>
            <Controller
              name="cakeType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="cakeType" className={triggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAKE_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="font-sans">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cakeType ? (
              <p className="text-sm text-destructive">{errors.cakeType.message}</p>
            ) : null}
          </div>

          <div className="min-w-0 space-y-2">
            <Label htmlFor="cakeSize" className="font-sans text-[var(--color-ink-soft)]">
              size
            </Label>
            <Controller
              name="cakeSize"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="cakeSize" className={triggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAKE_SIZES.map((t) => (
                      <SelectItem key={t} value={t} className="font-sans">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cakeSize ? (
              <p className="text-sm text-destructive">{errors.cakeSize.message}</p>
            ) : null}
          </div>

          <div className="min-w-0 space-y-2">
            <Label htmlFor="cakeFlavor" className="font-sans text-[var(--color-ink-soft)]">
              flavor
            </Label>
            <Controller
              name="cakeFlavor"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="cakeFlavor" className={triggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAKE_FLAVORS.map((t) => (
                      <SelectItem key={t} value={t} className="font-sans">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cakeFlavor ? (
              <p className="text-sm text-destructive">{errors.cakeFlavor.message}</p>
            ) : null}
          </div>

          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <Controller
              name="isEggless"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="flex items-center gap-3 font-sans text-[var(--color-ink)]">
                  <Checkbox
                    id="isEggless"
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked === true)}
                  />
                  <Label
                    htmlFor="isEggless"
                    className="cursor-pointer rounded-full bg-[var(--color-mint)]/35 px-3 py-1 text-sm font-semibold text-[var(--color-ink-soft)]">
                    eggless
                  </Label>
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="messageOnCake" className="font-sans text-[var(--color-ink-soft)]">
              message on cake (optional, max 60 characters)
            </Label>
            <Input
              id="messageOnCake"
              className={inputClass}
              maxLength={60}
              {...register("messageOnCake")}
            />
            {errors.messageOnCake ? (
              <p className="text-sm text-destructive">{errors.messageOnCake.message}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-ambient-pink)] md:p-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
          inspiration
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          optional but helpful, share what you have in mind. up to five images, jpg, png, or webp, 10mb each.
        </p>

        <div
          {...getRootProps()}
          className={cn(
            "mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-12 text-center transition-colors",
            isDragActive
              ? "border-[var(--color-brand-pink)] bg-[var(--color-brand-pink-soft)]/40"
              : "border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]/50 hover:border-[var(--color-brand-pink)]/60",
            localFiles.length >= MAX_FILES ? "pointer-events-none opacity-50" : "",
          )}>
          <input {...getInputProps()} />
          <CloudUpload className="size-10 text-[var(--color-brand-pink)]" aria-hidden />
          <p className="mt-3 font-sans text-sm font-medium text-[var(--color-ink)]">
            drop reference images here, or tap to upload
          </p>
        </div>

        {uploadProgress ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-brand-pink-deep)]">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {uploadProgress}
          </p>
        ) : null}

        {localFiles.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {localFiles.map((item) => (
              <li
                key={item.id}
                className="relative aspect-[3/2] overflow-hidden rounded-xl bg-[var(--color-cream-soft)]">
                {/* Blob previews require a plain img (next/image does not support blob: URLs). */}
                {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URLs */}
                <img
                  src={item.previewUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeLocalFile(item.id)}
                  className="absolute right-2 top-2 rounded-full bg-[var(--color-ink)]/80 p-1.5 text-white hover:bg-[var(--color-ink)]"
                  aria-label="remove image">
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-ambient-pink)] md:p-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
          special instructions
        </h2>
        <Label htmlFor="specialInstructions" className="mt-4 font-sans text-[var(--color-ink-soft)]">
          allergies, figurines, color codes, anything else (optional)
        </Label>
        <Textarea
          id="specialInstructions"
          rows={4}
          maxLength={500}
          className="mt-2 min-h-[120px] rounded-xl px-4 py-3 font-sans text-base shadow-[var(--shadow-ambient-pink)] md:text-sm"
          {...register("specialInstructions")}
        />
        {errors.specialInstructions ? (
          <p className="mt-1 text-sm text-destructive">{errors.specialInstructions.message}</p>
        ) : null}
      </section>

      <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-ambient-pink)] md:p-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
          delivery details
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2 md:items-start">
          <div className="min-w-0 space-y-2">
            <Label className="font-sans text-[var(--color-ink-soft)]">date</Label>
            <Controller
              name="deliveryDate"
              control={control}
              render={({ field }) => {
                const parsed =
                  field.value && isValid(parseISO(`${field.value}T12:00:00`))
                    ? startOfDay(parseISO(`${field.value}T12:00:00`))
                    : undefined;
                return (
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        triggerClass,
                        "font-normal",
                      )}>
                      <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
                      {parsed ? (
                        <span className="truncate">{format(parsed, "PPP")}</span>
                      ) : (
                        <span className="text-muted-foreground">pick a date</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto rounded-xl border-border p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        fromDate={calendarFrom}
                        toDate={calendarTo}
                        selected={parsed}
                        defaultMonth={parsed ?? calendarFrom}
                        onSelect={(d) => {
                          field.onChange(d ? format(d, "yyyy-MM-dd") : field.value);
                        }}
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
            {errors.deliveryDate ? (
              <p className="text-sm text-destructive">{errors.deliveryDate.message}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              earliest {bounds.min}, within 30 days
            </p>
          </div>

          <div className="min-w-0 space-y-2">
            <Label htmlFor="deliveryTimeSlot" className="font-sans text-[var(--color-ink-soft)]">
              time slot
            </Label>
            <Controller
              name="deliveryTimeSlot"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="deliveryTimeSlot" className={triggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TIME_LABELS) as OrderBodyInput["deliveryTimeSlot"][]).map((k) => (
                      <SelectItem key={k} value={k} className="font-sans">
                        {TIME_LABELS[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.deliveryTimeSlot ? (
              <p className="text-sm text-destructive">{errors.deliveryTimeSlot.message}</p>
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-sans text-sm font-medium text-[var(--color-ink-soft)]">pickup or delivery</p>
            <Controller
              name="deliveryMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  className="flex flex-wrap gap-6"
                  value={field.value}
                  onValueChange={field.onChange}>
                  {(
                    [
                      ["pickup", "i'll pick it up from an outlet"],
                      ["delivery", "deliver to my address"],
                    ] as const
                  ).map(([val, lab]) => (
                    <div key={val} className="flex items-center gap-2 font-sans text-[var(--color-ink)]">
                      <RadioGroupItem value={val} id={`dm-${val}`} />
                      <Label htmlFor={`dm-${val}`} className="cursor-pointer font-normal">
                        {lab}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          {deliveryMethod === "delivery" ? (
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="deliveryAddress" className="font-sans text-[var(--color-ink-soft)]">
                delivery address
              </Label>
              <Textarea
                id="deliveryAddress"
                rows={3}
                className="min-h-[96px] rounded-xl px-4 py-3 font-sans text-base shadow-[var(--shadow-ambient-pink)] md:text-sm"
                {...register("deliveryAddress")}
              />
              {errors.deliveryAddress ? (
                <p className="text-sm text-destructive">{errors.deliveryAddress.message}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-white p-6 shadow-[var(--shadow-ambient-pink)] md:p-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
          your details
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="customerName" className="font-sans text-[var(--color-ink-soft)]">
              full name
            </Label>
            <Input
              id="customerName"
              className={inputClass}
              autoComplete="name"
              {...register("customerName")}
            />
            {errors.customerName ? (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="font-sans text-[var(--color-ink-soft)]">
              phone (10 digit indian mobile)
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={15}
              className={inputClass}
              placeholder="9876543210"
              {...register("customerPhone")}
            />
            {errors.customerPhone ? (
              <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail" className="font-sans text-[var(--color-ink-soft)]">
              email (optional)
            </Label>
            <Input id="customerEmail" type="email" autoComplete="email" className={inputClass} {...register("customerEmail")} />
            {errors.customerEmail ? (
              <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="h-[52px] gap-2 rounded-full px-10 text-[11px] font-bold uppercase tracking-wider shadow-[var(--shadow-ambient-pink-lg)]">
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden />
              sending…
            </>
          ) : (
            "place order"
          )}
        </Button>
      </div>
    </form>
  );
}

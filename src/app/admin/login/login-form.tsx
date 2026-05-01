"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export function AdminLoginForm({ nextTarget }: { nextTarget: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginInput> = async (fields) => {
    setFormError("");
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email: fields.email.trim(),
        password: fields.password,
      });
      if (error) {
        setFormError(error.message || "Signing in failed.");
        return;
      }
      router.push(nextTarget);
      router.refresh();
    } catch {
      setFormError("Signing in failed. Try again.");
    }
  };

  return (
    <div className="mx-auto mt-24 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
        Baker&apos;s Fresh Admin
      </h1>
      <p className="mt-2 text-sm text-zinc-500">Sign in to manage cake orders.</p>
      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="bg-white"
          />
          {errors.email ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        {formError ? (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

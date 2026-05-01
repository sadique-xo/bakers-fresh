"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-[var(--color-border-soft)] font-sans shadow-[var(--shadow-ambient-pink)]",
        },
      }}
    />
  );
}

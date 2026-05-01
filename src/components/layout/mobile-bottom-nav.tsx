"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cake, ClipboardEdit, Home, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "home", Icon: Home },
  { href: "/cakes", label: "cakes", Icon: Cake },
  { href: "/order", label: "order", Icon: ClipboardEdit },
  { href: "/contact", label: "contact", Icon: MessageCircle },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="main"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-between gap-0 rounded-t-[32px] border-t border-[var(--color-navbar-line)] bg-[color-mix(in_srgb,var(--color-buttercream)_92%,white)] px-2 py-3 shadow-[0_-10px_30px_-12px_rgba(40,23,26,0.08)] backdrop-blur-lg sm:justify-around sm:gap-2 sm:px-4 md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      {items.map(({ href, label, Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-[3rem] min-w-0 flex-1 basis-0 flex-col items-center justify-center rounded-2xl px-1.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 active:scale-90 sm:px-3 sm:text-[11px]",
              active
                ? "bg-rose-50 text-[var(--color-brand-pink)]"
                : "text-zinc-400 hover:text-[var(--color-brand-pink)]",
            )}
          >
            <Icon
              className="size-5 shrink-0 stroke-[2] sm:size-6"
              strokeWidth={active ? 2.25 : 2}
              aria-hidden
            />
            <span className="mt-0.5 max-w-full truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

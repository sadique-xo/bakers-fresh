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
      className="border-t border-[var(--color-navbar-line)] bg-[color-mix(in_srgb,var(--color-buttercream)_92%,white)] px-4 py-3 shadow-[0_-10px_30px_-12px_rgba(40,23,26,0.08)] backdrop-blur-lg md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around rounded-t-[32px] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
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
              "flex min-w-[4.25rem] flex-col items-center justify-center rounded-2xl px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all active:scale-90 duration-300",
              active
                ? "bg-rose-50 text-[var(--color-brand-pink)]"
                : "text-zinc-400 hover:text-[var(--color-brand-pink)]",
            )}
          >
            <Icon
              className="size-6 stroke-[2]"
              strokeWidth={active ? 2.25 : 2}
              aria-hidden
            />
            <span className="mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

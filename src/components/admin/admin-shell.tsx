"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Menu, PanelRightClose } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { signOutAdmin } from "@/app/admin/(dashboard)/actions";

function NavLinks({
  pathname,
  className,
  onNavigate,
}: {
  pathname: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const linkClass =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/80 hover:text-zinc-900";

  const active = pathname.startsWith("/admin/orders");

  return (
    <nav className={className}>
      <Link
        href="/admin/orders"
        onClick={() => onNavigate?.()}
        className={`${linkClass} ${active ? "bg-white shadow-sm ring-1 ring-zinc-200 text-zinc-900" : ""}`}
      >
        <ClipboardList className="size-4 shrink-0" aria-hidden />
        Orders
      </Link>
      <p className="mt-4 px-3 text-xs uppercase tracking-wide text-zinc-400">
        Coming later
      </p>
      <button
        type="button"
        disabled
        className="flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400"
      >
        Cake catalog (V1.5)
      </button>
    </nav>
  );
}

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-100 md:flex-row">
      <aside className="hidden w-52 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 p-6 md:flex">
        <Link href="/admin/orders" className="font-semibold tracking-tight text-zinc-900">
          Baker&apos;s Fresh
        </Link>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Admin
        </p>
        <div className="mt-10">
          <NavLinks pathname={pathname} className="flex flex-col gap-1" />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-4 border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
            <SheetTrigger render={<Button type="button" variant="outline" size="sm" aria-label="Open navigation" />}>
              <Menu className="size-4" />
            </SheetTrigger>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 truncate">Orders</span>
          </div>
          <SheetContent side="left" className="w-[min(280px,100vw)] gap-6 bg-zinc-50 px-6 py-10">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <Link
              href="/admin/orders"
              className="font-semibold tracking-tight text-zinc-900"
              onClick={() => setOpen(false)}
            >
              Baker&apos;s Fresh Admin
            </Link>
            <NavLinks
              pathname={pathname}
              className="mt-10 flex flex-col gap-2"
              onNavigate={() => setOpen(false)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-3 gap-2"
              onClick={() => setOpen(false)}
            >
              <PanelRightClose className="size-4" />
              Close menu
            </Button>
          </SheetContent>
        </Sheet>

        <header className="hidden items-center justify-end gap-3 border-b border-zinc-200 bg-white px-6 py-3 md:flex">
          <span className="max-w-[220px] truncate text-sm text-zinc-600" title={userEmail}>
            {userEmail}
          </span>
          <form action={signOutAdmin}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </header>

        <div className="flex justify-end gap-3 border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <span className="max-w-[140px] truncate text-xs text-zinc-600" title={userEmail}>
            {userEmail}
          </span>
          <form action={signOutAdmin}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>

        <div className="flex-1 p-4 pb-28 md:p-8 md:pb-8">{children}</div>
      </div>
    </div>
  );
}

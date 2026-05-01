"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Cake, Menu, Phone, ShoppingBag, X } from "lucide-react";

import { sitePhoneDisplay, sitePhoneTel } from "@/lib/site";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/cakes", label: "cakes" },
  { href: "/order", label: "order" },
  { href: "/locations", label: "locations" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-[60] w-full transition-[box-shadow,border-color,background]",
          scrolled
            ? "border-b border-rose-100/80 bg-[color-mix(in_srgb,var(--color-brand-pink-soft)_93%,white)] shadow-[0_4px_20px_-5px_rgba(233,30,99,0.1)] backdrop-blur-md"
            : "border-b border-rose-100/40 bg-[color-mix(in_srgb,var(--color-brand-pink-soft)_85%,white)] backdrop-blur-sm",
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center px-5 md:h-[4.5rem] md:px-8">
          <button
            type="button"
            className="relative z-[2] shrink-0 rounded-full p-2 text-[var(--color-brand-pink)] transition-colors hover:bg-rose-100/55 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "close menu" : "open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" strokeWidth={2} /> : <Menu className="size-6" />}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 z-[2] inline-flex max-w-[11rem] -translate-x-1/2 font-black italic tracking-tighter text-[var(--color-brand-pink)] sm:max-w-none md:relative md:left-auto md:translate-x-0 md:justify-start md:text-xl lg:text-2xl"
          >
            baker&apos;s fresh
          </Link>

          <nav
            aria-label="primary"
            className="hidden min-w-0 flex-1 justify-center gap-6 md:flex lg:gap-8"
          >
            {navLinks.map(({ href, label }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "whitespace-nowrap font-serif text-sm font-bold tracking-tight transition-colors hover:rounded-full hover:bg-rose-100/45 hover:px-2 hover:py-1",
                    active
                      ? "text-[var(--color-brand-pink-deep)]"
                      : "text-rose-500/95 hover:text-[var(--color-brand-pink-deep)]",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-[2] ml-auto flex shrink-0 items-center gap-2 md:gap-4 lg:gap-6">
            <a
              href={sitePhoneTel}
              title="call us"
              className="hidden md:inline-flex items-center gap-2 rounded-full lg:rounded-full lg:border-0"
            >
              <Phone className="size-5 shrink-0 text-[var(--color-brand-pink)] lg:size-[18px]" aria-hidden />
              <span className="hidden font-sans text-sm font-semibold text-[var(--color-ink)] lg:inline whitespace-nowrap">
                {sitePhoneDisplay}
              </span>
            </a>
            <Link
              href="/order"
              aria-label="order custom cake"
              className={cn(
                "hidden rounded-full border border-transparent bg-[var(--color-brand-pink)] px-4 py-2.5 whitespace-nowrap sm:px-5 md:inline-flex",
                "font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_-6px_rgba(233,30,99,0.35)] sm:text-[11px]",
                "transition-[transform,filter] hover:brightness-105 active:scale-[0.98]",
              )}
            >
              order custom cake
            </Link>
            <Link
              href="/order"
              aria-label="order custom cake"
              className="rounded-full p-2 text-[var(--color-brand-pink)] transition-colors hover:bg-rose-100/55 md:hidden"
            >
              <ShoppingBag className="size-6" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-[70] md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/35 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          aria-label="close menu backdrop"
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal
          aria-label="site menu"
          className={cn(
            "absolute left-0 top-0 flex h-full w-[min(20rem,90vw)] flex-col gap-1 bg-[var(--color-cream)] px-6 pt-24 pb-10 shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <p className="mb-6 font-[family-name:var(--font-handwritten)] text-2xl text-[var(--color-brand-pink)]">
            fresh picks
          </p>
          <a
            href={sitePhoneTel}
            className="mb-6 flex items-center gap-2 rounded-xl border border-[var(--color-border-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            <Phone className="size-4 shrink-0 text-[var(--color-brand-pink)]" aria-hidden />
            {sitePhoneDisplay}
          </a>
          {navLinks.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-xl px-4 py-3 font-serif font-semibold capitalize transition-colors",
                  active ? "bg-rose-100/70 text-[var(--color-brand-pink-deep)]" : "text-[var(--color-ink)]",
                )}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/order"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-pink)] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_24px_-6px_rgba(233,30,99,0.35)]"
          >
            <Cake className="size-[18px]" aria-hidden />
            order custom cake
          </Link>
        </div>
      </div>
    </>
  );
}

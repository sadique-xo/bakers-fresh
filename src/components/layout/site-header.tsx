"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
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
  const skipNextPathClose = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (skipNextPathClose.current) {
      skipNextPathClose.current = false;
      return;
    }
    setOpen(false);
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
          "fixed top-0 z-[60] w-full transition-[background,box-shadow,backdrop-filter]",
          scrolled
            ? "bg-[color-mix(in_srgb,white_92%,var(--color-buttercream)_8%)] shadow-[0_8px_32px_-12px_rgba(40,23,26,0.08)] backdrop-blur-lg"
            : "bg-[color-mix(in_srgb,var(--color-buttercream)_78%,transparent)] backdrop-blur-md",
        )}
      >
        <div className="relative mx-auto flex min-h-[4.25rem] max-w-7xl items-center gap-3 px-5 py-1 md:min-h-20 md:gap-6 md:px-8 md:py-0">
          <button
            type="button"
            className="relative z-[2] shrink-0 rounded-xl border border-[var(--color-navbar-line)] bg-white/50 p-2 text-[var(--color-ink)] transition-colors hover:bg-white/85 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "close menu" : "open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" strokeWidth={2} /> : <Menu className="size-6" />}
          </button>

          <Link
            href="/"
            className={cn(
              "absolute left-1/2 z-[2] flex max-w-[15rem] -translate-x-1/2 items-center justify-center md:relative md:left-auto md:translate-x-0 md:max-w-none",
            )}
          >
            <Image
              src="/bakers-fresh-pink-logo.webp"
              alt="baker&apos;s fresh"
              width={360}
              height={100}
              className="h-11 w-auto sm:h-12 md:h-[3.35rem] lg:h-16"
              priority
            />
          </Link>

          <nav
            aria-label="primary"
            className="hidden min-w-0 flex-1 justify-center md:flex"
          >
            <LayoutGroup id="site-header-desktop-nav">
              <div className="flex items-center gap-0.5 rounded-full border border-[var(--color-navbar-line)] bg-white/60 p-1 shadow-[0_2px_12px_-4px_rgba(40,23,26,0.06)] backdrop-blur-sm lg:gap-1">
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
                        "relative whitespace-nowrap rounded-full px-3 py-2 font-sans text-[13px] font-semibold tracking-tight transition-colors duration-200 lg:px-3.5",
                        active
                          ? "text-[var(--color-brand-pink-deep)]"
                          : "text-[var(--color-ink-soft)] hover:bg-white/70 hover:text-[var(--color-ink)]",
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="site-header-nav-active-pill"
                          className="pointer-events-none absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(40,23,26,0.08)] ring-1 ring-black/[0.04]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                            mass: 0.8,
                          }}
                        />
                      ) : null}
                      <span className="relative z-[1]">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </LayoutGroup>
          </nav>

          <div className="relative z-[2] ml-auto flex shrink-0 items-center gap-2 md:gap-3">
            <a
              href={sitePhoneTel}
              title="call us"
              className="hidden items-center gap-2 rounded-full border border-[var(--color-navbar-line)] bg-white/70 px-3 py-2 font-sans text-sm font-semibold text-[var(--color-ink)] shadow-sm backdrop-blur-sm transition-colors hover:bg-white md:inline-flex lg:gap-2.5 lg:px-4"
            >
              <Phone className="size-[18px] shrink-0 text-[var(--color-brand-pink)]" aria-hidden />
              <span className="hidden whitespace-nowrap lg:inline">{sitePhoneDisplay}</span>
            </a>
            <Link
              href="/order"
              aria-label="order custom cake"
              className={cn(
                "hidden rounded-full bg-[var(--color-brand-pink)] px-4 py-2.5 whitespace-nowrap md:inline-flex",
                "font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_-6px_rgba(233,30,99,0.35)] lg:px-5 lg:text-[11px]",
                "ring-2 ring-[color-mix(in_srgb,var(--color-brand-pink)_35%,transparent)] transition-[transform,filter] hover:brightness-[1.03] active:scale-[0.98]",
              )}
            >
              order custom cake
            </Link>
            <Link
              href="/order"
              aria-label="order custom cake"
              className="flex size-10 items-center justify-center rounded-xl border border-[var(--color-navbar-line)] bg-white/60 shadow-sm backdrop-blur-sm transition-colors hover:bg-white md:hidden"
            >
              <ShoppingBag className="size-[1.125rem] text-[var(--color-brand-pink-deep)]" aria-hidden />
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
            "absolute left-0 top-0 flex h-full min-h-[100dvh] w-[min(22rem,92vw)] flex-col bg-[color-mix(in_srgb,var(--color-buttercream)_96%,white)] rounded-r-[2rem] pb-10 pl-7 pr-6 pt-[max(1.5rem,env(safe-area-inset-top)+0.5rem)] shadow-[8px_0_40px_-8px_rgba(40,23,26,0.12)] backdrop-blur-lg transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-navbar-line)] bg-white/80 text-[var(--color-ink)] shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="close menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" strokeWidth={2} aria-hidden />
            </button>
            <p className="font-[family-name:var(--font-handwritten)] text-2xl text-[var(--color-brand-pink-deep)]">
              menu
            </p>
          </div>
          <a
            href={sitePhoneTel}
            className="mb-8 flex items-center gap-3 rounded-2xl border border-[var(--color-navbar-line)] bg-white/80 px-4 py-4 text-sm font-semibold text-[var(--color-ink)] shadow-[var(--shadow-ambient-pink)]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-pink-soft)] text-[var(--color-brand-pink)]">
              <Phone className="size-5" aria-hidden />
            </span>
            <span className="text-left leading-tight">{sitePhoneDisplay}</span>
          </a>
          <nav className="flex flex-col gap-1.5">
            <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-subtle)]">
              explore
            </p>
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
                    "flex items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 font-sans text-[15px] font-semibold capitalize transition-colors",
                    active
                      ? "border-[var(--color-navbar-line)] bg-white text-[var(--color-brand-pink-deep)] shadow-sm"
                      : "text-[var(--color-ink)] hover:bg-white/65",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {label}
                  <span aria-hidden className="text-[var(--color-ink-subtle)] opacity-50">
                    ›
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="min-h-8 flex-1 shrink-0" aria-hidden />
          <Link
            href="/order"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-pink)] px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_10px_28px_-8px_rgba(233,30,99,0.45)] ring-2 ring-[color-mix(in_srgb,var(--color-brand-pink)_38%,transparent)]"
          >
            <Cake className="size-[18px]" aria-hidden />
            order custom cake
          </Link>
        </div>
      </div>
    </>
  );
}

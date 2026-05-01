"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const MIN_VISIBLE_MS = 240;
const FAILSAFE_END_MS = 10000;

export function TopRouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const startedAtRef = useRef<number | null>(null);
  const tickingRef = useRef<number | null>(null);
  const failsafeRef = useRef<number | null>(null);
  const completeRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const clearTimer = (id: number | null) => {
    if (id !== null) window.clearTimeout(id);
  };

  const clearIntervalRef = (id: number | null) => {
    if (id !== null) window.clearInterval(id);
  };

  const stopTimers = () => {
    clearIntervalRef(tickingRef.current);
    clearTimer(failsafeRef.current);
    clearTimer(completeRef.current);
    tickingRef.current = null;
    failsafeRef.current = null;
    completeRef.current = null;
  };

  const complete = () => {
    if (!runningRef.current) return;

    const startedAt = startedAtRef.current ?? Date.now();
    const elapsed = Date.now() - startedAt;
    const waitMs = Math.max(0, MIN_VISIBLE_MS - elapsed);

    completeRef.current = window.setTimeout(() => {
      setProgress(100);
      window.setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 160);
      runningRef.current = false;
      stopTimers();
    }, waitMs);
  };

  const start = () => {
    if (runningRef.current) return;

    stopTimers();
    runningRef.current = true;
    startedAtRef.current = Date.now();
    setIsVisible(true);
    setProgress(14);

    tickingRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const bump = prev < 40 ? 8 : prev < 70 ? 4 : 2;
        return Math.min(92, prev + bump);
      });
    }, 180);

    failsafeRef.current = window.setTimeout(() => {
      complete();
    }, FAILSAFE_END_MS);
  };

  useEffect(() => {
    const handleNavigationIntent = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const nextUrl = new URL(href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;

      const nextPathAndSearch = `${nextUrl.pathname}${nextUrl.search}`;
      const currentPathAndSearch = `${window.location.pathname}${window.location.search}`;
      if (nextPathAndSearch === currentPathAndSearch) return;

      start();
    };

    const handlePopState = () => {
      start();
    };

    window.addEventListener("click", handleNavigationIntent, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("click", handleNavigationIntent, true);
      window.removeEventListener("popstate", handlePopState);
      stopTimers();
    };
  }, []);

  useEffect(() => {
    complete();
    // Use the serialized query string so nav completion includes search changes.
  }, [pathname, searchParams.toString()]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-1 overflow-hidden"
    >
      <div
        className="h-full bg-[linear-gradient(90deg,var(--color-brand-pink),var(--color-brand-pink-deep))] shadow-[0_2px_10px_rgba(233,30,99,0.45)] transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
}

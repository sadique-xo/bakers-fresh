/**
 * Catalog images are stored as Supabase Storage public URLs. Next/Image optimization
 * can clash with huge originals + mobile layout; helpers normalize URLs from the DB
 * and decide when to skip the optimizer.
 */

export function normalizeCakeMediaUrl(raw: string | null | undefined): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  if (s.startsWith("https://") || s.startsWith("http://")) return s;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  if (!base || !s.startsWith("/")) return s;
  /** DB sometimes stores `/storage/v1/...` without origin */
  if (s.startsWith("/storage")) return `${base}${s}`;
  return s;
}

/** Public object URL or signed-style path under /storage/v1/object/ */
export function isSupabaseStorageImageUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    const u = new URL(url);
    if (!/\.supabase\.(co|in)$/i.test(u.hostname)) return false;
    return (
      u.pathname.includes("/storage/v1/object/") ||
      u.pathname.includes("/storage/v1/render/image/")
    );
  } catch {
    return false;
  }
}

export function shouldUseUnoptimizedRemoteImage(url: string): boolean {
  return isSupabaseStorageImageUrl(url);
}

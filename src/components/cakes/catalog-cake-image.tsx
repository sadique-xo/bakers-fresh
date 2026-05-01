import Image from "next/image";

import { shouldUseUnoptimizedRemoteImage } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** `sizes` for responsive `srcset` (helps when the optimizer is enabled). */
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Catalog cake photos from Supabase Storage: optional `unoptimized` so the browser
 * always respects the CSS box (`fill` + object-fit) instead of fighting huge originals.
 */
export function CatalogCakeImage({ src, alt, priority, sizes, className }: Props) {
  if (!src.trim()) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={shouldUseUnoptimizedRemoteImage(src)}
      className={cn(className)}
    />
  );
}

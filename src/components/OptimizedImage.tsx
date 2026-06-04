import type { ImgHTMLAttributes } from "react";

export type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** When true, load eagerly and hint high fetch priority (hero / above-the-fold). */
  priority?: boolean;
};

function isSanityCdnUrl(src: string): boolean {
  return src.includes("cdn.sanity.io/images/");
}

function withQualityParams(src: string): string {
  if (!isSanityCdnUrl(src)) return src;
  const hasQuery = src.includes("?");
  const joiner = hasQuery ? "&" : "?";
  return `${src}${joiner}auto=format&q=75`;
}

/**
 * Image helper for CLS + LCP: explicit dimensions when possible, lazy by default.
 * (Vite/React SPA — use this instead of raw &lt;img&gt; where practical.)
 */
export function OptimizedImage({
  priority,
  decoding = "async",
  loading,
  alt,
  src,
  ...rest
}: OptimizedImageProps) {
  const normalizedSrc = typeof src === "string" ? withQualityParams(src) : src;
  return (
    <img
      alt={alt ?? ""}
      loading={priority ? "eager" : loading ?? "lazy"}
      decoding={decoding}
      src={normalizedSrc}
      {...rest}
    />
  );
}

export default OptimizedImage;

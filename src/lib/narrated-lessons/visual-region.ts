/**
 * Shared, bounded visual coordinate & approved media-path primitives for GAM EDU
 * interactive engines (reused by ProcessStepperEngine Mode C and DiagramHotspotsEngine).
 *
 * Security & Coordinate Guarantees:
 * - Approved WebP/PNG paths ONLY (zero raw SVG markup, zero untrusted external URLs).
 * - Blocks path traversal (`..`), URL-encoded traversal (`%2e`, `%2f`, `%5c`),
 *   and executable protocols (`javascript:`, `vbscript:`, `data:`).
 * - Strictly bounds percentage coordinates within 0..100%.
 */

const APPROVED_RELATIVE_IMAGE_RE =
  /^(?:images\/[A-Za-z0-9_.-]+\.(?:webp|png)|\/preview-fixtures\/(?:[A-Za-z0-9_-]+\/)?[A-Za-z0-9_.-]+\.(?:webp|png))$/;

const APPROVED_CDN_IMAGE_RE =
  /^https:\/\/(?:storage\.googleapis\.com\/gamedu-[A-Za-z0-9_-]+\.firebasestorage\.app|firebasestorage\.googleapis\.com\/v0\/b\/gamedu-[A-Za-z0-9_-]+\.firebasestorage\.app)\/[^\s"'<>]+\.(?:webp|png)(?:\?[^\s"'<>]*)?$/;

const ENCODED_TRAVERSAL_RE = /%(?:2e|2f|5c)/i;

export function isApprovedInteractiveAssetPath(src: string): boolean {
  if (typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (trimmed.length === 0 || trimmed.length > 512) return false;
  if (trimmed.includes('..') || trimmed.includes('\\') || ENCODED_TRAVERSAL_RE.test(trimmed)) {
    return false;
  }
  return APPROVED_RELATIVE_IMAGE_RE.test(trimmed) || APPROVED_CDN_IMAGE_RE.test(trimmed);
}

export function isValidPointPercent(xPct: unknown, yPct: unknown): boolean {
  return (
    typeof xPct === 'number' &&
    typeof yPct === 'number' &&
    Number.isFinite(xPct) &&
    Number.isFinite(yPct) &&
    xPct >= 0 &&
    xPct <= 100 &&
    yPct >= 0 &&
    yPct <= 100
  );
}

export function isValidRectPercent(
  xPct: unknown,
  yPct: unknown,
  widthPct: unknown,
  heightPct: unknown
): boolean {
  return (
    isValidPointPercent(xPct, yPct) &&
    typeof widthPct === 'number' &&
    typeof heightPct === 'number' &&
    Number.isFinite(widthPct) &&
    Number.isFinite(heightPct) &&
    widthPct > 0 &&
    widthPct <= 100 &&
    heightPct > 0 &&
    heightPct <= 100 &&
    (xPct as number) + widthPct <= 100 &&
    (yPct as number) + heightPct <= 100
  );
}

/**
 * DOMPurify-backed strict SVG sanitizer for GAM EDU narrated lessons.
 *
 * Uses DOMPurify (`dompurify`) with strict SVG/SVG-filters allowlist + custom URI/CSS hooks:
 * - Browser / Vitest jsdom: binds DOMPurify directly to `window`.
 * - Node.js CLI (`publish-lesson.ts`): binds DOMPurify to `jsdom` via `sanitizeSvgWithDom`
 *   so the exact same DOMPurify policy runs at publish time and render time without bundling
 *   `jsdom` into client JS.
 */
import createDOMPurify, { type Config as DOMPurifyConfig, type DOMPurify as DOMPurifyInstance } from 'dompurify';

export const MAX_SVG_BYTES = 200_000; // 200 KB max per inline SVG
export const MAX_SVG_ELEMENTS = 1_500; // Prevent SVG billion-laughs / DOM exhaustion

const SVG_FORBID_TAGS = [
  'script',
  'foreignObject',
  'iframe',
  'object',
  'embed',
  'applet',
  'meta',
  'link',
  'base',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'animate',
  'animateMotion',
  'animateTransform',
  'set',
  'handler',
  'style',
  'audio',
  'video',
  'image',
  'a',
];

const DOMPURIFY_SVG_CONFIG: DOMPurifyConfig = {
  USE_PROFILES: { svg: true, svgFilters: true },
  FORBID_TAGS: SVG_FORBID_TAGS,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  RETURN_TRUSTED_TYPE: false,
};

const DANGEROUS_URI_RE = /(?:javascript|vbscript|data)\s*:/i;

const FORBIDDEN_LOCAL_NAMES = new Set(SVG_FORBID_TAGS.map((t) => t.toLowerCase()));

function attachStrictSvgHooks(purify: DOMPurifyInstance): void {
  purify.removeAllHooks();
  purify.addHook('uponSanitizeElement', (node, data) => {
    const rawName = (data.tagName || (node as Element).tagName || '').toLowerCase();
    const localName = rawName.includes(':') ? rawName.split(':').pop()! : rawName;
    if (FORBIDDEN_LOCAL_NAMES.has(localName) || rawName.includes(':')) {
      node.parentNode?.removeChild(node);
    }
  });
  purify.addHook('uponSanitizeAttribute', (_node, data) => {
    const nameLower = (data.attrName || '').toLowerCase();
    const val = (data.attrValue || '').trim();

    if (nameLower.startsWith('on')) {
      data.keepAttr = false;
      return;
    }

    if (DANGEROUS_URI_RE.test(val)) {
      data.keepAttr = false;
      return;
    }

    // Only allow internal fragment references (#id) for href / xlink:href
    if (nameLower === 'href' || nameLower === 'xlink:href') {
      if (!/^#[A-Za-z_][A-Za-z0-9_.:-]*$/.test(val)) {
        data.keepAttr = false;
      }
      return;
    }

    // Block unsafe CSS expressions, @import, or non-fragment url(...) in style attributes
    if (nameLower === 'style') {
      if (/expression\s*\(|@import|behavior\s*:|-moz-binding/i.test(val)) {
        data.keepAttr = false;
        return;
      }
      const urls = val.match(/url\s*\(([^)]+)\)/gi) ?? [];
      for (const u of urls) {
        const inner = u.replace(/^url\s*\(\s*['"]?/, '').replace(/['"]?\s*\)$/, '').trim();
        if (!inner.startsWith('#')) {
          data.keepAttr = false;
          return;
        }
      }
      return;
    }

    // For fill / stroke / marker-* / clip-path / filter url(...), allow only internal #id refs
    if (/url\s*\(/i.test(val)) {
      const urls = val.match(/url\s*\(([^)]+)\)/gi) ?? [];
      for (const u of urls) {
        const inner = u.replace(/^url\s*\(\s*['"]?/, '').replace(/['"]?\s*\)$/, '').trim();
        if (!inner.startsWith('#')) {
          data.keepAttr = false;
          return;
        }
      }
    }
  });
}

let cachedBrowserPurify: DOMPurifyInstance | null = null;

function getBrowserPurify(): DOMPurifyInstance | null {
  if (typeof window === 'undefined') return null;
  if (!cachedBrowserPurify) {
    cachedBrowserPurify = createDOMPurify(window);
    attachStrictSvgHooks(cachedBrowserPurify);
  }
  return cachedBrowserPurify;
}

/**
 * Create a DOMPurify instance bound to a provided Window-like object (e.g. JSDOM in Node.js CLI).
 */
export function createSvgPurifier(win: Window & typeof globalThis): DOMPurifyInstance {
  const purify = createDOMPurify(win);
  attachStrictSvgHooks(purify);
  return purify;
}

/**
 * Check SVG size & element-count complexity limits.
 */
export function checkSvgComplexity(rawSvg: string): string[] {
  const issues: string[] = [];
  if (rawSvg.length > MAX_SVG_BYTES) {
    issues.push(`SVG exceeds maximum allowed size (${rawSvg.length} > ${MAX_SVG_BYTES} bytes).`);
  }
  const tagCount = (rawSvg.match(/<\s*[A-Za-z][^>]*>/g) ?? []).length;
  if (tagCount > MAX_SVG_ELEMENTS) {
    issues.push(`SVG exceeds maximum allowed element complexity (${tagCount} > ${MAX_SVG_ELEMENTS} elements).`);
  }
  return issues;
}

/**
 * Render-time defence-in-depth SVG sanitizer using DOMPurify.
 * Returns empty string if SVG exceeds safety complexity limits or has no valid root `<svg>`.
 */
export function sanitizeSvg(
  rawSvg: string | null | undefined,
  purifierOverride?: DOMPurifyInstance
): string {
  if (!rawSvg || typeof rawSvg !== 'string') return '';
  if (checkSvgComplexity(rawSvg).length > 0) return '';

  const purify = purifierOverride ?? getBrowserPurify();
  if (!purify) {
    // SSR pre-hydration safeguard: never emit unsanitised SVG on server render before client hydration
    return '';
  }

  const cleaned = String(purify.sanitize(rawSvg, DOMPURIFY_SVG_CONFIG));
  return cleaned.trim().toLowerCase().startsWith('<svg') ? cleaned : '';
}

const FORBIDDEN_TAG_RE =
  /<\s*(?:[a-z0-9_-]+:)?(script|foreignobject|iframe|object|embed|applet|meta|link|base|form|input|button|textarea|select|animate|animatemotion|animatetransform|set|handler|style|audio|video|image)\b/i;

/**
 * Publish-time / static security audit for raw SVG strings.
 * Checks complexity limits, forbidden elements (including prefixed namespaces),
 * event handlers, encoded/raw dangerous URIs, and external href/url references.
 */
export function auditSvgSecurity(svgCode: string): string[] {
  const issues: string[] = [];
  if (!svgCode || typeof svgCode !== 'string') return issues;

  issues.push(...checkSvgComplexity(svgCode));

  // Decode numeric HTML entities for audit inspection so &#x6A;avascript: is caught statically too
  const decoded = svgCode
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));

  if (FORBIDDEN_TAG_RE.test(decoded)) {
    const m = decoded.match(FORBIDDEN_TAG_RE);
    issues.push(`Forbidden SVG/HTML element <${m?.[1] ?? 'unknown'}> detected.`);
  }
  if (/\son[a-z]+\s*=/i.test(decoded)) {
    const m = decoded.match(/\s(on[a-z]+)\s*=/i);
    issues.push(`Inline event handler attribute "${m?.[1] ?? 'on*'}" is prohibited in SVG.`);
  }
  if (DANGEROUS_URI_RE.test(decoded)) {
    issues.push('Prohibited URI scheme (javascript:/vbscript:/data:) detected in SVG.');
  }
  const hrefMatches = decoded.match(/(?:xlink:)?href\s*=\s*["']([^"']+)["']/gi) ?? [];
  for (const hm of hrefMatches) {
    const val = hm.replace(/^(?:xlink:)?href\s*=\s*["']/, '').replace(/["']$/, '').trim();
    if (!val.startsWith('#')) {
      issues.push(`External or non-fragment href "${val}" is prohibited in SVG.`);
    }
  }
  const urlMatches = decoded.match(/url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/gi) ?? [];
  for (const um of urlMatches) {
    const inner = um.replace(/^url\s*\(\s*['"]?/, '').replace(/['"]?\s*\)$/, '').trim();
    if (!inner.startsWith('#')) {
      issues.push(`External url("${inner}") is prohibited in SVG.`);
    }
  }
  const styleAttrMatches = decoded.match(/\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi) ?? [];
  for (const sm of styleAttrMatches) {
    if (/expression\s*\(|@import|behavior\s*:|-moz-binding/i.test(sm)) {
      issues.push('Unsafe CSS construct (expression/@import) detected in SVG style attribute.');
    }
  }

  return issues;
}

export function assertSafeSvg(svgCode: string, contextLabel: string): void {
  const issues = auditSvgSecurity(svgCode);
  if (issues.length > 0) {
    throw new Error(`SVG security check FAILED for ${contextLabel}:\n - ${issues.join('\n - ')}`);
  }
}

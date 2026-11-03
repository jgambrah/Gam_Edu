/**
 * Custom fee items — lets a school add a fee that is not in the built-in Fee Type list.
 *
 * Design (additive — nothing existing changes):
 *  - A school's custom items live in ONE document: schoolSettings/{schoolId}/billing/customFeeItems
 *    (finance staff of that school may write it under the existing schoolSettings rules).
 *  - A bill made from a custom item stores the item's name in `type` — the same field the ledger, receipts,
 *    parent "By fee type" view and credit allocation already read — so it shows up everywhere with no change.
 *  - The bill also carries `feeCategory` (the fee family it reports under) so reports bucket it correctly.
 *    Bills without it behave exactly as before.
 */

export const BUILT_IN_FEE_TYPES = [
  'Tuition Fee',
  'Admission Fee',
  'Maintenance Fee',
  'Examination Fee',
  'PTA Levy',
  'Library Fine',
  'Lab Fee',
  'Sports Fee',
  'Canteen Fee',
  'Canteen Fee (Daily)',
  'Canteen Fee (Termly)',
  'Transport Fee',
  'Transport Fee (Daily)',
  'Transport Fee (Termly)',
  'Other',
  'Correction / Reversal',
] as const;

/** The fee families that Accounts > Student Billing reports on. */
export const FEE_CATEGORIES = ['Tuition', 'Canteen', 'Transport', 'PTA Levy', 'Other'] as const;
export type FeeCategory = (typeof FEE_CATEGORIES)[number];

export const CUSTOM_FEE_NAME_MAX = 60;
export const CUSTOM_FEE_ITEMS_MAX = 100;

export interface CustomFeeItem {
  /** Stable id (never reused), e.g. "cfi_k3j2…". */
  id: string;
  /** What the school calls it — this is what is stored in a bill's `type` and shown in the ledger. */
  name: string;
  /** The fee family it reports under. */
  category: FeeCategory;
  createdAt?: number;
  createdBy?: string;
}

/** Collapse whitespace so "  Graduation   Gown " and "Graduation Gown" are the same name. */
export const normalizeFeeName = (name: string): string => String(name || '').replace(/\s+/g, ' ').trim();

const keyOf = (name: string) => normalizeFeeName(name).toLowerCase();

/**
 * Returns an error message, or null when `name` can be added.
 * Names that would collide with built-in types, or with the daily/termly suffix the system uses to group
 * canteen & transport bills, are refused so existing grouping, reports and credit allocation never mix them up.
 */
export function validateCustomFeeName(name: string, existing: Pick<CustomFeeItem, 'name'>[] = []): string | null {
  const clean = normalizeFeeName(name);
  if (clean.length < 2) return 'Enter a name for the fee item (at least 2 characters).';
  if (clean.length > CUSTOM_FEE_NAME_MAX) return `Keep the name under ${CUSTOM_FEE_NAME_MAX} characters.`;
  if (!/[\p{L}\p{N}]/u.test(clean)) return 'The name must contain letters or numbers.';
  if (/[<>{}\[\]\\\/]/.test(clean)) return 'The name cannot contain < > { } [ ] / or \\.';
  if (/\((daily|termly)\)\s*$/i.test(clean)) return 'Names ending in (Daily) or (Termly) are reserved for canteen and transport billing.';
  if (/^(correction|reversal)\b/i.test(clean) || /opening balance|arrears|brought forward/i.test(clean)) {
    return 'That name is reserved for system adjustments. Choose a different name.';
  }
  const k = keyOf(clean);
  if (BUILT_IN_FEE_TYPES.some(t => keyOf(t) === k)) return 'That fee item is already in the list.';
  if (existing.some(e => keyOf(e.name) === k)) return 'Your school has already added that fee item.';
  return null;
}

export const isFeeCategory = (v: unknown): v is FeeCategory => FEE_CATEGORIES.includes(v as FeeCategory);

/** Pull valid items out of whatever is stored (ignores anything malformed rather than throwing). */
export function parseCustomFeeItems(raw: any): CustomFeeItem[] {
  const list = Array.isArray(raw?.items) ? raw.items : [];
  const seen = new Set<string>();
  const out: CustomFeeItem[] = [];
  for (const it of list) {
    const name = normalizeFeeName(it?.name);
    if (!it?.id || !name || seen.has(keyOf(name))) continue;
    seen.add(keyOf(name));
    out.push({
      id: String(it.id),
      name,
      category: isFeeCategory(it.category) ? it.category : 'Other',
      createdAt: typeof it.createdAt === 'number' ? it.createdAt : undefined,
      createdBy: typeof it.createdBy === 'string' ? it.createdBy : undefined,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extra fields written on a bill so it reports under the right family.
 *  - feeCategory: read by the Accounts reports (see finance-summary / financial-analytics).
 *  - category:    lower-case copy the term-rollover Cloud Function already reads first, so a custom name that
 *                 happens to contain "fee" is not itemised as tuition arrears.
 *  - isCustomFee: marks the bill as coming from a school-defined item.
 * Built-in types return {} so their bills are unchanged.
 */
export function customFeeBillFields(type: string, items: CustomFeeItem[]): Record<string, any> {
  const k = keyOf(type);
  const item = items.find(i => keyOf(i.name) === k);
  if (!item || BUILT_IN_FEE_TYPES.some(t => keyOf(t) === k)) return {};
  return { feeCategory: item.category, category: item.category.toLowerCase(), isCustomFee: true };
}

/** The fee family of a bill: its explicit mapping when it has one, otherwise null (caller falls back to its own rules). */
export function explicitFeeCategory(r: any): FeeCategory | null {
  return isFeeCategory(r?.feeCategory) ? r.feeCategory : null;
}

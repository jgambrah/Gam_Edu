/**
 * Public copy of each school's website data.
 *
 * The school website (/s/{slug}) and custom domains are visited by people who are not signed in. They used
 * to read the `schools` collection directly, which meant anyone on the internet could LIST every school on
 * the platform with all its settings (plan, AI credits, report-card settings, signature image...).
 *
 * Now the server keeps:
 *   publicSites/{slug}      — the school document WITHOUT private/billing fields (what the website shows)
 *   publicDomains/{domain}  — { slug } for a custom domain (domain stored lower-case, without "www.")
 * Both can be fetched by id only (no listing), so the `schools` collection no longer needs to be public.
 *
 * Kept current by onSchoolWriteForPublicSite (on every change to a school). Run rebuild-public-sites.js once
 * after deploying, to create them for existing schools.
 */
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) initializeApp();
const db = getFirestore();

/** Fields never published: subscription/billing, internal settings, signatures, and anything secret. */
const PRIVATE_FIELDS = new Set([
  'aiCredits', 'aiCreditBalance', 'plan', 'status', 'isActive', 'trialEndsAt', 'subscription', 'subscriptionStatus',
  'subscriptionPlan', 'planExpiresAt', 'billingStatus', 'headmasterSignature', 'headmasterSignatureUrl',
  'smsProvider', 'smsSenderId', 'enableSms', 'enableWhatsApp', 'paystackPubKey', 'enablePaystack', 'enableTransflow',
  'shopTillMode', 'customCostCenters', 'gradingSystem', 'caWeight', 'examWeight', 'reportCardPositionMode',
  'trackStaffOnWeekends', 'vacationMode', 'isSetupComplete', 'billsHaveArchiveFlag', 'ownerId', 'createdBy',
]);
const SECRET_PATTERN = /(secret|token|apikey|api_key|password|passwd|privatekey|private_key|instanceid|credential)/i;
const isPrivateKey = (k: string) => PRIVATE_FIELDS.has(k) || SECRET_PATTERN.test(k) || /^wa[A-Z]/.test(k);

export function publicSiteData(schoolId: string, data: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  Object.entries(data || {}).forEach(([k, v]) => { if (!isPrivateKey(k) && v !== undefined) out[k] = v; });
  out.id = schoolId;
  out.schoolId = schoolId;
  out.publishedAt = FieldValue.serverTimestamp();
  return out;
}

export const cleanSlug = (s: any) => String(s || '').trim().toLowerCase();
export const cleanDomain = (d: any) => String(d || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
const validId = (s: string) => !!s && !s.includes('/') && s !== '.' && s !== '..' && s.length <= 300;

/** Writes (or removes) one school's public copies. Exported for the one-off rebuild script. */
export async function syncPublicSite(schoolId: string, before: any | null, after: any | null): Promise<void> {
  const oldSlug = cleanSlug(before?.slug);
  const newSlug = after ? cleanSlug(after.slug) : '';
  const oldDomain = cleanDomain(before?.customDomain);
  const newDomain = after ? cleanDomain(after.customDomain) : '';

  // Remove copies under an old slug/domain — only if they belong to this school.
  const removeIfOwn = async (col: string, id: string) => {
    if (!validId(id)) return;
    const ref = db.collection(col).doc(id);
    const snap = await ref.get();
    if (snap.exists && snap.data()?.schoolId === schoolId) await ref.delete();
  };
  if (oldSlug && oldSlug !== newSlug) await removeIfOwn('publicSites', oldSlug);
  if (oldDomain && oldDomain !== newDomain) await removeIfOwn('publicDomains', oldDomain);

  if (!after) return;

  if (validId(newSlug)) {
    const ref = db.collection('publicSites').doc(newSlug);
    const existing = await ref.get();
    // Two schools must not share a web address: the school that has it keeps it.
    if (existing.exists && existing.data()?.schoolId && existing.data()?.schoolId !== schoolId) {
      console.warn(`[publicSite] slug "${newSlug}" already used by school ${existing.data()?.schoolId}; ${schoolId} not published.`);
    } else {
      await ref.set(publicSiteData(schoolId, after));
    }
  }
  if (validId(newDomain) && validId(newSlug)) {
    const ref = db.collection('publicDomains').doc(newDomain);
    const existing = await ref.get();
    if (!(existing.exists && existing.data()?.schoolId && existing.data()?.schoolId !== schoolId)) {
      await ref.set({ slug: newSlug, schoolId, updatedAt: FieldValue.serverTimestamp() });
    }
  }
}

export const onSchoolWriteForPublicSite = onDocumentWritten('schools/{schoolId}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  try {
    await syncPublicSite(event.params.schoolId, before, after);
  } catch (e: any) {
    console.error('[publicSite] sync failed for', event.params.schoolId, e?.message);
  }
});

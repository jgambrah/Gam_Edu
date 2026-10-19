import { FieldValue } from 'firebase-admin/firestore';

/**
 * SCHOOL SECRETS — server only.
 *
 * Payment and messaging credentials live in `schoolSecrets/{schoolId}`. The database rules deny all
 * browser access to that collection, so only server code (admin SDK) can read or write it.
 *
 * Older versions stored these keys on `schools/{id}` (publicly readable) and `schoolSettings/{id}`
 * (readable by every signed-in user). Until the migration has run for a school, reads fall back to
 * those legacy fields so payments and messages keep working without interruption.
 */

export const SECRET_FIELDS = ['paystackSecKey', 'smsApiKey', 'waInstanceId', 'waToken'] as const;
export type SecretField = (typeof SECRET_FIELDS)[number];
export type SchoolSecrets = Partial<Record<SecretField, string>>;

/** Legacy field names that also held a secret (read-only fallback, deleted on migration). */
const LEGACY_ALIASES: Partial<Record<SecretField, string[]>> = {
  smsApiKey: ['arkeselApiKey'],
};

type Db = FirebaseFirestore.Firestore;

const clean = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

function legacyValue(doc: any, field: SecretField): string | undefined {
  if (!doc) return undefined;
  return clean(doc[field]) || (LEGACY_ALIASES[field] || []).map(a => clean(doc[a])).find(Boolean);
}

/** Secrets for one school: the secure store first, then (temporarily) the legacy locations. */
export async function getSchoolSecrets(db: Db, schoolId: string): Promise<SchoolSecrets> {
  const secureSnap = await db.collection('schoolSecrets').doc(schoolId).get();
  const secure: any = secureSnap.exists ? secureSnap.data() : {};
  const out: SchoolSecrets = {};
  SECRET_FIELDS.forEach(f => { const v = clean(secure?.[f]); if (v) out[f] = v; });
  if (SECRET_FIELDS.every(f => out[f])) return out;

  // Fallback while a school has not been migrated yet.
  const [settingsSnap, schoolSnap] = await Promise.all([
    db.collection('schoolSettings').doc(schoolId).get(),
    db.collection('schools').doc(schoolId).get(),
  ]);
  const settings = settingsSnap.exists ? settingsSnap.data() : null;
  const school = schoolSnap.exists ? schoolSnap.data() : null;
  SECRET_FIELDS.forEach(f => {
    if (!out[f]) {
      const v = legacyValue(settings, f) || legacyValue(school, f);
      if (v) out[f] = v;
    }
  });
  return out;
}

/** Last 4 characters only, for showing "saved ••••1234" in the UI. */
export function maskSecret(v?: string): string | null {
  if (!v) return null;
  return v.length <= 4 ? '••••' : `••••${v.slice(-4)}`;
}

/**
 * Moves any legacy secret fields of one school into `schoolSecrets` (without overwriting a value that is
 * already in the secure store), applies `updates`, then deletes the legacy fields from `schools` and
 * `schoolSettings`. Safe to run more than once.
 */
export async function migrateAndSaveSchoolSecrets(
  db: Db,
  schoolId: string,
  updates: SchoolSecrets = {},
  updatedBy = 'system'
): Promise<{ moved: SecretField[]; updated: SecretField[]; removedFrom: string[] }> {
  const secureRef = db.collection('schoolSecrets').doc(schoolId);
  const settingsRef = db.collection('schoolSettings').doc(schoolId);
  const schoolRef = db.collection('schools').doc(schoolId);

  const [secureSnap, settingsSnap, schoolSnap] = await db.getAll(secureRef, settingsRef, schoolRef);
  const secure: any = secureSnap.exists ? secureSnap.data() : {};
  const settings: any = settingsSnap.exists ? settingsSnap.data() : null;
  const school: any = schoolSnap.exists ? schoolSnap.data() : null;

  const toWrite: Record<string, any> = {};
  const moved: SecretField[] = [];
  const updated: SecretField[] = [];

  SECRET_FIELDS.forEach(f => {
    const incoming = clean(updates[f]);
    if (incoming) {
      toWrite[f] = incoming;
      updated.push(f);
      return;
    }
    if (!clean(secure?.[f])) {
      const legacy = legacyValue(settings, f) || legacyValue(school, f);
      if (legacy) {
        toWrite[f] = legacy;
        moved.push(f);
      }
    }
  });

  const legacyKeys = [...SECRET_FIELDS, ...Object.values(LEGACY_ALIASES).flat()] as string[];
  const removal = Object.fromEntries(legacyKeys.map(k => [k, FieldValue.delete()]));
  const removedFrom: string[] = [];

  const batch = db.batch();
  if (Object.keys(toWrite).length > 0) {
    batch.set(secureRef, { ...toWrite, schoolId, updatedAt: FieldValue.serverTimestamp(), updatedBy }, { merge: true });
  }
  if (settings && legacyKeys.some(k => k in settings)) { batch.update(settingsRef, removal); removedFrom.push('schoolSettings'); }
  if (school && legacyKeys.some(k => k in school)) { batch.update(schoolRef, removal); removedFrom.push('schools'); }
  await batch.commit();

  return { moved, updated, removedFrom };
}

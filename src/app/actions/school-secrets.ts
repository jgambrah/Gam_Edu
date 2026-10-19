'use server';

import { getAdminDb } from '@/lib/firebaseAdmin';
import { verifySchoolAdminToken, AuthError } from '@/lib/admin-guard';
import { getSchoolSecrets, maskSecret, migrateAndSaveSchoolSecrets, SECRET_FIELDS, type SchoolSecrets } from '@/lib/school-secrets';

export type SecretStatus = Record<(typeof SECRET_FIELDS)[number], string | null>;

/** Which keys are saved for a school, shown masked (••••1234). Never returns the keys themselves. */
export async function getSchoolSecretStatusAction(idToken: string, schoolId: string): Promise<{ ok: true; status: SecretStatus } | { ok: false; error: string }> {
  try {
    await verifySchoolAdminToken(idToken, schoolId);
    const secrets = await getSchoolSecrets(getAdminDb(), schoolId);
    const status = Object.fromEntries(SECRET_FIELDS.map(f => [f, maskSecret(secrets[f])])) as SecretStatus;
    return { ok: true, status };
  } catch (e: any) {
    return { ok: false, error: e instanceof AuthError ? e.message : 'Could not load saved keys.' };
  }
}

/**
 * Saves new keys (blank fields are left as they are) into the server-only store, and moves any keys still
 * sitting in the old public locations for this school.
 */
export async function saveSchoolSecretsAction(idToken: string, schoolId: string, updates: SchoolSecrets): Promise<{ ok: true; status: SecretStatus } | { ok: false; error: string }> {
  try {
    const admin = await verifySchoolAdminToken(idToken, schoolId);
    const safe: SchoolSecrets = {};
    SECRET_FIELDS.forEach(f => {
      const v = updates?.[f];
      if (typeof v === 'string' && v.trim()) {
        if (v.trim().length > 500) throw new AuthError('A key is too long.', 400);
        safe[f] = v.trim();
      }
    });
    const db = getAdminDb();
    await migrateAndSaveSchoolSecrets(db, schoolId, safe, admin.name);
    await db.collection('auditLogs').add({
      action: 'SCHOOL_SECRETS_UPDATED',
      schoolId,
      fields: Object.keys(safe),
      performedBy: admin.name,
      performedByUid: admin.uid,
      createdAt: new Date(),
    });
    const secrets = await getSchoolSecrets(db, schoolId);
    const status = Object.fromEntries(SECRET_FIELDS.map(f => [f, maskSecret(secrets[f])])) as SecretStatus;
    return { ok: true, status };
  } catch (e: any) {
    console.error('saveSchoolSecretsAction failed:', e?.message);
    return { ok: false, error: e instanceof AuthError ? e.message : 'Could not save keys.' };
  }
}

'use server';

import { getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { requireSignedIn, SessionError } from '@/lib/session-guard';
import {
  THINK_TANK_PARADOXES,
  THINK_TANK_DETECTIVE_CASES,
  THINK_TANK_RIDDLES,
  THINK_TANK_DEBATES,
} from '@/lib/think-tank-data';

const ALLOWED_ROLES = [
  'director',
  'administrator',
  'admin',
  'principal',
  'headmaster',
  'headmistress',
  'owner',
  'super_admin',
  'teacher',
];

export async function seedThinkTankCentralRepoAction(): Promise<{
  success: boolean;
  paradoxCount?: number;
  caseCount?: number;
  riddleCount?: number;
  debateCount?: number;
  totalCount?: number;
  message?: string;
  error?: string;
}> {
  try {
    const user = await requireSignedIn();
    const db = getAdminDb();

    if (!user.isSuperAdmin) {
      const [staffSnap, userSnap] = await Promise.all([
        db.collection('staff').doc(user.uid).get(),
        db.collection('users').doc(user.uid).get(),
      ]);
      const role = String(
        (staffSnap.exists ? staffSnap.data()?.role : '') ||
          (userSnap.exists ? userSnap.data()?.role : '') ||
          user.claims?.role ||
          ''
      ).toLowerCase();
      if (!ALLOWED_ROLES.includes(role)) {
        return {
          success: false,
          error: 'Only school administrators or teachers can sync the central Think Tank repository.',
        };
      }
    }

    const paradoxCount = THINK_TANK_PARADOXES.length;
    const caseCount = THINK_TANK_DETECTIVE_CASES.length;
    const riddleCount = THINK_TANK_RIDDLES.length;
    const debateCount = THINK_TANK_DEBATES.length;
    const totalCount = paradoxCount + caseCount + riddleCount + debateCount;

    const payload = {
      id: 'think_tank_v1',
      title: 'Think Tank Central Critical Thinking & Riddle Bank',
      version: '5.0.0',
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: user.uid,
      paradoxCount,
      caseCount,
      riddleCount,
      debateCount,
      totalCount,
      paradoxes: THINK_TANK_PARADOXES,
      detectiveCases: THINK_TANK_DETECTIVE_CASES,
      riddles: THINK_TANK_RIDDLES,
      debates: THINK_TANK_DEBATES,
    };

    await db.collection('global_curriculum').doc('think_tank_v1').set(payload, { merge: true });

    return {
      success: true,
      paradoxCount,
      caseCount,
      riddleCount,
      debateCount,
      totalCount,
      message: `Published ${totalCount} items (${paradoxCount} paradoxes, ${caseCount} detective cases, ${riddleCount} riddles, ${debateCount} debate motions) to global_curriculum/think_tank_v1.`,
    };
  } catch (e: any) {
    if (e instanceof SessionError) return { success: false, error: e.message };
    console.error('[think-tank-seed] failed:', e);
    return { success: false, error: e?.message || 'Could not seed central Think Tank repository.' };
  }
}


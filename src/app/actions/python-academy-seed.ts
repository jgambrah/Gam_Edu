'use server';

import { getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { requireSignedIn, SessionError } from '@/lib/session-guard';
import { PYTHON_ACADEMY_CURRICULUM, PYTHON_CHEAT_SHEETS } from '@/lib/python-academy-data';

const ALLOWED_ROLES = ['director', 'administrator', 'admin', 'principal', 'headmaster', 'headmistress', 'owner', 'super_admin', 'teacher'];

export async function seedPythonAcademyCentralCurriculumAction(): Promise<{
  success: boolean;
  phaseCount?: number;
  lessonCount?: number;
  cheatSheetCount?: number;
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
        user.claims?.role || ''
      ).toLowerCase();
      if (!ALLOWED_ROLES.includes(role)) {
        return { success: false, error: 'Only school administrators or teachers can seed the central curriculum.' };
      }
    }

    const lessonCount = PYTHON_ACADEMY_CURRICULUM.reduce(
      (sum, p) => sum + p.mainTopics.reduce((tSum, t) => tSum + t.lessons.length, 0),
      0
    );

    const payload = {
      id: 'python_academy_v1',
      title: "Python Academy & Beginner's Python Cheat Sheet (Python Crash Course)",
      version: '2.0.0',
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: user.uid,
      phaseCount: PYTHON_ACADEMY_CURRICULUM.length,
      lessonCount,
      cheatSheetCount: PYTHON_CHEAT_SHEETS.length,
      phases: PYTHON_ACADEMY_CURRICULUM,
      curriculum: PYTHON_ACADEMY_CURRICULUM,
      cheatSheets: PYTHON_CHEAT_SHEETS,
    };

    await db.collection('global_curriculum').doc('python_academy_v1').set(payload, { merge: true });

    return {
      success: true,
      phaseCount: PYTHON_ACADEMY_CURRICULUM.length,
      lessonCount,
      cheatSheetCount: PYTHON_CHEAT_SHEETS.length,
      message: `Published ${PYTHON_ACADEMY_CURRICULUM.length} phases (${lessonCount} lessons) and ${PYTHON_CHEAT_SHEETS.length} cheat sheets to global_curriculum/python_academy_v1.`,
    };
  } catch (e: any) {
    if (e instanceof SessionError) return { success: false, error: e.message };
    console.error('[python-academy-seed] failed:', e);
    return { success: false, error: e?.message || 'Could not seed central Python Academy curriculum.' };
  }
}

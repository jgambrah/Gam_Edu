import { NextResponse } from 'next/server';
import { executeTermFinancialRollover, planTermRollover } from '../../../../../functions/src/financial-rollover';
import { requireSchoolAdmin, AuthError } from '@/lib/admin-guard';

export const maxDuration = 300; // large schools: archiving thousands of bills takes a while

/**
 * POST /api/terms/rollover
 *   { schoolId, mode: 'dry-run' }                                → plan only, nothing written
 *   { schoolId, mode: 'execute', expectedFromTermId: '2025-2026_T1' } → closes that term
 * Administrators only. The term to close always comes from the school profile, never from the client.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { schoolId, mode, expectedFromTermId } = body || {};

    if (!schoolId || (mode !== 'dry-run' && mode !== 'execute')) {
      return NextResponse.json({ error: "Missing schoolId, or mode is not 'dry-run' / 'execute'." }, { status: 400 });
    }

    const adminUser = await requireSchoolAdmin(req, schoolId);

    if (mode === 'dry-run') {
      const plan = await planTermRollover(schoolId);
      // Keep the response small: per-student lines without the long source lists.
      return NextResponse.json({
        ...plan,
        recordIds: undefined,
        students: plan.students.map(({ sources, ...rest }) => ({ ...rest, sourceCount: sources.length })),
      });
    }

    if (!expectedFromTermId) {
      return NextResponse.json({ error: 'Run the dry run first (expectedFromTermId is required).' }, { status: 400 });
    }
    const result = await executeTermFinancialRollover(schoolId, {
      expectedFromTermId,
      performedBy: adminUser.name,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('API /api/terms/rollover Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to run the term rollover.' }, { status: 500 });
  }
}

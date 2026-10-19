import { NextResponse } from 'next/server';
import { listAcademicTerms, planAcademicClose, executeAcademicClose } from '../../../../../functions/src/academic-rollover';
import { requireSchoolAdmin, AuthError } from '@/lib/admin-guard';

export const maxDuration = 300;

/**
 * POST /api/terms/academic-close   (administrators only)
 *   { schoolId, mode: 'list' }                       → terms that can be closed
 *   { schoolId, mode: 'dry-run', termId }            → counts, nothing written
 *   { schoolId, mode: 'execute', termId }            → summarise, freeze and archive that term
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { schoolId, mode, termId } = body || {};
    if (!schoolId || !['list', 'dry-run', 'execute'].includes(mode)) {
      return NextResponse.json({ error: "Missing schoolId, or mode is not 'list' / 'dry-run' / 'execute'." }, { status: 400 });
    }
    const adminUser = await requireSchoolAdmin(req, schoolId);

    if (mode === 'list') return NextResponse.json({ terms: await listAcademicTerms(schoolId) });
    if (!termId) return NextResponse.json({ error: 'Choose a term.' }, { status: 400 });
    if (mode === 'dry-run') return NextResponse.json(await planAcademicClose(schoolId, termId));
    return NextResponse.json(await executeAcademicClose(schoolId, termId, adminUser.name));
  } catch (error: any) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('API /api/terms/academic-close Error:', error);
    return NextResponse.json({ error: error?.message || 'Academic close failed.' }, { status: 500 });
  }
}

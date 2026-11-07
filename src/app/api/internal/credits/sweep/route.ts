import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { sweepStaleCharges } from '@/lib/credits-server';

/**
 * Stale AI-credit charge sweep (refunds charges whose job never finished, e.g. a server crash).
 *
 * SAFE BY DEFAULT — and not scheduled by anything in this repo:
 *  • returns 404 unless CREDIT_SWEEP_ENABLED === 'true';
 *  • needs `Authorization: Bearer <CREDIT_SWEEP_SECRET>` (constant-time compare);
 *  • DRY RUN unless the body is {"apply": true};
 *  • returns aggregate numbers only (no names, no uids).
 */
export const dynamic = 'force-dynamic';

function authorised(req: Request): boolean {
  const secret = process.env.CREDIT_SWEEP_SECRET;
  if (!secret || secret.length < 24) return false;
  const given = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(given), b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (process.env.CREDIT_SWEEP_ENABLED !== 'true') return new NextResponse('Not found', { status: 404 });
  if (!authorised(req)) return new NextResponse('Unauthorized', { status: 401 });
  let body: any = {};
  try { body = await req.json(); } catch { /* empty body = dry run */ }
  const result = await sweepStaleCharges({ dryRun: body?.apply !== true, olderThanMs: Number(body?.olderThanMinutes) > 0 ? Number(body.olderThanMinutes) * 60_000 : undefined, limit: Number(body?.limit) || undefined });
  return NextResponse.json(result);
}

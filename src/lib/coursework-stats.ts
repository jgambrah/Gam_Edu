'use client';
/**
 * Statistics for the Assignments & Quizzes pages, computed with Firestore COUNT / SUM aggregations.
 *
 * READ COST: an aggregation is billed about 1 read per 1,000 matching records, so these figures cost a few
 * reads in total. Before, the pages kept live copies of EVERY submission, EVERY quiz attempt (with answers)
 * and EVERY student of the school just to work out three percentages — and those grow every day.
 */
import { collection, query, where, getCountFromServer, getAggregateFromServer, sum, getDoc, doc, type Firestore } from 'firebase/firestore';
import { readOnceCached } from '@/lib/firestore-once';

const LEFT = new Set(['inactive', 'withdrawn', 'graduated', 'transferred', 'alumni', 'dismissed', 'deceased']);
const TTL = 5 * 60 * 1000;

/** Students on roll per class. Uses the server-kept roster (1 read) when readable, else one COUNT per class. */
export async function classSizes(firestore: Firestore, schoolId: string, classIds: string[], tryRoster: boolean): Promise<Record<string, number>> {
    const ids = Array.from(new Set(classIds.filter(Boolean))).sort();
    const [sizes] = await readOnceCached<Record<string, number>>(`cw:sizes:${schoolId}:${tryRoster ? 'r' : 'c'}:${ids.join(',')}`, async () => {
        const out: Record<string, number> = {};
        ids.forEach(id => { out[id] = 0; });
        if (tryRoster) {
            try {
                const snap = await getDoc(doc(firestore, 'studentRoster', schoolId));
                const d: any = snap.exists() ? snap.data() : null;
                if (d?.students && !d.tooLarge) {
                    Object.values(d.students).forEach((s: any) => {
                        if (s?.classId in out && !LEFT.has(String(s.enrollmentStatus || '').toLowerCase()) && s.isArchived !== true) out[s.classId]++;
                    });
                    return [out];
                }
            } catch { /* not readable for this role — count instead */ }
        }
        await Promise.all(ids.map(async cid => {
            try {
                const c = await getCountFromServer(query(collection(firestore, 'students'),
                    where('schoolId', '==', schoolId), where('classId', '==', cid), where('enrollmentStatus', '==', 'Active')));
                out[cid] = c.data().count;
            } catch { out[cid] = 0; }
        }));
        return [out];
    }, { ttlMs: TTL });
    return sizes;
}

/** % of expected submissions received (each assignment's class size = expected; duplicates never exceed 100%). */
export async function submissionRate(firestore: Firestore, schoolId: string, assignments: Array<{ id: string; classId?: string }>, sizes: Record<string, number>): Promise<number | null> {
    const list = assignments.filter(a => a.id && a.classId && (sizes[a.classId] || 0) > 0);
    if (list.length === 0) return null;
    const counts = await readOnceCached<number>(`cw:subs:${schoolId}:${list.map(a => a.id).sort().join(',')}`, async () =>
        Promise.all(list.map(async a => {
            try {
                const c = await getCountFromServer(query(collection(firestore, 'submissions'), where('schoolId', '==', schoolId), where('assignmentId', '==', a.id)));
                return c.data().count;
            } catch { return 0; }
        })), { ttlMs: TTL });
    let expected = 0, actual = 0;
    list.forEach((a, i) => { const size = sizes[a.classId!] || 0; expected += size; actual += Math.min(counts[i] || 0, size); });
    return expected > 0 ? Math.round((actual / expected) * 100) : null;
}

/**
 * Average quiz score as % of questions answered correctly, FIRST attempts only (retakes are practice and,
 * because answers are shown after submitting, always score 100% — they used to inflate the average to 100%).
 * Pass quizIds to limit to some quizzes (e.g. one teacher's); otherwise the whole school.
 */
export async function quizAverage(firestore: Firestore, schoolId: string, quizIds?: string[]): Promise<number | null> {
    const ids = quizIds ? Array.from(new Set(quizIds)).sort() : null;
    if (ids && ids.length === 0) return null;
    const [res] = await readOnceCached<{ s: number; t: number }>(`cw:quizavg:${schoolId}:${ids ? ids.join(',') : 'all'}`, async () => {
        let s = 0, t = 0;
        const run = async (extra: any[]) => {
            const agg = await getAggregateFromServer(
                query(collection(firestore, 'quizAttempts'), where('schoolId', '==', schoolId), where('countsForGrade', '==', true), ...extra),
                { s: sum('score'), t: sum('total') }
            );
            s += Number(agg.data().s) || 0;
            t += Number(agg.data().t) || 0;
        };
        try {
            if (ids) { for (let i = 0; i < ids.length; i += 30) await run([where('quizId', 'in', ids.slice(i, i + 30))]); }
            else await run([]);
        } catch (e) { console.warn('Quiz average unavailable:', e); }
        return [{ s, t }];
    }, { ttlMs: TTL });
    return res.t > 0 ? Math.round((res.s / res.t) * 100) : null;
}

/** Number of quizzes (1 read). */
export async function quizCount(firestore: Firestore, schoolId: string): Promise<number | null> {
    try {
        const [n] = await readOnceCached<number>(`cw:quizcount:${schoolId}`, async () => {
            const c = await getCountFromServer(query(collection(firestore, 'quizzes'), where('schoolId', '==', schoolId)));
            return [c.data().count];
        }, { ttlMs: TTL });
        return n;
    } catch { return null; }
}

/** Newest first, by createdAt. */
export function newestFirst<T extends { createdAt?: any }>(list: T[]): T[] {
    const ms = (v: any) => (v?.toDate ? v.toDate().getTime() : v ? new Date(v).getTime() : 0) || 0;
    return [...list].sort((a, b) => ms(b.createdAt) - ms(a.createdAt));
}

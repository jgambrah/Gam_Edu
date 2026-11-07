'use client';

/**
 * Helpers shared by the Nursery Bloom (Junior Campus) activities.
 * Moved out of nursery-bloom/page.tsx unchanged (only `export` added) so activities can live in their own files.
 */

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast as showToast } from '@/hooks/use-toast';

// --- School scoping for Junior Campus content ---
// The page reads the school once and shares it, so each activity does not look it up again.
export const JuniorSchoolContext = createContext<string | null>(null);
export const useJuniorSchoolId = () => useContext(JuniorSchoolContext);

/** Who and which school a new item belongs to (older items without these stay shared). */
export const juniorStamp = (schoolId: string | null) => ({
    schoolId: schoolId || null,
    createdBy: getAuth().currentUser?.uid || null,
});

/** Shared items (no school) plus this school's own — never another school's. */
export function visibleForSchool<T extends { schoolId?: string | null }>(items: T[] | null | undefined, schoolId: string | null): T[] | null | undefined {
    if (!items) return items;
    return items.filter(d => !d.schoolId || d.schoolId === schoolId);
}

/** Delete with a clear message when the rules say no (only the person who added it, or the school's admin, may remove it). */
export async function removeJuniorDoc(firestore: any, coll: string, id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(firestore, coll, id));
        return true;
    } catch (err) {
        console.error(`Delete ${coll}/${id} failed:`, err);
        showToast({ title: 'Could not delete', description: 'Only the person who added this, or your school admin, can remove it.', variant: 'destructive' });
        return false;
    }
}

export const millisOf = (v: any) => (v?.toMillis ? v.toMillis() : (v?.seconds ? v.seconds * 1000 : 0));

/**
 * This school's items plus the ones I made (older items made before schools were recorded).
 * Two small, bounded listeners instead of one listener on every school's items.
 */
export function useSchoolAndMine(coll: string, schoolId: string | null, uid: string | null | undefined, max = 50) {
    const firestore = useFirestore();
    const schoolQ = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, coll), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), limit(max)) : null, [firestore, coll, schoolId, max]);
    const mineQ = useMemoFirebase(() => (firestore && uid) ? query(collection(firestore, coll), where('createdBy', '==', uid), orderBy('createdAt', 'desc'), limit(max)) : null, [firestore, coll, uid, max]);
    const a = useCollection<any>(schoolQ);
    const b = useCollection<any>(mineQ);
    const data = useMemo(() => {
        if (!a.data && !b.data) return null;
        const byId = new Map<string, any>();
        [...(a.data || []), ...(b.data || [])].forEach((d: any) => {
            if (!d.schoolId || d.schoolId === schoolId) byId.set(d.id, d);
        });
        return Array.from(byId.values()).sort((x, y) => millisOf(y.createdAt) - millisOf(x.createdAt));
    }, [a.data, b.data, schoolId]);
    const forceRefetch = useCallback(() => { a.forceRefetch?.(); b.forceRefetch?.(); }, [a, b]);
    return { data, forceRefetch };
}

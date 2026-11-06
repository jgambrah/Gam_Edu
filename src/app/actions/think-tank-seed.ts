'use server';

import { getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { requireSignedIn, SessionError } from '@/lib/session-guard';
import {
  THINK_TANK_DATA_VERSION,
  THINK_TANK_PARADOXES,
  THINK_TANK_DETECTIVE_CASES,
  THINK_TANK_RIDDLES,
  THINK_TANK_DEBATES,
} from '@/lib/think-tank-data';
import { toPublicParadoxes, type PublicParadox } from '@/lib/think-tank-public-paradox';
import {
  THINK_TANK_PUBLIC_V2_VERSION,
  toPublicDetectiveCases,
  toPublicRiddles,
  toPublicDebates,
  type PublicDetectiveCase,
  type PublicRiddle,
  type PublicDebate,
} from '@/lib/think-tank-public-challenges';

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

    const SHARD_SIZE = 400;
    const shardIds: string[] = [];
    const shardWrites: Array<{ id: string; data: Record<string, unknown> }> = [];

    const chunkArray = <T>(arr: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    const categories: Array<{ key: string; prefix: string; items: unknown[] }> = [
      { key: 'paradoxes', prefix: 'think_tank_v1_paradoxes', items: THINK_TANK_PARADOXES },
      { key: 'detectiveCases', prefix: 'think_tank_v1_cases', items: THINK_TANK_DETECTIVE_CASES },
      { key: 'riddles', prefix: 'think_tank_v1_riddles', items: THINK_TANK_RIDDLES },
      { key: 'debates', prefix: 'think_tank_v1_debates', items: THINK_TANK_DEBATES },
    ];

    for (const cat of categories) {
      const chunks = chunkArray(cat.items, SHARD_SIZE);
      chunks.forEach((chunk, idx) => {
        const shardId = `${cat.prefix}_${idx}`;
        shardIds.push(shardId);
        shardWrites.push({
          id: shardId,
          data: {
            id: shardId,
            parentId: 'think_tank_v1',
            version: THINK_TANK_DATA_VERSION,
            kind: cat.key,
            index: idx,
            count: chunk.length,
            items: chunk,
            updatedAt: FieldValue.serverTimestamp(),
          },
        });
      });
    }

    await Promise.all(
      shardWrites.map((s) => db.collection('global_curriculum').doc(s.id).set(s.data))
    );

    const manifestPayload = {
      id: 'think_tank_v1',
      title: 'Think Tank Central Critical Thinking & Riddle Bank',
      version: THINK_TANK_DATA_VERSION,
      sharded: true,
      shardIds,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: user.uid,
      paradoxCount,
      caseCount,
      riddleCount,
      debateCount,
      totalCount,
    };

    await db.collection('global_curriculum').doc('think_tank_v1').set(manifestPayload);

    // Publish v2 public shards (sanitized allowlist without answers, explanations, or rubrics)
    const publicParadoxes: PublicParadox[] = toPublicParadoxes(THINK_TANK_PARADOXES);
    const publicCases: PublicDetectiveCase[] = toPublicDetectiveCases(THINK_TANK_DETECTIVE_CASES);
    const publicRiddles: PublicRiddle[] = toPublicRiddles(THINK_TANK_RIDDLES);
    const publicDebates: PublicDebate[] = toPublicDebates(THINK_TANK_DEBATES);

    const v2Categories: Array<{ key: string; prefix: string; items: unknown[] }> = [
      { key: 'paradoxes', prefix: 'think_tank_v2_paradoxes', items: publicParadoxes },
      { key: 'detectiveCases', prefix: 'think_tank_v2_cases', items: publicCases },
      { key: 'riddles', prefix: 'think_tank_v2_riddles', items: publicRiddles },
      { key: 'debates', prefix: 'think_tank_v2_debates', items: publicDebates },
    ];

    const v2ShardIds: string[] = [];
    const v2ShardWrites: Array<{ id: string; data: Record<string, unknown> }> = [];

    const splitIntoTwoShards = <T>(arr: T[]): [T[], T[]] => {
      const mid = Math.ceil(arr.length / 2);
      return [arr.slice(0, mid), arr.slice(mid)];
    };

    for (const cat of v2Categories) {
      const chunks = splitIntoTwoShards(cat.items);
      chunks.forEach((chunk, idx) => {
        const shardId = `${cat.prefix}_${idx}`;
        v2ShardIds.push(shardId);
        v2ShardWrites.push({
          id: shardId,
          data: {
            id: shardId,
            parentId: 'think_tank_v2',
            version: THINK_TANK_PUBLIC_V2_VERSION,
            schemaVersion: 2,
            isPublicSanitized: true,
            kind: cat.key,
            index: idx,
            count: chunk.length,
            items: chunk,
            updatedAt: FieldValue.serverTimestamp(),
          },
        });
      });
    }

    await Promise.all(
      v2ShardWrites.map((s) => db.collection('global_curriculum').doc(s.id).set(s.data))
    );

    const v2TotalCount =
      publicParadoxes.length + publicCases.length + publicRiddles.length + publicDebates.length;

    await db.collection('global_curriculum').doc('think_tank_v2').set({
      id: 'think_tank_v2',
      title: 'Think Tank Public Critical Thinking Bank (v2 Sanitized)',
      version: THINK_TANK_PUBLIC_V2_VERSION,
      schemaVersion: 2,
      sharded: true,
      shardIds: v2ShardIds,
      paradoxCount: publicParadoxes.length,
      caseCount: publicCases.length,
      riddleCount: publicRiddles.length,
      debateCount: publicDebates.length,
      totalCount: v2TotalCount,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: user.uid,
    });

    return {
      success: true,
      paradoxCount,
      caseCount,
      riddleCount,
      debateCount,
      totalCount,
      message: `Published ${totalCount} items across ${shardIds.length} shards (${paradoxCount} paradoxes, ${caseCount} detective cases, ${riddleCount} riddles, ${debateCount} debate motions) to global_curriculum/think_tank_v1.`,
    };
  } catch (e: any) {
    if (e instanceof SessionError) return { success: false, error: e.message };
    console.error('[think-tank-seed] failed:', e);
    return { success: false, error: e?.message || 'Could not seed central Think Tank repository.' };
  }
}


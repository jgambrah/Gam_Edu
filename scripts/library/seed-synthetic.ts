/**
 * Synthetic story seeding (EMULATOR / IN-MEMORY ONLY). Seeds DRAFTS; a human must approve and publish them.
 *
 *   npx tsx scripts/library/seed-synthetic.ts --count 1000 --seed 1                 # in-memory dry run (default)
 *   npx tsx scripts/library/seed-synthetic.ts --count 1000 --target emulator        # Firestore emulator (needs FIRESTORE_EMULATOR_HOST)
 *   npx tsx scripts/library/seed-synthetic.ts --count 1000 --rollback               # seed, then roll the job back
 *
 * It refuses to run against anything but the emulators: see src/lib/story-library/seeder/guard.ts.
 */
import { MemoryBackend } from '../../src/lib/story-library/seeder/memory-backend';
import { createEmulatorBackend } from '../../src/lib/story-library/seeder/firestore-backend';
import { rollbackJob, runSeed } from '../../src/lib/story-library/seeder/seeder';
import { generateCorpus } from '../../src/lib/story-library/seeder/synthetic';
import type { SeedBackend } from '../../src/lib/story-library/seeder/types';

const arg = (name: string, def?: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? def : (process.argv[i + 1]?.startsWith('--') || process.argv[i + 1] === undefined ? 'true' : process.argv[i + 1]);
};

async function main() {
  const count = Number(arg('count', '1000'));
  const seed = Number(arg('seed', '1'));
  const target = arg('target', 'memory');
  const parallel = Number(arg('parallel', '4'));
  const projectId = arg('project', 'demo-gam-edu-seeder')!;
  const corpus = generateCorpus({ count, seed });
  console.log(`corpus: ${corpus.stories.length} synthetic stories (${corpus.distinct.length} distinct, ${corpus.planted.exact.length} exact + ${corpus.planted.near.length} near duplicates planted)`);

  let backend: SeedBackend;
  let close = async () => {};
  let mem: MemoryBackend | undefined;
  if (target === 'emulator') {
    const e = createEmulatorBackend(projectId, { useStorageEmulator: !!process.env.FIREBASE_STORAGE_EMULATOR_HOST });
    backend = e.backend; close = e.close;
  } else if (target === 'memory') {
    mem = new MemoryBackend({ yieldToLoop: false }); backend = mem;
  } else throw new Error(`unknown --target ${target} (use memory or emulator)`);

  const t0 = performance.now();
  const s = await runSeed(backend, corpus.stories, { owner: `cli-${process.pid}`, parallel });
  const ms = performance.now() - t0;
  console.log(JSON.stringify({ ...s, wallMs: Math.round(ms), perStoryMs: +(ms / corpus.stories.length).toFixed(2), memoryStats: mem?.stats }, null, 2));
  if (arg('rollback') === 'true') console.log('rollback:', JSON.stringify(await rollbackJob(backend, s.jobId)));
  await close();
}
main().catch((e) => { console.error(e instanceof Error ? `${e.name}: ${e.message}` : e); process.exit(1); });

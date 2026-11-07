/**
 * Safety guards for the Stage 2 seeder. It may run only against the local emulators with a `demo-` project, with no real
 * credentials in the environment, and only on synthetic stories. Mirrors the intent of src/lib/staging-guard.ts.
 * Deliberately does NOT use src/lib/firebaseAdmin.ts, whose fallback is real production credentials.
 */
import type { StoryInput } from './types';

export const PRODUCTION_PROJECT_ID = 'gamedu-69888475-f5783';

export class SeederGuardError extends Error { constructor(msg: string) { super(msg); this.name = 'SeederGuardError'; } }

type Env = Record<string, string | undefined>;

export function assertEmulatorOnly(projectId: string | undefined, env: Env, opts: { needStorage?: boolean } = {}): string {
  if (!projectId) throw new SeederGuardError('A project id is required (use a demo- project).');
  if (projectId === PRODUCTION_PROJECT_ID) throw new SeederGuardError('Refusing: this is the production project.');
  if (!projectId.startsWith('demo-')) throw new SeederGuardError(`Refusing: project "${projectId}" is not a demo- emulator project.`);
  if (!env.FIRESTORE_EMULATOR_HOST) throw new SeederGuardError('Refusing: FIRESTORE_EMULATOR_HOST is not set, so this would reach a real database.');
  if (opts.needStorage && !env.FIREBASE_STORAGE_EMULATOR_HOST) throw new SeederGuardError('Refusing: FIREBASE_STORAGE_EMULATOR_HOST is not set.');
  for (const k of ['GOOGLE_APPLICATION_CREDENTIALS', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL']) {
    if (env[k]) throw new SeederGuardError(`Refusing: ${k} is set. The seeder runs without real credentials.`);
  }
  return projectId;
}

export function assertSyntheticOnly(stories: StoryInput[]): void {
  const bad = stories.filter((s) => (s as { synthetic?: unknown }).synthetic !== true);
  if (bad.length) throw new SeederGuardError(`Refusing: ${bad.length} stor${bad.length === 1 ? 'y is' : 'ies are'} not marked synthetic (first: ${bad[0]?.storyKey}). Stage 2 seeds synthetic stories only.`);
}

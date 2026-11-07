export const PRODUCTION_PROJECT_ID = 'gamedu-69888475-f5783';

/** Seeding synthetic data is allowed only into the emulator or a project whose id starts with "gamedu-staging". */
export function checkStagingTarget(projectId: string | undefined, opts: { emulator: boolean }): string | null {
  if (opts.emulator) return null;
  if (!projectId) return 'No project id. Set FIREBASE_PROJECT_ID to your staging project.';
  if (projectId === PRODUCTION_PROJECT_ID) return 'Refusing: that is the PRODUCTION project.';
  if (!/^gamedu-staging[a-z0-9-]*$/.test(projectId)) return `Refusing: "${projectId}" is not a staging project (its id must start with "gamedu-staging").`;
  return null;
}

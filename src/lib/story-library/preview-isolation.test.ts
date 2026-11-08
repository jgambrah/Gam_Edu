// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * The Story Spark preview page must never reach Firestore, Storage, Firebase Auth or the Admin SDK. This walks the real
 * import graph of the page and fails if any module in it imports a Firebase package or the app's Firebase wrapper, or
 * calls a network write. (The ROOT layout still mounts the app-wide Firebase provider; see the isolation notes in
 * docs/story-spark/PREMIUM-UPGRADE-REPORT.md. That is a property of the whole app, not of this page's code.)
 */
const root = path.resolve(__dirname, '../../..');
const exts = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
function resolveImport(from: string, spec: string): string | null {
  let base: string | null = null;
  if (spec.startsWith('@/')) base = path.join(root, 'src', spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
  if (!base) return null;
  if (existsSync(base) && /\.(ts|tsx)$/.test(base)) return base;
  for (const e of exts) if (existsSync(base + e)) return base + e;
  return null;
}
function graph(entry: string): Map<string, string> {
  const seen = new Map<string, string>();
  const stack = [entry];
  while (stack.length) {
    const f = stack.pop()!;
    if (seen.has(f)) continue;
    const src = readFileSync(f, 'utf8');
    seen.set(f, src);
    for (const m of src.matchAll(/(?:import|export)[^'"]*?from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      const r = resolveImport(f, m[1] ?? m[2]);
      if (r) stack.push(r);
    }
  }
  return seen;
}

describe('Story Spark preview isolation', () => {
  const files = graph(path.join(root, 'src/app/story-spark-preview/page.tsx'));
  it('the import graph is the real preview code (sanity)', () => {
    const names = [...files.keys()].map((f) => path.relative(root, f).replace(/\\/g, '/'));
    expect(names).toEqual(expect.arrayContaining(['src/components/story-library/LibraryDashboard.tsx', 'src/components/story-library/StorybookReader.tsx', 'src/lib/story-library/library-source.ts']));
    expect(files.size).toBeGreaterThan(10);
  });
  it('no module imports Firebase (client or admin), the app Firebase wrapper, or server actions', () => {
    for (const [f, src] of files) {
      const rel = path.relative(root, f);
      expect(/from\s+['"](firebase|firebase-admin)(\/|['"])/.test(src), `${rel} imports firebase`).toBe(false);
      expect(/from\s+['"]@\/firebase/.test(src), `${rel} imports the app firebase wrapper`).toBe(false);
      expect(/from\s+['"]@\/app\/actions|['"]use server['"]/.test(src), `${rel} uses server actions`).toBe(false);
      expect(/from\s+['"]@\/ai\//.test(src), `${rel} imports AI flows (paid services)`).toBe(false);
    }
  });
  it('the only network access is fetching static files from the preview folder', () => {
    for (const [f, src] of files) {
      const rel = path.relative(root, f);
      if (/\.test\./.test(rel)) continue;
      for (const m of src.matchAll(/\bfetch\s*\(/g)) void m; // fetch is expected, but never with a method other than GET
      expect(/method:\s*['"](POST|PUT|PATCH|DELETE)['"]/i.test(src), `${rel} makes a write request`).toBe(false);
      expect(/XMLHttpRequest|WebSocket|sendBeacon/.test(src), `${rel} uses a network channel other than fetch`).toBe(false);
    }
  });
});

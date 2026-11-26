/**
 * Read-only security & compatibility audit for all published narrated-lesson SVGs on CDN.
 *
 * Usage:
 *   npx tsx scripts/lessons/audit-cdn-svgs.ts
 *
 * Requires no credentials or private tokens (reads public CDN catalogue & lesson packages only).
 */
import { JSDOM } from 'jsdom';
import {
  NARRATED_LESSON_CDN_BUCKET,
  NARRATED_LESSON_CDN_PREFIX,
  type NarratedLesson,
} from '../../src/lib/narrated-lessons/types';
import {
  auditSvgSecurity,
  createSvgPurifier,
  sanitizeSvg,
} from '../../src/lib/narrated-lessons/svg-sanitizer';

const CDN_BASE = `https://firebasestorage.googleapis.com/v0/b/${NARRATED_LESSON_CDN_BUCKET}/o/`;

async function fetchPublicJson<T>(remotePath: string): Promise<T> {
  const url = `${CDN_BASE}${encodeURIComponent(remotePath)}?alt=media`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${remotePath}`);
  }
  return (await res.json()) as T;
}

async function main() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const purifier = createSvgPurifier(dom.window as unknown as Window & typeof globalThis);

  const catalogue = await fetchPublicJson<{
    version: number;
    entries: Array<{ lessonId: string; curriculum?: string; subject: string; packagePath: string }>;
  }>(`${NARRATED_LESSON_CDN_PREFIX}/catalogue.json`);

  let lessonsChecked = 0;
  let svgsChecked = 0;
  let passedAudit = 0;
  let flaggedByAudit = 0;
  let rejectedEmpty = 0;
  const findings: Array<{ lessonId: string; slideId: string; issues: string[] }> = [];

  for (const entry of catalogue.entries || []) {
    const pkg = await fetchPublicJson<NarratedLesson>(
      `${NARRATED_LESSON_CDN_PREFIX}/${entry.packagePath}`
    );
    lessonsChecked++;

    for (const slide of pkg.slides || []) {
      if (slide.visual?.type !== 'svg' || !slide.visual.svgCode) continue;
      svgsChecked++;
      const issues = auditSvgSecurity(slide.visual.svgCode);
      const cleaned = sanitizeSvg(slide.visual.svgCode, purifier);

      if (issues.length === 0) {
        passedAudit++;
      } else {
        flaggedByAudit++;
        findings.push({ lessonId: entry.lessonId, slideId: slide.id, issues });
      }
      if (!cleaned) {
        rejectedEmpty++;
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        catalogueVersion: catalogue.version,
        lessonsChecked,
        svgsChecked,
        passedAudit,
        flaggedByAudit,
        rejectedEmpty,
        findings,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error('[audit-cdn-svgs] ERROR:', err);
  process.exit(1);
});

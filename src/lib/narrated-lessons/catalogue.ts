import {
  NARRATED_LESSON_CDN_BUCKET,
  NARRATED_LESSON_CDN_PREFIX,
  type NarratedLesson,
} from './types';
import type { LessonNotesPackage } from './notes-types';

export type CurriculumSystem = 'ges' | 'cambridge';

export interface ClassBand {
  id: string;
  label: string;
  classes: string[];
}

export const CLASS_BANDS: readonly ClassBand[] = [
  {
    id: 'early-years',
    label: 'Early Years',
    classes: ['Creche', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2'],
  },
  {
    id: 'lower-primary',
    label: 'Lower Primary',
    classes: ['Basic 1', 'Basic 2', 'Basic 3'],
  },
  {
    id: 'upper-primary',
    label: 'Upper Primary',
    classes: ['Basic 4', 'Basic 5', 'Basic 6'],
  },
  {
    id: 'jhs',
    label: 'Junior High (JHS)',
    classes: ['Basic 7', 'Basic 8', 'Basic 9'],
  },
];

export const CAMBRIDGE_CLASS_BANDS: readonly ClassBand[] = [
  {
    id: 'cam-primary',
    label: 'Cambridge Primary',
    classes: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
  },
  {
    id: 'cam-lower-secondary',
    label: 'Lower Secondary',
    classes: ['Year 7', 'Year 8', 'Year 9'],
  },
  {
    id: 'cam-igcse',
    label: 'Upper Secondary',
    classes: ['IGCSE'],
  },
  {
    id: 'cam-advanced',
    label: 'Cambridge Advanced',
    classes: ['AS Level', 'A Level'],
  },
];

export const ALL_CLASS_LEVELS: readonly string[] = CLASS_BANDS.flatMap((b) => b.classes);

export function normalizeCambridgeLevel(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (/a[\s-]*level|\ba2\b|year\s*13|yr\s*13|stage\s*13/.test(s) && !/as[\s-]*level/.test(s)) {
    return 'A Level';
  }
  if (/as[\s-]*level|year\s*12|yr\s*12|stage\s*12/.test(s)) {
    return 'AS Level';
  }
  if (/igcse|o[\s-]*level|year\s*1[01]|yr\s*1[01]|stage\s*1[01]/.test(s)) {
    return 'IGCSE';
  }
  const yr = s.match(/(?:year|yr|stage|grade|primary)\s*([1-9])\b/);
  if (yr) return `Year ${yr[1]}`;
  return null;
}

export function normalizeClassLevel(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (/creche/.test(s)) return 'Creche';
  const nur = s.match(/nursery\s*([12])/);
  if (nur) return `Nursery ${nur[1]}`;
  const kg = s.match(/k\.?g\.?\s*([12])/);
  if (kg) return `KG ${kg[1]}`;
  const jhs = s.match(/j\.?h\.?s\.?\s*([123])/);
  if (jhs) return `Basic ${Number(jhs[1]) + 6}`;
  const basic = s.match(/(?:basic|bs|b|primary|p)\s*([1-9])/);
  if (basic) return `Basic ${basic[1]}`;
  return null;
}

export function classDisplayLabel(classLevel: string): string {
  if (classLevel === 'Basic 7') return 'Basic 7 (JHS 1)';
  if (classLevel === 'Basic 8') return 'Basic 8 (JHS 2)';
  if (classLevel === 'Basic 9') return 'Basic 9 (JHS 3)';
  return classLevel;
}

export interface LessonCatalogueEntry {
  lessonId: string;
  slug?: string;
  curriculum?: CurriculumSystem;
  title: string;
  summary: string;
  class: string;
  subject: string;
  term: number;
  strand?: string;
  contentStandard: string;
  indicators: string[];
  slideCount: number;
  estimatedNarrationMinutes: number;
  estimatedTotalMinutes: number;
  schemaVersion: string;
  packagePath: string; // e.g. packages/bs7-sci-t1-water-cycle.<hash12>.json
  packageHash: string;
  notesPath?: string; // e.g. packages/b7-sci-t3-systems-ecosystem.notes.<hash12>.json
  notesHash?: string;
  coverImagePath?: string; // e.g. bs7-sci-t1-water-cycle/images/s01.webp
  status: 'published' | 'pilot' | 'draft';
  updatedAt: string;
}

export interface LessonCatalogue {
  catalogueVersion: number;
  updatedAt: string;
  entries: LessonCatalogueEntry[];
}

export function cdnObjectUrl(relPath: string): string {
  const clean = relPath.replace(/^\/+/, '');
  const objectPath = `${NARRATED_LESSON_CDN_PREFIX}/${clean}`;
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(NARRATED_LESSON_CDN_BUCKET)}/o/${encodeURIComponent(objectPath)}?alt=media`;
}

export function catalogueCdnUrl(): string {
  return cdnObjectUrl('catalogue.json');
}

export async function fetchLessonCatalogue(): Promise<LessonCatalogue> {
  // Respect CDN Cache-Control (public, max-age=60, stale-while-revalidate=300)
  const res = await fetch(catalogueCdnUrl());
  if (!res.ok) {
    throw new Error(`Failed to load lesson catalogue (HTTP ${res.status})`);
  }
  return (await res.json()) as LessonCatalogue;
}

export async function fetchLessonPackageById(lessonIdOrSlug: string): Promise<{
  entry: LessonCatalogueEntry;
  lesson: NarratedLesson;
  notes: LessonNotesPackage | null;
} | null> {
  const cat = await fetchLessonCatalogue();
  const entry = cat.entries.find(
    (e) => e.lessonId === lessonIdOrSlug || e.slug === lessonIdOrSlug,
  );
  if (!entry) return null;

  const pkgPromise = fetch(cdnObjectUrl(entry.packagePath), { cache: 'force-cache' });
  const notesPromise = entry.notesPath
    ? fetch(cdnObjectUrl(entry.notesPath), { cache: 'force-cache' }).catch(() => null)
    : Promise.resolve(null);

  const [pkgRes, notesRes] = await Promise.all([pkgPromise, notesPromise]);
  if (!pkgRes.ok) {
    throw new Error(`Failed to load lesson package ${entry.lessonId} (HTTP ${pkgRes.status})`);
  }
  const lesson = (await pkgRes.json()) as NarratedLesson;

  let notes: LessonNotesPackage | null = null;
  if (notesRes && notesRes.ok) {
    try {
      notes = (await notesRes.json()) as LessonNotesPackage;
    } catch {
      notes = null;
    }
  }
  return { entry, lesson, notes };
}

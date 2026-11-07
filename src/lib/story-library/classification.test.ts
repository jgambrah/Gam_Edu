// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  CATALOGUE_QUERY_SHAPES, CLASS_REGISTRY, CLASSIFICATION_VERSION, DEFAULT_REGISTRIES, GENRES, LANGUAGES, OBJECTIVES, READING_LEVELS,
  ageTiersFor, catalogueIndexes, errorsOf, matchShape, toCatalogueFacets, validateClassification, type Classification,
} from './classification';

const good = (over: Record<string, unknown> = {}): Classification => ({
  schemaVersion: CLASSIFICATION_VERSION, language: 'en', classIds: ['kg-1', 'kg-2'], ageMin: 4, ageMax: 6, readingLevel: 'emergent', difficulty: 2,
  genres: ['animal', 'moral'], themes: ['lost-and-found'], objectives: ['vocabulary', 'sequencing', 'kindness'], ghanaianContext: 'central',
  culturalTags: ['village-life'], estimatedDurationSec: 240, narrationLocale: 'en-GH', ...over,
} as Classification);
const errs = (c: unknown) => errorsOf(validateClassification(c));
const paths = (c: unknown) => errs(c).map((i) => i.path);

describe('vocabulary', () => {
  it('has exactly the classes, reading levels and core genres/objectives the product owner listed', () => {
    expect(CLASS_REGISTRY.map((c) => c.label)).toEqual(['Nursery 1', 'Nursery 2', 'KG 1', 'KG 2', 'Primary 1', 'Primary 2', 'Primary 3']);
    expect(READING_LEVELS.map((l) => l.label)).toEqual(['Pre-reader', 'Emergent reader', 'Early reader', 'Developing reader', 'Fluent reader']);
    for (const g of ['folktale', 'animal', 'adventure', 'bedtime', 'fantasy', 'science', 'nature', 'cultural', 'moral', 'educational', 'historical', 'humour'])
      expect(GENRES.map((x) => x.id)).toContain(g);
    for (const o of ['phonics', 'letter-recognition', 'vocabulary', 'reading-comprehension', 'sequencing', 'prediction', 'counting', 'reasoning', 'problem-solving',
      'emotional-intelligence', 'kindness', 'honesty', 'responsibility', 'environmental-awareness'])
      expect(OBJECTIVES.map((x) => x.id)).toContain(o);
  });
  it('identifiers are unique, lowercase slugs; class order is strictly increasing', () => {
    for (const reg of [CLASS_REGISTRY, READING_LEVELS, GENRES, OBJECTIVES, LANGUAGES]) {
      const ids = reg.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
    const orders = CLASS_REGISTRY.map((c) => c.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });
  it('ships NO curriculum codes (we do not invent them)', () => {
    const src = readFileSync(new URL('./classification.ts', import.meta.url), 'utf8');
    expect(src).not.toMatch(/\bB[0-9]\.[0-9]\.[0-9]/); // NaCCA-style indicator codes
  });
});

describe('validateClassification', () => {
  it('accepts a good classification with multiple classes, genres and objectives', () => {
    expect(errs(good())).toEqual([]);
  });
  it.each([
    ['unknown class', { classIds: ['kg-1', 'primary-9'] }, 'classIds'],
    ['no class', { classIds: [] }, 'classIds'],
    ['duplicate genre', { genres: ['animal', 'animal'] }, 'genres'],
    ['unknown genre', { genres: ['space-opera'] }, 'genres'],
    ['no objective', { objectives: [] }, 'objectives'],
    ['too many objectives', { objectives: OBJECTIVES.slice(0, 9).map((o) => o.id) }, 'objectives'],
    ['age order', { ageMin: 7, ageMax: 5 }, 'ageMax'],
    ['age out of range', { ageMin: 1 }, 'ageMin'],
    ['non-integer age', { ageMax: 6.5 }, 'ageMax'],
    ['unknown reading level', { readingLevel: 'expert' }, 'readingLevel'],
    ['difficulty 0', { difficulty: 0 }, 'difficulty'],
    ['difficulty 6', { difficulty: 6 }, 'difficulty'],
    ['duration too short', { estimatedDurationSec: 3 }, 'estimatedDurationSec'],
    ['bad ghanaianContext', { ghanaianContext: 'maybe' }, 'ghanaianContext'],
    ['cultural tags with context none', { ghanaianContext: 'none' }, 'culturalTags'],
    ['unknown cultural tag', { culturalTags: ['made-up'] }, 'culturalTags'],
    ['unknown field', { rating: 5 }, 'rating'],
    ['wrong schema version', { schemaVersion: 99 }, 'schemaVersion'],
    ['not a list', { classIds: 'kg-1' }, 'classIds'],
  ])('rejects: %s', (_n, over, path) => {
    expect(paths(good(over))).toContain(path);
  });
  it('rejects non-objects', () => { for (const x of [null, 5, 'x', []]) expect(errs(x).length).toBeGreaterThan(0); });

  describe('languages (English now, room for Ghanaian languages later)', () => {
    it('English is supported; Ghanaian languages are reserved but cannot be published yet', () => {
      expect(errs(good({ language: 'en' }))).toEqual([]);
      for (const l of ['ak', 'ee', 'gaa', 'dag', 'fat']) expect(paths(good({ language: l, narrationLocale: undefined }))).toContain('language');
      expect(paths(good({ language: 'fr' }))).toContain('language');
    });
    it('a registry update enables a language with no code change', () => {
      const reg = { ...DEFAULT_REGISTRIES, languages: LANGUAGES.map((l) => (l.id === 'ak' ? { ...l, supported: true } : l)) };
      expect(errorsOf(validateClassification(good({ language: 'ak', narrationLocale: 'ak-GH' }), reg))).toEqual([]);
    });
    it('the narration locale must belong to the language', () => {
      expect(paths(good({ narrationLocale: 'ak-GH' }))).toContain('narrationLocale');
      expect(errs(good({ narrationLocale: 'en-GB' }))).toEqual([]);
    });
  });

  describe('classes are extensible', () => {
    it('adding Primary 4 to the registry needs no other change', () => {
      expect(paths(good({ classIds: ['primary-4'], ageMin: 9, ageMax: 10 }))).toContain('classIds');
      const reg = { ...DEFAULT_REGISTRIES, classes: [...CLASS_REGISTRY, { id: 'primary-4', label: 'Primary 4', order: 8, stage: 'primary' as const, typicalAge: [9, 10] as [number, number] }] };
      expect(errorsOf(validateClassification(good({ classIds: ['primary-4'], ageMin: 9, ageMax: 10 }), reg))).toEqual([]);
      expect(toCatalogueFacets(good({ classIds: ['primary-3', 'primary-4'] }), reg).classMax).toBe(8);
    });
  });

  describe('curriculum alignment is never invented', () => {
    const cur = (r: Record<string, unknown>) => good({ curriculum: [{ framework: 'NaCCA', ...r }] });
    it('an unverified entry may carry a note but never a code', () => {
      expect(errs(cur({ verified: false, note: 'Likely supports early literacy' }))).toEqual([]);
      expect(paths(cur({ verified: false, note: 'x', code: 'B1.1.1.1' }))).toContain('curriculum[0].code');
      expect(paths(cur({ verified: false }))).toContain('curriculum[0].note');
    });
    it('a verified entry needs code, source, who verified and when', () => {
      expect(errs(cur({ verified: true, code: 'X', source: 'doc', verifiedBy: 'a', verifiedAt: '2026-01-01' }))).toEqual([]);
      for (const missing of ['code', 'source', 'verifiedBy', 'verifiedAt']) {
        const full: Record<string, unknown> = { verified: true, code: 'X', source: 'doc', verifiedBy: 'a', verifiedAt: '2026-01-01' };
        delete full[missing];
        expect(paths(cur(full))).toContain(`curriculum[0].${missing}`);
      }
    });
    it('only NaCCA is recognised and `verified` must be a boolean', () => {
      expect(paths(good({ curriculum: [{ framework: 'Other', verified: false, note: 'x' }] }))).toContain('curriculum[0].framework');
      expect(paths(cur({ verified: 'yes', note: 'x' }))).toContain('curriculum[0].verified');
    });
  });

  describe('warnings (for the human reviewer; never blocking)', () => {
    const warns = (c: unknown) => validateClassification(c).filter((i) => i.severity === 'warning').map((i) => i.path);
    it('flags a class whose typical age is far outside the recommended ages', () => {
      expect(warns(good({ classIds: ['primary-3'], ageMin: 4, ageMax: 5 }))).toContain('classIds');
      expect(warns(good())).not.toContain('classIds');
    });
    it('flags implausible combinations', () => {
      expect(warns(good({ readingLevel: 'fluent', classIds: ['nursery-1'], ageMin: 2, ageMax: 3 }))).toContain('readingLevel');
      expect(warns(good({ ageMin: 2, ageMax: 10 }))).toContain('ageMax');
      expect(warns(good({ readingLevel: 'pre-reader', difficulty: 5 }))).toContain('difficulty');
    });
    it('warnings alone never make a classification invalid', () => {
      expect(errs(good({ classIds: ['primary-3'], ageMin: 4, ageMax: 5 }))).toEqual([]);
    });
  });
});

describe('catalogue projection and filters', () => {
  it('projects only compact facets, with derived class range and age tiers', () => {
    const f = toCatalogueFacets(good());
    expect(f.classMin).toBe(3);
    expect(f.classMax).toBe(4);
    expect(f.classIds).toEqual(['kg-1', 'kg-2']);
    expect(Object.keys(f)).not.toContain('curriculum');
    expect(JSON.stringify(f).length).toBeLessThan(600);
  });
  it('ageTiersFor maps recommended ages onto the legacy display buckets', () => {
    expect(ageTiersFor(4, 6)).toEqual(['3-4', '5-6']);
    expect(ageTiersFor(7, 7)).toEqual(['7-8']);
    expect(ageTiersFor(8, 10)).toEqual(['7-8', '9-10']);
  });
  it('every supported query shape has exactly one composite index, with at most one array-contains', () => {
    const idx = catalogueIndexes();
    expect(idx.length).toBe(CATALOGUE_QUERY_SHAPES.filter((q) => q.equals.length || q.arrayContains).length);
    for (const i of idx) {
      expect(i.fields.filter((f) => f.arrayConfig).length).toBeLessThanOrEqual(1);
      expect(i.fields[0]).toEqual({ fieldPath: 'status', order: 'ASCENDING' });
      expect(i.fields[i.fields.length - 1]).toEqual({ fieldPath: 'sortKey', order: 'ASCENDING' });
    }
  });
  it('matchShape accepts the supported filter combinations and rejects the rest', () => {
    expect(matchShape({})?.id).toBe('all');
    expect(matchShape({ classId: 'kg-1' })?.id).toBe('by-class');
    expect(matchShape({ classId: 'kg-1', readingLevel: 'early' })?.id).toBe('by-class-level');
    expect(matchShape({ genre: 'animal', readingLevel: 'early' })?.id).toBe('by-genre-level');
    expect(matchShape({ genre: 'animal', classId: 'kg-1' })).toBeNull(); // two array-contains: not supported by Firestore
    expect(matchShape({ genre: 'animal', theme: 'family' })).toBeNull();
  });
  it('firestore.indexes.json (repo config, not deployed) contains every generated index', () => {
    const file = JSON.parse(readFileSync(new URL('../../../firestore.indexes.json', import.meta.url), 'utf8')) as { indexes: Array<{ collectionGroup: string; fields: unknown[] }> };
    const have = file.indexes.filter((i) => i.collectionGroup === 'story_catalogue').map((i) => JSON.stringify(i.fields));
    for (const want of catalogueIndexes()) expect(have).toContain(JSON.stringify(want.fields));
  });
});

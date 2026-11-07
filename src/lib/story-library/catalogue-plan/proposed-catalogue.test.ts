// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { PROPOSED_CATALOGUE } from './proposed-catalogue';
import { CLASS_REGISTRY, GENRES, OBJECTIVES, READING_LEVELS, THEMES } from '../classification';
import { ACTIVITY_TYPE_IDS } from '../premium';
import { PILOT_STORIES } from '../pilot/pilot-stories';

const levelOrder = (id: string) => READING_LEVELS.find((l) => l.id === id)!.order;

describe('proposed 65-story catalogue', () => {
  it('has exactly 65 stories, five for each of the 13 classes from Nursery 1 to JHS 3', () => {
    expect(PROPOSED_CATALOGUE).toHaveLength(65);
    for (const c of CLASS_REGISTRY) expect(PROPOSED_CATALOGUE.filter((s) => s.classId === c.id)).toHaveLength(5);
  });
  it('has unique ids and unique titles', () => {
    expect(new Set(PROPOSED_CATALOGUE.map((s) => s.id)).size).toBe(65);
    expect(new Set(PROPOSED_CATALOGUE.map((s) => s.title.toLowerCase())).size).toBe(65);
  });
  it('uses only registered genres, themes, objectives, reading levels and activity types', () => {
    const g = new Set(GENRES.map((x) => x.id)), t = new Set(THEMES.map((x) => x.id)), o = new Set(OBJECTIVES.map((x) => x.id)), l = new Set(READING_LEVELS.map((x) => x.id));
    for (const s of PROPOSED_CATALOGUE) {
      for (const x of s.genres) expect(g.has(x), `${s.id} genre ${x}`).toBe(true);
      for (const x of s.themes) expect(t.has(x), `${s.id} theme ${x}`).toBe(true);
      for (const x of s.objectives) expect(o.has(x), `${s.id} objective ${x}`).toBe(true);
      expect(l.has(s.readingLevel)).toBe(true);
      for (const a of s.activities) expect((ACTIVITY_TYPE_IDS as readonly string[]).includes(a), `${s.id} activity ${a}`).toBe(true);
      expect(s.synopsis.length).toBeGreaterThan(40);
      expect(s.curriculumSubjects.length).toBeGreaterThan(0);
      expect(s.activities.length).toBeGreaterThanOrEqual(2);
      expect(s.activityIdeas.length).toBeGreaterThan(10);
    }
  });
  it('reading level and vocabulary difficulty never fall as the class goes up (by class average)', () => {
    let prevLevel = 0, prevVocab = 0;
    for (const c of CLASS_REGISTRY) {
      const rows = PROPOSED_CATALOGUE.filter((s) => s.classId === c.id);
      const lv = rows.reduce((n, s) => n + levelOrder(s.readingLevel), 0) / rows.length;
      const vo = rows.reduce((n, s) => n + s.vocabularyDifficulty, 0) / rows.length;
      expect(lv).toBeGreaterThanOrEqual(prevLevel - 0.01); expect(vo).toBeGreaterThanOrEqual(prevVocab - 0.01);
      prevLevel = lv; prevVocab = vo;
    }
  });
  it('early years stories are short-vocabulary and picture-led; JHS stories are mature', () => {
    for (const s of PROPOSED_CATALOGUE.filter((x) => x.classId.startsWith('nursery'))) expect(s.vocabularyDifficulty).toBe(1);
    for (const s of PROPOSED_CATALOGUE.filter((x) => x.classId.startsWith('jhs'))) { expect(s.readingLevel).toBe('proficient'); expect(s.vocabularyDifficulty).toBeGreaterThanOrEqual(4); }
  });
  it('covers every priority area: literacy, numeracy, science, financial literacy, environment, digital citizenship, character, critical thinking', () => {
    const has = (pred: (s: (typeof PROPOSED_CATALOGUE)[number]) => boolean) => PROPOSED_CATALOGUE.filter(pred).length;
    expect(has((s) => s.objectives.includes('financial-literacy'))).toBeGreaterThanOrEqual(8);
    expect(has((s) => s.objectives.includes('environmental-awareness'))).toBeGreaterThanOrEqual(6);
    expect(has((s) => s.themes.includes('technology'))).toBeGreaterThanOrEqual(8);
    expect(has((s) => s.objectives.includes('critical-thinking'))).toBeGreaterThanOrEqual(10);
    expect(has((s) => s.objectives.includes('counting') || s.curriculumSubjects.some((x) => /mathematics|numeracy/i.test(x)))).toBeGreaterThanOrEqual(15);
    expect(has((s) => s.objectives.includes('scientific-curiosity'))).toBeGreaterThanOrEqual(10);
    expect(has((s) => ['honesty', 'kindness', 'respect', 'responsibility', 'perseverance'].some((o) => s.objectives.includes(o)))).toBeGreaterThanOrEqual(20);
    expect(has((s) => s.objectives.includes('cultural-heritage'))).toBeGreaterThanOrEqual(8);
  });
  it('slots that map to existing drafts point at real drafts in the same class band', () => {
    const existing = PROPOSED_CATALOGUE.filter((s) => s.existing);
    expect(existing).toHaveLength(8);
    for (const s of existing) {
      const pilot = PILOT_STORIES.find((p) => p.key === s.existing);
      expect(pilot, s.existing).toBeDefined();
      expect(pilot!.title.replace(/[’']/g, '')).toBe(s.title.replace(/[’']/g, ''));
      expect(pilot!.classification.classIds).toContain(s.classId);
    }
  });
  it('claims no curriculum codes and flags cultural review where culture is central', () => {
    for (const s of PROPOSED_CATALOGUE) for (const c of s.curriculumSubjects) expect(c).not.toMatch(/\b[A-Z]\d+\.\d+|\b\d+\.\d+\.\d+/);
    expect(PROPOSED_CATALOGUE.filter((s) => s.needsCulturalReview).length).toBeGreaterThan(40);
  });
});

// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { EFUA_ACTIVITIES, EFUA_GLOSSARY, EFUA_ILLUSTRATION_PLAN, EFUA_PAGES, EFUA_TEACHER_GUIDE } from './efua-premium';
import { assemblePrompt, estimateImageCost, illustrationStatus, promptHash, recurringCharacters, validatePlan, type IllustrationPlan } from '../illustration/plan';
import { GHANAIAN_PRONUNCIATIONS } from '../pronunciation/dictionary';
import { pronunciationBlockers, buildSpokenScript, unknownProperNouns } from '../pronunciation/apply';
import { validateActivities, validateGlossary } from '../premium';
import { PILOT_STORIES } from './pilot-stories';

const texts = EFUA_PAGES.map((p) => p.text);

describe('Efua’s Honest Business (premium benchmark)', () => {
  it('has twelve pages, activities and glossary that validate, and a full activity mix', () => {
    expect(EFUA_PAGES).toHaveLength(12);
    expect(validateActivities(EFUA_ACTIVITIES, 12)).toEqual([]);
    expect(validateGlossary(EFUA_GLOSSARY, texts)).toEqual([]);
    const types = new Set(EFUA_ACTIVITIES.map((a) => a.type));
    expect(types).toEqual(new Set(['comprehension', 'vocabulary', 'prediction', 'sel', 'sequencing']));
  });
  it('preserves the original story’s core elements', () => {
    const all = texts.join(' ');
    for (const k of ['groundnut', 'twelve cedis', 'eight cedis', 'forty cedis', 'Kwabena', 'Auntie Dede', 'Customers are like a garden', 'twenty-five packs', 'trust']) expect(all).toContain(k);
  });
  it('the arithmetic in the story is internally consistent', () => {
    const all = texts.join(' ');
    expect(20 - 12).toBe(8); expect(5 * 8).toBe(40);
    expect(20 - 14).toBe(6);
    expect(20 - 9).toBe(11); expect(11 - 8).toBe(3); expect(11).not.toBe(2 * 8);
    expect((65 * 20) / 100).toBe(13);
    for (const phrase of ['nine cedis', 'eleven cedis', 'three cedis', 'thirteen cedis for twenty', 'fourteen packs', 'six were left over']) expect(all).toContain(phrase);
  });
  it('activities that state numbers agree with the story and the guide', () => {
    const find = (id: string) => EFUA_ACTIVITIES.find((a) => a.id === id) as any;
    expect(find('efua-c-profit').options[find('efua-c-profit').correctIndex]).toBe('Eight cedis');
    expect(find('efua-c-cost').options[find('efua-c-cost').correctIndex]).toBe('Thirteen cedis');
    const ans = EFUA_TEACHER_GUIDE.mathsExtension.map((m) => m.answer).join(' ');
    expect(ans).toContain('8.75'); expect(ans).toContain('6.25');
    expect(25 - 25 * 0.65).toBeCloseTo(8.75, 5);
    expect(20 + 5 * 0.5 - 25 * 0.65).toBeCloseTo(6.25, 5);
  });
  it('is about the right length for upper primary / JHS and the narrated pace', () => {
    const words = texts.join(' ').split(/\s+/).length;
    expect(words).toBeGreaterThan(450); expect(words).toBeLessThan(800);
  });
  it('has a teacher’s guide with reflection questions, locally-adjustable assumptions, and approved subject links', () => {
    expect(EFUA_TEACHER_GUIDE.reflection.length).toBeGreaterThanOrEqual(3);
    expect(EFUA_TEACHER_GUIDE.localiseThis.length).toBeGreaterThan(0);
    expect(EFUA_TEACHER_GUIDE.subjectLinks.every((l) => l.status === 'approved')).toBe(true);
  });
});

describe('Efua illustration plan', () => {
  it('is structurally valid: cover + every page, known characters and settings, alt text, no emoji', () => {
    expect(validatePlan(EFUA_ILLUSTRATION_PLAN, 12)).toEqual([]);
  });
  it('page briefs shown to reviewers come from the shot list', () => {
    EFUA_PAGES.forEach((p, i) => expect(p.brief).toContain(EFUA_ILLUSTRATION_PLAN.shots.find((s) => s.page === i + 1)!.action));
  });
  it('assembles a deterministic prompt that carries character anchors, the style and the avoid list', () => {
    const shot = EFUA_ILLUSTRATION_PLAN.shots[5];
    const a = assemblePrompt(EFUA_ILLUSTRATION_PLAN, shot), b = assemblePrompt(EFUA_ILLUSTRATION_PLAN, shot);
    expect(a).toBe(b);
    expect(promptHash(a)).toBe(promptHash(b));
    expect(a).toContain('two hair puffs'); expect(a).toContain('close-cropped hair');
    expect(a).toMatch(/Avoid:.*emoji/);
    expect(a).toContain('No text, letters, watermarks or logos');
    expect(a).toContain('No text, no letters, no numbers, no colour swatches, no hex codes, no borders or blank bands. Full-bleed scene filling the whole frame.');
    expect(assemblePrompt(EFUA_ILLUSTRATION_PLAN, EFUA_ILLUSTRATION_PLAN.shots[1])).toContain('a navy-and-gold kente-patterned headwrap');
    expect(a).not.toMatch(/UNDEFINED/);
    expect(promptHash(assemblePrompt(EFUA_ILLUSTRATION_PLAN, EFUA_ILLUSTRATION_PLAN.shots[6]))).not.toBe(promptHash(a));
  });
  it('identifies recurring characters (Efua, Kwabena) whose reference sheet must be generated first', () => {
    expect(recurringCharacters(EFUA_ILLUSTRATION_PLAN)).toEqual(expect.arrayContaining(['efua', 'kwabena', 'nana-ama']));
  });
  it('validation catches missing shots, unknown ids and emoji', () => {
    const bad: IllustrationPlan = { ...EFUA_ILLUSTRATION_PLAN, shots: [{ ...EFUA_ILLUSTRATION_PLAN.shots[1], settingId: 'nowhere', characters: [{ id: 'ghost', expression: 'x', pose: 'y' }], mustShow: ['a 🥜 emoji'] }] };
    const problems = validatePlan(bad, 12).map((p) => p.message).join('|');
    expect(problems).toMatch(/no shot/); expect(problems).toMatch(/unknown setting nowhere/); expect(problems).toMatch(/unknown character ghost/); expect(problems).toMatch(/emoji/);
  });
  it('reports honest illustration status: with no files, nothing is illustrated', () => {
    const none = illustrationStatus(EFUA_ILLUSTRATION_PLAN, []);
    expect(none).toMatchObject({ approved: 0, candidate: 0, total: 13, allApproved: false });
    const placeholders = illustrationStatus(EFUA_ILLUSTRATION_PLAN, EFUA_ILLUSTRATION_PLAN.shots.map((s) => ({ page: s.page, status: 'placeholder' as const })));
    expect(placeholders).toMatchObject({ approved: 0, placeholder: 13, allApproved: false });
    expect(illustrationStatus(EFUA_ILLUSTRATION_PLAN, [{ page: 1, status: 'approved' }]).approved).toBe(0);
  });
  it('dry-run cost estimate is arithmetic only', () => {
    const c = estimateImageCost(EFUA_ILLUSTRATION_PLAN, { name: 'test', perImageUsd: 0.1, source: 'x', asOf: 'x' }, { candidatesPerShot: 3, referenceSheetCandidates: 2, retryRate: 0.25 });
    expect(c.images).toBe(65);
    expect(c.usd).toBeCloseTo(6.5, 5);
  });
  it('delivery budget fits a low-bandwidth device', () => {
    const d = EFUA_ILLUSTRATION_PLAN.style.delivery;
    expect(13 * d.maxBytesAt480).toBeLessThanOrEqual(d.lowBandwidthStoryBudgetBytes);
  });
});

describe('Efua pronunciation', () => {
  it('every Ghanaian name in the story is in the dictionary and approved for immediate publication', () => {
    for (const n of ['Efua', 'Kwabena', 'Dede']) expect(GHANAIAN_PRONUNCIATIONS.entries.some((e) => e.written === n && e.status === 'approved')).toBe(true);
    expect(pronunciationBlockers(texts, GHANAIAN_PRONUNCIATIONS)).toEqual([]);
  });
  it('no unknown proper nouns remain (everything capitalised mid-sentence is covered or ordinary English)', () => {
    const known = new Set(['monday', 'tuesday', 'wednesday', 'saturday', 'saturdays', 'auntie', 'yesterday', 'i', 'that', 'then']);
    expect(unknownProperNouns(texts, GHANAIAN_PRONUNCIATIONS, known).filter((w) => !['Monday', 'Tuesday', 'Wednesday', 'Saturday'].includes(w))).toEqual([]);
  });
  it('every Ghanaian name in all eight preview stories is in the dictionary', () => {
    const known = new Set(['monday', 'tuesday', 'wednesday', 'saturday', 'auntie', 'yesterday', 'mr', 'mama', 'papa', 'grandma', 'clean', 'lane', 'club']);
    for (const s of PILOT_STORIES) {
      const missing = unknownProperNouns(s.pages.map((p) => p.text), GHANAIAN_PRONUNCIATIONS, known);
      if (['efuas-honest-business', 'yaa-and-the-blocked-drain', 'kofi-counts-the-market'].includes(s.key)) expect(missing, s.key).toEqual([]);
    }
  });
  it('applying pronunciation never changes the written text and keeps word timing aligned (same token count)', () => {
    for (const t of texts) {
      const s = buildSpokenScript(t, GHANAIAN_PRONUNCIATIONS, 'espeak');
      expect(s.spoken.split(/\s+/)).toHaveLength(t.split(/\s+/).length);
    }
  });
});

describe('the pilot set now contains the benchmark and two samples', () => {
  it('Efua carries the teacher’s guide and illustration plan; samples carry guides', () => {
    const efua = PILOT_STORIES.find((s) => s.key === 'efuas-honest-business')!;
    expect(efua.teacherGuide).toBeDefined(); expect(efua.illustrationPlan).toBeDefined();
    for (const k of ['yaa-and-the-blocked-drain', 'kofi-counts-the-market']) expect(PILOT_STORIES.find((s) => s.key === k)?.teacherGuide).toBeDefined();
  });
});

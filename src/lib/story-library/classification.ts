/**
 * Educational classification for the central story library (Stage 3B).
 *
 * Goals: one controlled vocabulary, validated identifiers, multi-valued fields, efficient server-side catalogue filters
 * (no need to download the library), English now and room for Ghanaian languages later, and NO invented curriculum codes.
 *
 * Vocabulary is DATA: adding `primary-4`, a genre or a language is an append to a registry, never a schema change.
 * Identifiers are stable lowercase slugs; labels are for display only and may be re-worded without touching stored data.
 * Document: docs/STORY-LIBRARY-CLASSIFICATION.md
 */

export const CLASSIFICATION_VERSION = 1;

// ---------------------------------------------------------------------------------------------------- school classes

export interface SchoolClass {
  id: string;
  label: string;
  /** Position in the school ladder; used for ranges and ordering. Append higher numbers for later classes. */
  order: number;
  stage: 'nursery' | 'kindergarten' | 'primary' | 'jhs';
  /**
   * APPROXIMATE typical age range, used only to raise consistency WARNINGS against a story's recommended ages.
   * It is a planning aid, not an official statement: confirm against GES/NaCCA documents before relying on it.
   */
  typicalAge: [number, number];
}

export const CLASS_REGISTRY: readonly SchoolClass[] = [
  { id: 'nursery-1', label: 'Nursery 1', order: 1, stage: 'nursery', typicalAge: [2, 3] },
  { id: 'nursery-2', label: 'Nursery 2', order: 2, stage: 'nursery', typicalAge: [3, 4] },
  { id: 'kg-1', label: 'KG 1', order: 3, stage: 'kindergarten', typicalAge: [4, 5] },
  { id: 'kg-2', label: 'KG 2', order: 4, stage: 'kindergarten', typicalAge: [5, 6] },
  { id: 'primary-1', label: 'Primary 1', order: 5, stage: 'primary', typicalAge: [6, 7] },
  { id: 'primary-2', label: 'Primary 2', order: 6, stage: 'primary', typicalAge: [7, 8] },
  { id: 'primary-3', label: 'Primary 3', order: 7, stage: 'primary', typicalAge: [8, 9] },
  { id: 'primary-4', label: 'Primary 4', order: 8, stage: 'primary', typicalAge: [9, 10] },
  { id: 'primary-5', label: 'Primary 5', order: 9, stage: 'primary', typicalAge: [10, 11] },
  { id: 'primary-6', label: 'Primary 6', order: 10, stage: 'primary', typicalAge: [11, 12] },
  { id: 'jhs-1', label: 'JHS 1', order: 11, stage: 'jhs', typicalAge: [12, 13] },
  { id: 'jhs-2', label: 'JHS 2', order: 12, stage: 'jhs', typicalAge: [13, 14] },
  { id: 'jhs-3', label: 'JHS 3', order: 13, stage: 'jhs', typicalAge: [14, 15] },
];

// ---------------------------------------------------------------------------------------------------- reading levels

export interface ReadingLevel { id: string; label: string; order: number; description: string }
export const READING_LEVELS: readonly ReadingLevel[] = [
  { id: 'pre-reader', label: 'Pre-reader', order: 1, description: 'Listens; looks at pictures; little or no decoding.' },
  { id: 'emergent', label: 'Emergent reader', order: 2, description: 'Recognises letters and some words; follows text read aloud.' },
  { id: 'early', label: 'Early reader', order: 3, description: 'Decodes simple sentences with support.' },
  { id: 'developing', label: 'Developing reader', order: 4, description: 'Reads short passages with growing fluency.' },
  { id: 'fluent', label: 'Fluent reader', order: 5, description: 'Reads independently with expression.' },
  { id: 'proficient', label: 'Proficient reader', order: 6, description: 'Reads varied, longer texts; infers, compares and evaluates.' },
];

// ----------------------------------------------------------------------------------------------------- genres & themes

export interface Term { id: string; label: string }
const terms = (pairs: Array<[string, string]>): readonly Term[] => pairs.map(([id, label]) => ({ id, label }));

export const GENRES: readonly Term[] = terms([
  ['folktale', 'Folktale'], ['animal', 'Animal story'], ['adventure', 'Adventure'], ['bedtime', 'Bedtime story'],
  ['fantasy', 'Fantasy'], ['science', 'Science'], ['nature', 'Nature'], ['cultural', 'Cultural story'],
  ['moral', 'Moral story'], ['educational', 'Educational story'], ['historical', 'Historical story'], ['humour', 'Humour'],
  ['family', 'Family story'], ['friendship', 'Friendship story'], ['school-life', 'School-life story'], ['mystery', 'Mystery'],
  ['rhyme', 'Rhyme and poetry'],
  // Older learners (upper primary and JHS)
  ['realistic-fiction', 'Realistic fiction'], ['biography', 'Biography and real lives'], ['science-fiction', 'Science fiction'],
  ['informational', 'Informational text'], ['drama', 'Drama and plays'], ['poetry', 'Poetry'],
]);

export const THEMES: readonly Term[] = terms([
  ['family', 'Family'], ['friendship', 'Friendship'], ['school', 'School'], ['farm-and-garden', 'Farm and garden'],
  ['weather', 'Weather and seasons'], ['night-sky', 'Night sky'], ['helping-others', 'Helping others'], ['lost-and-found', 'Lost and found'],
  ['food', 'Food'], ['community', 'Community'], ['fear-and-courage', 'Fear and courage'], ['new-beginnings', 'New beginnings'],
  ['animals-and-habitats', 'Animals and habitats'], ['festivals', 'Festivals and celebrations'],
  ['identity', 'Identity and growing up'], ['leadership', 'Leadership'], ['technology', 'Technology and invention'],
  ['careers', 'Work and careers'], ['peer-pressure', 'Peer pressure and choices'], ['citizenship', 'Citizenship and community'],
  ['health-and-wellbeing', 'Health and wellbeing'], ['money-and-enterprise', 'Money and enterprise'],
]);

// ------------------------------------------------------------------------------------------------ educational objectives

export interface Objective extends Term { domain: 'literacy' | 'numeracy-reasoning' | 'social-emotional' | 'values' | 'environment-science' | 'culture' }
export const OBJECTIVES: readonly Objective[] = [
  { id: 'phonics', label: 'Phonics', domain: 'literacy' },
  { id: 'letter-recognition', label: 'Letter recognition', domain: 'literacy' },
  { id: 'vocabulary', label: 'Vocabulary', domain: 'literacy' },
  { id: 'reading-comprehension', label: 'Reading comprehension', domain: 'literacy' },
  { id: 'sequencing', label: 'Sequencing', domain: 'literacy' },
  { id: 'prediction', label: 'Prediction', domain: 'literacy' },
  { id: 'oral-language', label: 'Oral language and listening', domain: 'literacy' },
  { id: 'counting', label: 'Counting', domain: 'numeracy-reasoning' },
  { id: 'reasoning', label: 'Reasoning', domain: 'numeracy-reasoning' },
  { id: 'problem-solving', label: 'Problem-solving', domain: 'numeracy-reasoning' },
  { id: 'emotional-intelligence', label: 'Emotional intelligence', domain: 'social-emotional' },
  { id: 'teamwork', label: 'Teamwork and cooperation', domain: 'social-emotional' },
  { id: 'perseverance', label: 'Perseverance', domain: 'social-emotional' },
  { id: 'kindness', label: 'Kindness', domain: 'values' },
  { id: 'honesty', label: 'Honesty', domain: 'values' },
  { id: 'responsibility', label: 'Responsibility', domain: 'values' },
  { id: 'respect', label: 'Respect', domain: 'values' },
  { id: 'environmental-awareness', label: 'Environmental awareness', domain: 'environment-science' },
  { id: 'scientific-curiosity', label: 'Scientific curiosity', domain: 'environment-science' },
  { id: 'cultural-heritage', label: 'Cultural heritage', domain: 'culture' },
  // Older learners
  { id: 'inference', label: 'Inference and reading between the lines', domain: 'literacy' },
  { id: 'critical-thinking', label: 'Critical thinking', domain: 'numeracy-reasoning' },
  { id: 'summarising', label: 'Summarising', domain: 'literacy' },
  { id: 'author-purpose', label: "Author's purpose and viewpoint", domain: 'literacy' },
  { id: 'figurative-language', label: 'Figurative language', domain: 'literacy' },
  { id: 'citizenship', label: 'Citizenship', domain: 'values' },
  { id: 'financial-literacy', label: 'Money and enterprise skills', domain: 'numeracy-reasoning' },
];

// ------------------------------------------------------------------------------------------------------------ languages

export interface Language {
  /** Code used in `classification.language` (ISO 639 code). */
  id: string;
  label: string;
  /** Only `supported` languages may be published. Others are reserved so the schema does not change later. */
  supported: boolean;
  /** Narration locales (BCP 47) that may be attached. Voice quality per locale is evaluated before enabling (see narration plan). */
  narrationLocales: string[];
}
export const LANGUAGES: readonly Language[] = [
  { id: 'en', label: 'English', supported: true, narrationLocales: ['en-GH', 'en-GB'] },
  // Reserved for later. Codes follow ISO 639; enable only after content, voices and reviewers exist for the language.
  { id: 'ak', label: 'Akan (Twi)', supported: false, narrationLocales: ['ak-GH'] },
  { id: 'fat', label: 'Fante', supported: false, narrationLocales: ['fat-GH'] },
  { id: 'ee', label: 'Ewe', supported: false, narrationLocales: ['ee-GH'] },
  { id: 'gaa', label: 'Ga', supported: false, narrationLocales: ['gaa-GH'] },
  { id: 'dag', label: 'Dagbani', supported: false, narrationLocales: ['dag-GH'] },
];

// ------------------------------------------------------------------------------------------------------- cultural / misc

export const GHANAIAN_CONTEXT = ['none', 'incidental', 'central'] as const;
export const CULTURAL_TAGS: readonly Term[] = terms([
  ['ananse-tradition', 'Ananse / trickster-tale tradition'], ['local-food', 'Local food'], ['village-life', 'Village and farm life'],
  ['market', 'Market'], ['festival', 'Festival or celebration'], ['local-names', 'Ghanaian names and greetings'], ['proverb', 'Proverb or saying'],
]);

export const ACTIVITY_TYPES: readonly Term[] = terms([
  ['phonics', 'Phonics'], ['vocabulary', 'Vocabulary'], ['comprehension', 'Comprehension'], ['sequencing', 'Sequencing'],
  ['prediction', 'Prediction'], ['sel', 'Social-emotional reflection'],
]);

export const COMPLETENESS = ['none', 'partial', 'complete'] as const;
export type Completeness = (typeof COMPLETENESS)[number];

// -------------------------------------------------------------------------------------------------------- curriculum

/**
 * Curriculum alignment. We do NOT ship curriculum codes and do not claim official alignment on our own authority.
 *  - unverified: a free-text note about the intended strand; never displayed as an official alignment.
 *  - verified: a code from the framework document, accepted ONLY with the source, who checked it and when.
 */
export interface CurriculumRef {
  framework: 'NaCCA';
  verified: boolean;
  /** For unverified entries: what we think the story supports. Not a claim of alignment. */
  note?: string;
  strand?: string;
  subStrand?: string;
  /** Verified entries only. */
  code?: string;
  source?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// ---------------------------------------------------------------------------------------------------- the classification

export interface Classification {
  schemaVersion: number;
  language: string;
  /** One or more school classes the story suits. Ids from CLASS_REGISTRY. */
  classIds: string[];
  ageMin: number;
  ageMax: number;
  readingLevel: string;
  /** Overall difficulty 1 (easiest) to 5, separate from reading level (concept and vocabulary load). */
  difficulty: number;
  genres: string[];
  themes: string[];
  objectives: string[];
  ghanaianContext: (typeof GHANAIAN_CONTEXT)[number];
  culturalTags?: string[];
  curriculum?: CurriculumRef[];
  /** Estimated reading time in seconds when read aloud at default speed. */
  estimatedDurationSec: number;
  /** Narration locale, when narration exists. Must belong to the language. */
  narrationLocale?: string;
}

export interface Issue { path: string; message: string; severity: 'error' | 'warning' }

const ids = (list: readonly { id: string }[]) => new Set(list.map((t) => t.id));

export interface Registries {
  classes: readonly SchoolClass[];
  levels: readonly ReadingLevel[];
  genres: readonly Term[];
  themes: readonly Term[];
  objectives: readonly Term[];
  languages: readonly Language[];
  culturalTags: readonly Term[];
}
export const DEFAULT_REGISTRIES: Registries = {
  classes: CLASS_REGISTRY, levels: READING_LEVELS, genres: GENRES, themes: THEMES, objectives: OBJECTIVES, languages: LANGUAGES, culturalTags: CULTURAL_TAGS,
};

export const LIMITS = { maxClasses: 16, maxGenres: 5, maxThemes: 5, maxObjectives: 8, maxCurriculum: 6, minAge: 2, maxAge: 16, maxDurationSec: 3600 } as const;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const dupes = (a: unknown[]) => a.length !== new Set(a).size;

/**
 * Validate a classification. Errors block ingestion/publication; warnings go to the human reviewer.
 * `registries` can be extended (e.g. a new primary class) without touching this function.
 */
export function validateClassification(c: unknown, registries: Registries = DEFAULT_REGISTRIES): Issue[] {
  const out: Issue[] = [];
  const err = (path: string, message: string) => out.push({ path, message, severity: 'error' });
  const warn = (path: string, message: string) => out.push({ path, message, severity: 'warning' });
  if (!isObj(c)) return [{ path: '', message: 'classification must be an object', severity: 'error' }];

  const allowed = new Set(['schemaVersion', 'language', 'classIds', 'ageMin', 'ageMax', 'readingLevel', 'difficulty', 'genres', 'themes', 'objectives',
    'ghanaianContext', 'culturalTags', 'curriculum', 'estimatedDurationSec', 'narrationLocale']);
  for (const k of Object.keys(c)) if (!allowed.has(k)) err(k, 'field not allowed in a classification');
  if (c.schemaVersion !== CLASSIFICATION_VERSION) err('schemaVersion', `must be ${CLASSIFICATION_VERSION}`);

  // language
  const lang = registries.languages.find((l) => l.id === c.language);
  if (!lang) err('language', 'unknown language id');
  else if (!lang.supported) err('language', `${lang.label} is reserved but not yet supported`);

  // multi-valued controlled fields
  const many = (key: 'classIds' | 'genres' | 'themes' | 'objectives' | 'culturalTags', registry: readonly { id: string }[], min: number, max: number, required = true) => {
    const v = c[key];
    if (v === undefined && !required) return [] as string[];
    if (!Array.isArray(v)) { err(key, 'must be a list'); return [] as string[]; }
    if (v.length < min || v.length > max) err(key, `${min === max ? min : `${min}-${max}`} entries required`);
    if (dupes(v)) err(key, 'duplicate entries');
    const known = ids(registry);
    for (const x of v) if (typeof x !== 'string' || !known.has(x)) err(key, `unknown id ${JSON.stringify(x)}`);
    return v.filter((x): x is string => typeof x === 'string');
  };
  const classIds = many('classIds', registries.classes, 1, LIMITS.maxClasses);
  many('genres', registries.genres, 1, LIMITS.maxGenres);
  many('themes', registries.themes, 0, LIMITS.maxThemes);
  many('objectives', registries.objectives, 1, LIMITS.maxObjectives);
  many('culturalTags', registries.culturalTags, 0, 7, false);

  // ages
  const intIn = (v: unknown, lo: number, hi: number) => Number.isInteger(v) && (v as number) >= lo && (v as number) <= hi;
  if (!intIn(c.ageMin, LIMITS.minAge, LIMITS.maxAge)) err('ageMin', `integer ${LIMITS.minAge}-${LIMITS.maxAge}`);
  if (!intIn(c.ageMax, LIMITS.minAge, LIMITS.maxAge)) err('ageMax', `integer ${LIMITS.minAge}-${LIMITS.maxAge}`);
  if (Number.isInteger(c.ageMin) && Number.isInteger(c.ageMax) && (c.ageMin as number) > (c.ageMax as number)) err('ageMax', 'must be >= ageMin');

  // reading level, difficulty, duration
  if (!registries.levels.some((l) => l.id === c.readingLevel)) err('readingLevel', 'unknown reading level');
  if (!intIn(c.difficulty, 1, 5)) err('difficulty', 'integer 1-5');
  if (!intIn(c.estimatedDurationSec, 10, LIMITS.maxDurationSec)) err('estimatedDurationSec', `integer 10-${LIMITS.maxDurationSec}`);

  // Ghanaian context
  if (!(GHANAIAN_CONTEXT as readonly unknown[]).includes(c.ghanaianContext)) err('ghanaianContext', 'none, incidental or central');
  if (c.ghanaianContext === 'none' && Array.isArray(c.culturalTags) && c.culturalTags.length) err('culturalTags', 'cultural tags given but ghanaianContext is none');

  // narration locale must belong to the language
  if (c.narrationLocale !== undefined) {
    if (!(typeof c.narrationLocale === 'string' && lang?.narrationLocales.includes(c.narrationLocale))) err('narrationLocale', 'not a narration locale of this language');
  }

  // curriculum: never accept an unverified code
  if (c.curriculum !== undefined) {
    if (!Array.isArray(c.curriculum) || c.curriculum.length > LIMITS.maxCurriculum) err('curriculum', `list of at most ${LIMITS.maxCurriculum}`);
    else c.curriculum.forEach((r: unknown, i: number) => {
      const at = `curriculum[${i}]`;
      if (!isObj(r)) return err(at, 'must be an object');
      if (r.framework !== 'NaCCA') err(`${at}.framework`, 'only NaCCA is recognised');
      if (typeof r.verified !== 'boolean') err(`${at}.verified`, 'required boolean');
      if (r.verified === true) {
        for (const k of ['code', 'source', 'verifiedBy', 'verifiedAt']) if (!(typeof r[k] === 'string' && (r[k] as string).trim())) err(`${at}.${k}`, 'required for a verified alignment');
      } else {
        if (r.code !== undefined) err(`${at}.code`, 'a code may only be recorded on a verified alignment (do not invent curriculum codes)');
        if (!(typeof r.note === 'string' && r.note.trim())) err(`${at}.note`, 'an unverified entry needs a note describing the intended strand');
      }
    });
  }

  // consistency warnings for the human reviewer (never blocking)
  const levels = registries.levels;
  const lvl = levels.find((l) => l.id === c.readingLevel);
  if (Number.isInteger(c.ageMin) && Number.isInteger(c.ageMax)) {
    for (const id of classIds) {
      const k = registries.classes.find((x) => x.id === id);
      if (k && ((c.ageMax as number) < k.typicalAge[0] || (c.ageMin as number) > k.typicalAge[1])) warn('classIds', `${k.label} is typically ages ${k.typicalAge[0]}-${k.typicalAge[1]}, outside the recommended ${c.ageMin}-${c.ageMax}`);
    }
    if (c.ageMax as number - (c.ageMin as number) > 5) warn('ageMax', 'age range spans more than 5 years; consider narrowing');
  }
  if (lvl && lvl.order >= 4 && classIds.length) {
    const lowest = Math.min(...classIds.map((id) => registries.classes.find((x) => x.id === id)?.order ?? 99));
    if (lowest <= 2) warn('readingLevel', `${lvl.label} text for nursery classes is unusual`);
  }
  if (lvl && lvl.order <= 2 && classIds.length) {
    const highest = Math.max(...classIds.map((id) => registries.classes.find((x) => x.id === id)?.order ?? 0));
    if (highest >= 8) warn('readingLevel', `${lvl.label} text for ${registries.classes.find((x) => x.order === highest)?.label ?? 'older classes'} is unusual`);
  }
  if (lvl?.order === 1 && Number.isInteger(c.difficulty) && (c.difficulty as number) >= 4) warn('difficulty', 'a pre-reader story rated difficulty 4-5 is unusual');
  return out;
}

export const errorsOf = (issues: Issue[]) => issues.filter((i) => i.severity === 'error');

// ------------------------------------------------------------------------------------------------ catalogue projection

/** Compact, filterable fields copied onto the catalogue entry (the catalogue never holds the full classification). */
export interface CatalogueFacets {
  classIds: string[];
  classMin: number; // lowest class `order` (range / sort helper)
  classMax: number;
  ageMin: number;
  ageMax: number;
  readingLevel: string;
  difficulty: number;
  genres: string[];
  themes: string[];
  objectives: string[];
  language: string;
  ghanaianContext: string;
  durationSec: number;
}

export function toCatalogueFacets(c: Classification, registries: Registries = DEFAULT_REGISTRIES): CatalogueFacets {
  const orders = c.classIds.map((id) => registries.classes.find((k) => k.id === id)?.order ?? 0);
  return {
    classIds: [...c.classIds], classMin: Math.min(...orders), classMax: Math.max(...orders), ageMin: c.ageMin, ageMax: c.ageMax,
    readingLevel: c.readingLevel, difficulty: c.difficulty, genres: [...c.genres], themes: [...c.themes], objectives: [...c.objectives],
    language: c.language, ghanaianContext: c.ghanaianContext, durationSec: c.estimatedDurationSec,
  };
}

/** Legacy age buckets kept for the existing `ageTiers` catalogue field, derived from the recommended ages. */
export function ageTiersFor(ageMin: number, ageMax: number): string[] {
  const buckets: Array<[string, number, number]> = [['3-4', 0, 4], ['5-6', 5, 6], ['7-8', 7, 8], ['9-10', 9, 99]];
  return buckets.filter(([, lo, hi]) => ageMax >= lo && ageMin <= hi).map(([b]) => b);
}

// ---------------------------------------------------------------------------------------------------- catalogue queries

/**
 * The catalogue filters we support, each backed by ONE composite index. Firestore allows a single array-contains per
 * query, so a filter on two list fields is not offered: pick the filter that matters most, and refine on the (small)
 * page already fetched. Every query is `status == 'published'`, ordered by `sortKey` (append order), paginated (<= 50).
 */
export interface QueryShape {
  id: string;
  description: string;
  /** Equality fields (besides status). */
  equals: string[];
  /** Optional single array-contains field. */
  arrayContains?: string;
}

export const CATALOGUE_QUERY_SHAPES: readonly QueryShape[] = [
  { id: 'all', description: 'Everything, newest last (append order)', equals: [] },
  { id: 'by-class', description: 'A school class', equals: [], arrayContains: 'classIds' },
  { id: 'by-class-level', description: 'A class at a reading level', equals: ['readingLevel'], arrayContains: 'classIds' },
  { id: 'by-class-language', description: 'A class in a language', equals: ['language'], arrayContains: 'classIds' },
  { id: 'by-class-ghana', description: 'A class, Ghanaian-context stories', equals: ['ghanaianContext'], arrayContains: 'classIds' },
  { id: 'by-genre-level', description: 'A genre at a reading level', equals: ['readingLevel'], arrayContains: 'genres' },
  { id: 'by-objective', description: 'An educational objective', equals: [], arrayContains: 'objectives' },
  { id: 'by-theme', description: 'A theme', equals: [], arrayContains: 'themes' },
  { id: 'by-level', description: 'A reading level', equals: ['readingLevel'] },
];

export interface IndexDef {
  collectionGroup: 'story_catalogue';
  queryScope: 'COLLECTION';
  fields: Array<{ fieldPath: string; order?: 'ASCENDING'; arrayConfig?: 'CONTAINS' }>;
}

/** Composite index definitions for `firestore.indexes.json` (repo config only; deploying indexes is a separate approved step). */
export function catalogueIndexes(): IndexDef[] {
  return CATALOGUE_QUERY_SHAPES.filter((q) => q.equals.length > 0 || q.arrayContains).map((q) => ({
    collectionGroup: 'story_catalogue' as const,
    queryScope: 'COLLECTION' as const,
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' as const },
      ...q.equals.map((f) => ({ fieldPath: f, order: 'ASCENDING' as const })),
      ...(q.arrayContains ? [{ fieldPath: q.arrayContains, arrayConfig: 'CONTAINS' as const }] : []),
      { fieldPath: 'sortKey', order: 'ASCENDING' as const },
    ],
  }));
}

/** The filters a client may ask for, validated before it builds a query. */
export interface CatalogueFilter { classId?: string; readingLevel?: string; language?: string; ghanaianContext?: string; genre?: string; objective?: string; theme?: string }

export function matchShape(f: CatalogueFilter): QueryShape | null {
  const keys = Object.keys(f).filter((k) => (f as Record<string, unknown>)[k] !== undefined).sort().join(',');
  const map: Record<string, string> = {
    '': 'all', classId: 'by-class', 'classId,readingLevel': 'by-class-level', 'classId,language': 'by-class-language',
    'classId,ghanaianContext': 'by-class-ghana', 'genre,readingLevel': 'by-genre-level', objective: 'by-objective', theme: 'by-theme', readingLevel: 'by-level',
  };
  const id = map[keys];
  return id ? CATALOGUE_QUERY_SHAPES.find((q) => q.id === id) ?? null : null;
}


// ------------------------------------------------------------------------------------------- age-appropriate presentation

/**
 * How the reader presents a story, derived from the OLDEST class the story suits. Older learners must not get a
 * "baby" experience: smaller, denser text, no cartoon framing, reflective activities and a read-it-yourself default.
 * These are product defaults the reader applies; a teacher or learner can still change the reading mode.
 */
export interface Presentation {
  id: 'early-years' | 'lower-primary' | 'upper-primary' | 'jhs';
  label: string;
  /** Multiplier on the base reading size. */
  textScale: number;
  defaultMode: 'listen' | 'follow' | 'solo';
  /** Large, playful controls and big tap targets (early years) versus compact, calmer controls (JHS). */
  controls: 'playful' | 'standard' | 'compact';
  /** Words shown per screen is controlled by the story's pages; this is guidance for authors and the layout. */
  layout: 'picture-first' | 'balanced' | 'text-first';
  tone: string;
}
export const PRESENTATIONS: Record<Presentation['id'], Presentation> = {
  'early-years': { id: 'early-years', label: 'Early years', textScale: 1.5, defaultMode: 'listen', controls: 'playful', layout: 'picture-first', tone: 'Warm, playful, lots of pictures and sound' },
  'lower-primary': { id: 'lower-primary', label: 'Lower primary', textScale: 1.25, defaultMode: 'follow', controls: 'playful', layout: 'balanced', tone: 'Encouraging, with word help while learning to read' },
  'upper-primary': { id: 'upper-primary', label: 'Upper primary', textScale: 1.1, defaultMode: 'solo', controls: 'standard', layout: 'balanced', tone: 'Confident, curious, story-driven' },
  jhs: { id: 'jhs', label: 'Junior high', textScale: 1, defaultMode: 'solo', controls: 'compact', layout: 'text-first', tone: 'Mature and respectful; reflective and discussion-ready' },
};

export function presentationFor(classIds: string[], registries: Registries = DEFAULT_REGISTRIES): Presentation {
  const top = classIds.map((id) => registries.classes.find((k) => k.id === id)).filter((k): k is SchoolClass => !!k).sort((a, b) => b.order - a.order)[0];
  if (!top) return PRESENTATIONS['lower-primary'];
  if (top.stage === 'jhs') return PRESENTATIONS.jhs;
  if (top.stage === 'nursery' || top.stage === 'kindergarten') return PRESENTATIONS['early-years'];
  return top.order <= 7 ? PRESENTATIONS['lower-primary'] : PRESENTATIONS['upper-primary'];
}

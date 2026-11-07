/**
 * Reusable premium illustration pipeline (specification layer). NO IMAGE IS GENERATED HERE and nothing calls a paid API.
 *
 * It turns three small, human-reviewed documents into consistent, checkable image briefs:
 *   1. a StyleBible    (one per series: the look every image shares)
 *   2. CharacterSheets / SettingSheets (one per character/place: the details that must not drift between pages)
 *   3. Shots           (one per page: who, where, what happens, how it is framed)
 * `assemblePrompt` combines them deterministically, so the same inputs always give the same prompt (and a prompt hash a
 * reviewer can compare). Every produced file is tracked with an honest status; a page is only "illustrated" when an
 * APPROVED file exists. Emoji and generic placeholders are rejected as final artwork.
 */

export type ImageStatus =
  | 'brief'               // only a written brief exists
  | 'placeholder'         // a labelled stand-in is shown (emoji/gradient); NEVER publishable
  | 'candidate'           // a generated or commissioned image exists, awaiting review
  | 'approved'            // reviewed and approved for this exact brief
  | 'rejected';

export interface StyleBible {
  id: string;
  name: string;
  summary: string;
  medium: string;
  lighting: string;
  camera: string;
  palette: Array<{ name: string; hex: string; use: string }>;
  mustHave: string[];
  mustAvoid: string[];
  aspect: '4:3';
  /** Delivery targets for mobile and low bandwidth. */
  delivery: {
    masterPx: [number, number];
    webpWidths: number[];
    maxBytesAt960: number;
    maxBytesAt480: number;
    lowBandwidthStoryBudgetBytes: number;
    format: string[];
  };
}

export interface CharacterSheet {
  id: string;
  name: string;
  role: string;
  age: string;
  build: string;
  face: string;
  hair: string;
  skin: string;
  clothing: string;
  signatureProps: string[];
  personality: string;
  expressionRange: string[];
  /** Details that must be identical on every page. */
  consistencyAnchors: string[];
  doNot: string[];
}

export interface SettingSheet { id: string; name: string; description: string; palette: string; keyDetails: string[]; doNot: string[] }

export interface Shot {
  /** 0 = cover, otherwise the page number. */
  page: number;
  title: string;
  settingId: string;
  characters: Array<{ id: string; expression: string; pose: string }>;
  action: string;
  camera: string;
  lighting: string;
  mustShow: string[];
  /** Region kept calm so overlaid text or highlights never cover a face or the key action. */
  calmZone: 'top' | 'bottom' | 'none';
  alt: string;
}

export interface IllustrationPlan {
  storyKey: string;
  style: StyleBible;
  characters: CharacterSheet[];
  settings: SettingSheet[];
  shots: Shot[];
}

export interface ImageRecord {
  page: number;
  status: ImageStatus;
  /** Present only when a real file exists. */
  file?: { path: string; widthPx: number; heightPx: number; bytes: number; sha256: string };
  promptHash?: string;
  generator?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

const EMOJI = /\p{Extended_Pictographic}/u;

/** Deterministic prompt for one shot. Same plan + shot => same text. */
export function assemblePrompt(plan: IllustrationPlan, shot: Shot): string {
  const st = plan.style;
  const setting = plan.settings.find((s) => s.id === shot.settingId);
  const who = shot.characters.map((c) => {
    const sheet = plan.characters.find((x) => x.id === c.id);
    if (!sheet) return `${c.id} (UNDEFINED)`;
    return `${sheet.name}, ${sheet.age}, ${sheet.build}; face: ${sheet.face}; hair: ${sheet.hair}; skin: ${sheet.skin}; wearing ${sheet.clothing}; ${sheet.consistencyAnchors.join('; ')}. Expression: ${c.expression}. Pose: ${c.pose}.`;
  });
  const lines = [
    `${st.medium}. ${st.summary}`,
    `Scene: ${shot.action}`,
    setting ? `Setting: ${setting.name}. ${setting.description} Key details: ${setting.keyDetails.join('; ')}.` : 'Setting: UNDEFINED',
    who.length ? `Characters (keep identical to their reference sheets): ${who.join(' ')}` : 'No characters in this image.',
    `Camera: ${shot.camera}. Lighting: ${shot.lighting}; overall lighting style: ${st.lighting}.`,
    `Must show: ${shot.mustShow.join('; ')}.`,
    shot.calmZone === 'none' ? '' : `Keep the ${shot.calmZone} of the frame calm and uncluttered (no faces or key action there) so text can sit over it.`,
    `Palette: ${st.palette.map((p) => `${p.name} ${p.hex}`).join(', ')}.`,
    `Include: ${st.mustHave.join('; ')}.`,
    `Avoid: ${[...st.mustAvoid, ...plan.characters.filter((c) => shot.characters.some((s) => s.id === c.id)).flatMap((c) => c.doNot)].join('; ')}.`,
    `Aspect ratio ${st.aspect}. No text, letters, watermarks or logos inside the image.`,
  ];
  return lines.filter(Boolean).join('\n');
}

export function promptHash(prompt: string): string {
  // Two 32-bit FNV-1a lanes (different offsets) -> 16 hex chars. A comparison aid for reviewers, not a security hash.
  let h1 = 0x811c9dc5, h2 = 0x01000193 ^ 0xdeadbeef;
  for (let i = 0; i < prompt.length; i++) {
    const c = prompt.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

export interface PlanIssue { where: string; message: string }

/** Structural checks a reviewer shouldn't have to do by eye. */
export function validatePlan(plan: IllustrationPlan, pageCount: number): PlanIssue[] {
  const out: PlanIssue[] = [];
  const add = (where: string, message: string) => out.push({ where, message });
  const charIds = new Set(plan.characters.map((c) => c.id)), setIds = new Set(plan.settings.map((s) => s.id));
  if (charIds.size !== plan.characters.length) add('characters', 'duplicate character id');
  if (setIds.size !== plan.settings.length) add('settings', 'duplicate setting id');
  const pages = new Set(plan.shots.map((s) => s.page));
  if (pages.size !== plan.shots.length) add('shots', 'two shots for the same page');
  for (let p = 0; p <= pageCount; p++) if (!pages.has(p)) add(p === 0 ? 'cover' : `page ${p}`, 'no shot');
  for (const s of plan.shots) {
    const w = s.page === 0 ? 'cover' : `page ${s.page}`;
    if (s.page < 0 || s.page > pageCount) add(w, 'page out of range');
    if (!setIds.has(s.settingId)) add(w, `unknown setting ${s.settingId}`);
    for (const c of s.characters) if (!charIds.has(c.id)) add(w, `unknown character ${c.id}`);
    if (s.alt.trim().length < 15 || s.alt.length > 250) add(w, 'alt text should be 15-250 characters');
    if (s.mustShow.length === 0) add(w, 'no must-show details');
    if ([s.title, s.action, s.alt, ...s.mustShow].some((t) => EMOJI.test(t))) add(w, 'emoji in an image brief (emoji are never final artwork)');
  }
  for (const c of plan.characters) {
    if (c.consistencyAnchors.length < 3) add(`character ${c.id}`, 'needs at least 3 consistency anchors');
    if (c.expressionRange.length < 3) add(`character ${c.id}`, 'needs an expression range');
  }
  if (plan.style.palette.length < 4) add('style', 'palette too small');
  if (!plan.style.mustAvoid.length) add('style', 'no avoid-list');
  return out;
}

/** Characters that appear in 2+ shots must be generated from the same sheet; list them so the reference image is made first. */
export const recurringCharacters = (plan: IllustrationPlan): string[] => {
  const n = new Map<string, number>();
  for (const s of plan.shots) for (const c of s.characters) n.set(c.id, (n.get(c.id) ?? 0) + 1);
  return [...n].filter(([, k]) => k >= 2).map(([id]) => id);
};

/** A page counts as illustrated only when an APPROVED file exists. Anything else is honestly reported. */
export function illustrationStatus(plan: IllustrationPlan, records: ImageRecord[]): { approved: number; candidate: number; placeholder: number; missing: number; total: number; allApproved: boolean } {
  const total = plan.shots.length;
  let approved = 0, candidate = 0, placeholder = 0;
  for (const s of plan.shots) {
    const r = records.find((x) => x.page === s.page);
    if (r?.status === 'approved' && r.file) approved++;
    else if (r?.status === 'candidate' && r.file) candidate++;
    else if (r?.status === 'placeholder') placeholder++;
  }
  return { approved, candidate, placeholder, missing: total - approved - candidate - placeholder, total, allApproved: approved === total };
}

// ------------------------------------------------------------------------------------------------ cost (dry run)

export interface ImagePricing { name: string; perImageUsd: number; source: string; asOf: string }

/** Cost to generate candidates for a plan. Dry run only: nothing is generated. */
export function estimateImageCost(plan: IllustrationPlan, pricing: ImagePricing, opts: { candidatesPerShot: number; referenceSheetCandidates: number; retryRate: number }): { images: number; usd: number; breakdown: string } {
  const shots = plan.shots.length;
  const refs = plan.characters.length + plan.settings.length;
  const images = Math.ceil(shots * opts.candidatesPerShot * (1 + opts.retryRate)) + refs * opts.referenceSheetCandidates;
  const usd = images * pricing.perImageUsd;
  return { images, usd, breakdown: `${shots} shots x ${opts.candidatesPerShot} candidates (+${Math.round(opts.retryRate * 100)}% retries) + ${refs} reference images x ${opts.referenceSheetCandidates} = ${images} images at $${pricing.perImageUsd.toFixed(3)} (${pricing.name}, ${pricing.asOf})` };
}

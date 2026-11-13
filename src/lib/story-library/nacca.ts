/**
 * NaCCA curriculum codes (for example B4.2.2.1.1, or B1.5.1.1 for Basic 1 content standards) written inside a story's
 * teacher-guide subject links, such as "Science (NaCCA B4.2.2.1.1)". The catalogue carries them as a flat string list so
 * the library can bring forward stories that match what a class is studying this week, without downloading any guide.
 */
const CODE = /\bB[1-9]\.\d+\.\d+\.\d+(?:\.\d+)?\b/g;

/** Every distinct NaCCA code found in the given texts, in first-seen order. */
export function extractNaccaCodes(...texts: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  for (const t of texts) for (const m of (t ?? '').match(CODE) ?? []) seen.add(m);
  return [...seen];
}

/** Codes from a teacher guide's normalised `subjectLinks` ({ subject, link }). */
export function naccaCodesFromSubjectLinks(links: ReadonlyArray<{ subject?: string; link?: string }> | undefined): string[] {
  return extractNaccaCodes(...(links ?? []).flatMap((l) => [l.subject, l.link]));
}

/**
 * True when any of the story's codes falls under a focus. A focus is a code or a code prefix on dot boundaries:
 * "B4.2" means Basic 4, strand 2 (Cycles); "B4.2.2.1.1" means that one standard. "B4.2" never matches "B4.20.1.1".
 */
export function matchesNaccaFocus(codes: readonly string[] | undefined, focus: readonly string[] | undefined): boolean {
  if (!codes?.length || !focus?.length) return false;
  return focus.some((f) => {
    const p = f.trim().toUpperCase();
    return p !== '' && codes.some((c) => c === p || c.startsWith(`${p}.`));
  });
}

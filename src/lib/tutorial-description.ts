/**
 * Turns a tutorial's description (often pasted as one long run of markdown-ish text:
 * "### Title 1. **Do this** More text 2. **Then this** ...") into a heading plus a list of steps,
 * so the Help Center can show it tidily. Never throws; plain text just becomes a single paragraph.
 */
export interface ParsedDescription {
  /** Heading / intro text with markdown markers removed (may be empty). */
  heading: string;
  /** Numbered steps, in order (empty when the text is not a numbered list). */
  steps: string[];
}

export function parseTutorialDescription(raw: unknown): ParsedDescription {
  const text = String(raw ?? '').replace(/\r\n/g, '\n').trim();
  if (!text) return { heading: '', steps: [] };

  // Only accept "1." "2." "3." in sequence, so prices like "GH₵1.5" or "v2. " are never mistaken for steps.
  const re = /(^|\s)(\d{1,2})\.\s+(?=\S)/g;
  const marks: { start: number; end: number }[] = [];
  let expected = 1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (Number(m[2]) === expected) { marks.push({ start: m.index, end: re.lastIndex }); expected++; }
  }

  const clean = (s: string) => s.replace(/^#{1,6}\s*/, '').trim();
  if (marks.length < 2) return { heading: '', steps: [clean(text)].filter(Boolean) };

  const heading = clean(text.slice(0, marks[0].start));
  const steps = marks
    .map((mk, i) => text.slice(mk.end, marks[i + 1] ? marks[i + 1].start : text.length).trim())
    .filter(Boolean);
  return { heading, steps };
}

/** Splits text into plain / **bold** / `code` pieces for rendering (no HTML is ever injected). */
export function splitInline(s: string): { kind: 'text' | 'bold' | 'code'; value: string }[] {
  return String(s ?? '')
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter(Boolean)
    .map(p =>
      p.startsWith('**') && p.endsWith('**') && p.length > 4 ? { kind: 'bold' as const, value: p.slice(2, -2) }
      : p.startsWith('`') && p.endsWith('`') && p.length > 2 ? { kind: 'code' as const, value: p.slice(1, -1) }
      : { kind: 'text' as const, value: p });
}

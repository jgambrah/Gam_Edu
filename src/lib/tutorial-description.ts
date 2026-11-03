/**
 * Turns a tutorial's description into a clean heading plus an organized list of steps.
 * Handles:
 *  - Inline run-on numbered steps: "### Title 1. **Do this** 2. **Do that**"
 *  - Multi-line numbered steps: "1. Step one\n2. Step two"
 *  - Step keywords: "Step 1: Step one\nStep 2: Step two"
 *  - Bulleted lists: "- Item one\n- Item two" or "* Item one\n* Item two"
 *  - Multi-paragraph / sentence descriptions
 *  - Markdown headings: "### Getting Started"
 */
export interface ParsedDescription {
  /** Heading / intro text with markdown markers removed (may be empty). */
  heading: string;
  /** Numbered steps or itemized points in order. */
  steps: string[];
}

export function parseTutorialDescription(raw: unknown): ParsedDescription {
  const text = String(raw ?? '').replace(/\r\n/g, '\n').trim();
  if (!text) return { heading: '', steps: [] };

  const cleanHeader = (s: string) => s.replace(/^#{1,6}\s*/, '').trim();

  // 1. Sequential numbering: '1. ', '2. ' or 'Step 1:', 'Step 2:' or '1) ', '2) '
  // Matches both inline running steps and multi-line steps
  const stepRegex = /(?:^|[\n\r]|\s+)(?:(?:Step\s+)?(\d{1,2})[:.]|(\d{1,2})[.)])\s+(?=\S)/gi;
  const matches: { start: number; end: number; num: number }[] = [];
  let expected = 1;
  let m: RegExpExecArray | null;
  while ((m = stepRegex.exec(text))) {
    const num = Number(m[1] || m[2]);
    if (num === expected) {
      matches.push({ start: m.index, end: stepRegex.lastIndex, num });
      expected++;
    }
  }

  if (matches.length >= 2) {
    const heading = cleanHeader(text.slice(0, marksStart(text, matches[0].start)));
    const steps = matches.map((match, i) => {
      const nextMatch = matches[i + 1];
      const slice = text.slice(match.end, nextMatch ? nextMatch.start : text.length).trim();
      return cleanHeader(slice);
    }).filter(Boolean);
    return { heading, steps };
  }

  function marksStart(t: string, pos: number) {
    return pos;
  }

  // 2. Line-by-line / bullet points
  const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (rawLines.length >= 2) {
    // Bullet points (- or * or •)
    const isBulletList = rawLines.some(l => /^[-*•]\s+/.test(l));
    if (isBulletList) {
      let heading = '';
      const steps: string[] = [];
      for (const line of rawLines) {
        if (/^[-*•]\s+/.test(line)) {
          steps.push(line.replace(/^[-*•]\s+/, '').trim());
        } else if (steps.length === 0) {
          heading = heading ? heading + ' ' + cleanHeader(line) : cleanHeader(line);
        } else {
          steps[steps.length - 1] += ' ' + line;
        }
      }
      if (steps.length > 0) return { heading, steps };
    }

    // Numbered lines that may not start at 1
    const numberedLines = rawLines.filter(l => /^\d{1,2}[.:)]\s+/.test(l));
    if (numberedLines.length >= 2) {
      let heading = '';
      const steps: string[] = [];
      for (const line of rawLines) {
        if (/^\d{1,2}[.:)]\s+/.test(line)) {
          steps.push(line.replace(/^\d{1,2}[.:)]\s+/, '').trim());
        } else if (steps.length === 0) {
          heading = heading ? heading + ' ' + cleanHeader(line) : cleanHeader(line);
        } else {
          steps.push(cleanHeader(line));
        }
      }
      return { heading, steps };
    }

    // Multi-paragraph or distinct lines: first line as heading if formatted or brief
    const firstLine = rawLines[0];
    const isHeaderLine = /^#{1,6}\s+/.test(firstLine) || (firstLine.length < 80 && !firstLine.endsWith('.'));
    if (isHeaderLine) {
      return {
        heading: cleanHeader(firstLine),
        steps: rawLines.slice(1).map(cleanHeader).filter(Boolean)
      };
    } else {
      return {
        heading: '',
        steps: rawLines.map(cleanHeader).filter(Boolean)
      };
    }
  }

  // 3. Single block with a markdown header
  if (/^#{1,6}\s+/.test(text)) {
    const parts = text.split('\n').filter(Boolean);
    return {
      heading: cleanHeader(parts[0]),
      steps: parts.slice(1).map(cleanHeader).filter(Boolean)
    };
  }

  // 4. Default: single paragraph
  return { heading: '', steps: [cleanHeader(text)].filter(Boolean) };
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

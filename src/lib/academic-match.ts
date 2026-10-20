/**
 * Flexible academic-year / term matching for marks (assessments), which were saved over the years with
 * different spellings ("2024/2025", "Term 1", "First Term"…).
 *
 * Lives here (not in a page file) so screens can share it without pulling a whole page into their bundle.
 * The Academic Reports page re-exports these, so existing imports keep working.
 */

/** "2024-2025", "2024/2025", "2024 - 2025" → "2024-2025" (lower-case, no spaces). */
export const normalizeYear = (yearStr?: string | null): string => {
    if (!yearStr) return '';
    return String(yearStr).trim().replace(/[\/\\]/g, '-').replace(/\s+/g, '').toLowerCase();
};

export const isYearMatch = (y1?: string | null, y2?: string | null): boolean => {
    if (!y1 || !y2) return true;
    const norm1 = normalizeYear(y1);
    const norm2 = normalizeYear(y2);
    if (norm1 === norm2) return true;
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

    // Check 2-digit vs 4-digit span matches, e.g. 2024-2025 vs 2024/25
    const years1 = norm1.match(/\d{2,4}/g) || [];
    const years2 = norm2.match(/\d{2,4}/g) || [];
    if (years1.length > 0 && years2.length > 0) {
        const y1Start = years1[0];
        const y2Start = years2[0];
        if (y1Start && y2Start) {
            if (y1Start === y2Start) return true;
            if (y1Start.slice(-2) === y2Start.slice(-2)) return true;
        }
    }
    const d1 = norm1.replace(/\D/g, '');
    const d2 = norm2.replace(/\D/g, '');
    if (d1 && d2 && (d1 === d2 || d1.includes(d2) || d2.includes(d1))) return true;
    return false;
};

/**
 * Normalizes term strings to standard indexes/names:
 * "Second Term", "Term 2", "term_2", "2", "2nd Term", "Second", "Two", "T2", etc.
 */
export const normalizeTerm = (termStr?: string | null): string => {
    if (!termStr) return '';
    const s = String(termStr).toLowerCase().trim().replace(/[-_]/g, ' ');
    if (s.includes('1') || s.includes('first') || s.includes('one') || s === 't1' || s.includes('1st')) return '1';
    if (s.includes('2') || s.includes('second') || s.includes('two') || s === 't2' || s.includes('2nd')) return '2';
    if (s.includes('3') || s.includes('third') || s.includes('three') || s === 't3' || s.includes('3rd')) return '3';
    return s.replace(/\s+/g, '');
};

export const isTermMatch = (t1?: string | null, t2?: string | null): boolean => {
    if (!t1 || !t2) return true;
    const n1 = normalizeTerm(t1);
    const n2 = normalizeTerm(t2);
    if (n1 === n2) return true;
    if (n1 && n2 && (n1.includes(n2) || n2.includes(n1))) return true;
    return false;
};

/**
 * The spellings an academic year may have been saved with, for a Firestore `in` filter
 * ("2026-2027" → ["2026-2027", "2026/2027", "2026 - 2027", "2026/27", "2026-27"]). At most 10 values.
 */
export const academicYearVariants = (year?: string | null): string[] => {
    const raw = String(year || '').trim();
    if (!raw) return [];
    const out = new Set<string>([raw]);
    const m = raw.match(/(\d{4})\s*[\/\\-]\s*(\d{2,4})/);
    if (m) {
        const a = m[1];
        const b = m[2].length === 2 ? `${a.slice(0, 2)}${m[2]}` : m[2];
        const bb = b.slice(-2);
        [`${a}-${b}`, `${a}/${b}`, `${a} - ${b}`, `${a} / ${b}`, `${a}/${bb}`, `${a}-${bb}`].forEach(v => out.add(v));
    }
    return Array.from(out).slice(0, 10);
};

/**
 * The spellings a term may have been saved with, for a Firestore `in` filter
 * ("First Term" → ["First Term", "Term 1", "1st Term", "first term", "term 1", "FIRST TERM", "T1"]). At most 10 values.
 */
export const termVariants = (term?: string | null): string[] => {
    const raw = String(term || '').trim();
    if (!raw) return [];
    const n = normalizeTerm(raw);
    const words: Record<string, [string, string]> = { '1': ['First', '1st'], '2': ['Second', '2nd'], '3': ['Third', '3rd'] };
    const out = new Set<string>([raw]);
    if (words[n]) {
        const [word, ord] = words[n];
        [`${word} Term`, `Term ${n}`, `${ord} Term`, `${word} term`.toLowerCase(), `term ${n}`, `${word} Term`.toUpperCase(), `T${n}`]
            .forEach(v => out.add(v));
    }
    return Array.from(out).slice(0, 10);
};

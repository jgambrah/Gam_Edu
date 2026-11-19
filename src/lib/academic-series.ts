import { DEFAULT_GRADING_SYSTEM, getGradeFromScale, type GradeBracket } from '@/lib/utils';

export type AcademicSeriesId = 'end_of_term' | 'mid_term' | `mock_${string}`;

export interface AcademicSeriesOption {
    id: AcademicSeriesId;
    label: string;
    shortLabel: string;
    kind: 'end_of_term' | 'mid_term' | 'mock';
    mockNumber?: number;
}

export interface BeceGradeBracket {
    minScore: number;
    maxScore: number;
    grade: string;
    numericGrade: number;
    remark: string;
}

export const WAEC_BECE_GRADING_SCALE: BeceGradeBracket[] = [
    { minScore: 80, maxScore: 100, grade: '1', numericGrade: 1, remark: 'Highest (Distinction)' },
    { minScore: 70, maxScore: 79, grade: '2', numericGrade: 2, remark: 'Higher (Very Good)' },
    { minScore: 65, maxScore: 69, grade: '3', numericGrade: 3, remark: 'High (Good)' },
    { minScore: 60, maxScore: 64, grade: '4', numericGrade: 4, remark: 'High Average (Credit)' },
    { minScore: 55, maxScore: 59, grade: '5', numericGrade: 5, remark: 'Average (Credit)' },
    { minScore: 50, maxScore: 54, grade: '6', numericGrade: 6, remark: 'Low Average (Credit)' },
    { minScore: 45, maxScore: 49, grade: '7', numericGrade: 7, remark: 'Low (Pass)' },
    { minScore: 40, maxScore: 44, grade: '8', numericGrade: 8, remark: 'Lower (Pass)' },
    { minScore: 0, maxScore: 39, grade: '9', numericGrade: 9, remark: 'Lowest (Fail)' },
];

export const DEFAULT_MOCK_SERIES: AcademicSeriesOption[] = [
    { id: 'mock_1', label: 'Mock 1', shortLabel: 'Mock 1', kind: 'mock', mockNumber: 1 },
    { id: 'mock_2', label: 'Mock 2', shortLabel: 'Mock 2', kind: 'mock', mockNumber: 2 },
    { id: 'mock_3', label: 'Mock 3', shortLabel: 'Mock 3', kind: 'mock', mockNumber: 3 },
    { id: 'mock_4', label: 'Mock 4', shortLabel: 'Mock 4', kind: 'mock', mockNumber: 4 },
    { id: 'mock_5', label: 'Mock 5', shortLabel: 'Mock 5', kind: 'mock', mockNumber: 5 },
];

export const CORE_REPORT_SERIES: AcademicSeriesOption[] = [
    { id: 'end_of_term', label: 'End of Term (SBA + Exam)', shortLabel: 'End of Term', kind: 'end_of_term' },
    { id: 'mid_term', label: 'Mid-Term Report (100%)', shortLabel: 'Mid-Term', kind: 'mid_term' },
];

const WORD_ORDINALS: Record<string, number> = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
};

/**
 * Converts a user-entered Mock title (e.g. "Mock 2", "Mock 6", "District Mock", "Pre-BECE Mock")
 * into a canonical { id, label } pair.
 */
export function normalizeMockSeriesInput(rawLabel: string): AcademicSeriesOption | null {
    const trimmed = String(rawLabel || '').trim().replace(/\s+/g, ' ');
    if (!trimmed) return null;

    const withoutPct = trimmed.replace(/\(\s*100\s*%?\s*\)/gi, '').replace(/\b100\s*%/gi, '').trim();
    const lower = withoutPct.toLowerCase();

    // Check explicit canonical numeric mock ONLY when unprefixed: "Mock 2", "Mock Exam 2", "2nd Mock", "Mock #3"
    // Custom prefixed names like "District Mock 2" or "Pre-BECE Mock 1" fall through to custom slugging so they never collide with Mock 2 / Mock 1.
    const afterMockNum = lower.match(/^mock(?:\s+exam(?:ination)?s?)?\s*#?\s*(\d+)$/i);
    if (afterMockNum) {
        const num = parseInt(afterMockNum[1], 10);
        if (num >= 1 && num <= 50) {
            return { id: `mock_${num}`, label: `Mock ${num}`, shortLabel: `Mock ${num}`, kind: 'mock', mockNumber: num };
        }
    }

    const beforeMockNum = lower.match(/^(\d+)(?:st|nd|rd|th)?\s+mock(?:\s+exam(?:ination)?s?)?$/i);
    if (beforeMockNum) {
        const num = parseInt(beforeMockNum[1], 10);
        if (num >= 1 && num <= 50) {
            return { id: `mock_${num}`, label: `Mock ${num}`, shortLabel: `Mock ${num}`, kind: 'mock', mockNumber: num };
        }
    }

    for (const [word, num] of Object.entries(WORD_ORDINALS)) {
        if (
            new RegExp(`^${word}\\s+mock(?:\\s+exam(?:ination)?s?)?$`, 'i').test(lower) ||
            new RegExp(`^mock(?:\\s+exam(?:ination)?s?)?\\s+${word}$`, 'i').test(lower)
        ) {
            return { id: `mock_${num}`, label: `Mock ${num}`, shortLabel: `Mock ${num}`, kind: 'mock', mockNumber: num };
        }
    }

    // Legacy generic names ("Mock Exam (100%)", "Mock Exam", "Mock Examination", "Mock") -> Mock 1!
    if (/^mock(?:\s+exam(?:ination)?s?)?$/i.test(withoutPct)) {
        return { id: 'mock_1', label: 'Mock 1', shortLabel: 'Mock 1', kind: 'mock', mockNumber: 1 };
    }

    // Pure digits ("2" -> "Mock 2")
    if (/^\d+$/.test(withoutPct)) {
        const num = parseInt(withoutPct, 10);
        if (num >= 1 && num <= 50) {
            return { id: `mock_${num}`, label: `Mock ${num}`, shortLabel: `Mock ${num}`, kind: 'mock', mockNumber: num };
        }
    }

    // Custom named mock (e.g. "District Mock", "Pre-BECE Mock", "Special Mock")
    const displayLabel = /mock/i.test(withoutPct) ? withoutPct : `${withoutPct} Mock`;
    const slug = displayLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/^mock_+/, '');

    const id: AcademicSeriesId = `mock_${slug || '1'}`;
    return {
        id,
        label: displayLabel,
        shortLabel: displayLabel,
        kind: 'mock',
    };
}

/**
 * Resolves which Mock series an assessment record belongs to, or null if it is NOT a mock assessment.
 *
 * CRITICAL BACKWARD COMPATIBILITY RULE:
 * Legacy Mock assessments saved before multi-mock support have:
 *   assessmentType: "Mock Exam (100%)" or "Mock Exam"
 *   assessmentName: "Mock Exam (100%)" or "Mock Exam" (no mockSeries field, no number)
 * Those MUST always resolve to `{ id: 'mock_1', label: 'Mock 1' }` so schools' existing Mock 1 entries
 * remain 100% intact, viewable, editable, and printable while Mock 2+ stays completely separate.
 */
export function resolveMockSeriesFromAssessment(a: any): AcademicSeriesOption | null {
    if (!a) return null;
    if (a.reportScope === 'mid_term' || a.mockSeries === 'mid_term' || a.standaloneMidTerm === true) {
        return null;
    }

    // 1. Explicit mockSeries field if already stamped
    if (typeof a.mockSeries === 'string' && a.mockSeries.trim().startsWith('mock_')) {
        const key = a.mockSeries.trim() as AcademicSeriesId;
        const numMatch = key.match(/^mock_(\d+)$/);
        if (numMatch) {
            const n = parseInt(numMatch[1], 10);
            return { id: key, label: `Mock ${n}`, shortLabel: `Mock ${n}`, kind: 'mock', mockNumber: n };
        }
        const customLabel = (typeof a.mockSeriesLabel === 'string' && a.mockSeriesLabel.trim())
            || (typeof a.assessmentName === 'string' && a.assessmentName.trim())
            || formatSeriesLabelFromId(key);
        return { id: key, label: customLabel, shortLabel: customLabel, kind: 'mock' };
    }

    const nameStr = String(a.assessmentName || '').trim();
    const typeStr = String(a.assessmentType || '').trim();
    const typeHasMock = typeStr.toLowerCase().includes('mock');
    const cleanName = nameStr.replace(/\(\s*100\s*%?\s*\)/gi, '').replace(/\b100\s*%/gi, '').trim();
    const nameIsExplicitMockExam = /^(?:(?:\d+(?:st|nd|rd|th)|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+)?mock(?:\s+exam(?:ination)?s?)?(?:\s*#?\s*\d+)?$/i.test(cleanName);

    // Avoid turning CA tests like "Mock Test 1" (assessmentType: "Class Exercise (CA)") into phantom mock series.
    if (!typeHasMock && !nameIsExplicitMockExam) {
        return null;
    }

    if (nameStr && nameStr.toLowerCase().includes('mock')) {
        const parsedName = normalizeMockSeriesInput(nameStr);
        if (parsedName) return parsedName;
    }

    const parsedType = normalizeMockSeriesInput(typeStr);
    return parsedType || { id: 'mock_1', label: 'Mock 1', shortLabel: 'Mock 1', kind: 'mock', mockNumber: 1 };
}

export function isMockAssessment(a: any): boolean {
    return resolveMockSeriesFromAssessment(a) !== null;
}

/**
 * Returns true when an assessment record belongs to the dedicated Mid-Term Report workspace
 * (`reportScope === 'mid_term'`, plus legacy `standaloneMidTerm` / `mockSeries === 'mid_term'`).
 * Normal End-of-Term SBA Mid-Term column records (`Mid-Term (CA)` without `reportScope: 'mid_term'`)
 * return FALSE here so End-of-Term SBA behaves 100% as it always did!
 */
export function isMidTermReportScopeAssessment(a: any): boolean {
    if (!a || isMockAssessment(a)) return false;
    if (a.reportScope === 'mid_term' || a.standaloneMidTerm === true || a.mockSeries === 'mid_term') {
        return true;
    }
    const typeLower = String(a.assessmentType || '').toLowerCase();
    const nameLower = String(a.assessmentName || '').toLowerCase();
    const combined = `${typeLower} ${nameLower}`;
    const hasMid =
        combined.includes('mid-term') ||
        combined.includes('mid term') ||
        combined.includes('midterm') ||
        combined.includes('mid-sem') ||
        combined.includes('mid sem') ||
        combined.includes('midsemester');
    if (!hasMid) return false;
    if (combined.includes('standalone') || combined.includes('100%') || typeLower === 'mid-term exam') {
        return true;
    }
    return false;
}

/** Alias kept for clean compatibility across pages. */
export const isStandaloneMidTermAssessment = isMidTermReportScopeAssessment;

export function isMidTermAssessment(a: any): boolean {
    if (!a || isMockAssessment(a)) return false;
    if (isMidTermReportScopeAssessment(a)) return true;
    const combined = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase();
    return (
        combined.includes('mid-term') ||
        combined.includes('mid term') ||
        combined.includes('midterm') ||
        combined.includes('mid-sem') ||
        combined.includes('mid sem') ||
        combined.includes('midsemester')
    );
}

/**
 * Resolves which slot inside the Mid-Term Report sheet a Mid-Term record belongs to:
 * `'test'` (Class Exercise / Test), `'hw'` (Homework), `'project'` (Project / CW), or `'exam'` (Mid-Term Exam).
 */
export function resolveMidTermSlot(a: any): 'test' | 'hw' | 'project' | 'exam' {
    if (!a) return 'exam';
    const explicit = String(a.midTermSlot || '').toLowerCase();
    if (explicit === 'test' || explicit === 'hw' || explicit === 'project' || explicit === 'exam') {
        return explicit;
    }
    if (a.standaloneMidTerm === true && !a.midTermSlot) {
        return 'exam';
    }
    const stripped = `${a.assessmentType || ''} ${a.assessmentName || ''}`
        .toLowerCase()
        .replace(/mid[\s-]*term|mid[\s-]*sem(?:ester)?/g, ' ')
        .trim();
    if (stripped.includes('exam') || stripped === '' || stripped === '(ca)' || stripped === '(100%)') {
        return 'exam';
    }
    if (stripped.includes('proj') || stripped.includes('group') || stripped.includes('practical')) {
        return 'project';
    }
    if (stripped.includes('home') || stripped.includes('hw') || stripped.includes('assignment')) {
        return 'hw';
    }
    return 'test';
}

/**
 * Given all assessments in a class+subject, selects the records that feed the Mid-Term Report:
 * - If ANY dedicated Mid-Term workspace records (`isMidTermReportScopeAssessment`) exist in the class for this subject,
 *   ONLY those dedicated Mid-Term records are used (CA + Mid-Term Exam), keeping End-of-Term completely separate!
 * - Otherwise (legacy fallback before dedicated Mid-Term tab), falls back to legacy Mid-Term records.
 */
export function selectMidTermRecordsForSubject<T = any>(items: T[], classSubjectItems?: T[]): T[] {
    if (!items || items.length === 0) return [];
    const pool = classSubjectItems && classSubjectItems.length > 0 ? classSubjectItems : items;
    const classHasDedicatedMidTerm = pool.some(a => isMidTermReportScopeAssessment(a));
    if (classHasDedicatedMidTerm) {
        return items.filter(a => isMidTermReportScopeAssessment(a));
    }
    return items.filter(a => isMidTermAssessment(a));
}

/**
 * Resolves CA/Exam weights consistently across Gradebook, Report Cards, Master List, and Ward Grades.
 * Defaults to 30% CA / 70% Exam everywhere, honours 0% CA / 100% Exam, and derives missing pairs cleanly.
 */
export function resolveSeriesWeights(params: {
    series?: AcademicSeriesId | string | null;
    classDoc?: any | null;
    schoolSettings?: any | null;
}): { caWeight: number; examWeight: number } {
    const series = params.series || 'end_of_term';
    if (typeof series === 'string' && series.startsWith('mock_')) {
        return { caWeight: 0, examWeight: 100 };
    }
    const parseNum = (v: any): number | null => {
        if (v === undefined || v === null || v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
    };
    const pairFrom = (rawCa: any, rawEx: any): { caWeight: number; examWeight: number } | null => {
        const c = parseNum(rawCa);
        const e = parseNum(rawEx);
        if (c !== null && e !== null) {
            if (Math.round(c + e) === 100) return { caWeight: c, examWeight: e };
            return { caWeight: c, examWeight: Math.max(0, 100 - c) };
        }
        if (c !== null) return { caWeight: c, examWeight: Math.max(0, 100 - c) };
        if (e !== null) return { caWeight: Math.max(0, 100 - e), examWeight: e };
        return null;
    };
    const cd = params.classDoc;
    const ss = params.schoolSettings;
    if (series === 'mid_term') {
        return (
            pairFrom(cd?.midTermCaWeight, cd?.midTermExamWeight) ||
            pairFrom(ss?.midTermCaWeight, ss?.midTermExamWeight) ||
            pairFrom(cd?.caWeight, cd?.examWeight) ||
            pairFrom(ss?.caWeight, ss?.examWeight) ||
            { caWeight: 30, examWeight: 70 }
        );
    }
    return (
        pairFrom(cd?.caWeight, cd?.examWeight) ||
        pairFrom(ss?.caWeight, ss?.examWeight) ||
        { caWeight: 30, examWeight: 70 }
    );
}

/**
 * Classifies an End-of-Term assessment record into its SBA / Exam slot, or null if it belongs to Mock or dedicated Mid-Term.
 */
export function resolveEndOfTermSlot(a: any): 'exam' | 'mid' | 'project' | 'hw' | 'test' | null {
    if (!a || isMockAssessment(a) || isMidTermReportScopeAssessment(a)) return null;
    if (isMidTermAssessment(a)) return 'mid';
    const typeLower = String(a.assessmentType || '').toLowerCase();
    const nameLower = String(a.assessmentName || '').toLowerCase();
    const combined = `${typeLower} ${nameLower}`;
    if (typeLower.includes('exam') && !typeLower.includes('ca')) return 'exam';
    if ((nameLower.includes('end of term') || nameLower.includes('terminal exam') || nameLower === 'exam') && !typeLower.includes('ca')) {
        return 'exam';
    }
    if (combined.includes('proj') || combined.includes('group') || combined.includes('practical')) return 'project';
    if (combined.includes('home') || combined.includes('hw') || combined.includes('assign')) return 'hw';
    return 'test';
}

export interface UnifiedSubjectScoreResult {
    ca: number;
    exam: number;
    total: number;
    isSingleExamOnly: boolean;
    rawDisplay?: string;
    rawObtained?: number;
    rawMax?: number;
    hasCa?: boolean;
    hasExam?: boolean;
}

/**
 * Computes a student's Mid-Term subject result (`CA + Mid-Term Exam = Total`), supporting BOTH:
 * 1) Full Mid-Term SBA + Mid-Term Exam (Class Exercise/Tests + Homework + Project scaled to `caWeight`, plus Mid-Term Exam scaled to `examWeight`).
 * 2) Pure 100% Mid-Term Exam (automatically when `caWeight === 0` OR when zero Mid-Term CA marks were entered across the class for this subject).
 */
export function computeMidTermSubjectScore(params: {
    studentItems: any[];
    classSubjectItems?: any[];
    caWeight: number;
    examWeight: number;
}): UnifiedSubjectScoreResult | null {
    const num = (v: any, d: number) => {
        const n = Number(v);
        return isFinite(n) ? n : d;
    };
    const allSubItems = selectMidTermRecordsForSubject(
        params.classSubjectItems && params.classSubjectItems.length > 0 ? params.classSubjectItems : params.studentItems,
        params.classSubjectItems
    );
    const myItems = selectMidTermRecordsForSubject(params.studentItems, params.classSubjectItems);
    if (!myItems || myItems.length === 0) return null;

    // Inspect distinct active CA columns across the class in this subject so unused columns never penalize students
    const distinctClassTests = new Map<string, number>();
    let classHwMax = 0;
    let classProjMax = 0;
    allSubItems.forEach((a: any) => {
        const slot = resolveMidTermSlot(a);
        const m = num(a.maxScore, slot === 'exam' ? 100 : 20) || 20;
        if (slot === 'test') {
            const key = String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1';
            const prev = distinctClassTests.get(key) || 0;
            if (m > prev) distinctClassTests.set(key, m);
        } else if (slot === 'hw' && m > classHwMax) classHwMax = m;
        else if (slot === 'project' && m > classProjMax) classProjMax = m;
    });
    const testMaxValues = Array.from(distinctClassTests.values());
    const classTestMax = testMaxValues.length > 0
        ? testMaxValues.reduce((s, v) => s + v, 0) / testMaxValues.length
        : 0;
    const activeCaMax = classTestMax + classHwMax + classProjMax;

    const myTests = myItems.filter(a => resolveMidTermSlot(a) === 'test');
    const myHws = myItems.filter(a => resolveMidTermSlot(a) === 'hw');
    const myProjs = myItems.filter(a => resolveMidTermSlot(a) === 'project');
    const myExams = myItems.filter(a => resolveMidTermSlot(a) === 'exam');

    // Pure 100% Mid-Term Exam mode (either explicit 0% CA weight OR no Mid-Term CA entered anywhere in this subject)
    if (params.caWeight <= 0 || activeCaMax <= 0) {
        if (myExams.length === 0) return null;
        const obtained = myExams.reduce((sum, a) => sum + num(a.score, 0), 0);
        const max = myExams.reduce((sum, a) => sum + (num(a.maxScore, 100) || 100), 0);
        if (max <= 0) return null;
        const pct = Math.min(100, Math.round((obtained / max) * 100));
        const cleanObt = Math.round(obtained * 10) / 10;
        const cleanMax = Math.round(max * 10) / 10;
        return {
            ca: 0,
            exam: pct,
            total: pct,
            isSingleExamOnly: true,
            rawObtained: cleanObt,
            rawMax: cleanMax,
            rawDisplay: `${cleanObt}/${cleanMax}`,
            hasCa: false,
            hasExam: true,
        };
    }

    const expectedTestCount = Math.max(distinctClassTests.size, myTests.length, 1);
    const testObt = myTests.length > 0
        ? myTests.reduce((sum, a) => sum + num(a.score, 0), 0) / expectedTestCount
        : 0;
    const slotObtained = (arr: any[], slotMax: number) => {
        if (arr.length === 0 || slotMax <= 0) return 0;
        if (arr.length === 1) return num(arr[0].score, 0);
        const sObt = arr.reduce((s, a) => s + num(a.score, 0), 0);
        const sMax = arr.reduce((s, a) => s + (num(a.maxScore, slotMax) || slotMax), 0);
        return sMax > 0 ? (sObt / sMax) * slotMax : 0;
    };
    const hwObt = slotObtained(myHws, classHwMax);
    const projObt = slotObtained(myProjs, classProjMax);
    const caObt = testObt + hwObt + projObt;

    const rawCA = activeCaMax > 0 ? Math.min((caObt / activeCaMax) * params.caWeight, params.caWeight) : 0;

    const exObt = myExams.reduce((sum, a) => sum + num(a.score, 0), 0);
    const exMax = myExams.reduce((sum, a) => sum + (num(a.maxScore, 100) || 100), 0);
    const rawExam = exMax > 0 ? Math.min((exObt / exMax) * params.examWeight, params.examWeight) : 0;

    const ca = Math.round(rawCA);
    const exam = Math.round(rawExam);
    const hasCa = myTests.length > 0 || myHws.length > 0 || myProjs.length > 0;
    const hasExam = myExams.length > 0;
    return {
        ca,
        exam,
        total: Math.min(100, ca + exam),
        isSingleExamOnly: false,
        hasCa,
        hasExam,
    };
}

/**
 * Unified subject scorer shared by Gradebook, Report Cards, Master List, and Ward/My Grades
 * so every screen computes the exact same CA, Exam, and Total % for End-of-Term, Mid-Term, and Mock N.
 */
export function computeUnifiedSubjectScore(params: {
    series: AcademicSeriesId | string;
    studentItems: any[];
    classSubjectItems?: any[];
    caWeight: number;
    examWeight: number;
}): UnifiedSubjectScoreResult | null {
    const num = (v: any, d: number) => {
        const n = Number(v);
        return isFinite(n) ? n : d;
    };
    const series = (params.series || 'end_of_term') as AcademicSeriesId;

    // 1. Mock Exam series (100% single paper)
    if (series.startsWith('mock_')) {
        const mockItems = (params.studentItems || []).filter(a => resolveMockSeriesFromAssessment(a)?.id === series);
        if (mockItems.length === 0) return null;
        const obtained = mockItems.reduce((sum, a) => sum + num(a.score, 0), 0);
        const max = mockItems.reduce((sum, a) => sum + (num(a.maxScore, 100) || 100), 0);
        if (max <= 0) return null;
        const pct = Math.min(100, Math.round((obtained / max) * 100));
        const cleanObt = Math.round(obtained * 10) / 10;
        const cleanMax = Math.round(max * 10) / 10;
        return {
            ca: 0,
            exam: pct,
            total: pct,
            isSingleExamOnly: true,
            rawObtained: cleanObt,
            rawMax: cleanMax,
            rawDisplay: `${cleanObt}/${cleanMax}`,
            hasCa: false,
            hasExam: true,
        };
    }

    // 2. Dedicated Mid-Term series (CA + Mid-Term Exam, or 100% pure exam if no Mid-Term CA in class/subject)
    if (series === 'mid_term') {
        return computeMidTermSubjectScore({
            studentItems: params.studentItems,
            classSubjectItems: params.classSubjectItems,
            caWeight: params.caWeight,
            examWeight: params.examWeight,
        });
    }

    // 3. End-of-Term series (SBA + End of Term Exam)
    const rawPool = params.classSubjectItems && params.classSubjectItems.length > 0
        ? params.classSubjectItems
        : params.studentItems;
    const pool = (rawPool || []).filter(a => resolveEndOfTermSlot(a) !== null);
    const myItems = (params.studentItems || []).filter(a => resolveEndOfTermSlot(a) !== null);
    if (myItems.length === 0) return null;

    const distinctClassTests = new Map<string, number>();
    let classHwMax = 0;
    let classProjMax = 0;
    let classMidMax = 0;
    pool.forEach((a: any) => {
        const slot = resolveEndOfTermSlot(a);
        if (!slot || slot === 'exam') return;
        const defaultMax = slot === 'hw' || slot === 'project' ? 10 : 20;
        const m = num(a.maxScore, defaultMax) || defaultMax;
        if (slot === 'test') {
            const key = String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1';
            const prev = distinctClassTests.get(key) || 0;
            if (m > prev) distinctClassTests.set(key, m);
        } else if (slot === 'hw' && m > classHwMax) classHwMax = m;
        else if (slot === 'project' && m > classProjMax) classProjMax = m;
        else if (slot === 'mid' && m > classMidMax) classMidMax = m;
    });

    const testMaxValues = Array.from(distinctClassTests.values());
    const classTestMax = testMaxValues.length > 0
        ? testMaxValues.reduce((s, v) => s + v, 0) / testMaxValues.length
        : 0;
    const activeCaMax = classTestMax + classHwMax + classProjMax + classMidMax;

    const myTests = myItems.filter(a => resolveEndOfTermSlot(a) === 'test');
    const myHws = myItems.filter(a => resolveEndOfTermSlot(a) === 'hw');
    const myProjs = myItems.filter(a => resolveEndOfTermSlot(a) === 'project');
    const myMids = myItems.filter(a => resolveEndOfTermSlot(a) === 'mid');
    const myExams = myItems.filter(a => resolveEndOfTermSlot(a) === 'exam');

    if (params.caWeight <= 0) {
        if (myExams.length === 0) return null;
        const obtained = myExams.reduce((sum, a) => sum + num(a.score, 0), 0);
        const max = myExams.reduce((sum, a) => sum + (num(a.maxScore, 100) || 100), 0);
        if (max <= 0) return null;
        const pct = Math.min(100, Math.round((obtained / max) * 100));
        const cleanObt = Math.round(obtained * 10) / 10;
        const cleanMax = Math.round(max * 10) / 10;
        return {
            ca: 0,
            exam: pct,
            total: pct,
            isSingleExamOnly: true,
            rawObtained: cleanObt,
            rawMax: cleanMax,
            rawDisplay: `${cleanObt}/${cleanMax}`,
            hasCa: false,
            hasExam: true,
        };
    }

    const expectedTestCount = Math.max(distinctClassTests.size, myTests.length, 1);
    const testObt = myTests.length > 0
        ? myTests.reduce((sum, a) => sum + num(a.score, 0), 0) / expectedTestCount
        : 0;
    const slotObtained = (arr: any[], slotMax: number) => {
        if (arr.length === 0 || slotMax <= 0) return 0;
        if (arr.length === 1) return num(arr[0].score, 0);
        const sObt = arr.reduce((s, a) => s + num(a.score, 0), 0);
        const sMax = arr.reduce((s, a) => s + (num(a.maxScore, slotMax) || slotMax), 0);
        return sMax > 0 ? (sObt / sMax) * slotMax : 0;
    };
    const hwObt = slotObtained(myHws, classHwMax);
    const projObt = slotObtained(myProjs, classProjMax);
    const midObt = slotObtained(myMids, classMidMax);
    const caObt = testObt + hwObt + projObt + midObt;

    const rawCA = activeCaMax > 0 ? Math.min((caObt / activeCaMax) * params.caWeight, params.caWeight) : 0;

    const exObt = myExams.reduce((sum, a) => sum + num(a.score, 0), 0);
    const exMax = myExams.reduce((sum, a) => sum + (num(a.maxScore, 100) || 100), 0);
    const rawExam = exMax > 0 ? Math.min((exObt / exMax) * params.examWeight, params.examWeight) : 0;

    const ca = Math.round(rawCA);
    const exam = Math.round(rawExam);
    const hasCa = myTests.length > 0 || myHws.length > 0 || myProjs.length > 0 || myMids.length > 0;
    const hasExam = myExams.length > 0;

    return {
        ca,
        exam,
        total: Math.min(100, ca + exam),
        isSingleExamOnly: false,
        hasCa,
        hasExam,
    };
}

export function formatSeriesLabelFromId(seriesId?: string | null): string {
    if (!seriesId || seriesId === 'end_of_term') return 'End of Term';
    if (seriesId === 'mid_term') return 'Mid-Term';
    const numMatch = seriesId.match(/^mock_(\d+)$/);
    if (numMatch) return `Mock ${parseInt(numMatch[1], 10)}`;
    if (seriesId.startsWith('mock_')) {
        const words = seriesId
            .replace(/^mock_/, '')
            .split('_')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1));
        const joined = words.join(' ');
        return /mock/i.test(joined) ? joined : `${joined} Mock`;
    }
    return seriesId;
}

/**
 * Discovers all available Mock series from defaults (Mock 1..5), class/school custom configs,
 * existing assessments, and existing report cards.
 */
export function discoverMockSeriesOptions(params: {
    assessments?: any[] | null;
    classDoc?: any | null;
    schoolSettings?: any | null;
    reportCards?: any[] | null;
    extraCustomMocks?: Array<{ id: string; label: string }> | null;
}): AcademicSeriesOption[] {
    const map = new Map<string, AcademicSeriesOption>();

    DEFAULT_MOCK_SERIES.forEach(opt => map.set(opt.id, opt));

    const ingestCustomList = (list: any) => {
        if (!Array.isArray(list)) return;
        list.forEach((item: any) => {
            if (typeof item === 'string') {
                const parsed = normalizeMockSeriesInput(item);
                if (parsed && !map.has(parsed.id)) map.set(parsed.id, parsed);
            } else if (item && typeof item === 'object') {
                const id = typeof item.id === 'string' && item.id.startsWith('mock_')
                    ? (item.id as AcademicSeriesId)
                    : normalizeMockSeriesInput(item.label || item.name || '')?.id;
                const label = String(item.label || item.name || formatSeriesLabelFromId(id)).trim();
                if (id && label && !map.has(id)) {
                    const numMatch = id.match(/^mock_(\d+)$/);
                    map.set(id, {
                        id,
                        label,
                        shortLabel: label,
                        kind: 'mock',
                        mockNumber: numMatch ? parseInt(numMatch[1], 10) : undefined,
                    });
                }
            }
        });
    };

    ingestCustomList(params.schoolSettings?.customMockSeries || params.schoolSettings?.mockSeries);
    ingestCustomList(params.classDoc?.customMockSeries || params.classDoc?.mockSeries);
    ingestCustomList(params.extraCustomMocks);

    (params.assessments || []).forEach(a => {
        const resolved = resolveMockSeriesFromAssessment(a);
        if (resolved && !map.has(resolved.id)) {
            map.set(resolved.id, resolved);
        }
    });

    (params.reportCards || []).forEach(rc => {
        const key = getReportCardSeriesKey(rc);
        if (key.startsWith('mock_') && !map.has(key)) {
            const label = rc?.reportSeriesLabel || formatSeriesLabelFromId(key);
            const numMatch = key.match(/^mock_(\d+)$/);
            map.set(key, {
                id: key as AcademicSeriesId,
                label,
                shortLabel: label,
                kind: 'mock',
                mockNumber: numMatch ? parseInt(numMatch[1], 10) : undefined,
            });
        }
    });

    return Array.from(map.values()).sort((a, b) => {
        if (a.mockNumber !== undefined && b.mockNumber !== undefined) return a.mockNumber - b.mockNumber;
        if (a.mockNumber !== undefined) return -1;
        if (b.mockNumber !== undefined) return 1;
        return a.label.localeCompare(b.label);
    });
}

export function buildAllAcademicSeriesOptions(params: Parameters<typeof discoverMockSeriesOptions>[0]): AcademicSeriesOption[] {
    return [
        ...CORE_REPORT_SERIES,
        ...discoverMockSeriesOptions(params),
    ];
}

/**
 * Checks whether a class is JHS / Basic 7–9 (where WAEC BECE 1–9 grading & Best-6 Aggregate apply on Mocks).
 * Supports streamed labels like "BS 7A", "Basic 8B", "Class 9C", "B.S. 7", and "Basic Seven".
 */
export function isJhsOrBeceClass(className?: string | null): boolean {
    if (!className) return false;
    const cleaned = className.toUpperCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
    if (cleaned.includes('JHS') || cleaned.includes('JUNIOR HIGH') || cleaned.includes('BECE')) {
        return true;
    }
    const match = cleaned.match(/\b(?:BS|BASIC|GRADE|CLASS|FORM|YEAR)\s*(?:[789]|(?:SEVEN|EIGHT|NINE)\b)(?![0-9])/);
    if (match) {
        return true;
    }
    return false;
}

export function getBeceGradeFromScore(score: number): { grade: string; numericGrade: number; autoRemark: string } {
    const rounded = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
    for (const b of WAEC_BECE_GRADING_SCALE) {
        if (rounded >= b.minScore && rounded <= b.maxScore) {
            return { grade: b.grade, numericGrade: b.numericGrade, autoRemark: b.remark };
        }
    }
    return { grade: '9', numericGrade: 9, autoRemark: 'Lowest (Fail)' };
}

export function getSeriesGradeFromScore(
    score: number,
    options?: {
        isMock?: boolean;
        className?: string | null;
        schoolGradingSystem?: GradeBracket[] | null;
    }
): { grade: string; autoRemark: string; isBeceGrade: boolean; numericGrade?: number } {
    // For JHS / BS 7-9 Mock Exams, use official WAEC BECE 1-9 grading unless the school configured custom numeric grades
    if (options?.isMock && isJhsOrBeceClass(options?.className)) {
        const customScale = options?.schoolGradingSystem;
        const hasCustomNumeric = Array.isArray(customScale) && customScale.length > 0 && customScale.every(b => /^\d+$/.test(String(b.grade).trim()));
        if (hasCustomNumeric) {
            const res = getGradeFromScale(score, customScale!);
            return { ...res, isBeceGrade: true, numericGrade: parseInt(res.grade, 10) || 9 };
        }
        const bece = getBeceGradeFromScore(score);
        return { grade: bece.grade, numericGrade: bece.numericGrade, autoRemark: bece.autoRemark, isBeceGrade: true };
    }

    const std = getGradeFromScale(score, options?.schoolGradingSystem || DEFAULT_GRADING_SYSTEM);
    return { ...std, isBeceGrade: false };
}

function classifyBeceCoreBucket(subjectName: string): 'english' | 'math' | 'science' | 'social' | null {
    const s = String(subjectName || '').toLowerCase().trim();
    if (s.includes('english') || s === 'eng' || s.includes('eng lang')) return 'english';
    if (s.includes('math')) return 'math';
    if (
        s.includes('science') &&
        !s.includes('social') &&
        !s.includes('computer') &&
        !s.includes('computing') &&
        !s.includes('ict') &&
        !s.includes('home') &&
        !s.includes('agric') &&
        !s.includes('health')
    ) {
        return 'science';
    }
    if (s.includes('social')) return 'social';
    return null;
}

/**
 * Computes WAEC BECE Aggregate:
 *   4 Core Subjects (English, Mathematics, Integrated Science, Social Studies)
 *   + Best 2 other subjects (lowest numeric grade points).
 * If fewer than 4 cores or <6 subjects have marks yet, computes aggregate across best up-to-6 subjects tested
 * and flags `isCompleteSix: false` so schools see progress clearly.
 */
export function computeBeceAggregate(
    entries: Array<{ subjectName: string; score: number }>,
    schoolGradingSystem?: GradeBracket[] | null
): { aggregate: number | null; subjectsUsed: number; isCompleteSix: boolean } {
    if (!entries || entries.length === 0) {
        return { aggregate: null, subjectsUsed: 0, isCompleteSix: false };
    }

    const graded = entries
        .filter(e => e && typeof e.score === 'number' && !isNaN(e.score))
        .map(e => {
            const gradeRes = getSeriesGradeFromScore(e.score, {
                isMock: true,
                className: 'JHS 3',
                schoolGradingSystem,
            });
            return {
                subjectName: e.subjectName,
                score: e.score,
                numericGrade: gradeRes.numericGrade ?? getBeceGradeFromScore(e.score).numericGrade,
                coreBucket: classifyBeceCoreBucket(e.subjectName),
            };
        });

    if (graded.length === 0) {
        return { aggregate: null, subjectsUsed: 0, isCompleteSix: false };
    }

    const chosenCoreByBucket = new Map<string, typeof graded[number]>();
    const remaining: Array<typeof graded[number]> = [];

    graded.forEach(item => {
        if (item.coreBucket) {
            const prev = chosenCoreByBucket.get(item.coreBucket);
            if (!prev || item.numericGrade < prev.numericGrade) {
                if (prev) remaining.push(prev);
                chosenCoreByBucket.set(item.coreBucket, item);
            } else {
                remaining.push(item);
            }
        } else {
            remaining.push(item);
        }
    });

    remaining.sort((a, b) => a.numericGrade - b.numericGrade || b.score - a.score);

    const selected = Array.from(chosenCoreByBucket.values());
    const slotsLeft = Math.max(0, 6 - selected.length);
    const bestOthers = remaining.slice(0, slotsLeft);
    const combined = [...selected, ...bestOthers];

    const sum = combined.reduce((acc, item) => acc + item.numericGrade, 0);
    return {
        aggregate: combined.length > 0 ? sum : null,
        subjectsUsed: combined.length,
        isCompleteSix: chosenCoreByBucket.size === 4 && combined.length === 6,
    };
}

/**
 * Builds the Firestore document ID for `report-cards`.
 * Preserves the EXACT legacy ID for `end_of_term` so zero existing report cards are affected!
 */
export function buildReportCardDocId(
    studentId: string,
    academicYear: string,
    term: string,
    reportSeries?: string | null
): string {
    const base = `${studentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
    if (!reportSeries || reportSeries === 'end_of_term') {
        return base;
    }
    return `${base}__${reportSeries}`;
}

/**
 * Builds the Firestore document ID for `academic_report_snapshots`.
 * Starts with `${schoolId}_` to satisfy `ownSchoolSnapshot(snapshotId)` in `firestore.rules`,
 * and preserves the EXACT legacy ID for `end_of_term`!
 */
export function buildAcademicSnapshotDocId(
    schoolId: string,
    selectedYear: string,
    selectedTerm: string,
    selectedClassId: string,
    reportSeries?: string | null
): string {
    const normalizedYear = (selectedYear || 'current').trim().replace(/\s+/g, '').replace(/[\/\\]/g, '-');
    const normalizedTerm = (selectedTerm || 'current').trim().toLowerCase().replace(/\s+/g, '_');
    const base = `${schoolId}_${normalizedYear}_${normalizedTerm}_${selectedClassId}`;
    if (!reportSeries || reportSeries === 'end_of_term') {
        return base;
    }
    return `${base}__${reportSeries}`;
}

export function getReportCardSeriesKey(report: any): AcademicSeriesId {
    if (report?.reportSeries && typeof report.reportSeries === 'string') {
        return report.reportSeries as AcademicSeriesId;
    }
    const idStr = String(report?.id || '');
    const suffixMatch = idStr.match(/__(mid_term|mock_[a-z0-9_]+)$/i);
    if (suffixMatch) {
        return suffixMatch[1].toLowerCase() as AcademicSeriesId;
    }
    return 'end_of_term';
}

export function getReportCardSeriesLabel(report: any): string {
    if (report?.reportSeriesLabel && typeof report.reportSeriesLabel === 'string') {
        return report.reportSeriesLabel;
    }
    const key = getReportCardSeriesKey(report);
    return formatSeriesLabelFromId(key);
}

export function matchesReportSeries(report: any, targetSeries?: string | null): boolean {
    const effectiveTarget = targetSeries || 'end_of_term';
    return getReportCardSeriesKey(report) === effectiveTarget;
}

export function sanitizeReportFilenamePart(raw?: string | null): string {
    return String(raw || '')
        .trim()
        .replace(/[\/\\]+/g, '-')
        .replace(/[^a-zA-Z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'Report';
}

/**
 * Anonymous class-subject CA structure (no pupil IDs or scores) stored on `classAverages` / `classSeriesProfiles`
 * so Student & Parent portals (`my-grades`) reproduce the exact class CA denominators without reading classmates' marks.
 */
export interface SubjectCaProfile {
    tests?: Record<string, number>;
    hwMax?: number;
    projMax?: number;
    midMax?: number;
    examMax?: number;
    hasDedicatedMidTerm?: boolean;
}

export function synthesizeClassItemsFromCaProfile(
    profile?: SubjectCaProfile | null,
    series: AcademicSeriesId | string = 'end_of_term'
): any[] {
    if (!profile) return [];
    const out: any[] = [];
    const isMid = series === 'mid_term';

    if (profile.tests && typeof profile.tests === 'object') {
        Object.entries(profile.tests).forEach(([testKey, maxScore]) => {
            const m = Number(maxScore) || 0;
            if (m <= 0) return;
            out.push(isMid
                ? { reportScope: 'mid_term', midTermSlot: 'test', assessmentType: 'Class Exercise (CA)', assessmentName: testKey, score: 0, maxScore: m }
                : { assessmentType: 'Class Exercise (CA)', assessmentName: testKey, score: 0, maxScore: m }
            );
        });
    }
    if ((Number(profile.hwMax) || 0) > 0) {
        out.push(isMid
            ? { reportScope: 'mid_term', midTermSlot: 'hw', assessmentType: 'Homework (CA)', assessmentName: 'Homework', score: 0, maxScore: Number(profile.hwMax) }
            : { assessmentType: 'Homework (CA)', assessmentName: 'Homework', score: 0, maxScore: Number(profile.hwMax) }
        );
    }
    if ((Number(profile.projMax) || 0) > 0) {
        out.push(isMid
            ? { reportScope: 'mid_term', midTermSlot: 'project', assessmentType: 'Project (CA)', assessmentName: 'Project', score: 0, maxScore: Number(profile.projMax) }
            : { assessmentType: 'Project (CA)', assessmentName: 'Project', score: 0, maxScore: Number(profile.projMax) }
        );
    }
    if (!isMid && (Number(profile.midMax) || 0) > 0) {
        out.push({ assessmentType: 'Mid-Term (CA)', assessmentName: 'Mid-Term', score: 0, maxScore: Number(profile.midMax) });
    }
    if ((Number(profile.examMax) || 0) > 0) {
        out.push(isMid
            ? (profile.hasDedicatedMidTerm !== false
                ? { reportScope: 'mid_term', midTermSlot: 'exam', assessmentType: 'Mid-Term Exam (Exam)', assessmentName: 'Mid-Term Exam', score: 0, maxScore: Number(profile.examMax) }
                : { assessmentType: 'Mid-Term (CA)', assessmentName: 'Mid-Term', score: 0, maxScore: Number(profile.examMax) })
            : { assessmentType: 'End of Term Exam (Exam)', assessmentName: 'End of Term Exam', score: 0, maxScore: Number(profile.examMax) }
        );
    }
    return out;
}

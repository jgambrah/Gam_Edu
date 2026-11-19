'use client';

import { useState, useMemo, useEffect, useCallback, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useRole } from '@/context/role-context';
import { useFirestore } from '@/firebase';
import { collection, query, where, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useOnceQuery, readOnceCached, invalidateOnceCache, peekOnceCache, writeOnceCache } from '@/lib/firestore-once';
import { buildTermId } from '@/lib/term';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell
} from 'recharts';
import { 
    FileText, Printer, BarChart2, Users, Loader2, ShieldAlert, Award, TrendingUp, 
    TrendingDown, AlertTriangle, BookOpen, Search, Sparkles, Wand2, ChevronRight, 
    GraduationCap, Info, FileSpreadsheet, RefreshCw, BookOpenCheck, UserCheck, Archive,
    BarChart3, PackageCheck, Zap, Database
} from 'lucide-react';
import { Class, Subject, Student, Assessment } from '@/lib/types';
import Link from 'next/link';
import { useUser } from '@/firebase/provider';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { TermManagementModal, TermUnlockCountdownBanner } from '@/components/dashboard/term-management-modal';

const getGradeForScore = (score: number | null | undefined, hasMark: boolean = true): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'N/A' => {
    if (!hasMark || score === null || score === undefined || Number.isNaN(Number(score))) return 'N/A';
    const n = Number(score);
    if (n >= 80) return 'A';
    if (n >= 70) return 'B';
    if (n >= 60) return 'C';
    if (n >= 50) return 'D';
    if (n >= 40) return 'E';
    if (n >= 0) return 'F';
    return 'N/A';
};

const getStatusBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Honor Roll</Badge>;
    if (score >= 50) return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Passing</Badge>;
    return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Needs Support</Badge>;
};

/**
 * Strict pedagogical hierarchy rank for Ghanaian / West African school systems:
 * 1. Creche / Daycare (Rank 10)
 * 2. Nursery 1, Nursery 2 (Rank 21, 22)
 * 3. KG 1, KG 2 (Rank 31, 32)
 * 4. BS 1 / Class 1 through BS 6 / Class 6 (Rank 41..46)
 * 5. BS 7 / JHS 1 through BS 9 / JHS 3 (Rank 70, 80, 90)
 * 6. SHS / Secondary / Unmatched (Rank 100+)
 */
const getAcademicClassRank = (className?: string): number => {
    if (!className) return 999;
    const name = className.trim().toUpperCase();

    // 1. Creche / Daycare
    if (name.includes('CRECHE') || name.includes('DAYCARE') || name.includes('DAY CARE') || name.includes('TODDLER')) {
        return 10;
    }

    // 2. Nursery 1, Nursery 2
    if (name.includes('NURSERY') || name.includes('NURS')) {
        if (name.includes('1')) return 21;
        if (name.includes('2')) return 22;
        if (name.includes('3')) return 23;
        return 20;
    }

    // 3. KG 1, KG 2 / Kindergarten
    if (name.includes('KG') || name.includes('KINDERGARTEN')) {
        if (name.includes('1')) return 31;
        if (name.includes('2')) return 32;
        if (name.includes('3')) return 33;
        return 30;
    }

    // 4. JHS 1..3 / Junior High / BS 7..9
    if (name.includes('JHS') || name.includes('J.H.S') || name.includes('JUNIOR HIGH')) {
        if (name.includes('1')) return 70; // JHS 1 / BS 7
        if (name.includes('2')) return 80; // JHS 2 / BS 8
        if (name.includes('3')) return 90; // JHS 3 / BS 9
        return 70;
    }

    // 5. SHS / Senior High (if present)
    if (name.includes('SHS') || name.includes('S.H.S') || name.includes('SENIOR HIGH')) {
        if (name.includes('1')) return 101;
        if (name.includes('2')) return 102;
        if (name.includes('3')) return 103;
        return 100;
    }

    // 6. BS 1..6, Class 1..6, Grade 1..6, Primary 1..6, Basic 1..6
    const prefixMatch = name.match(/(?:BS|CLASS|GRADE|BASIC|PRIMARY|STAGE|YEAR|P)\s*(\d+)/i);
    if (prefixMatch) {
        const num = parseInt(prefixMatch[1], 10);
        if (num >= 1 && num <= 6) return 40 + num; // 41..46
        if (num === 7) return 70; // BS 7
        if (num === 8) return 80; // BS 8
        if (num === 9) return 90; // BS 9
        if (num > 9) return 100 + num;
    }

    // Fallback: standalone digits in the class name
    const numberMatch = name.match(/\b(\d+)\b/);
    if (numberMatch) {
        const num = parseInt(numberMatch[1], 10);
        if (num >= 1 && num <= 6) return 40 + num;
        if (num === 7) return 70;
        if (num === 8) return 80;
        if (num === 9) return 90;
        if (num > 9) return 100 + num;
    }

    return 500;
};

const compareAcademicClasses = (a: Class, b: Class): number => {
    const rankA = getAcademicClassRank(a?.name);
    const rankB = getAcademicClassRank(b?.name);
    if (rankA !== rankB) {
        return rankA - rankB;
    }
    return (a?.name || '').localeCompare(b?.name || '', undefined, { numeric: true, sensitivity: 'base' });
};

/**
 * Resolves a reliable canonical identifier for a student document:
 * Prioritizes id (Firestore doc ID), uid, studentId (admission ID), admissionNumber, or indexNumber.
 */
const getStudentId = (student: any): string => {
    if (!student) return '';
    return String(student.id || student.uid || student.studentId || student.admissionNumber || student.indexNumber || '').trim();
};

import { normalizeYear, isYearMatch, normalizeTerm, isTermMatch, academicYearVariants } from '@/lib/academic-match';
import {
    buildAcademicSnapshotDocId,
    buildAllAcademicSeriesOptions,
    computeBeceAggregate,
    formatSeriesLabelFromId,
    getReportCardSeriesKey,
    getSeriesGradeFromScore,
    isJhsOrBeceClass,
    isMidTermAssessment,
    isMidTermReportScopeAssessment,
    isStandaloneMidTermAssessment,
    resolveMidTermSlot,
    resolveSeriesWeights,
    computeUnifiedSubjectScore,
    isMockAssessment,
    resolveMockSeriesFromAssessment,
    type AcademicSeriesId,
} from '@/lib/academic-series';

interface AcademicReportSnapshotDoc {
    id: string;
    calcVersion?: number;
    builtAt?: number;
    markVersion?: number;
    caWeight?: number;
    examWeight?: number;
    schoolId: string;
    academicYear: string;
    term: string;
    reportSeries?: string;
    reportSeriesLabel?: string;
    classId: string;
    className: string;
    isArchived: boolean;
    snapshotCreatedAt: string;
    updatedAt: string;
    distinctSubjectsList: Array<{ id: string; name: string }>;
    activeSubjects: Array<{ id: string; name: string }>;
    rankedStudents: Array<any>;
    academicData: {
        studentAverages: Array<{
            studentId: string;
            studentName: string;
            average: number;
            subjectScores: Record<string, number>;
            subjectSubScores: Record<string, any>;
            passCount: number;
            totalTestedSubjects: number;
        }>;
        studentSubjectScores: Record<string, Record<string, number>>;
        subjectPerformance: Array<any>;
        classOverallAverage: number;
        classPassRate: number;
        classAssessmentsCount: number;
        atRiskStudents: Array<any>;
        topPerformer: any;
        performanceTiers: Array<any>;
    };
    subjectDetailsMap?: Record<string, any>;
}

const MASTER_LIST_TTL_MS = 10 * 60 * 1000;
const safeDocKey = (v: any) => String(v || '').replace(/[.\/\[\]#$*`~]/g, '_').slice(0, 120);
const toEpochMs = (v: any): number => {
    if (!v) return 0;
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    if (typeof v.toMillis === 'function') return v.toMillis();
    if (typeof v.seconds === 'number') return v.seconds * 1000 + Math.floor((v.nanoseconds || 0) / 1e6);
    const parsed = Date.parse(String(v));
    return Number.isFinite(parsed) ? parsed : 0;
};

export default function AcademicReportsPage() {
    const { role, loading: isRoleLoading } = useRole();
    const router = useRouter();
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

    // States
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const [selectedSeries, setSelectedSeries] = useState<AcademicSeriesId>('end_of_term');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isReportRequested, setIsReportRequested] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'dashboard' | 'master_report'>('dashboard');
    const [mounted, setMounted] = useState(false);

    // 1-Document Rollup Snapshot State (Single Firestore Read for entire class academic load)
    const [activeSnapshot, setActiveSnapshot] = useState<AcademicReportSnapshotDoc | null>(null);
    const [isLoadingSnapshot, setIsLoadingSnapshot] = useState<boolean>(false);
    const [loadingTimedOut, setLoadingTimedOut] = useState<boolean>(false);
    const pendingAutoOpenRef = useRef<{ classId: string; series?: AcademicSeriesId } | null>(null);
    const latestClassAvgMetaRef = useRef<{ lastMarkWriteAtMs: number; markVersion: number }>({
        lastMarkWriteAtMs: 0,
        markVersion: 0,
    });
    const persistedSnapshotKeysRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const sParam = params.get('series');
            const cParam = params.get('classId');
            const validSeries = (sParam && (sParam === 'end_of_term' || sParam === 'mid_term' || sParam.startsWith('mock_')))
                ? (sParam as AcademicSeriesId)
                : undefined;
            if (validSeries) {
                setSelectedSeries(validSeries);
                setViewMode('master_report');
            }
            if (cParam) {
                setSelectedClassId(cParam);
                pendingAutoOpenRef.current = { classId: cParam, series: validSeries };
            }
        }
    }, []);

    const isAdmin = ['Administrator', 'Director'].includes(role || '');
    const isTeacher = role === 'Teacher';
    const canAccess = !isRoleLoading && (isAdmin || isTeacher);

    // Initialise Default Year and Term
    useEffect(() => {
        if (MOCK_ACADEMIC_YEARS && MOCK_ACADEMIC_YEARS.length > 0) {
            setSelectedYear(MOCK_ACADEMIC_YEARS[MOCK_ACADEMIC_YEARS.length - 1]);
        }
        if (MOCK_TERMS && MOCK_TERMS.length > 0) {
            setSelectedTerm(MOCK_TERMS[0]);
        }
    }, []);

    useEffect(() => {
        if (!isRoleLoading && role === 'Student') {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    const readAll = useCallback(async <T = any>(q: any): Promise<T[]> => {
        const snap = await getDocs(q);
        return snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id })) as T[];
    }, []);

    // One-time cached reads (10 min TTL) for Classes, Subjects & School Settings (replaces live onSnapshot listeners)
    const { data: rawClasses, isLoading: isLoadingClasses } = useOnceQuery<Class>(
        (user && firestore && schoolId && !isRoleLoading && canAccess)
            ? `ml:classes:${schoolId}:${role === 'Teacher' ? user.uid : 'all'}`
            : null,
        () => {
            let q = query(collection(firestore!, 'classes'), where('schoolId', '==', schoolId));
            if (role === 'Teacher') {
                q = query(q, where('teacherId', '==', user!.uid));
            }
            return readAll<Class>(q);
        },
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    // Pedagogical Academic Sorting for classes
    const classes = useMemo(() => {
        if (!rawClasses) return [];
        return [...rawClasses].sort(compareAcademicClasses);
    }, [rawClasses]);

    const selectedClass = classes?.find(c => c.id === selectedClassId);

    const { data: subjects, isLoading: isLoadingSubjects } = useOnceQuery<Subject>(
        (firestore && schoolId && !isRoleLoading && canAccess) ? `ml:subjects:${schoolId}` : null,
        () => readAll<Subject>(query(collection(firestore!, 'subjects'), where('schoolId', '==', schoolId))),
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    const { data: schoolProfileRows } = useOnceQuery<any>(
        (firestore && schoolId && !isRoleLoading && canAccess) ? `ml:schoolSettings:${schoolId}` : null,
        async () => {
            const snap = await getDoc(doc(firestore!, 'schoolSettings', schoolId!));
            return snap.exists() ? [{ ...(snap.data() as any), id: snap.id }] : [];
        },
        { ttlMs: MASTER_LIST_TTL_MS }
    );
    const schoolProfile = schoolProfileRows?.[0] || null;

    const selectedYearVariants = useMemo(
        () => (selectedYear ? academicYearVariants(selectedYear).slice(0, 10) : []),
        [selectedYear]
    );
    const yearKey = selectedYearVariants.join('|') || selectedYear || 'current';
    const classScopeKey = selectedClassId || 'none';
    const liveCompileReady = Boolean(
        firestore &&
        schoolId &&
        !isRoleLoading &&
        canAccess &&
        isReportRequested &&
        !activeSnapshot &&
        !isLoadingSnapshot &&
        selectedClassId
    );

    // 2a & 2b) Class-scoped one-time reads (10-min TTL). Switching series reuses these cached arrays with 0 extra reads!
    const {
        data: rawStudents,
        isLoading: isLoadingStudents,
        refresh: refreshStudents,
    } = useOnceQuery<Student>(
        liveCompileReady ? `ml:students:${schoolId}:${classScopeKey}` : null,
        async () => {
            if (selectedClassId && selectedClassId !== 'all') {
                const byClass = await readAll<Student>(
                    query(collection(firestore!, 'students'), where('schoolId', '==', schoolId), where('classId', '==', selectedClassId))
                );
                if (byClass.length > 0) return byClass;
            }
            // Fallback to school-wide students ONLY when classId=='all' or classId query returned 0 (legacy name-matched rosters)
            return readOnceCached<Student>(
                `ml:students:all:${schoolId}`,
                () => readAll<Student>(query(collection(firestore!, 'students'), where('schoolId', '==', schoolId))),
                { ttlMs: MASTER_LIST_TTL_MS }
            );
        },
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    const students = useMemo(() => {
        if (!rawStudents) return [];
        return rawStudents.filter((s: any) => {
            if (selectedClassId && selectedClassId !== 'all') {
                const targetClassName = selectedClass?.name?.toLowerCase().trim();
                const sClassId = String(s.classId || '').toLowerCase().trim();
                const sClassName = String(s.className || (s as any).class || '').toLowerCase().trim();
                const matchesId = s.classId === selectedClassId;
                const matchesName = targetClassName && (sClassId === targetClassName || sClassName === targetClassName);
                if (!matchesId && !matchesName) {
                    return false;
                }
            }
            return true;
        });
    }, [rawStudents, selectedClassId, selectedClass]);

    const readScopedByClassAndYear = useCallback(async <T = any>(colName: string): Promise<T[]> => {
        const base: any[] = [where('schoolId', '==', schoolId)];
        if (selectedClassId && selectedClassId !== 'all') {
            base.push(where('classId', '==', selectedClassId));
        }
        if (selectedYearVariants.length > 0) {
            try {
                return await readAll<T>(query(collection(firestore!, colName), ...base, where('academicYear', 'in', selectedYearVariants)));
            } catch (err: any) {
                if (err?.code === 'permission-denied') throw err;
                console.warn(`[MasterList] Year-variant query on ${colName} fell back to class-scoped query:`, err?.message);
            }
        }
        return readAll<T>(query(collection(firestore!, colName), ...base));
    }, [firestore, schoolId, selectedClassId, selectedYearVariants, readAll]);

    const assessmentsCacheKey = (firestore && schoolId && selectedClassId)
        ? `ml:assessments:${schoolId}:${classScopeKey}:${yearKey}`
        : null;

    const {
        data: rawAssessments,
        isLoading: isLoadingAssessments,
        refresh: refreshAssessments,
    } = useOnceQuery<Assessment>(
        liveCompileReady ? assessmentsCacheKey : null,
        () => readScopedByClassAndYear<Assessment>('assessments'),
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    const {
        data: rawGrades,
        isLoading: isLoadingGrades,
        refresh: refreshGrades,
    } = useOnceQuery<any>(
        liveCompileReady ? `ml:grades:${schoolId}:${classScopeKey}:${yearKey}` : null,
        () => readScopedByClassAndYear<any>('grades'),
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    const {
        data: rawReportCards,
        isLoading: isLoadingReportCards,
        refresh: refreshReportCards,
    } = useOnceQuery<any>(
        liveCompileReady ? `ml:report-cards:${schoolId}:${classScopeKey}:${yearKey}` : null,
        () => readScopedByClassAndYear<any>('report-cards'),
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    const {
        data: rawReportCardsAlt,
        isLoading: isLoadingReportCardsAlt,
        refresh: refreshReportCardsAlt,
    } = useOnceQuery<any>(
        liveCompileReady ? `ml:reportCards:${schoolId}:${classScopeKey}:${yearKey}` : null,
        () => readScopedByClassAndYear<any>('reportCards'),
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    const {
        data: rawTermReportCards,
        isLoading: isLoadingTermReportCards,
        refresh: refreshTermReportCards,
    } = useOnceQuery<any>(
        liveCompileReady ? `ml:term_report_cards:${schoolId}:${classScopeKey}:${yearKey}` : null,
        () => readScopedByClassAndYear<any>('term_report_cards'),
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    const {
        data: rawMarks,
        isLoading: isLoadingMarks,
        refresh: refreshMarks,
    } = useOnceQuery<any>(
        liveCompileReady ? `ml:marks:${schoolId}:${classScopeKey}:${yearKey}` : null,
        () => readScopedByClassAndYear<any>('marks'),
        { ttlMs: MASTER_LIST_TTL_MS }
    );

    useEffect(() => {
        if (schoolProfile) {
            const savedYear = schoolProfile.academicYear || schoolProfile.activeAcademicYear;
            const savedTerm = schoolProfile.term || schoolProfile.activeTerm || schoolProfile.currentTermId;
            if (savedYear) setSelectedYear(savedYear);
            if (savedTerm) setSelectedTerm(savedTerm);
        }
    }, [schoolProfile]);

    // Unified CA / Exam weighting across Gradebook, Report Cards, Master List, and Ward Grades (defaults to 30% CA / 70% Exam)
    const { caWeight: currentCaWeight, examWeight: currentExamWeight } = useMemo(
        () => resolveSeriesWeights({
            series: selectedSeries,
            classDoc: selectedClass,
            schoolSettings: schoolProfile,
        }),
        [selectedSeries, selectedClass, schoolProfile]
    );
    const CA_WEIGHT = currentCaWeight;
    const EXAM_WEIGHT = currentExamWeight;

    // Build comprehensive lookup index for students across all identifiers:
    // id (Firestore doc ID), uid, studentId (admission ID), admissionNumber, indexNumber, name
    const studentLookup = useMemo(() => {
        const idMap = new Map<string, any>();
        const nameMap = new Map<string, any>();

        (rawStudents || []).forEach(student => {
            const primaryId = getStudentId(student);
            if (!primaryId) return;

            if (student.id) idMap.set(String(student.id).trim(), student);
            if (student.uid) idMap.set(String(student.uid).trim(), student);
            if (student.studentId) idMap.set(String(student.studentId).trim(), student);
            if ((student as any).admissionNumber) idMap.set(String((student as any).admissionNumber).trim(), student);
            if ((student as any).indexNumber) idMap.set(String((student as any).indexNumber).trim(), student);
            if ((student as any).studentNumber) idMap.set(String((student as any).studentNumber).trim(), student);

            const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim().toLowerCase().replace(/\s+/g, ' ');
            if (fullName) nameMap.set(fullName, student);
            if ((student as any).name) nameMap.set(String((student as any).name).trim().toLowerCase().replace(/\s+/g, ' '), student);
        });

        return { idMap, nameMap };
    }, [rawStudents]);

    const resolveStudentForMark = useCallback((a: any) => {
        if (!a) return null;
        const candidates = [
            a.studentId,
            a.studentDocId,
            a.studentRef,
            a.studentUid,
            a.student_id,
            a.uid,
            a.admissionNumber,
            a.indexNumber
        ];
        for (const cand of candidates) {
            if (!cand) continue;
            const key = String(cand).trim();
            if (studentLookup.idMap.has(key)) {
                return studentLookup.idMap.get(key);
            }
        }
        if (a.studentName) {
            const clean = String(a.studentName).trim().toLowerCase().replace(/\s+/g, ' ');
            if (studentLookup.nameMap.has(clean)) {
                return studentLookup.nameMap.get(clean);
            }
        }
        return null;
    }, [studentLookup]);

    // Unify candidate records from all sources: assessments, grades, marks, report-cards, and student embeds
    const candidateRecords = useMemo(() => {
        const list: any[] = [];

        // 1. From assessments collection
        if (rawAssessments && rawAssessments.length > 0) {
            rawAssessments.forEach((a: any) => {
                if (a) {
                    list.push({
                        ...a,
                        studentId: a.studentId || a.studentDocId || a.studentRef || a.studentUid || a.uid || a.admissionNumber,
                        _source: 'assessments'
                    });
                }
            });
        }

        // 2. From grades collection
        if (rawGrades && rawGrades.length > 0) {
            rawGrades.forEach((g: any) => {
                if (g) {
                    list.push({
                        id: g.id || `grade_${Math.random()}`,
                        studentId: g.studentId || g.studentDocId || g.studentRef || g.studentUid || g.uid || g.admissionNumber,
                        studentDocId: g.studentDocId,
                        studentRef: g.studentRef,
                        classId: g.classId,
                        subjectId: g.subjectId,
                        subjectName: g.subjectName,
                        academicYear: g.academicYear || g.year || g.academic_year,
                        term: g.term || g.termId || g.term_id,
                        assessmentType: g.assessmentType || (g.assessmentName?.toLowerCase().includes('exam') ? 'Exam' : 'Class Exercise'),
                        assessmentName: g.assessmentName || 'Assessment',
                        score: g.score !== undefined ? Number(g.score) : undefined,
                        maxScore: g.maxScore !== undefined ? Number(g.maxScore) : 100,
                        classExercise: g.classExercise ?? g.classEx ?? g.exercises,
                        homework: g.homework ?? g.hw,
                        midSem: g.midSem ?? g.midTerm,
                        project: g.project ?? g.proj,
                        caScore: g.caScore ?? g.ca ?? g.classScore,
                        examScore: g.examScore ?? g.exam ?? g.terminalExam,
                        totalScore: g.totalScore ?? g.finalScore ?? g.percentage ?? g.total,
                        isArchived: g.isArchived === true,
                        _source: 'grades'
                    });
                }
            });
        }

        // 3. From marks collection
        if (rawMarks && rawMarks.length > 0) {
            rawMarks.forEach((m: any) => {
                if (m) {
                    list.push({
                        ...m,
                        studentId: m.studentId || m.studentDocId || m.studentRef || m.studentUid || m.uid || m.admissionNumber,
                        _source: 'marks'
                    });
                }
            });
        }

        // 4. From report-cards, reportCards, and term_report_cards collections
        const processReportCards = (rcArray: any[] | null | undefined, sourceLabel: string) => {
            if (!rcArray || rcArray.length === 0) return;
            rcArray.forEach((rc: any) => {
                const sId = rc.studentId || rc.studentDocId || rc.studentRef || rc.studentUid || rc.uid;
                if (!rc || !sId) return;
                const rcSeries = getReportCardSeriesKey(rc);
                const summaries = rc.subjectSummaries || rc.subjects || rc.grades || rc.marks || rc.rows;
                if (Array.isArray(summaries)) {
                    summaries.forEach((sub: any) => {
                        if (Array.isArray(sub.assessments) && sub.assessments.length > 0) {
                            sub.assessments.forEach((a: any) => {
                                list.push({
                                    ...a,
                                    studentId: a.studentId || sId,
                                    classId: a.classId || rc.classId || rc.className,
                                    academicYear: a.academicYear || rc.academicYear || rc.academicYearId || rc.year,
                                    term: a.term || rc.term || rc.termId,
                                    subjectId: a.subjectId || sub.subjectId,
                                    subjectName: a.subjectName || sub.subjectName,
                                    _reportSeries: rcSeries,
                                    _source: `${sourceLabel}-nested`
                                });
                            });
                        } else {
                            list.push({
                                id: `rc_${rc.id}_${sub.subjectId || sub.subjectName || Math.random()}`,
                                studentId: sId,
                                classId: rc.classId || rc.className,
                                academicYear: rc.academicYear || rc.academicYearId || rc.year,
                                term: rc.term || rc.termId,
                                subjectId: sub.subjectId,
                                subjectName: sub.subjectName || sub.subject,
                                classExercise: sub.classExercise ?? sub.classEx ?? sub.exercises,
                                homework: sub.homework ?? sub.hw,
                                midSem: sub.midSem ?? sub.midTerm,
                                project: sub.project ?? sub.proj,
                                caScore: sub.caScore ?? sub.ca ?? sub.classScore,
                                examScore: sub.examScore ?? sub.exam ?? sub.terminalExam,
                                totalScore: sub.percentage ?? sub.finalScore ?? sub.score ?? sub.total,
                                score: sub.percentage ?? sub.finalScore ?? sub.score ?? sub.total,
                                maxScore: 100,
                                assessmentType: rcSeries === 'end_of_term' ? 'Terminal Report Summary' : (rc.reportSeriesLabel || formatSeriesLabelFromId(rcSeries)),
                                mockSeries: rcSeries.startsWith('mock_') ? rcSeries : undefined,
                                _reportSeries: rcSeries,
                                isArchived: rc.isArchived === true,
                                _source: sourceLabel
                            });
                        }
                    });
                }
            });
        };

        processReportCards(rawReportCards, 'report-cards');
        processReportCards(rawReportCardsAlt, 'reportCards');
        processReportCards(rawTermReportCards, 'term_report_cards');

        // 5. From student documents (if grades/assessments/terminalReports are embedded)
        if (rawStudents && rawStudents.length > 0) {
            rawStudents.forEach((stu: any) => {
                const primaryId = getStudentId(stu);
                const embedded = stu.grades || stu.assessments || stu.terminalReports || stu.marks;
                if (Array.isArray(embedded)) {
                    embedded.forEach((item: any) => {
                        list.push({
                            ...item,
                            studentId: primaryId,
                            classId: item.classId || stu.classId,
                            _source: 'student-embedded'
                        });
                    });
                }
            });
        }

        return list;
    }, [rawAssessments, rawGrades, rawMarks, rawReportCards, rawReportCardsAlt, rawTermReportCards, rawStudents]);

    // Filter candidate assessments by Selected Term, Academic Year, and Class using robust normalization
    const classAssessments = useMemo(() => {
        if (!candidateRecords || candidateRecords.length === 0) return [];
        return candidateRecords.filter(a => {
            if (!a) return false;

            const matchedStudent = resolveStudentForMark(a);
            const rawStudentId = a.studentId || a.studentDocId || a.studentRef || a.studentUid || a.student_id || a.uid || a.admissionNumber;
            if (!rawStudentId && !matchedStudent) return false;

            // Class matching (relaxed: matches classId, className, class code, or resolved student's class)
            if (selectedClassId && selectedClassId !== 'all') {
                const targetClassName = selectedClass?.name?.toLowerCase().trim();
                const targetClassCode = String((selectedClass as any)?.code || '').toLowerCase().trim();
                const targetClassLevel = String((selectedClass as any)?.level || '').toLowerCase().trim();
                const aClassId = String(a.classId || '').toLowerCase().trim();
                const aClassName = String(a.className || '').toLowerCase().trim();

                const matchesClassId = a.classId === selectedClassId || aClassId === selectedClassId.toLowerCase().trim();
                const matchesClassName = targetClassName && (aClassId === targetClassName || aClassName === targetClassName);
                const matchesClassCode = targetClassCode && (aClassId === targetClassCode || aClassName === targetClassCode);
                const matchesClassLevel = targetClassLevel && (aClassId === targetClassLevel || aClassName === targetClassLevel);

                const matchesStudent = matchedStudent && (
                    matchedStudent.classId === selectedClassId || 
                    (targetClassName && (
                        String(matchedStudent.className || '').toLowerCase().trim() === targetClassName ||
                        String((matchedStudent as any).class || '').toLowerCase().trim() === targetClassName
                    ))
                );

                if ((a.classId || a.className) && !matchesClassId && !matchesClassName && !matchesClassCode && !matchesClassLevel && !matchesStudent) {
                    return false;
                }

                if (!a.classId && !a.className && matchedStudent && !matchesStudent) {
                    return false;
                }
            }

            // Academic Year matching (normalized: "2024-2025" vs "2024/2025" vs "2024 - 2025" vs "2024/25")
            const recordYear = a.academicYear || a.academicYearId || a.year || a.session || a.academic_year || a.schoolYear;
            if (selectedYear && recordYear && !isYearMatch(recordYear, selectedYear)) {
                return false;
            }

            // Term matching (normalized: "Second Term" vs "Term 2" vs "term_2" vs "2" vs "2nd Term")
            const recordTerm = a.term || a.termId || a.semester || a.term_id || a.academicTerm;
            if (selectedTerm && recordTerm && !isTermMatch(recordTerm, selectedTerm)) {
                return false;
            }

            return true;
        });
    }, [candidateRecords, selectedClassId, selectedClass, selectedYear, selectedTerm, resolveStudentForMark]);

    // Discover alternative terms and years that have marks for this class (smart recovery helper)
    const availableTermsForClass = useMemo(() => {
        if (!candidateRecords || candidateRecords.length === 0) return [];
        const termCounts = new Map<string, { term: string; year: string; count: number }>();
        
        candidateRecords.forEach((a: any) => {
            if (selectedClassId && selectedClassId !== 'all') {
                const targetClassName = selectedClass?.name?.toLowerCase().trim();
                const targetClassCode = String((selectedClass as any)?.code || '').toLowerCase().trim();
                const aClassId = String(a.classId || '').toLowerCase().trim();
                const aClassName = String(a.className || '').toLowerCase().trim();

                const matchesClassId = a.classId === selectedClassId || aClassId === selectedClassId.toLowerCase().trim();
                const matchesClassName = targetClassName && (aClassId === targetClassName || aClassName === targetClassName);
                const matchesClassCode = targetClassCode && (aClassId === targetClassCode || aClassName === targetClassCode);
                const matchedStudent = resolveStudentForMark(a);
                const matchesStudent = matchedStudent && (
                    matchedStudent.classId === selectedClassId || 
                    (targetClassName && (
                        String(matchedStudent.className || '').toLowerCase().trim() === targetClassName ||
                        String((matchedStudent as any).class || '').toLowerCase().trim() === targetClassName
                    ))
                );

                if (!matchesClassId && !matchesClassName && !matchesClassCode && !matchesStudent) return;
            }

            const t = a.term || a.termId || a.semester;
            const y = a.academicYear || a.academicYearId || a.year || selectedYear || '';
            if (!t) return;
            const key = `${t}___${y}`;
            const existing = termCounts.get(key) || { term: t, year: y, count: 0 };
            existing.count++;
            termCounts.set(key, existing);
        });

        return Array.from(termCounts.values()).sort((a, b) => b.count - a.count);
    }, [candidateRecords, selectedClassId, selectedClass, selectedYear, resolveStudentForMark]);

    // Available Report Series options (End of Term, Mid-Term, Mock 1..5 + custom & discovered Mocks)
    const availableSeriesOptions = useMemo(() => {
        return buildAllAcademicSeriesOptions({
            assessments: classAssessments.length > 0 ? classAssessments : candidateRecords,
            classDoc: selectedClass,
            schoolSettings: schoolProfile,
            reportCards: rawReportCards,
        });
    }, [classAssessments, candidateRecords, selectedClass, schoolProfile, rawReportCards]);

    const activeSeriesOption = useMemo(() => {
        return availableSeriesOptions.find(opt => opt.id === selectedSeries) || availableSeriesOptions[0];
    }, [availableSeriesOptions, selectedSeries]);

    const isMockSeries = selectedSeries.startsWith('mock_');
    const isMidTermSeries = selectedSeries === 'mid_term';
    const isBeceClass = isJhsOrBeceClass(selectedClass?.name);

    // Discover which report series have marks in the currently selected Class + Term + Year
    const availableSeriesInCurrentTerm = useMemo(() => {
        const counts = new Map<AcademicSeriesId, { id: AcademicSeriesId; label: string; count: number }>();
        classAssessments.forEach((a: any) => {
            if (a._reportSeries && a._reportSeries !== 'end_of_term') {
                const k = a._reportSeries as AcademicSeriesId;
                const cur = counts.get(k) || { id: k, label: formatSeriesLabelFromId(k), count: 0 };
                cur.count++;
                counts.set(k, cur);
                return;
            }
            const mockOpt = resolveMockSeriesFromAssessment(a);
            if (mockOpt) {
                const cur = counts.get(mockOpt.id) || { id: mockOpt.id, label: mockOpt.label, count: 0 };
                cur.count++;
                counts.set(kSafe(mockOpt.id), cur);
                return;
            }
            if (isMidTermReportScopeAssessment(a)) {
                const curMid = counts.get('mid_term') || { id: 'mid_term', label: 'Mid-Term', count: 0 };
                curMid.count++;
                counts.set('mid_term', curMid);
                return;
            }
            if (isMidTermAssessment(a) || a.midSem !== undefined || a.midTerm !== undefined) {
                const curMid = counts.get('mid_term') || { id: 'mid_term', label: 'Mid-Term', count: 0 };
                curMid.count++;
                counts.set('mid_term', curMid);
            }
            const endCur = counts.get('end_of_term') || { id: 'end_of_term', label: 'End of Term', count: 0 };
            endCur.count++;
            counts.set('end_of_term', endCur);
        });
        function kSafe(id: AcademicSeriesId) { return id; }
        return Array.from(counts.values());
    }, [classAssessments]);

    // Filter classAssessments strictly to the selected report series!
    // - End of Term: NEVER contaminated by Mock Exam marks, Dedicated Mid-Term workspace marks, or non-terminal report cards
    // - Mid-Term: Dedicated Mid-Term workspace marks (CA + Mid-Term Exam) if present, else legacy Mid-Term marks
    // - Mock N: ONLY assessments belonging to that exact Mock N (legacy unnumbered mocks map cleanly to Mock 1)
    const seriesAssessments = useMemo(() => {
        if (!classAssessments || classAssessments.length === 0) return [];
        return classAssessments.filter((a: any) => {
            if (selectedSeries === 'end_of_term') {
                if (a._reportSeries && a._reportSeries !== 'end_of_term') return false;
                if (isMockAssessment(a) || isMidTermReportScopeAssessment(a)) return false;
                return true;
            }
            if (selectedSeries === 'mid_term') {
                if (a._reportSeries) return a._reportSeries === 'mid_term';
                // Keep both dedicated Mid-Term and legacy Mid-Term records here so `computeUnifiedSubjectScore`
                // (`selectMidTermRecordsForSubject`) decides PER SUBJECT rather than dropping legacy subjects class-wide!
                return isMidTermReportScopeAssessment(a) || isMidTermAssessment(a) || a.midSem !== undefined || a.midTerm !== undefined;
            }
            if (selectedSeries.startsWith('mock_')) {
                if (a._reportSeries) return a._reportSeries === selectedSeries;
                const resolved = resolveMockSeriesFromAssessment(a);
                return resolved?.id === selectedSeries;
            }
            return true;
        });
    }, [classAssessments, selectedSeries]);

    // Mid-Term uses weighted CA + Mid-Term Exam whenever Mid-Term CA records exist (and caWeight > 0),
    // and automatically falls back to a 100% Single-Exam broadsheet if a school only recorded Mid-Term Exam marks!
    const midTermHasAnyCaRecords = useMemo(() => {
        if (!isMidTermSeries) return false;
        return seriesAssessments.some((a: any) => {
            if (isMidTermReportScopeAssessment(a)) {
                return resolveMidTermSlot(a) !== 'exam';
            }
            return a.caScore !== undefined && Number(a.caScore) > 0;
        });
    }, [isMidTermSeries, seriesAssessments]);

    const isSingleExamSeries = isMockSeries || (isMidTermSeries && (currentCaWeight <= 0 || !midTermHasAnyCaRecords));

    // Distinct subjects compiled from registered subjects and series assessments
    const rawDistinctSubjectsList = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();

        // 1. Registered subjects
        (subjects || []).forEach(s => {
            map.set(s.id, { id: s.id, name: s.name });
        });

        // 2. Discover subjects from seriesAssessments
        seriesAssessments.forEach(a => {
            const subId = a.subjectId;
            const subName = a.subjectName;
            if (subId && map.has(subId)) return;

            if (subName) {
                const match = Array.from(map.values()).find(s => s.name.toLowerCase().trim() === subName.toLowerCase().trim());
                if (match) return;
            }

            const key = subId || (subName ? subName.toLowerCase().replace(/\s+/g, '_') : 'unknown_subject');
            const label = subName || subId || 'Subject';
            if (!map.has(key)) {
                map.set(key, { id: key, name: label });
            }
        });

        return Array.from(map.values());
    }, [subjects, seriesAssessments]);

    const distinctSubjectsList = activeSnapshot ? activeSnapshot.distinctSubjectsList : rawDistinctSubjectsList;

    // Helper to resolve an assessment's subject to an entry in distinctSubjectsList
    const resolveSubjectKey = useCallback((a: any): string => {
        if (a.subjectId && distinctSubjectsList.some(s => s.id === a.subjectId)) {
            return a.subjectId;
        }
        if (a.subjectName) {
            const clean = a.subjectName.toLowerCase().trim();
            const found = distinctSubjectsList.find(s => s.name.toLowerCase().trim() === clean);
            if (found) return found.id;
        }
        if (a.subjectId) return a.subjectId;
        return a.subjectName ? a.subjectName.toLowerCase().replace(/\s+/g, '_') : 'unknown_subject';
    }, [distinctSubjectsList]);

    // Check if current term data is archived (or if an active unlock window is open on schoolSettings)
    const rawIsTermArchived = useMemo(() => {
        if (schoolProfile?.isTermCorrectionActive) {
            const activeTerm = schoolProfile.activeUnlockedTermId;
            const expires = schoolProfile.termUnlockExpiresAt || schoolProfile.unlockedUntil;
            const expiresMs = expires?.toMillis ? expires.toMillis() : (expires ? new Date(expires).getTime() : 0);
            if ((!activeTerm || isTermMatch(activeTerm, selectedTerm)) && expiresMs > Date.now()) {
                return false;
            }
        }
        if (!classAssessments || classAssessments.length === 0) return false;
        return classAssessments.every(a => (a as any).isArchived === true);
    }, [classAssessments, schoolProfile, selectedTerm]);

    const isTermArchived = activeSnapshot ? activeSnapshot.isArchived : rawIsTermArchived;

    
    // Safety timer: prevent indefinite spinner freeze if network latency spikes
    const isAnyCollectionLoading =
        isLoadingStudents ||
        isLoadingAssessments ||
        isLoadingGrades ||
        isLoadingMarks ||
        isLoadingReportCards ||
        isLoadingReportCardsAlt ||
        isLoadingTermReportCards;

    useEffect(() => {
        let timer: any;
        const isAnyLoading = isLoadingSnapshot || isAnyCollectionLoading;
        if (isAnyLoading) {
            timer = setTimeout(() => {
                setLoadingTimedOut(true);
            }, 10000);
        } else {
            setLoadingTimedOut(false);
        }
        return () => clearTimeout(timer);
    }, [isLoadingSnapshot, isAnyCollectionLoading]);

    const snapshotReqSeqRef = useRef<number>(0);

    // Clear any loaded snapshot immediately if filters/series move away from what the snapshot belongs to
    useEffect(() => {
        if (!activeSnapshot) return;
        const snapSeries = (activeSnapshot.reportSeries || 'end_of_term') as AcademicSeriesId;
        if (
            snapSeries !== selectedSeries ||
            activeSnapshot.classId !== selectedClassId ||
            (selectedYear && activeSnapshot.academicYear && !isYearMatch(activeSnapshot.academicYear, selectedYear)) ||
            (selectedTerm && activeSnapshot.term && !isTermMatch(activeSnapshot.term, selectedTerm))
        ) {
            setActiveSnapshot(null);
        }
    }, [activeSnapshot, selectedSeries, selectedClassId, selectedYear, selectedTerm]);

    const handleGenerateAnalytics = useCallback(async (forceRefresh: boolean = false, seriesOverride?: AcademicSeriesId) => {
        if (!selectedClassId || !firestore || !schoolId) return;

        const targetSeries = seriesOverride || selectedSeries;
        if (seriesOverride && seriesOverride !== selectedSeries) {
            setSelectedSeries(seriesOverride);
        }

        const reqSeq = ++snapshotReqSeqRef.current;
        const canonicalTermId = buildTermId(selectedYear, selectedTerm);
        const targetClassDoc = classes?.find(c => c.id === selectedClassId);
        const targetWeights = resolveSeriesWeights({
            series: targetSeries,
            classDoc: targetClassDoc,
            schoolSettings: schoolProfile,
        });

        // Fast path (0 Firestore reads): if raw class marks/cards are already cached in memory and this is not an explicit Refresh,
        // switching series computes immediately from cached data with 0 extra reads!
        if (!forceRefresh && assessmentsCacheKey && peekOnceCache(assessmentsCacheKey, MASTER_LIST_TTL_MS) !== null) {
            setActiveSnapshot(null);
            setIsReportRequested(true);
            return;
        }

        const snapshotDocId = buildAcademicSnapshotDocId(
            schoolId,
            selectedYear || 'current',
            selectedTerm || 'current',
            selectedClassId,
            targetSeries
        );

        // 2c) Check 1-doc snapshot for BOTH archived AND unchanged active terms (`builtAt >= lastMarkWriteAt` & `calcVersion === 2`)
        if (!forceRefresh && !schoolProfile?.isTermCorrectionActive && selectedClassId !== 'all') {
            setIsLoadingSnapshot(true);
            try {
                const classAvgDocId = canonicalTermId
                    ? `${schoolId}__${canonicalTermId}__${safeDocKey(selectedClassId)}`
                    : null;

                const [snapArr, classAvgArr] = await Promise.all([
                    readOnceCached<AcademicReportSnapshotDoc>(
                        `ml:snap:${snapshotDocId}`,
                        async () => {
                            const s = await getDoc(doc(firestore, 'academic_report_snapshots', snapshotDocId));
                            return s.exists() ? [s.data() as AcademicReportSnapshotDoc] : [];
                        },
                        { ttlMs: MASTER_LIST_TTL_MS }
                    ),
                    classAvgDocId
                        ? readOnceCached<any>(
                            `ml:classAvg:${classAvgDocId}`,
                            async () => {
                                const c = await getDoc(doc(firestore, 'classAverages', classAvgDocId));
                                return c.exists() ? [c.data()] : [];
                            },
                            { ttlMs: MASTER_LIST_TTL_MS }
                        )
                        : Promise.resolve([]),
                ]);

                if (reqSeq !== snapshotReqSeqRef.current) return;

                const classAvgData = classAvgArr[0] || null;
                const lastMarkWriteAtMs = toEpochMs(classAvgData?.lastMarkWriteAt);
                const currentMarkVersion = Number(classAvgData?.markVersion || 0);
                latestClassAvgMetaRef.current = { lastMarkWriteAtMs, markVersion: currentMarkVersion };

                const data = snapArr[0];
                if (data) {
                    const snapSeries = (data.reportSeries || 'end_of_term') as AcademicSeriesId;
                    const snapBuiltAtMs = toEpochMs(data.builtAt);
                    const weightsMatch =
                        (data.caWeight === undefined || data.caWeight === targetWeights.caWeight) &&
                        (data.examWeight === undefined || data.examWeight === targetWeights.examWeight);
                    const isFreshActiveSnapshot =
                        snapBuiltAtMs > 0 &&
                        snapBuiltAtMs >= lastMarkWriteAtMs &&
                        (classAvgData?.markVersion === undefined || Number(data.markVersion ?? 0) >= currentMarkVersion) &&
                        weightsMatch;

                    if (
                        data.calcVersion === 2 &&
                        snapSeries === targetSeries &&
                        data.classId === selectedClassId &&
                        (data.isArchived === true || isFreshActiveSnapshot)
                    ) {
                        setActiveSnapshot(data);
                        setIsReportRequested(true);
                        setIsLoadingSnapshot(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Snapshot lookup error, falling back to live compilation:", err);
            }
            if (reqSeq !== snapshotReqSeqRef.current) return;
            setIsLoadingSnapshot(false);
        }

        // Explicit Refresh button: invalidate cached snapshots/marks and force one-time re-read
        if (forceRefresh) {
            persistedSnapshotKeysRef.current.clear();
            invalidateOnceCache(`ml:snap:${schoolId}`);
            invalidateOnceCache(`ml:classAvg:${schoolId}`);
            invalidateOnceCache(`ml:students:${schoolId}:${classScopeKey}`);
            invalidateOnceCache(`ml:assessments:${schoolId}:${classScopeKey}`);
            invalidateOnceCache(`ml:grades:${schoolId}:${classScopeKey}`);
            invalidateOnceCache(`ml:marks:${schoolId}:${classScopeKey}`);
            invalidateOnceCache(`ml:report-cards:${schoolId}:${classScopeKey}`);
            invalidateOnceCache(`ml:reportCards:${schoolId}:${classScopeKey}`);
            invalidateOnceCache(`ml:term_report_cards:${schoolId}:${classScopeKey}`);

            if (canonicalTermId && selectedClassId !== 'all') {
                const classAvgDocId = `${schoolId}__${canonicalTermId}__${safeDocKey(selectedClassId)}`;
                try {
                    const cSnap = await getDoc(doc(firestore, 'classAverages', classAvgDocId));
                    const cData = cSnap.exists() ? cSnap.data() : null;
                    latestClassAvgMetaRef.current = {
                        lastMarkWriteAtMs: toEpochMs(cData?.lastMarkWriteAt),
                        markVersion: Number(cData?.markVersion || 0),
                    };
                    writeOnceCache(`ml:classAvg:${classAvgDocId}`, cData ? [cData] : []);
                } catch {}
            }

            setActiveSnapshot(null);
            setIsReportRequested(true);
            refreshStudents();
            refreshAssessments();
            refreshGrades();
            refreshMarks();
            refreshReportCards();
            refreshReportCardsAlt();
            refreshTermReportCards();
            return;
        }

        // Live compilation (uses `useOnceQuery` 10-min cache — no duplicate refetch listeners!)
        setActiveSnapshot(null);
        setIsReportRequested(true);
    }, [
        selectedClassId,
        firestore,
        schoolId,
        selectedYear,
        selectedTerm,
        selectedSeries,
        classes,
        schoolProfile,
        assessmentsCacheKey,
        classScopeKey,
        refreshStudents,
        refreshAssessments,
        refreshGrades,
        refreshMarks,
        refreshReportCards,
        refreshReportCardsAlt,
        refreshTermReportCards,
    ]);

    // Trigger initial snapshot-first load when opened via ?classId=...&series=... URL link
    useEffect(() => {
        if (!pendingAutoOpenRef.current || !firestore || !schoolId || !selectedYear || !selectedTerm || isRoleLoading || !canAccess) {
            return;
        }
        const pending = pendingAutoOpenRef.current;
        if (selectedClassId !== pending.classId) return;
        pendingAutoOpenRef.current = null;
        handleGenerateAnalytics(false, pending.series);
    }, [firestore, schoolId, selectedYear, selectedTerm, selectedClassId, isRoleLoading, canAccess, handleGenerateAnalytics]);

    useEffect(() => {
        if (isReportRequested) {
            const marksDocs = [
                ...(rawAssessments || []),
                ...(rawGrades || []),
                ...(rawMarks || []),
                ...(rawReportCards || []),
                ...(rawReportCardsAlt || []),
                ...(rawTermReportCards || [])
            ];
            console.log("Query filters:", { academicYear: selectedYear, term: selectedTerm, classId: selectedClassId });
            console.log("Fetched marks count:", marksDocs.length);
            if (marksDocs.length > 0) {
                const sampleDoc = marksDocs[0];
                const docYear = sampleDoc?.academicYear || sampleDoc?.year || sampleDoc?.academic_year;
                const docTerm = sampleDoc?.term || sampleDoc?.termId || sampleDoc?.term_id;
                console.log("Sample fetched mark record:", sampleDoc);
                console.log("Academic year match test:", {
                    selectedYear,
                    sampleDocYear: docYear,
                    isMatch: isYearMatch(docYear, selectedYear)
                });
                console.log("Term match test:", {
                    selectedTerm,
                    sampleDocTerm: docTerm,
                    isMatch: isTermMatch(docTerm, selectedTerm)
                });
            }
            console.log("Filtered classAssessments count:", classAssessments.length);
        }
    }, [isReportRequested, selectedYear, selectedTerm, selectedClassId, rawAssessments, rawGrades, rawMarks, rawReportCards, rawReportCardsAlt, rawTermReportCards, classAssessments.length]);

    // Data Aggregation Engine (Aggregates assessments by student & subject)
    const getCategoryKey = (type: string, name?: string, record?: any) => {
        if (record && isMidTermReportScopeAssessment(record)) {
            const slot = resolveMidTermSlot(record);
            if (slot === 'exam') return 'exam';
            if (slot === 'hw') return 'hw';
            if (slot === 'project') return 'proj';
            return 'classEx';
        }
        const t = `${type || ''} ${name || ''}`.toLowerCase();
        if (t.includes('mock')) return 'mock';
        if (t.includes('mid')) return 'midSem';
        if (t.includes('exam') || t.includes('terminal') || t.includes('end of term') || t.includes('final')) return 'exam';
        if (t.includes('homework') || t.includes('h/w') || t.includes('assignment') || t.includes('hw')) return 'hw';
        if (t.includes('project') || t.includes('proj') || t.includes('practical')) return 'proj';
        if (t.includes('exercise') || t.includes('class ex') || t.includes('quiz') || t.includes('activity') || t.includes('test') || t.includes('classwork') || t.includes('cw')) return 'classEx';
        return 'classEx';
    };

    // Check if the currently selected academic year and term matches the school's active/current session
    const isCurrentSession = useMemo(() => {
        const activeYear = schoolProfile?.academicYear || schoolProfile?.activeAcademicYear;
        const activeTerm = schoolProfile?.term || schoolProfile?.activeTerm || schoolProfile?.currentTermId;
        if (!activeYear || !selectedYear) return false;
        const matchYear = isYearMatch(selectedYear, activeYear);
        const matchTerm = !activeTerm || !selectedTerm || isTermMatch(selectedTerm, activeTerm);
        return Boolean(matchYear && matchTerm);
    }, [schoolProfile, selectedYear, selectedTerm]);

    // Effective students for the selected class/session & report series:
    const effectiveStudents = useMemo(() => {
        const studentMap = new Map<string, any>();

        // 1. First, collect all students who actually have assessment marks in this class for this year, term & series
        seriesAssessments.forEach((a: any) => {
            const matched = resolveStudentForMark(a);
            if (matched) {
                const pid = getStudentId(matched);
                if (pid && !studentMap.has(pid)) {
                    studentMap.set(pid, matched);
                }
            } else {
                const sId = String(a.studentId || a.studentDocId || a.studentRef || a.studentUid || a.uid || a.admissionNumber || '').trim();
                if (sId && !studentMap.has(sId)) {
                    studentMap.set(sId, {
                        id: sId,
                        studentId: sId,
                        firstName: a.studentName || 'Student',
                        lastName: sId.length > 4 ? `(${sId.slice(-4)})` : '',
                        classId: selectedClassId
                    });
                }
            }
        });

        // 2. Include current class roster students if it is the CURRENT active session
        if (isCurrentSession || seriesAssessments.length === 0) {
            (students || []).forEach(s => {
                const pid = getStudentId(s);
                if (pid && !studentMap.has(pid)) {
                    studentMap.set(pid, s);
                }
            });
        }

        return Array.from(studentMap.values());
    }, [students, seriesAssessments, resolveStudentForMark, selectedClassId, isCurrentSession]);

    // Data Aggregation Engine — uses the SAME unified per-subject scorer (`computeUnifiedSubjectScore`) as Gradebook,
    // Report Cards, and Ward Grades so scores, test averaging, Mid-Term per-subject pure-exam detection, weights, and
    // rounding agree 100% across every screen!
    const rawAcademicData = useMemo(() => {
        if (seriesAssessments.length === 0) return null;
        if (effectiveStudents.length === 0 || distinctSubjectsList.length === 0) return null;

        const classSubItemsMap: Record<string, any[]> = {};
        const studentSubItemsMap: Record<string, Record<string, any[]>> = {};
        distinctSubjectsList.forEach(s => { classSubItemsMap[s.id] = []; });

        seriesAssessments.forEach((a: any) => {
            const matched = resolveStudentForMark(a);
            const primaryStudentId = matched
                ? getStudentId(matched)
                : String(a.studentId || a.studentDocId || a.studentRef || a.studentUid || a.uid || '').trim();
            if (!primaryStudentId) return;

            const subjectKey = resolveSubjectKey(a);
            if (!classSubItemsMap[subjectKey]) classSubItemsMap[subjectKey] = [];
            classSubItemsMap[subjectKey].push(a);

            if (!studentSubItemsMap[primaryStudentId]) studentSubItemsMap[primaryStudentId] = {};
            if (!studentSubItemsMap[primaryStudentId][subjectKey]) studentSubItemsMap[primaryStudentId][subjectKey] = [];
            studentSubItemsMap[primaryStudentId][subjectKey].push(a);
        });

        const studentSubjectScores: Record<string, Record<string, number>> = {};
        const studentAverages: Array<any> = [];

        effectiveStudents.forEach(student => {
            const primaryId = getStudentId(student);
            const scoresMap: Record<string, number> = {};
            const subScoresMap: Record<string, any> = {};
            let sumPercentages = 0;
            let testedSubjectsCount = 0;
            let passCount = 0;
            const beceInputs: Array<{ subjectName: string; score: number }> = [];

            distinctSubjectsList.forEach(subject => {
                const myItems = studentSubItemsMap[primaryId]?.[subject.id] || [];
                if (myItems.length === 0) return;

                // Support legacy pre-aggregated row documents (from flattened reportCards / grades collections without `score`)
                const preAggDoc = myItems.find((a: any) =>
                    (a.score === undefined || a.score === null || a.score === '') &&
                    (a.totalScore !== undefined || a.finalScore !== undefined || a.total !== undefined || a.caScore !== undefined || a.ca !== undefined || a.examScore !== undefined || a.exam !== undefined)
                );

                let finalCA = 0;
                let finalExam = 0;
                let finalTotal = 0;
                let rawObtained: number | undefined;
                let rawMax: number | undefined;
                let subIsSingleExam = false;

                if (preAggDoc) {
                    const directCa = preAggDoc.caScore ?? preAggDoc.ca ?? preAggDoc.classScore;
                    const directEx = preAggDoc.examScore ?? preAggDoc.exam ?? preAggDoc.terminalExam;
                    const directTot = preAggDoc.totalScore ?? preAggDoc.finalScore ?? preAggDoc.percentage ?? preAggDoc.total;
                    if (directTot !== undefined && directCa === undefined && directEx === undefined) {
                        finalTotal = Math.min(100, Math.max(0, Math.round(Number(directTot) || 0)));
                        finalCA = isMockSeries ? 0 : Math.round((finalTotal / 100) * currentCaWeight);
                        finalExam = isMockSeries ? finalTotal : Math.max(0, finalTotal - finalCA);
                        subIsSingleExam = isMockSeries;
                    } else {
                        finalCA = directCa !== undefined ? Math.round(Math.min(Number(directCa) || 0, currentCaWeight)) : 0;
                        finalExam = directEx !== undefined ? Math.round(Math.min(Number(directEx) || 0, isMockSeries ? 100 : currentExamWeight)) : 0;
                        finalTotal = Math.min(100, finalCA + finalExam);
                        subIsSingleExam = isMockSeries;
                    }
                } else {
                    const normalizedItems = myItems.map((a: any) => ({
                        ...a,
                        score: a.score ?? a.marks ?? a.mark ?? a.gradeScore ?? (isMidTermSeries ? (a.midSem ?? a.midTerm) : undefined) ?? 0,
                        maxScore: a.maxScore ?? a.totalMarks ?? a.maxMark ?? 100,
                    }));
                    const normalizedClassItems = (classSubItemsMap[subject.id] || []).map((a: any) => ({
                        ...a,
                        score: a.score ?? a.marks ?? a.mark ?? a.gradeScore ?? (isMidTermSeries ? (a.midSem ?? a.midTerm) : undefined) ?? 0,
                        maxScore: a.maxScore ?? a.totalMarks ?? a.maxMark ?? 100,
                    }));

                    const scored = computeUnifiedSubjectScore({
                        series: selectedSeries,
                        studentItems: normalizedItems,
                        classSubjectItems: normalizedClassItems,
                        caWeight: currentCaWeight,
                        examWeight: currentExamWeight,
                    });
                    if (!scored) return;

                    finalCA = scored.ca;
                    finalExam = scored.exam;
                    finalTotal = scored.total;
                    rawObtained = scored.rawObtained;
                    rawMax = scored.rawMax;
                    subIsSingleExam = scored.isSingleExamOnly;
                }

                const gradeInfo = getSeriesGradeFromScore(finalTotal, {
                    isMock: isMockSeries,
                    className: selectedClass?.name,
                    schoolGradingSystem: schoolProfile?.gradingSystem || null,
                });

                scoresMap[subject.id] = finalTotal;
                subScoresMap[subject.id] = {
                    classEx: 0,
                    hw: 0,
                    midSem: isMidTermSeries ? (rawObtained ?? finalTotal) : 0,
                    proj: 0,
                    ca: finalCA,
                    exam: finalExam,
                    rawScore: rawObtained,
                    rawMax,
                    isSingleExamOnly: subIsSingleExam,
                    total: finalTotal,
                    grade: gradeInfo.grade,
                    isBeceGrade: gradeInfo.isBeceGrade,
                    numericGrade: gradeInfo.numericGrade,
                };

                beceInputs.push({ subjectName: subject.name, score: finalTotal });
                sumPercentages += finalTotal;
                testedSubjectsCount++;
                if (finalTotal >= 50) passCount++;
            });

            const overallAvg = testedSubjectsCount > 0 ? sumPercentages / testedSubjectsCount : 0;
            const beceAgg = (isMockSeries && isBeceClass)
                ? computeBeceAggregate(beceInputs, schoolProfile?.gradingSystem)
                : { aggregate: null, subjectsUsed: 0, isCompleteSix: false };
            studentSubjectScores[primaryId] = scoresMap;

            studentAverages.push({
                studentId: primaryId,
                studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || (student as any).name || 'Student',
                average: Math.round(overallAvg),
                subjectScores: scoresMap,
                subjectSubScores: subScoresMap,
                passCount,
                totalTestedSubjects: testedSubjectsCount,
                beceAggregate: beceAgg.aggregate,
                beceSubjectsUsed: beceAgg.subjectsUsed,
                beceIsCompleteSix: beceAgg.isCompleteSix,
            });
        });

        // Compute Subject Performance Summary across class
        const subjectPerformance: Array<{
            subjectId: string;
            subjectName: string;
            average: number;
            passRate: number;
            totalStudentsCount: number;
        }> = [];

        distinctSubjectsList.forEach(subject => {
            let sumSubjectScores = 0;
            let countStudentsInSubject = 0;
            let passStudentsInSubject = 0;

            effectiveStudents.forEach(student => {
                const primaryId = getStudentId(student);
                const score = studentSubjectScores[primaryId]?.[subject.id];
                if (score !== undefined) {
                    sumSubjectScores += score;
                    countStudentsInSubject++;
                    if (score >= 50) {
                        passStudentsInSubject++;
                    }
                }
            });

            if (countStudentsInSubject > 0) {
                const avg = sumSubjectScores / countStudentsInSubject;
                const passRate = (passStudentsInSubject / countStudentsInSubject) * 100;
                subjectPerformance.push({
                    subjectId: subject.id,
                    subjectName: subject.name,
                    average: parseFloat(avg.toFixed(1)),
                    passRate: parseFloat(passRate.toFixed(1)),
                    totalStudentsCount: countStudentsInSubject
                });
            }
        });

        const comparePerformers = (a: any, b: any) => {
            if (isMockSeries && isBeceClass) {
                if (a.beceIsCompleteSix && !b.beceIsCompleteSix) return -1;
                if (!a.beceIsCompleteSix && b.beceIsCompleteSix) return 1;
                if (a.beceIsCompleteSix && b.beceIsCompleteSix && a.beceAggregate !== null && b.beceAggregate !== null) {
                    if (a.beceAggregate !== b.beceAggregate) return a.beceAggregate - b.beceAggregate;
                }
            }
            const totalA = Object.values((a.subjectScores || {}) as Record<string, number>).reduce((sum, val) => sum + (Number(val) || 0), 0);
            const totalB = Object.values((b.subjectScores || {}) as Record<string, number>).reduce((sum, val) => sum + (Number(val) || 0), 0);
            if (totalB !== totalA) return totalB - totalA;
            return b.average - a.average;
        };

        // Overall Aggregate Metrics
        const validOverallStudents = studentAverages.filter(s => s.totalTestedSubjects > 0);
        const classOverallAverage = validOverallStudents.length > 0 
            ? validOverallStudents.reduce((sum, s) => sum + s.average, 0) / validOverallStudents.length 
            : 0;

        let totalTestedCombinations = 0;
        let totalPassedCombinations = 0;
        studentAverages.forEach(s => {
            totalTestedCombinations += s.totalTestedSubjects;
            totalPassedCombinations += s.passCount;
        });
        const classPassRate = totalTestedCombinations > 0 
            ? (totalPassedCombinations / totalTestedCombinations) * 100 
            : 0;

        const atRiskStudents = studentAverages.filter(s => s.totalTestedSubjects > 0 && s.average < 50);
        const topPerformer = validOverallStudents.length > 0
            ? [...validOverallStudents].sort(comparePerformers)[0]
            : null;

        // Performance Tiers Count
        let excellentCount = 0;
        let goodCount = 0;
        let passCount = 0;
        let failCount = 0;
        validOverallStudents.forEach(s => {
            if (s.average >= 80) excellentCount++;
            else if (s.average >= 60) goodCount++;
            else if (s.average >= 50) passCount++;
            else failCount++;
        });

        const performanceTiers = [
            { name: 'Excellent (80-100%)', value: excellentCount, color: '#10b981' },
            { name: 'Good (60-79%)', value: goodCount, color: '#3b82f6' },
            { name: 'Pass (50-59%)', value: passCount, color: '#f59e0b' },
            { name: 'Needs Support (<50%)', value: failCount, color: '#ef4444' }
        ].filter(tier => tier.value > 0);

        return {
            studentAverages,
            studentSubjectScores,
            subjectPerformance,
            classOverallAverage: parseFloat(classOverallAverage.toFixed(1)),
            classPassRate: parseFloat(classPassRate.toFixed(1)),
            atRiskStudents,
            topPerformer,
            performanceTiers,
            classAssessmentsCount: seriesAssessments.length
        };
    }, [effectiveStudents, seriesAssessments, distinctSubjectsList, resolveStudentForMark, resolveSubjectKey, currentCaWeight, currentExamWeight, selectedSeries, isMockSeries, isMidTermSeries, isBeceClass, selectedClass, schoolProfile]);

    // Effective academicData (defaults to 1-read snapshot when loaded, else raw computation)
    const academicData = activeSnapshot ? activeSnapshot.academicData : rawAcademicData;

    // Reusable single-subject calculator (used for both real-time Subject Zoom and snapshot pre-compilation)
    const computeSubjectDetails = useCallback((subId: string) => {
        if (!subId || subId === 'all' || !academicData || !effectiveStudents || seriesAssessments.length === 0) return null;

        const subAssessments = seriesAssessments.filter(a => a.subjectId === subId || resolveSubjectKey(a) === subId);

        const studentAssessmentsMap: Record<string, any[]> = {};
        effectiveStudents.forEach(s => {
            const primaryId = getStudentId(s);
            studentAssessmentsMap[primaryId] = subAssessments.filter(a => {
                const st = resolveStudentForMark(a);
                const sId = st ? getStudentId(st) : String(a.studentId || a.studentDocId || a.studentRef || a.uid || '').trim();
                return sId === primaryId;
            });
        });

        const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
        const studentSubjectDetails = effectiveStudents.map(student => {
            const primaryId = getStudentId(student);
            const myAssessments = studentAssessmentsMap[primaryId] || [];
            const recordedScore = academicData.studentSubjectScores[primaryId]?.[subId];
            const hasMark = recordedScore !== undefined || myAssessments.length > 0;

            let finalCA = 0;
            let finalExam = 0;
            let finalScore = recordedScore ?? 0;
            let subIsSingleExam = isMockSeries;
            let caRawStr = '—';
            let examRawStr = '—';

            if (hasMark) {
                const scored = computeUnifiedSubjectScore({
                    series: selectedSeries,
                    studentItems: myAssessments,
                    classSubjectItems: subAssessments,
                    caWeight: currentCaWeight,
                    examWeight: currentExamWeight,
                });
                if (scored) {
                    finalCA = scored.ca;
                    finalExam = scored.exam;
                    if (recordedScore === undefined) finalScore = scored.total;
                    subIsSingleExam = scored.isSingleExamOnly;
                    if (scored.isSingleExamOnly) {
                        caRawStr = '—';
                        examRawStr = scored.rawDisplay || `${finalExam}/100`;
                    } else {
                        caRawStr = `${finalCA}/${currentCaWeight}`;
                        examRawStr = `${finalExam}/${currentExamWeight}`;
                    }
                } else if (recordedScore !== undefined) {
                    caRawStr = isMockSeries ? '—' : `${Math.round((recordedScore / 100) * currentCaWeight)}/${currentCaWeight}`;
                    examRawStr = isMockSeries ? `${recordedScore}/100` : `${Math.round((recordedScore / 100) * currentExamWeight)}/${currentExamWeight}`;
                }

                const letterBucket = getGradeForScore(finalScore, true);
                if (letterBucket !== 'N/A') {
                    gradeDistribution[letterBucket]++;
                }
            }

            const seriesGrade = hasMark
                ? getSeriesGradeFromScore(finalScore, {
                    isMock: isMockSeries,
                    className: selectedClass?.name,
                    schoolGradingSystem: schoolProfile?.gradingSystem || null,
                })
                : null;

            return {
                studentId: primaryId,
                studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || (student as any).name || 'Student',
                hasMark,
                score: hasMark ? finalScore : 0,
                grade: !hasMark
                    ? 'N/A'
                    : (seriesGrade?.isBeceGrade ? `Grade ${seriesGrade.grade}` : getGradeForScore(finalScore, true)),
                weightedCA: finalCA,
                weightedExam: finalExam,
                caRaw: subIsSingleExam ? '—' : caRawStr,
                examRaw: examRawStr
            };
        });

        const assessmentUniqueNames = Array.from(new Set(subAssessments.map(a => a.assessmentName || 'Assessment')));
        const assessmentAudit = assessmentUniqueNames.map(name => {
            const instances = subAssessments.filter(a => (a.assessmentName || 'Assessment') === name);
            const totalScore = instances.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
            const maxScore = instances.reduce((sum, a) => sum + (Number(a.maxScore) || 100), 0) / instances.length;
            const avgScore = instances.length > 0 ? totalScore / instances.length : 0;
            const pct = maxScore > 0 ? (avgScore / maxScore) * 100 : 0;
            const type = instances[0]?.assessmentType || 'CA';

            return {
                name,
                type,
                classAverage: parseFloat(avgScore.toFixed(1)),
                maxScore: parseFloat(maxScore.toFixed(1)),
                percentage: parseFloat(pct.toFixed(1))
            };
        });

        const chartData = ['A', 'B', 'C', 'D', 'E', 'F'].map(g => ({ name: g, count: gradeDistribution[g as keyof typeof gradeDistribution] || 0 }));

        // Only evaluate statistics across tested students (including genuine 0 scores; excluding untested students!)
        const testedStudents = studentSubjectDetails.filter(s => s.hasMark);
        const scores = testedStudents.map(s => s.score);
        const subjectAvg = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
        const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
        const passCount = testedStudents.filter(s => s.score >= 50).length;
        const passRate = testedStudents.length > 0 ? (passCount / testedStudents.length) * 100 : 0;

        return {
            studentScores: studentSubjectDetails,
            assessmentAudit,
            chartData,
            subjectAverage: parseFloat(subjectAvg.toFixed(1)),
            highestScore,
            lowestScore,
            passRate: parseFloat(passRate.toFixed(1))
        };
    }, [academicData, effectiveStudents, seriesAssessments, resolveSubjectKey, currentCaWeight, currentExamWeight, resolveStudentForMark, selectedSeries, isMockSeries, selectedClass, schoolProfile]);

    // Single-Subject Detailed Deep Dive
    const rawSubjectDetails = useMemo(() => {
        return computeSubjectDetails(selectedSubjectId);
    }, [selectedSubjectId, computeSubjectDetails]);

    const subjectDetails = activeSnapshot 
        ? (activeSnapshot.subjectDetailsMap?.[selectedSubjectId] || rawSubjectDetails) 
        : rawSubjectDetails;

    const selectedSubject = distinctSubjectsList.find(s => s.id === selectedSubjectId) || subjects?.find(s => s.id === selectedSubjectId);

    const compareStudentStanding = useCallback((a: any, b: any) => {
        if ((a.totalTestedSubjects || 0) === 0 && (b.totalTestedSubjects || 0) === 0) return 0;
        if ((a.totalTestedSubjects || 0) === 0) return 1;
        if ((b.totalTestedSubjects || 0) === 0) return -1;

        if (isMockSeries && isBeceClass) {
            if (a.beceIsCompleteSix && !b.beceIsCompleteSix) return -1;
            if (!a.beceIsCompleteSix && b.beceIsCompleteSix) return 1;
            if (a.beceIsCompleteSix && b.beceIsCompleteSix && a.beceAggregate !== null && b.beceAggregate !== null && a.beceAggregate !== undefined && b.beceAggregate !== undefined) {
                if (a.beceAggregate !== b.beceAggregate) return a.beceAggregate - b.beceAggregate;
            }
        }

        const scoresA = (a.subjectScores || {}) as Record<string, number>;
        const scoresB = (b.subjectScores || {}) as Record<string, number>;
        const totalA = typeof a.totalMarks === 'number'
            ? a.totalMarks
            : Object.values(scoresA).reduce((sum: number, val: number) => sum + (Number(val) || 0), 0);
        const totalB = typeof b.totalMarks === 'number'
            ? b.totalMarks
            : Object.values(scoresB).reduce((sum: number, val: number) => sum + (Number(val) || 0), 0);
        if (totalB !== totalA) return totalB - totalA;
        return (b.average || 0) - (a.average || 0);
    }, [isMockSeries, isBeceClass]);

    // Leaderboard search filter
    const filteredLeaderboard = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        return academicData.studentAverages
            .filter(s => s.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort(compareStudentStanding);
    }, [academicData, searchQuery, compareStudentStanding]);

    // Top Performers List (Spots 1, 2, 3)
    const topSpots = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        return [...academicData.studentAverages]
            .filter(s => s.totalTestedSubjects > 0)
            .sort(compareStudentStanding)
            .slice(0, 3);
    }, [academicData, compareStudentStanding]);

    // Filter subjects to only those that have at least one grade recorded for the selected class/cohort
    const rawActiveSubjects = useMemo(() => {
        if (!academicData?.studentSubjectScores) return [];

        // 1. Scored subjects
        const scored = distinctSubjectsList.filter(subject => {
            return Object.values(academicData.studentSubjectScores).some(
                scores => scores[subject.id] !== undefined
            );
        });

        const listToUse = scored.length > 0 ? scored : distinctSubjectsList;

        // 2. Sort subjects: Core subjects first, then alphabetically
        const corePriority = ['math', 'english', 'science', 'social', 'ict', 'french', 'ghanaian'];
        return [...listToUse].sort((a, b) => {
            const aLow = a.name.toLowerCase();
            const bLow = b.name.toLowerCase();
            const aPrio = corePriority.findIndex(c => aLow.includes(c));
            const bPrio = corePriority.findIndex(c => bLow.includes(c));
            if (aPrio !== -1 && bPrio !== -1) return aPrio - bPrio;
            if (aPrio !== -1) return -1;
            if (bPrio !== -1) return 1;
            return a.name.localeCompare(b.name);
        });
    }, [distinctSubjectsList, academicData]);

    const activeSubjects = activeSnapshot ? activeSnapshot.activeSubjects : rawActiveSubjects;

    // Rank students (by BECE Best-6 Aggregate first on JHS Mocks, else totalMarks + average tiebreaker)
    const rawRankedStudents = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        
        const list = academicData.studentAverages.map(s => {
            const scores = (s.subjectScores || {}) as Record<string, number>;
            const totalMarks = Object.values(scores).reduce((sum: number, val: number) => sum + (Number(val) || 0), 0);
            return {
                ...s,
                totalMarks: Math.round(Number(totalMarks))
            };
        });

        list.sort(compareStudentStanding);

        let currentRank = 1;
        return list.map((item, idx) => {
            if (item.totalTestedSubjects === 0) {
                return {
                    ...item,
                    rank: '-'
                };
            }
            if (idx > 0 && list[idx - 1].totalTestedSubjects > 0 && compareStudentStanding(list[idx - 1], item) < 0) {
                currentRank = idx + 1;
            }
            return {
                ...item,
                rank: currentRank
            };
        });
    }, [academicData, compareStudentStanding]);

    const rankedStudents = activeSnapshot ? activeSnapshot.rankedStudents : rawRankedStudents;

    // 2c) Auto-save snapshot to Firestore for Admins (both archived AND active terms, stamped with `builtAt` & `markVersion`)
    // so subsequent opens by Teachers or Admins cost <= 2 Firestore reads unless a new mark was written (`builtAt < lastMarkWriteAt`)!
    useEffect(() => {
        if (
            isAdmin &&
            selectedClassId &&
            selectedClassId !== 'all' &&
            !schoolProfile?.isTermCorrectionActive &&
            isReportRequested && 
            !activeSnapshot && 
            !isLoadingSnapshot &&
            rawAcademicData && 
            rawActiveSubjects.length > 0 &&
            rawRankedStudents.length > 0 && 
            !isAnyCollectionLoading &&
            firestore && 
            schoolId
        ) {
            const snapshotDocId = buildAcademicSnapshotDocId(
                schoolId,
                selectedYear || 'current',
                selectedTerm || 'current',
                selectedClassId,
                selectedSeries
            );
            const { lastMarkWriteAtMs, markVersion } = latestClassAvgMetaRef.current;
            const persistKey = `${snapshotDocId}@${markVersion}:${currentCaWeight}:${currentExamWeight}`;
            if (persistedSnapshotKeysRef.current.has(persistKey)) return;
            persistedSnapshotKeysRef.current.add(persistKey);

            // Pre-compile subjectDetailsMap for all class subjects
            const detailsMap: Record<string, any> = {};
            rawDistinctSubjectsList.forEach(sub => {
                const details = computeSubjectDetails(sub.id);
                if (details) {
                    detailsMap[sub.id] = details;
                }
            });

            const builtAtMs = Math.max(Date.now(), lastMarkWriteAtMs);
            const snapshotPayload: AcademicReportSnapshotDoc = {
                id: snapshotDocId,
                calcVersion: 2,
                builtAt: builtAtMs,
                markVersion,
                caWeight: currentCaWeight,
                examWeight: currentExamWeight,
                schoolId,
                academicYear: selectedYear,
                term: selectedTerm,
                reportSeries: selectedSeries,
                reportSeriesLabel: activeSeriesOption.shortLabel,
                classId: selectedClassId,
                className: selectedClass?.name || 'All Classes',
                isArchived: rawIsTermArchived,
                snapshotCreatedAt: new Date(builtAtMs).toISOString(),
                updatedAt: new Date(builtAtMs).toISOString(),
                distinctSubjectsList: rawDistinctSubjectsList,
                activeSubjects: rawActiveSubjects,
                rankedStudents: rawRankedStudents,
                academicData: rawAcademicData,
                subjectDetailsMap: detailsMap
            };

            const sanitizedPayload = JSON.parse(JSON.stringify(snapshotPayload));
            setDoc(doc(firestore, 'academic_report_snapshots', snapshotDocId), sanitizedPayload, { merge: true })
                .then(() => {
                    writeOnceCache(`ml:snap:${snapshotDocId}`, [snapshotPayload]);
                    setActiveSnapshot(snapshotPayload);
                })
                .catch(err => {
                    persistedSnapshotKeysRef.current.delete(persistKey);
                    console.warn("Failed to persist academic report snapshot:", err);
                });
        }
    }, [
        isAdmin,
        schoolProfile?.isTermCorrectionActive,
        isReportRequested, 
        activeSnapshot, 
        isLoadingSnapshot,
        rawAcademicData, 
        rawRankedStudents, 
        rawDistinctSubjectsList, 
        rawActiveSubjects, 
        rawIsTermArchived,
        isAnyCollectionLoading,
        firestore, 
        schoolId, 
        selectedClassId, 
        selectedYear, 
        selectedTerm, 
        selectedSeries,
        activeSeriesOption,
        selectedClass, 
        currentCaWeight,
        currentExamWeight,
        computeSubjectDetails
    ]);

    const handleDownloadCSV = () => {
        if (!rankedStudents || rankedStudents.length === 0 || !activeSubjects) return;

        let csvContent = "";

        if (isSingleExamSeries) {
            // Clean 100% Mock / Mid-Term Broadsheet CSV
            const headerRow = ["Position", "Student Name"];
            activeSubjects.forEach(sub => {
                headerRow.push(`"${sub.name} (%)"`, `"${sub.name} Grade"`);
            });
            headerRow.push("Subjects Tested", "Total Marks", "Average (%)");
            if (isMockSeries && isBeceClass) {
                headerRow.push("BECE Aggregate (Best 6)");
            }
            csvContent += headerRow.join(",") + "\n";

            rankedStudents.forEach(s => {
                const rowData = [s.rank.toString(), `"${s.studentName}"`];
                activeSubjects.forEach(sub => {
                    const subScore = s.subjectSubScores?.[sub.id];
                    const score = s.subjectScores?.[sub.id];
                    if (score !== undefined) {
                        rowData.push(score.toString(), subScore?.grade ? `"${subScore.grade}"` : "");
                    } else {
                        rowData.push("", "");
                    }
                });
                rowData.push(
                    String(s.totalTestedSubjects ?? 0),
                    s.totalMarks.toString(),
                    `${s.average}%`
                );
                if (isMockSeries && isBeceClass) {
                    rowData.push(s.beceAggregate !== null && s.beceAggregate !== undefined ? String(s.beceAggregate) : "");
                }
                csvContent += rowData.join(",") + "\n";
            });
        } else {
            // Row 1 Header
            const row1 = ["Position", "Student Name"];
            activeSubjects.forEach(sub => {
                row1.push(`"${sub.name}"`, "", "", "", "", "", "");
            });
            row1.push("Total Marks", "Average (%)");
            csvContent += row1.join(",") + "\n";

            // Row 2 Header
            const row2 = ["", ""];
            activeSubjects.forEach(sub => {
                row2.push("\"Class Ex\"", "\"H/W\"", "\"Mid Sem\"", "\"Proj\"", `\"C.A. (${currentCaWeight}%)\"`, `\"Exams (${currentExamWeight}%)\"`, "\"Total\"");
            });
            row2.push("", "");
            csvContent += row2.join(",") + "\n";

            // Student Data Rows
            rankedStudents.forEach(s => {
                const rowData = [s.rank.toString(), `"${s.studentName}"`];
                activeSubjects.forEach(sub => {
                    const subScore = s.subjectSubScores?.[sub.id];
                    if (subScore) {
                        const caTotal = subScore.ca !== undefined ? subScore.ca : parseFloat((subScore.classEx + subScore.hw + subScore.midSem + subScore.proj).toFixed(1));
                        rowData.push(
                            subScore.classEx > 0 ? subScore.classEx.toString() : "",
                            subScore.hw > 0 ? subScore.hw.toString() : "",
                            subScore.midSem > 0 ? subScore.midSem.toString() : "",
                            subScore.proj > 0 ? subScore.proj.toString() : "",
                            caTotal > 0 ? caTotal.toString() : (subScore.ca !== undefined && subScore.ca > 0 ? subScore.ca.toString() : ""),
                            subScore.exam > 0 ? subScore.exam.toString() : "",
                            subScore.total > 0 ? subScore.total.toString() : ""
                        );
                    } else {
                        rowData.push("", "", "", "", "", "", "");
                    }
                });
                rowData.push(s.totalMarks.toString(), `${s.average}%`);
                csvContent += rowData.join(",") + "\n";
            });
        }

        // Trigger file download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const seriesSlug = activeSeriesOption.shortLabel.replace(/\s+/g, '_');
        const filename = `${selectedClass?.name || 'School'}_${seriesSlug}_Master_List_${selectedTerm}_${selectedYear}.csv`.replace(/\s+/g, '_');
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isLoading = isSchoolLoading || isRoleLoading || isLoadingClasses || isLoadingSubjects;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-sm font-medium">Compiling institutional records...</p>
            </div>
        );
    }

    if (!canAccess) {
        return (
            <div className="p-8 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50 shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-800">Access Restricted</CardTitle>
                        <CardDescription>Academic reports are reserved for administrators, directors, and teaching staff.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center pt-2">
                        <Button asChild variant="outline" className="border-slate-200 shadow-sm"><Link href="/dashboard">Return to Dashboard</Link></Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const renderEmptyOrArchivedCard = () => {
        if (isTermArchived) {
            return (
                <div className="text-center py-12 px-6 bg-gradient-to-b from-indigo-50/50 via-white to-white border-2 border-indigo-200 rounded-3xl shadow-md max-w-2xl mx-auto space-y-5 my-6">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl w-fit mx-auto shadow-lg shadow-indigo-200">
                        <Archive className="h-8 w-8" />
                    </div>
                    <div className="space-y-1.5">
                        <Badge className="bg-indigo-100 text-indigo-900 border-indigo-200 font-extrabold uppercase text-[10px] tracking-wider px-3 py-1">
                            Term Data Archived
                        </Badge>
                        <h3 className="text-xl font-black text-slate-900 pt-2">
                            Academic Marks for {selectedTerm} ({selectedYear}) Have Been Archived
                        </h3>
                        <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed pt-1">
                            Continuous assessments and terminal exam records for this term were frozen during end-of-term archiving to optimize system performance and freeze historical grades.
                        </p>
                    </div>

                    {availableTermsForClass.length > 0 && (
                        <div className="bg-white border border-indigo-200 rounded-2xl p-4 text-left space-y-3 shadow-inner">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-600" />
                                Available Data Discovered in Other Terms for this Class:
                            </h4>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {availableTermsForClass.map(item => (
                                    <Button
                                        key={`${item.term}_${item.year}`}
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 shadow-sm flex items-center gap-1.5"
                                        onClick={() => {
                                            setSelectedTerm(item.term);
                                            if (item.year) setSelectedYear(item.year);
                                            setIsReportRequested(true);
                                        }}
                                    >
                                        <span>⚡</span> Switch to {item.term} {item.year ? `(${item.year})` : ''} • {item.count} marks
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-indigo-100 rounded-2xl p-4 text-left space-y-3 shadow-inner">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <Info className="h-4 w-4 text-indigo-600" />
                            How to Access or Edit Archived Term Data:
                        </h4>
                        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
                            <li>
                                <strong>To View Frozen Report Cards:</strong> Go to <Link href="/dashboard/my-reports" className="text-indigo-600 font-bold underline">My Reports</Link> or <Link href="/dashboard/report-cards/student-parent-view" className="text-indigo-600 font-bold underline">Report Cards</Link> to inspect historical term summaries.
                            </li>
                            <li>
                                <strong>To Edit / Re-Sync Marks:</strong> Click the button below to temporarily unlock this term for a 24-hour correction window.
                            </li>
                        </ul>
                    </div>

                    <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
                        <TermManagementModal
                            schoolId={schoolId || 'default'}
                            currentTermId={selectedTerm}
                            onSuccess={() => handleGenerateAnalytics()}
                        />
                        <Button variant="outline" size="sm" onClick={() => { setSelectedClassId(null); setIsReportRequested(false); }} className="rounded-xl">
                            Change Class
                        </Button>
                    </div>
                </div>
            );
        }

        const otherSeriesWithMarks = availableSeriesInCurrentTerm.filter(s => s.id !== selectedSeries && s.count > 0);

        return (
            <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-5 my-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-1"/>
                <h3 className="text-lg font-semibold text-slate-800">No {activeSeriesOption.shortLabel} Records Found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                    No marks have been posted yet for <strong className="text-indigo-700">{activeSeriesOption.shortLabel}</strong> in <strong className="text-slate-700">{selectedTerm}</strong> ({selectedYear}).
                </p>

                {otherSeriesWithMarks.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/70 border-2 border-amber-300 rounded-2xl p-5 text-left space-y-3 shadow-sm my-3">
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-600" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                                Marks Discovered in Other Exam Series for {selectedTerm}:
                            </h4>
                        </div>
                        <p className="text-xs text-slate-700">
                            This class has marks recorded under other exam series in this term. Click below to open &amp; print that Master List immediately:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {otherSeriesWithMarks.map(item => (
                                <Button
                                    key={item.id}
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs h-9 shadow-sm flex items-center gap-1.5"
                                    onClick={() => handleGenerateAnalytics(false, item.id)}
                                >
                                    <span>🎯</span> Open {item.label} Master List • {item.count} marks
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {availableTermsForClass.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-200 rounded-2xl p-5 text-left space-y-3 shadow-inner my-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-indigo-600" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                                Marks Discovered in Other Terms for this Class:
                            </h4>
                        </div>
                        <p className="text-xs text-slate-600">
                            We detected stored assessment marks for this class in other academic terms. Click below to load them instantly:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {availableTermsForClass.map(item => (
                                <Button
                                    key={`${item.term}_${item.year}`}
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 shadow-sm flex items-center gap-1.5"
                                    onClick={() => {
                                        setSelectedTerm(item.term);
                                        if (item.year) setSelectedYear(item.year);
                                        setIsReportRequested(true);
                                    }}
                                >
                                    <span>⚡</span> Switch to {item.term} {item.year ? `(${item.year})` : ''} • {item.count} marks
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4 gap-2 flex justify-center print:hidden">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedClassId(null); setIsReportRequested(false); }}>Change Class</Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" asChild>
                        <Link href="/dashboard/academics/gradebook/manual-entry">Go to Gradebook</Link>
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-12" id="report-content">
            
            {/* PRINT COMPATIBLE LETTERHEAD */}
            <div className="hidden print:flex flex-col items-center border-b border-slate-300 pb-4 mb-6 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{schoolProfile?.schoolName || 'ACADEMIC REPORT CARD'}</h1>
                <p className="text-xs text-slate-500 mt-1">{schoolProfile?.address || ''} {schoolProfile?.phone ? `| Tel: ${schoolProfile.phone}` : ''} {schoolProfile?.email ? `| Email: ${schoolProfile.email}` : ''}</p>
                <div className="mt-4 border-t pt-4 w-full flex justify-between text-xs font-semibold text-slate-600">
                    <span>REPORT: ACADEMIC DECISION & MANAGEMENT SUMMARY</span>
                    <span>ACADEMIC TERM: {selectedTerm} ({selectedYear})</span>
                    <span>CLASS: {selectedClass?.name || 'ALL CLASSES'}</span>
                </div>
            </div>

            {/* SCREEN-ONLY TOP HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-indigo-200 animate-pulse" /> 
                        Academic Reporting Panel
                    </h1>
                    <p className="text-indigo-100 text-sm font-medium">
                        Comprehensive institutional data metrics & indicators ({currentCaWeight}% Continuous Assessment / {currentExamWeight}% Term Examinations).
                    </p>
                </div>
                <div className="flex gap-2 self-stretch md:self-auto justify-end">
                    <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/dashboard/reports/enrollment">Enrollment</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/dashboard/reports/attendance">Attendance</Link>
                    </Button>
                    <Button 
                        onClick={() => window.print()} 
                        disabled={!selectedClassId || !isReportRequested || !academicData}
                        className="bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/15"
                        title={(!selectedClassId || !isReportRequested || !academicData) ? "Generate analytics first to print record" : "Print Record"}
                    >
                        <Printer className="mr-2 h-4 w-4"/>Print Record
                    </Button>
                </div>
            </div>

            {/* ACTIVE UNLOCK COUNTDOWN BANNER */}
            {schoolProfile?.isTermCorrectionActive && (
                (!schoolProfile?.activeUnlockedTermId || schoolProfile?.activeUnlockedTermId === selectedTerm || schoolProfile?.activeUnlockedTermId.toLowerCase() === (selectedTerm || '').toLowerCase()) && (
                    <div className="print:hidden">
                        <TermUnlockCountdownBanner
                            unlockedTermId={selectedTerm}
                            expiresAt={schoolProfile.termUnlockExpiresAt || schoolProfile.unlockedUntil}
                        />
                    </div>
                )
            )}

            {/* FILTERS PANEL */}
            <Card className="print:hidden border border-slate-200/80 shadow-md">
                <CardHeader className="py-4 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                        <Info className="h-4 w-4 text-indigo-500" /> Filter Selection
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                        {/* Column 1: Academic Year */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Academic Year</label>
                            <Select value={selectedYear} onValueChange={(val) => { setSelectedYear(val); setIsReportRequested(false); setActiveSnapshot(null); }}>
                                <SelectTrigger className="w-full bg-white h-11 border-2"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                <SelectContent>{MOCK_ACADEMIC_YEARS?.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Column 2: Term */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Term</label>
                            <Select value={selectedTerm} onValueChange={(val) => { setSelectedTerm(val); setIsReportRequested(false); setActiveSnapshot(null); }}>
                                <SelectTrigger className="w-full bg-white h-11 border-2"><SelectValue placeholder="Select Term" /></SelectTrigger>
                                <SelectContent>{MOCK_TERMS?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Column 3: Report Series (End of Term / Mid-Term / Mock 1 / Mock 2 ...) */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black text-amber-700 uppercase mb-1">Report Type / Series</label>
                            <Select
                                value={selectedSeries}
                                onValueChange={(val) => {
                                    const nextSeries = val as AcademicSeriesId;
                                    setSelectedSeries(nextSeries);
                                    setActiveSnapshot(null);
                                    if (isReportRequested && selectedClassId) {
                                        handleGenerateAnalytics(false, nextSeries);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full bg-amber-50/50 border-2 border-amber-200 focus:ring-amber-500 font-bold text-slate-900 h-11">
                                    <SelectValue placeholder="Select Report Series" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSeriesOptions.map(opt => (
                                        <SelectItem key={opt.id} value={opt.id} className="font-semibold">
                                            {opt.kind === 'mock' ? `🎯 ${opt.label} (100%)` : opt.kind === 'mid_term' ? `📝 ${opt.label}` : `🎓 ${opt.label}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Column 4: Class */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Class</label>
                            <Select value={selectedClassId || ''} onValueChange={(val) => { setSelectedClassId(val); setIsReportRequested(false); setActiveSnapshot(null); }}>
                                <SelectTrigger className="w-full bg-indigo-50/50 border-2 border-indigo-200 focus:ring-indigo-500 font-medium h-11">
                                    <SelectValue placeholder="Choose a Class..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {isAdmin && <SelectItem value="all">🏫 Entire School (All Classes)</SelectItem>}
                                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Column 5: Subject Zoom */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject Zoom</label>
                            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId} disabled={!selectedClassId}>
                                <SelectTrigger className="w-full bg-white h-11 border-2 disabled:opacity-50">
                                    <SelectValue placeholder="All Subjects (Class Summary)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">📊 All Subjects (Class Summary)</SelectItem>
                                    {distinctSubjectsList.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Column 6: Generate Analytics Action */}
                        <div className="space-y-1.5">
                            <label className="hidden md:block text-xs font-semibold text-transparent uppercase mb-1 select-none pointer-events-none">&nbsp;</label>
                            <Button 
                                onClick={() => handleGenerateAnalytics(false)} 
                                disabled={!selectedClassId || isLoadingSnapshot || isAnyCollectionLoading} 
                                title={!selectedClassId ? "Please select a class to generate analytics" : "Generate academic analytics"}
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 gap-2 rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoadingSnapshot ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Checking Snapshot...</span>
                                    </>
                                ) : isAnyCollectionLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 className="h-4 w-4" />
                                        <span>Generate Analytics</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* ON-DEMAND ACADEMIC ANALYTICS IDLE EMPTY-STATE */}
            {(!selectedClassId || !isReportRequested) ? (
                <Card className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-12 text-center rounded-3xl shadow-sm my-8 max-w-xl mx-auto space-y-4 print:hidden">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl w-fit mx-auto shadow-md shadow-indigo-200">
                        <BookOpenCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-lg font-black text-slate-900 flex items-center justify-center gap-2">
                            <span>⚡</span> On-Demand Academic Analytics
                        </h3>
                        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                            Select an <strong>Academic Year</strong>, <strong>Term</strong>, <strong>Class</strong>, and <strong>Subject</strong> above, then click <strong>"Generate Analytics"</strong> to fetch grade averages and score distributions without upfront read overhead.
                        </p>
                    </div>
                </Card>
            ) : (isLoadingSnapshot || isAnyCollectionLoading) ? (
                 <div className="text-center py-20 px-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-lg mx-auto space-y-4 my-8">
                     <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600 mb-2"/>
                     <div className="space-y-1">
                         <h4 className="font-bold text-slate-800 text-sm">
                             {isLoadingSnapshot ? "Loading institutional academic snapshot (1 document read)..." : "Loading student gradebook data..."}
                         </h4>
                         <p className="text-xs text-slate-500">
                             Fetching records scoped to {selectedYear} {selectedClassId === 'all' ? '(Entire School)' : ''}...
                         </p>
                     </div>
                     {loadingTimedOut && (
                         <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2 text-xs">
                             <p className="text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                 Scanning large historical dataset. Tip: Selecting a specific class loads much faster than Entire School.
                             </p>
                             <Button 
                                 variant="outline" 
                                 size="sm" 
                                 onClick={() => { setIsReportRequested(false); setActiveSnapshot(null); setLoadingTimedOut(false); }}
                                 className="text-xs h-8"
                             >
                                 Cancel Query
                             </Button>
                         </div>
                     )}
                 </div>
            ) : !academicData ? (
                renderEmptyOrArchivedCard()
            ) : selectedSubjectId === 'all' ? (
                /* ========================================================================= */
                /* CLASS OVERVIEW DASHBOARD (ALL SUBJECTS SUMMARY)                          */
                /* ========================================================================= */
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    {/* 1-READ ACADEMIC DOCUMENT SNAPSHOT BANNER */}
                    {activeSnapshot && (
                        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-cyan-50/50 border-2 border-emerald-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm print:hidden">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
                                    <PackageCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-black text-emerald-950">
                                            1-Read Institutional Academic Snapshot Active
                                        </h4>
                                        <Badge className="bg-emerald-200 text-emerald-900 border-emerald-300 font-extrabold text-[10px]">
                                            1 Firestore Read
                                        </Badge>
                                        <Badge className="bg-blue-100 text-blue-900 border-blue-200 font-bold text-[10px]">
                                            ⚡ Fast Load
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-emerald-800 mt-0.5">
                                        All master sheet positions, subject scores, and analytics for <strong>{selectedClass?.name || 'Class'}</strong> ({selectedTerm}, {selectedYear}) are served from a single aggregated rollup document.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateAnalytics(true)}
                                    className="bg-white hover:bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs h-9 shadow-sm flex items-center gap-1.5"
                                    title="Force re-query raw collections and recompile this snapshot"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" /> Recompile Snapshot
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ARCHIVED TERM INTEGRITY BANNER */}
                    {isTermArchived && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm print:hidden">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
                                    <Archive className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                                        <span>Archived Term (Historical Record)</span>
                                        <Badge className="bg-amber-200 text-amber-900 border-amber-300 font-extrabold text-[10px]">Preserved</Badge>
                                    </h4>
                                    <p className="text-xs text-amber-800 mt-0.5">
                                        Continuous assessments and terminal exam marks for <strong>{selectedTerm} ({selectedYear})</strong> are frozen for historical integrity. All analytics and master sheet records remain fully accessible below.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <TermManagementModal
                                    schoolId={schoolId || 'default'}
                                    currentTermId={selectedTerm}
                                    onSuccess={() => handleGenerateAnalytics(true)}
                                />
                            </div>
                        </div>
                    )}

                    {/* VIEW TOGGLE BAR */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-sm print:hidden">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
                                <button
                                    onClick={() => setViewMode('dashboard')}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                                        viewMode === 'dashboard' 
                                            ? "bg-white text-indigo-750 shadow-sm" 
                                            : "text-slate-600 hover:text-slate-800"
                                    )}
                                >
                                    <BarChart2 className="h-3.5 w-3.5" />
                                    Overview Dashboard
                                </button>
                                <button
                                    onClick={() => setViewMode('master_report')}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                                        viewMode === 'master_report' 
                                            ? "bg-white text-indigo-750 shadow-sm" 
                                            : "text-slate-600 hover:text-slate-800"
                                    )}
                                >
                                    <FileSpreadsheet className="h-3.5 w-3.5" />
                                    Master List ({activeSeriesOption.shortLabel})
                                </button>
                            </div>

                            {availableSeriesInCurrentTerm.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {availableSeriesInCurrentTerm.map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleGenerateAnalytics(false, item.id)}
                                            className={cn(
                                                "px-2.5 py-1 rounded-lg text-[11px] font-black border transition-all",
                                                selectedSeries === item.id
                                                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                                                    : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                                            )}
                                        >
                                            {item.label} ({item.count})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() => handleGenerateAnalytics(true)}
                                className="bg-white hover:bg-slate-100 text-slate-700 border-slate-300 font-bold text-xs h-9 shadow-sm flex items-center gap-1.5"
                                title="Force refresh marks and cards from Firestore"
                            >
                                <RefreshCw className="h-3.5 w-3.5" /> Refresh
                            </Button>
                            <Button
                                onClick={() => window.print()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 shadow-sm flex items-center gap-1.5"
                            >
                                <Printer className="h-4 w-4" /> Print {activeSeriesOption.shortLabel} Master List
                            </Button>
                            {viewMode === 'master_report' && (
                                <Button onClick={handleDownloadCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shadow-sm border-0 flex items-center gap-1.5">
                                    <FileSpreadsheet className="h-4 w-4" /> Export Excel / CSV
                                </Button>
                            )}
                        </div>
                    </div>

                    {viewMode === 'dashboard' ? (
                        <>
                            {/* STATS STRIP */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100 shadow-sm relative overflow-hidden group">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-md">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Class Average</p>
                                            <h3 className="text-2xl font-black text-slate-800">{academicData.classOverallAverage}%</h3>
                                        </div>
                                        <div className="absolute right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                                            <TrendingUp className="h-24 w-24 text-indigo-900" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100 shadow-sm relative overflow-hidden group">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-md">
                                            <UserCheck className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Overall Pass Rate</p>
                                            <h3 className="text-2xl font-black text-slate-800">{academicData.classPassRate}%</h3>
                                        </div>
                                        <div className="absolute right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                                            <UserCheck className="h-24 w-24 text-emerald-900" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100 shadow-sm relative overflow-hidden group">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className="bg-amber-505 p-3 rounded-2xl text-white shadow-md">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-0.5 max-w-[70%]">
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Top Performer</p>
                                            <h3 className="text-lg font-black text-slate-800 truncate" title={academicData.topPerformer?.studentName}>
                                                {academicData.topPerformer?.studentName || 'N/A'}
                                            </h3>
                                            <p className="text-[10px] text-amber-600 font-semibold">{academicData.topPerformer?.average || 0}% Average</p>
                                        </div>
                                        <div className="absolute right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                                            <Award className="h-24 w-24 text-amber-900" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100 shadow-sm relative overflow-hidden group">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-md">
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Needs Support</p>
                                            <h3 className="text-2xl font-black text-slate-800">{academicData.atRiskStudents.length} Students</h3>
                                            <p className="text-[10px] text-rose-600 font-semibold">&lt;50% overall average score</p>
                                        </div>
                                        <div className="absolute right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="h-24 w-24 text-rose-900" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* CHARTS CONTAINER */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {/* SUBJECT COMPARISON BAR */}
                                <Card className="lg:col-span-3 border border-slate-200/80 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                            <BarChart2 className="h-5 w-5 text-indigo-500" /> Subject Average Comparison
                                        </CardTitle>
                                        <CardDescription>Class performance benchmarks grouped by academic subject.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[320px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={academicData.subjectPerformance} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="subjectName" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} interval={0} />
                                                <YAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                                                    formatter={(value) => [`${value}%`, 'Class Average']}
                                                />
                                                <Bar dataKey="average" radius={[4, 4, 0, 0]} name="Subject Average">
                                                    {academicData.subjectPerformance.map((entry, index) => {
                                                        const color = entry.average < 50 ? '#ef4444' : entry.average >= 75 ? '#10b981' : '#6366f1';
                                                        return <Cell key={`cell-${index}`} fill={color} />;
                                                    })}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* PERFORMANCE TIERS PIE */}
                                <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                                    <CardHeader className="pb-0">
                                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                            <Users className="h-5 w-5 text-indigo-500" /> Grade Level Shares
                                        </CardTitle>
                                        <CardDescription>Class distribution across general performance tiers.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[220px] flex items-center justify-center relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={academicData.performanceTiers}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                >
                                                    {academicData.performanceTiers.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} Students`, 'Student Count']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute text-center">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Total Students</p>
                                            <p className="text-2xl font-black text-slate-800">{students?.length || 0}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col gap-1 border-t bg-slate-50/50 p-4">
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full text-xs">
                                            {academicData.performanceTiers.map((tier, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 py-0.5">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                                                    <span className="text-slate-600 truncate font-medium">{tier.name}: <strong>{tier.value}</strong></span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>

                            {/* TOP PERFORMERS SPOTLIGHT */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-amber-500" /> Class Leader Spotlights (Top 3)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {topSpots.map((student, index) => {
                                        const rankColors = [
                                            'from-yellow-400 to-amber-500 border-amber-300 ring-yellow-200',
                                            'from-slate-300 to-slate-400 border-slate-200 ring-slate-100',
                                            'from-amber-600 to-orange-700 border-orange-500 ring-orange-100'
                                        ];
                                        const rankTitles = ['Class Valedictorian', '2nd Position', '3rd Position'];
                                        
                                        return (
                                            <Card key={student.studentId} className={`border border-t-4 border-t-indigo-600 shadow-sm relative overflow-hidden`}>
                                                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                                                    <div>
                                                        <span className={`text-[10px] font-black uppercase text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-55 border border-indigo-100`}>
                                                            {rankTitles[index]}
                                                        </span>
                                                        <CardTitle className="text-lg font-black text-slate-800 mt-2 truncate max-w-[200px]" title={student.studentName}>
                                                            {student.studentName}
                                                        </CardTitle>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[index]} text-white flex items-center justify-center font-bold text-sm shadow-md ring-4`}>
                                                        {index + 1}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pb-4">
                                                    <div className="flex justify-between items-center text-xs font-bold mt-2">
                                                        <span className="text-slate-400">Class Average Score</span>
                                                        <span className="text-indigo-600 text-lg font-black">{student.average}%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-1">
                                                        <span>Subjects Passed</span>
                                                        <span>{student.passCount} / {student.totalTestedSubjects}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                    {topSpots.length === 0 && (
                                        <div className="col-span-full text-center py-6 text-slate-400 bg-slate-50 border rounded-lg">No spotlight statistics found.</div>
                                    )}
                                </div>
                            </div>

                            {/* LEADERBOARD TABLE */}
                            <div className="space-y-4">
                                <Card className="border border-slate-200/80 shadow-sm">
                                    <CardHeader className="pb-3 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                                <FileText className="h-5 w-5 text-indigo-500" /> Student Leaderboard Ranking
                                            </CardTitle>
                                            <CardDescription>Full academic rank sorting for {selectedClass?.name || 'Class'}.</CardDescription>
                                        </div>
                                        <div className="relative w-full md:w-48 print:hidden">
                                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                            <Input
                                                placeholder="Search student..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-8 h-8 text-xs bg-white"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[10%] text-center font-bold">Rank</TableHead>
                                                    <TableHead className="w-[50%] font-bold">Student Name</TableHead>
                                                    <TableHead className="text-right w-[20%] font-bold">Average (%)</TableHead>
                                                    <TableHead className="text-right w-[20%] font-bold">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredLeaderboard.map((student) => {
                                                    const rankedStudent = rankedStudents.find(r => r.studentId === student.studentId);
                                                    const rankDisplay = rankedStudent ? rankedStudent.rank : '-';

                                                    return (
                                                        <TableRow key={student.studentId} className="hover:bg-slate-50 transition-colors">
                                                            <TableCell className="text-center font-bold text-slate-500">{rankDisplay}</TableCell>
                                                            <TableCell className="font-bold text-slate-700">{student.studentName}</TableCell>
                                                            <TableCell className="text-right font-black text-indigo-650">{student.totalTestedSubjects > 0 ? `${student.average}%` : 'N/A'}</TableCell>
                                                            <TableCell className="text-right">{getStatusBadge(student.average)}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {filteredLeaderboard.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No students match the search filter.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <Card className="border border-slate-200 shadow-md">
                            <CardHeader className="border-b bg-slate-50/50 pb-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                                            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                                            <span>
                                                {isMockSeries
                                                    ? `${activeSeriesOption.shortLabel} Examination Master List`
                                                    : isMidTermSeries
                                                        ? 'Mid-Term Examination Master List'
                                                        : 'Academic Master Report Sheet (End of Term)'}
                                            </span>
                                            <Badge className={cn(
                                                "font-black text-[10px] uppercase",
                                                isMockSeries
                                                    ? "bg-amber-100 text-amber-900 border-amber-300"
                                                    : isMidTermSeries
                                                        ? "bg-blue-100 text-blue-900 border-blue-300"
                                                        : "bg-indigo-100 text-indigo-900 border-indigo-200"
                                            )}>
                                                {isSingleExamSeries ? '100% Standalone Series' : `${currentCaWeight}% CA + ${currentExamWeight}% Exam`}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            {isSingleExamSeries
                                                ? `Official ${activeSeriesOption.shortLabel} broadsheet for ${selectedClassId === 'all' ? 'Entire School' : selectedClass?.name || 'Class'} (${selectedTerm}, ${selectedYear}). Ready for A4 Landscape printing.`
                                                : `Subject-by-subject weighted score log for ${selectedClassId === 'all' ? 'Entire School' : selectedClass?.name || 'Class'}.`}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 print:hidden">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.print()}
                                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs h-8"
                                        >
                                            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Broadsheet
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto animate-in fade-in duration-300">
                                {isSingleExamSeries ? (
                                    <Table className="border-collapse border border-slate-200">
                                        <TableHeader>
                                            <TableRow className="bg-slate-900 hover:bg-slate-900 border-b border-slate-800">
                                                <TableHead className="w-14 text-center font-extrabold text-white border-r border-slate-700 uppercase text-xs">Pos</TableHead>
                                                <TableHead className="min-w-[180px] font-extrabold text-white border-r border-slate-700 uppercase text-xs">Student Name</TableHead>
                                                {activeSubjects.map(sub => (
                                                    <TableHead key={sub.id} className="text-center font-extrabold text-amber-200 border-r border-slate-700 uppercase text-[11px] px-2 min-w-[82px]">
                                                        <div>{sub.name}</div>
                                                        <div className="text-[9px] text-slate-300 font-semibold normal-case">100% {isMockSeries && isBeceClass ? '• Grd' : ''}</div>
                                                    </TableHead>
                                                ))}
                                                <TableHead className="text-center font-extrabold text-white w-20 border-r border-slate-700 uppercase text-xs">Subj.</TableHead>
                                                <TableHead className="text-center font-extrabold text-white w-24 bg-slate-800 border-r border-slate-700 uppercase text-xs">Total</TableHead>
                                                <TableHead className="text-center font-extrabold text-white w-24 border-r border-slate-700 uppercase text-xs">Avg (%)</TableHead>
                                                {isMockSeries && isBeceClass && (
                                                    <TableHead className="text-center font-extrabold text-amber-300 w-28 bg-slate-950 uppercase text-xs">BECE Agg.</TableHead>
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rankedStudents.map((s) => (
                                                <TableRow key={s.studentId} className="hover:bg-amber-50/30 transition-colors border-b border-slate-200">
                                                    <TableCell className="text-center font-black text-slate-600 border-r border-slate-200">{s.rank}</TableCell>
                                                    <TableCell className="font-bold text-slate-800 border-r border-slate-200">{s.studentName}</TableCell>
                                                    {activeSubjects.map(sub => {
                                                        const score = s.subjectScores?.[sub.id];
                                                        const subMeta = s.subjectSubScores?.[sub.id];
                                                        return (
                                                            <TableCell key={sub.id} className="text-center border-r border-slate-200 px-2 py-2">
                                                                {score !== undefined ? (
                                                                    <div className="flex items-center justify-center gap-1.5">
                                                                        <span className={cn("font-black text-xs", score < 50 ? "text-rose-600" : "text-slate-900")}>
                                                                            {score}
                                                                        </span>
                                                                        {subMeta?.grade && (
                                                                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                                                                {subMeta.grade}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-300">—</span>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell className="text-center text-xs font-bold text-slate-600 border-r border-slate-200">{s.totalTestedSubjects || 0}</TableCell>
                                                    <TableCell className="text-center font-black text-slate-950 bg-slate-50 border-r border-slate-200">{s.totalMarks}</TableCell>
                                                    <TableCell className="text-center font-black text-indigo-700 border-r border-slate-200">{s.average}%</TableCell>
                                                    {isMockSeries && isBeceClass && (
                                                        <TableCell className="text-center font-black bg-amber-50/50 text-amber-950">
                                                            {s.beceAggregate !== null && s.beceAggregate !== undefined ? (
                                                                <span className="inline-flex items-center gap-1 font-black">
                                                                    {s.beceAggregate}
                                                                    {!s.beceIsCompleteSix && (
                                                                        <span className="text-[9px] text-amber-700 font-semibold">({s.beceSubjectsUsed}/6)</span>
                                                                    )}
                                                                </span>
                                                            ) : '—'}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                            {rankedStudents.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={activeSubjects.length + (isMockSeries && isBeceClass ? 6 : 5)} className="text-center py-10 text-slate-400 italic">
                                                        No student records compiled for {activeSeriesOption.shortLabel}.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                ) : (
                                <Table className="border-collapse border border-slate-200">
                                    <TableHeader>
                                        <TableRow className="bg-slate-100 hover:bg-slate-100 border-b border-slate-200">
                                            <TableHead rowSpan={2} className="w-16 text-center font-extrabold text-slate-800 border-r border-slate-200 uppercase">Position</TableHead>
                                            <TableHead rowSpan={2} className="min-w-[180px] font-extrabold text-slate-800 border-r border-slate-200 uppercase">Student Name</TableHead>
                                            {activeSubjects.map(sub => (
                                                <TableHead key={sub.id} colSpan={7} className="text-center font-extrabold text-slate-800 border-r border-slate-200 uppercase bg-yellow-50/50">{sub.name}</TableHead>
                                            ))}
                                            <TableHead rowSpan={2} className="text-center font-extrabold text-slate-800 w-28 bg-slate-50 border-r border-slate-200 uppercase">Total Marks</TableHead>
                                            <TableHead rowSpan={2} className="text-center font-extrabold text-slate-800 w-24 border-slate-200 uppercase">Average (%)</TableHead>
                                        </TableRow>
                                        <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                            {activeSubjects.map(sub => (
                                                <Fragment key={sub.id}>
                                                    <TableHead className="text-[9px] font-black text-slate-500 border-r border-slate-200 px-1 text-center min-w-[55px] uppercase">Class Ex</TableHead>
                                                    <TableHead className="text-[9px] font-black text-slate-500 border-r border-slate-200 px-1 text-center min-w-[45px] uppercase">H/W</TableHead>
                                                    <TableHead className="text-[9px] font-black text-slate-500 border-r border-slate-200 px-1 text-center min-w-[55px] uppercase">Mid Sem</TableHead>
                                                    <TableHead className="text-[9px] font-black text-slate-500 border-r border-slate-200 px-1 text-center min-w-[45px] uppercase">Proj</TableHead>
                                                    <TableHead className="text-[9px] font-black text-slate-700 border-r border-slate-200 px-1 text-center min-w-[55px] uppercase bg-slate-100/30">C.A. ({currentCaWeight}%)</TableHead>
                                                    <TableHead className="text-[9px] font-black text-slate-500 border-r border-slate-200 px-1 text-center min-w-[55px] uppercase">Exams ({currentExamWeight}%)</TableHead>
                                                    <TableHead className="text-[9px] font-black text-slate-750 border-r border-slate-200 px-1 text-center min-w-[50px] uppercase bg-slate-100/50">Total</TableHead>
                                                </Fragment>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rankedStudents.map((s) => (
                                            <TableRow key={s.studentId} className="hover:bg-slate-50/55 transition-colors border-b border-slate-200">
                                                <TableCell className="text-center font-bold text-slate-500 border-r border-slate-200">{s.rank}</TableCell>
                                                <TableCell className="font-bold text-slate-700 border-r border-slate-200">{s.studentName}</TableCell>
                                                {activeSubjects.map(sub => {
                                                    const subScore = s.subjectSubScores?.[sub.id];
                                                    const caTotal = subScore ? (subScore.ca !== undefined ? subScore.ca : parseFloat((subScore.classEx + subScore.hw + subScore.midSem + subScore.proj).toFixed(1))) : 0;
                                                    return (
                                                        <Fragment key={sub.id}>
                                                            <TableCell className="text-center text-xs text-slate-500 italic font-medium border-r border-slate-200 px-1">
                                                                {subScore !== undefined && subScore.classEx > 0 ? subScore.classEx : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-center text-xs text-slate-500 italic font-medium border-r border-slate-200 px-1">
                                                                {subScore !== undefined && subScore.hw > 0 ? subScore.hw : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-center text-xs text-slate-500 italic font-medium border-r border-slate-200 px-1">
                                                                {subScore !== undefined && subScore.midSem > 0 ? subScore.midSem : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-center text-xs text-slate-500 italic font-medium border-r border-slate-200 px-1">
                                                                {subScore !== undefined && subScore.proj > 0 ? subScore.proj : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-center text-xs font-black border-r border-slate-200 px-1 bg-slate-50 text-slate-900">
                                                                {subScore !== undefined && caTotal > 0 ? caTotal : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-center text-xs text-slate-500 italic font-medium border-r border-slate-200 px-1">
                                                                {subScore !== undefined && subScore.exam > 0 ? subScore.exam : '—'}
                                                            </TableCell>
                                                            <TableCell className="text-center text-xs font-black border-r border-slate-200 px-1 bg-slate-100/60 text-slate-900">
                                                                {subScore !== undefined && subScore.total > 0 ? (
                                                                    <span className={subScore.total < 50 ? 'text-red-600' : 'text-slate-950'}>
                                                                        {subScore.total}
                                                                    </span>
                                                                ) : '—'}
                                                            </TableCell>
                                                        </Fragment>
                                                    );
                                                })}
                                                <TableCell className="text-center font-black text-slate-950 bg-slate-100/50 border-r border-slate-200">{s.totalMarks}</TableCell>
                                                <TableCell className="text-center font-black text-indigo-750">{s.average}%</TableCell>
                                            </TableRow>
                                        ))}
                                        {rankedStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={(activeSubjects.length * 7) + 4} className="text-center py-10 text-slate-400 italic">
                                                    No student records compiled for the selected parameters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>            ) : (
                /* ========================================================================= */
                /* SUBJECT DRILLDOWN DASHBOARD (SINGLE SUBJECT ANALYSIS)                    */
                /* ========================================================================= */
                subjectDetails && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                        {/* 1-READ ACADEMIC DOCUMENT SNAPSHOT BADGE */}
                        {activeSnapshot && (
                            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between shadow-sm text-xs text-emerald-900 font-semibold print:hidden">
                                <div className="flex items-center gap-2">
                                    <PackageCheck className="h-4 w-4 text-emerald-600" />
                                    <span>Subject analytics served from 1-Read Document Snapshot ({selectedClass?.name}, {selectedTerm}, {selectedYear})</span>
                                    <Badge className="bg-emerald-600 text-white font-bold text-[10px]">1 Document Read</Badge>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateAnalytics(true)}
                                    className="bg-white hover:bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs h-7 px-2.5"
                                >
                                    <RefreshCw className="h-3 w-3 mr-1" /> Recompile
                                </Button>
                            </div>
                        )}
                        
                        {/* SUBJECT HEADER BANNER */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-lg">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{selectedSubject?.name} Details</h3>
                                    <p className="text-xs text-slate-500 font-medium">Performance drilldown analysis for class {selectedClass?.name || ''}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSubjectId('all')} className="text-xs print:hidden shadow-sm">
                                Back to All Subjects
                            </Button>
                        </div>

                        {/* STATS STRIP */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-indigo-50/50 border-indigo-100 shadow-sm relative overflow-hidden group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-md">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Subject Average</p>
                                        <h3 className="text-2xl font-black text-slate-800">{subjectDetails.subjectAverage}%</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm relative overflow-hidden group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-md">
                                        <UserCheck className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pass Rate</p>
                                        <h3 className="text-2xl font-black text-slate-800">{subjectDetails.passRate}%</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-amber-50/50 border-amber-100 shadow-sm relative overflow-hidden group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-md">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Highest Score</p>
                                        <h3 className="text-2xl font-black text-slate-800">{subjectDetails.highestScore}%</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-rose-50/50 border-rose-100 shadow-sm relative overflow-hidden group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-md">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Lowest Score</p>
                                        <h3 className="text-2xl font-black text-slate-800">{subjectDetails.lowestScore}%</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CHARTS CONTAINER */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* GRADE DISTRIBUTION */}
                            <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                        <BarChart2 className="h-5 w-5 text-indigo-500" /> Grade Distribution
                                    </CardTitle>
                                    <CardDescription>Number of students receiving each grade tier.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={subjectDetails.chartData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                                            <Tooltip formatter={(value) => [`${value} Students`, 'Total']} />
                                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students">
                                                {subjectDetails.chartData.map((entry: any, index: number) => {
                                                    const colors = ['#10b981', '#3b82f6', '#84cc16', '#eab308', '#f97316', '#ef4444'];
                                                    return <Cell key={`cell-${index}`} fill={colors[index] || '#6366f1'} />;
                                                })}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* ASSESSMENT AUDIT */}
                            <Card className="lg:col-span-3 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                        <BookOpenCheck className="h-5 w-5 text-indigo-500" /> Assessment Item Audit
                                    </CardTitle>
                                    <CardDescription>Average performance benchmarks on specific tests and assignments.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 overflow-y-auto max-h-[280px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Assessment Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Class Avg</TableHead>
                                                <TableHead className="text-right">Performance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subjectDetails.assessmentAudit.map((audit: any, idx: number) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-bold text-slate-700 text-xs">{audit.name}</TableCell>
                                                    <TableCell><Badge variant="secondary" className="text-[10px] font-semibold">{audit.type}</Badge></TableCell>
                                                    <TableCell className="text-right text-xs font-semibold">{audit.classAverage} / {audit.maxScore}</TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={`text-xs font-black ${audit.percentage >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                                                            {audit.percentage}%
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {subjectDetails.assessmentAudit.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No specific assessments listed.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* STUDENT WEIGHTED AVERAGES TABLE */}
                        <Card className="border border-slate-200/80 shadow-sm">
                            <CardHeader className="pb-3 border-b bg-slate-50/50">
                                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                    <FileSpreadsheet className="h-5 w-5 text-indigo-500" /> Subject Weighted Grade Sheet
                                </CardTitle>
                                <CardDescription>Individual student weighted performance breakdown for {selectedSubject?.name}.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead className="text-right">CA Raw</TableHead>
                                            <TableHead className="text-right">CA Weighted ({currentCaWeight}%)</TableHead>
                                            <TableHead className="text-right">Exam Raw</TableHead>
                                            <TableHead className="text-right">Exam Weighted ({currentExamWeight}%)</TableHead>
                                            <TableHead className="text-right font-black">Final Weighted Avg (%)</TableHead>
                                            <TableHead className="text-right">Grade</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subjectDetails.studentScores.map((row: any) => (
                                            <TableRow key={row.studentId} className="hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-bold text-slate-700">{row.studentName}</TableCell>
                                                <TableCell className="text-right text-xs text-slate-500 font-semibold">{row.caRaw}</TableCell>
                                                <TableCell className="text-right text-xs font-semibold text-slate-700">{row.weightedCA}%</TableCell>
                                                <TableCell className="text-right text-xs text-slate-500 font-semibold">{row.examRaw}</TableCell>
                                                <TableCell className="text-right text-xs font-semibold text-slate-700">{row.weightedExam}%</TableCell>
                                                <TableCell className="text-right font-black text-indigo-600">{row.score}%</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={row.grade === 'F' ? 'destructive' : row.grade === 'N/A' ? 'outline' : 'default'} className="font-bold">
                                                        {row.grade}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )
            )}

            {/* PRINT PORTAL FOR LANDSCAPE REPORT */}
            {mounted && createPortal(
                <div id="print-master-report-root" className="hidden print:block bg-white text-black font-sans w-full">
                    {/* School Header */}
                    <div className="flex flex-col items-center text-center border-b-[2.5px] border-slate-900 pb-3 mb-4">
                        <h1 className="text-[20pt] font-black tracking-wide uppercase text-slate-900 leading-none">
                            {schoolProfile?.schoolName || schoolProfile?.name || "School Name"}
                        </h1>
                        {schoolProfile?.motto && (
                            <p className="text-[9.5pt] italic text-slate-600 mt-1 uppercase tracking-wider">
                                &ldquo;{schoolProfile.motto}&rdquo;
                            </p>
                        )}
                        <p className="text-[9.5pt] text-slate-500 mt-1 font-medium">
                            {[
                                schoolProfile?.address,
                                schoolProfile?.phone ? `Tel: ${schoolProfile.phone}` : "",
                                schoolProfile?.email ? `Email: ${schoolProfile.email}` : ""
                            ].filter(Boolean).join("  |  ")}
                        </p>
                    </div>

                    {/* Report Meta Header */}
                    <div className="text-center mb-4">
                        <h2 className="text-[13pt] font-black uppercase tracking-widest text-slate-800">
                            {isMockSeries
                                ? `${activeSeriesOption.shortLabel} Examination Master List`
                                : isMidTermSeries
                                    ? 'Mid-Term Examination Master List'
                                    : 'Academic Master Report Sheet (End of Term)'}
                        </h2>
                        <p className="text-[9.5pt] text-slate-600 mt-0.5 font-bold">
                            Academic Year: {selectedYear} &nbsp;|&nbsp; Term: {selectedTerm} &nbsp;|&nbsp; Series: {activeSeriesOption.shortLabel} &nbsp;|&nbsp; Class: {selectedClassId === 'all' ? 'Entire School (All Classes)' : selectedClass?.name || 'Unassigned'}
                        </p>
                    </div>

                    {/* Roster Table */}
                    <table className="w-full border-collapse text-[8.5pt]">
                        <thead>
                            <tr className="bg-[#1e293b] text-white">
                                <th className="border border-slate-800 p-1.5 w-12 text-center font-bold">Pos</th>
                                <th className="border border-slate-800 p-1.5 text-left min-w-[145px] font-bold">Student Name</th>
                                {activeSubjects.map(sub => (
                                    <th key={sub.id} className="border border-slate-800 p-1.5 text-center font-bold">
                                        {sub.name}
                                        {isMockSeries && isBeceClass ? <span className="block text-[6.5pt] font-normal opacity-80">Score (Grd)</span> : null}
                                    </th>
                                ))}
                                <th className="border border-slate-800 p-1.5 w-20 text-center font-bold bg-[#334155]">Total</th>
                                <th className="border border-slate-800 p-1.5 w-18 text-center font-bold">Avg (%)</th>
                                {isMockSeries && isBeceClass && (
                                    <th className="border border-slate-800 p-1.5 w-20 text-center font-bold bg-[#0f172a]">BECE Agg.</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {rankedStudents.map((s) => (
                                <tr key={s.studentId} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-600">{s.rank}</td>
                                    <td className="border border-slate-300 p-1.5 font-bold text-slate-800">{s.studentName}</td>
                                    {activeSubjects.map(sub => {
                                        const score = s.subjectScores[sub.id];
                                        const subMeta = s.subjectSubScores?.[sub.id];
                                        return (
                                            <td key={sub.id} className="border border-slate-300 p-1.5 text-center font-medium">
                                                {score !== undefined
                                                    ? (isMockSeries && isBeceClass && subMeta?.grade ? `${score} (${subMeta.grade})` : score)
                                                    : '—'}
                                            </td>
                                        );
                                    })}
                                    <td className="border border-slate-300 p-1.5 text-center font-extrabold text-slate-900 bg-slate-100/50">{s.totalMarks}</td>
                                    <td className="border border-slate-300 p-1.5 text-center font-extrabold text-indigo-700">{s.average}%</td>
                                    {isMockSeries && isBeceClass && (
                                        <td className="border border-slate-300 p-1.5 text-center font-extrabold text-slate-950 bg-amber-50/40">
                                            {s.beceAggregate !== null && s.beceAggregate !== undefined ? s.beceAggregate : '—'}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {rankedStudents.length === 0 && (
                                <tr>
                                    <td colSpan={activeSubjects.length + (isMockSeries && isBeceClass ? 5 : 4)} className="border border-slate-300 p-4 text-center text-slate-400 italic">
                                        No student records compiled for the selected term and filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Signature Blocks */}
                    <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-end">
                        <div className="flex flex-col gap-1 min-w-[220px]">
                            <span className="text-[8pt] font-bold text-slate-500 uppercase tracking-widest">Class Teacher Signature</span>
                            <div className="h-[1px] w-[220px] bg-slate-400 mt-8" />
                            <span className="text-[7.5pt] text-slate-400 mt-1">Date: ________________________</span>
                        </div>
                        <div className="flex flex-col gap-1 min-w-[220px] items-end">
                            <span className="text-[8pt] font-bold text-slate-500 uppercase tracking-widest">Headteacher / Director Approval</span>
                            <div className="h-[1px] w-[220px] bg-slate-400 mt-8" />
                            <span className="text-[7.5pt] text-slate-400 mt-1">Date: ________________________</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                @page {
                    size: A4 landscape;
                    margin: 12mm 12mm 12mm 12mm;
                }
                @media print {
                    body > *:not(#print-master-report-root) {
                        display: none !important;
                    }
                    #print-master-report-root {
                        display: block !important;
                        visibility: visible !important;
                        position: static !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                        color: #000 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    #print-master-report-root * {
                        visibility: visible !important;
                    }
                    thead { display: table-header-group !important; }
                    tfoot { display: table-footer-group !important; }
                    tr { page-break-inside: avoid !important; break-inside: avoid !important; }
                    thead tr th {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    tbody tr:nth-child(even) td {
                        background-color: #f8fafc !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}
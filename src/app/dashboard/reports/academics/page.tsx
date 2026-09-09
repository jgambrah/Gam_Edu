'use client';

import { useState, useMemo, useEffect, useCallback, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
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
    BarChart3
} from 'lucide-react';
import { Class, Subject, Student, Assessment } from '@/lib/types';
import Link from 'next/link';
import { useUser } from '@/firebase/provider';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { TermManagementModal, TermUnlockCountdownBanner } from '@/components/dashboard/term-management-modal';

const getGradeForScore = (score: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'N/A' => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    if (score > 0) return 'F';
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
export const getAcademicClassRank = (className?: string): number => {
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

export const compareAcademicClasses = (a: Class, b: Class): number => {
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
export const getStudentId = (student: any): string => {
    if (!student) return '';
    return String(student.id || student.uid || student.studentId || student.admissionNumber || student.indexNumber || '').trim();
};

/**
 * Normalizes academic year strings to account for variants:
 * "2024-2025", "2024/2025", "2024 - 2025", "2024/25", year IDs, etc.
 */
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

export default function AcademicReportsPage() {
    const { role, loading: isRoleLoading } = useRole();
    const router = useRouter();
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
    
    const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolData } = useDoc<any>(schoolRef);
    
    // States
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isReportRequested, setIsReportRequested] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'dashboard' | 'master_report'>('dashboard');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    // Query Classes
    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore || !schoolId || isRoleLoading || !canAccess) return null;
        let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
        if (role === 'Teacher') {
            q = query(q, where('teacherId', '==', user.uid));
        }
        return q;
    }, [firestore, user, role, schoolId, isRoleLoading, canAccess]);
    const { data: rawClasses, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    // Pedagogical Academic Sorting for classes
    const classes = useMemo(() => {
        if (!rawClasses) return [];
        return [...rawClasses].sort(compareAcademicClasses);
    }, [rawClasses]);

    const selectedClass = classes?.find(c => c.id === selectedClassId);

    // Query Subjects
    const subjectsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess) return null;
        return query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess]);
    const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

    // Query Students (school-wide on-demand to support flexible classId/className matching)
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess || !isReportRequested) return null;
        return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess, isReportRequested]);
    const { data: rawStudents, isLoading: isLoadingStudents, forceRefetch: refetchStudents } = useCollection<Student>(studentsQuery);

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

    // Multi-Source On-Demand Querying: Assessments collection
    const assessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess || !isReportRequested) return null;
        return query(collection(firestore, 'assessments'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess, isReportRequested]);
    const { data: rawAssessments, isLoading: isLoadingAssessments, forceRefetch: refetchAssessments } = useCollection<Assessment>(assessmentsQuery);

    // Multi-Source On-Demand Querying: Grades collection (alternative marks collection)
    const gradesQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess || !isReportRequested) return null;
        return query(collection(firestore, 'grades'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess, isReportRequested]);
    const { data: rawGrades, isLoading: isLoadingGrades, forceRefetch: refetchGrades } = useCollection<any>(gradesQuery);

    // Multi-Source On-Demand Querying: Report Cards collection (kebab-case)
    const reportCardsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess || !isReportRequested) return null;
        return query(collection(firestore, 'report-cards'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess, isReportRequested]);
    const { data: rawReportCards, isLoading: isLoadingReportCards, forceRefetch: refetchReportCards } = useCollection<any>(reportCardsQuery);

    // Multi-Source On-Demand Querying: Report Cards collection (camelCase alternate)
    const reportCardsAltQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess || !isReportRequested) return null;
        return query(collection(firestore, 'reportCards'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess, isReportRequested]);
    const { data: rawReportCardsAlt, isLoading: isLoadingReportCardsAlt, forceRefetch: refetchReportCardsAlt } = useCollection<any>(reportCardsAltQuery);

    // Multi-Source On-Demand Querying: Term Report Cards collection (archived & locked term snapshots)
    const termReportCardsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess || !isReportRequested) return null;
        return query(collection(firestore, 'term_report_cards'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess, isReportRequested]);
    const { data: rawTermReportCards, isLoading: isLoadingTermReportCards, forceRefetch: refetchTermReportCards } = useCollection<any>(termReportCardsQuery);

    // Multi-Source On-Demand Querying: Marks collection
    const marksQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess || !isReportRequested) return null;
        return query(collection(firestore, 'marks'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess, isReportRequested]);
    const { data: rawMarks, isLoading: isLoadingMarks, forceRefetch: refetchMarks } = useCollection<any>(marksQuery);

    // Fetch School Settings for standard weighting overrides
    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    useEffect(() => {
        if (schoolProfile) {
            const savedYear = schoolProfile.academicYear || schoolProfile.activeAcademicYear;
            const savedTerm = schoolProfile.term || schoolProfile.activeTerm || schoolProfile.currentTermId;
            if (savedYear) setSelectedYear(savedYear);
            if (savedTerm) setSelectedTerm(savedTerm);
        }
    }, [schoolProfile]);

    // Standard Ghanaian / Basic School default weighting: 50% CA / 50% Exam (unless overridden)
    const CA_WEIGHT = schoolProfile?.caWeight ?? 50;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 50;

    const currentCaWeight = selectedClass?.caWeight ?? CA_WEIGHT;
    const currentExamWeight = selectedClass?.examWeight ?? EXAM_WEIGHT;

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
                const summaries = rc.subjectSummaries || rc.subjects || rc.grades || rc.marks;
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
                                assessmentType: 'Terminal Report Summary',
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

    // Distinct subjects compiled from registered subjects and candidate assessments
    const distinctSubjectsList = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();

        // 1. Registered subjects
        (subjects || []).forEach(s => {
            map.set(s.id, { id: s.id, name: s.name });
        });

        // 2. Discover subjects from classAssessments
        classAssessments.forEach(a => {
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
    }, [subjects, classAssessments]);

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
    const isTermArchived = useMemo(() => {
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

    const handleGenerateAnalytics = () => {
        if (!selectedClassId) return;
        setIsReportRequested(true);

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

        refetchStudents?.();
        refetchAssessments?.();
        refetchGrades?.();
        refetchMarks?.();
        refetchReportCards?.();
        refetchReportCardsAlt?.();
        refetchTermReportCards?.();
    };

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
    const getCategoryKey = (type: string, name?: string) => {
        const t = `${type || ''} ${name || ''}`.toLowerCase();
        if (t.includes('mid')) return 'midSem';
        if (t.includes('exam') || t.includes('terminal') || t.includes('end of term') || t.includes('final')) return 'exam';
        if (t.includes('homework') || t.includes('h/w') || t.includes('assignment') || t.includes('hw')) return 'hw';
        if (t.includes('project') || t.includes('proj') || t.includes('practical')) return 'proj';
        if (t.includes('exercise') || t.includes('class ex') || t.includes('quiz') || t.includes('activity') || t.includes('test') || t.includes('classwork') || t.includes('cw')) return 'classEx';
        return 'classEx';
    };

    // Effective students for the selected class/session:
    // Combines current class roster with any students who have marks in classAssessments
    const effectiveStudents = useMemo(() => {
        const studentMap = new Map<string, any>();
        (students || []).forEach(s => {
            const pid = getStudentId(s);
            if (pid) studentMap.set(pid, s);
        });

        classAssessments.forEach((a: any) => {
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

        return Array.from(studentMap.values());
    }, [students, classAssessments, resolveStudentForMark, selectedClassId]);

    // Data Aggregation Engine (Aggregates assessments by student & subject & category)
    const academicData = useMemo(() => {
        if (classAssessments.length === 0 && effectiveStudents.length === 0) return null;
        if (effectiveStudents.length === 0 || distinctSubjectsList.length === 0) return null;

        // Group assessments by student, subject, and category
        interface SubGrouping {
            classEx: { score: number; maxScore: number; rawCount: number };
            hw: { score: number; maxScore: number; rawCount: number };
            midSem: { score: number; maxScore: number; rawCount: number };
            proj: { score: number; maxScore: number; rawCount: number };
            exam: { score: number; maxScore: number; rawCount: number };
            directCa?: number;
            directExam?: number;
            directTotal?: number;
            directClassEx?: number;
            directHw?: number;
            directMidSem?: number;
            directProj?: number;
        }

        const grouping: Record<string, Record<string, SubGrouping>> = {};

        effectiveStudents.forEach(student => {
            const primaryId = getStudentId(student);
            if (!primaryId) return;

            grouping[primaryId] = {};
            distinctSubjectsList.forEach(subject => {
                grouping[primaryId][subject.id] = {
                    classEx: { score: 0, maxScore: 0, rawCount: 0 },
                    hw: { score: 0, maxScore: 0, rawCount: 0 },
                    midSem: { score: 0, maxScore: 0, rawCount: 0 },
                    proj: { score: 0, maxScore: 0, rawCount: 0 },
                    exam: { score: 0, maxScore: 0, rawCount: 0 }
                };
            });
        });

        classAssessments.forEach((a: any) => {
            const matched = resolveStudentForMark(a);
            const primaryStudentId = matched ? getStudentId(matched) : String(a.studentId || a.studentDocId || a.studentRef || a.studentUid || a.uid || '').trim();
            if (!primaryStudentId) return;

            const subjectKey = resolveSubjectKey(a);

            if (!grouping[primaryStudentId]) {
                grouping[primaryStudentId] = {};
            }
            if (!grouping[primaryStudentId][subjectKey]) {
                grouping[primaryStudentId][subjectKey] = {
                    classEx: { score: 0, maxScore: 0, rawCount: 0 },
                    hw: { score: 0, maxScore: 0, rawCount: 0 },
                    midSem: { score: 0, maxScore: 0, rawCount: 0 },
                    proj: { score: 0, maxScore: 0, rawCount: 0 },
                    exam: { score: 0, maxScore: 0, rawCount: 0 }
                };
            }

            const entry = grouping[primaryStudentId][subjectKey];

            // 1. Direct component properties check (supports all common schemas)
            const directClassEx = a.classExercise ?? a.classEx ?? a.exercises ?? a.exercise ?? a.class_exercise ?? a.test ?? a.tests;
            const directHw = a.homework ?? a.hw ?? a['h/w'] ?? a.assignment ?? a.assignments ?? a.home_work;
            const directMidSem = a.midSem ?? a.midTerm ?? a.midSemester ?? a.midterm ?? a.mid_sem ?? a.mid_term;
            const directProj = a.project ?? a.proj ?? a.practical ?? a.practicals;
            const directExamField = a.exam ?? a.examScore ?? a.terminalExam ?? a.endOfTermExam ?? a.finalExam ?? a.exam_score;
            const directCa = a.caScore ?? a.ca ?? a.classScore ?? a.continuousAssessment ?? a.ca_score;
            const directTotal = a.totalScore ?? a.finalScore ?? a.percentage ?? a.total ?? a.finalTotal;

            if (directClassEx !== undefined && directClassEx !== null && directClassEx !== '' && !isNaN(Number(directClassEx))) {
                const val = Number(directClassEx);
                entry.directClassEx = val;
                entry.classEx.score = val;
                entry.classEx.maxScore = Number(a.classExMaxScore ?? a.classExMax ?? 20);
                entry.classEx.rawCount++;
            }
            if (directHw !== undefined && directHw !== null && directHw !== '' && !isNaN(Number(directHw))) {
                const val = Number(directHw);
                entry.directHw = val;
                entry.hw.score = val;
                entry.hw.maxScore = Number(a.hwMaxScore ?? a.hwMax ?? 20);
                entry.hw.rawCount++;
            }
            if (directMidSem !== undefined && directMidSem !== null && directMidSem !== '' && !isNaN(Number(directMidSem))) {
                const val = Number(directMidSem);
                entry.directMidSem = val;
                entry.midSem.score = val;
                entry.midSem.maxScore = Number(a.midSemMaxScore ?? a.midSemMax ?? 40);
                entry.midSem.rawCount++;
            }
            if (directProj !== undefined && directProj !== null && directProj !== '' && !isNaN(Number(directProj))) {
                const val = Number(directProj);
                entry.directProj = val;
                entry.proj.score = val;
                entry.proj.maxScore = Number(a.projMaxScore ?? a.projMax ?? 20);
                entry.proj.rawCount++;
            }
            if (directExamField !== undefined && directExamField !== null && directExamField !== '' && !isNaN(Number(directExamField))) {
                const val = Number(directExamField);
                entry.directExam = val;
                entry.exam.score = val;
                entry.exam.maxScore = Number(a.examMaxScore ?? a.examMax ?? 100);
                entry.exam.rawCount++;
            }
            if (directCa !== undefined && directCa !== null && directCa !== '' && !isNaN(Number(directCa))) {
                entry.directCa = Number(directCa);
            }
            if (directTotal !== undefined && directTotal !== null && directTotal !== '' && !isNaN(Number(directTotal))) {
                entry.directTotal = Number(directTotal);
            }

            // 2. Individual component assessment records (e.g. from manual entry / gradebook / quiz)
            const scoreVal = Number(a.score ?? a.marks ?? a.mark ?? a.gradeScore ?? 0);
            const maxScoreVal = Number(a.maxScore ?? a.totalMarks ?? a.maxMark ?? 100);

            if (!isNaN(scoreVal) && (scoreVal > 0 || maxScoreVal > 0)) {
                const categoryKey = getCategoryKey(a.assessmentType, a.assessmentName);

                if (directClassEx === undefined && categoryKey === 'classEx') {
                    entry.classEx.score += scoreVal;
                    entry.classEx.maxScore += maxScoreVal;
                    entry.classEx.rawCount++;
                } else if (directHw === undefined && categoryKey === 'hw') {
                    entry.hw.score += scoreVal;
                    entry.hw.maxScore += maxScoreVal;
                    entry.hw.rawCount++;
                } else if (directMidSem === undefined && categoryKey === 'midSem') {
                    entry.midSem.score += scoreVal;
                    entry.midSem.maxScore += maxScoreVal;
                    entry.midSem.rawCount++;
                } else if (directProj === undefined && categoryKey === 'proj') {
                    entry.proj.score += scoreVal;
                    entry.proj.maxScore += maxScoreVal;
                    entry.proj.rawCount++;
                } else if (directExamField === undefined && categoryKey === 'exam') {
                    entry.exam.score += scoreVal;
                    entry.exam.maxScore += maxScoreVal;
                    entry.exam.rawCount++;
                }
            }
        });

        const studentSubjectScores: Record<string, Record<string, number>> = {};
        const studentAverages: Array<{
            studentId: string;
            studentName: string;
            average: number;
            subjectScores: Record<string, number>;
            subjectSubScores: Record<string, { classEx: number; hw: number; midSem: number; proj: number; ca: number; exam: number; total: number }>;
            passCount: number;
            totalTestedSubjects: number;
        }> = [];

        effectiveStudents.forEach(student => {
            const primaryId = getStudentId(student);
            const scoresMap: Record<string, number> = {};
            const subScoresMap: Record<string, { classEx: number; hw: number; midSem: number; proj: number; ca: number; exam: number; total: number }> = {};
            let sumPercentages = 0;
            let testedSubjectsCount = 0;
            let passCount = 0;

            distinctSubjectsList.forEach(subject => {
                const subData = grouping[primaryId]?.[subject.id];
                if (!subData) return;

                const hasClassEx = subData.classEx.rawCount > 0 || subData.directClassEx !== undefined;
                const hasHw = subData.hw.rawCount > 0 || subData.directHw !== undefined;
                const hasMidSem = subData.midSem.rawCount > 0 || subData.directMidSem !== undefined;
                const hasProj = subData.proj.rawCount > 0 || subData.directProj !== undefined;
                const hasExam = subData.exam.rawCount > 0 || subData.directExam !== undefined;
                const hasCa = subData.directCa !== undefined || hasClassEx || hasHw || hasMidSem || hasProj;
                const hasDirectTotal = subData.directTotal !== undefined;

                if (hasCa || hasExam || hasDirectTotal) {
                    const rawClassExVal = subData.directClassEx !== undefined ? subData.directClassEx : subData.classEx.score;
                    const rawHwVal = subData.directHw !== undefined ? subData.directHw : subData.hw.score;
                    const rawMidSemVal = subData.directMidSem !== undefined ? subData.directMidSem : subData.midSem.score;
                    const rawProjVal = subData.directProj !== undefined ? subData.directProj : subData.proj.score;
                    const rawExamVal = subData.directExam !== undefined ? subData.directExam : subData.exam.score;

                    const caObtained = subData.classEx.score + subData.hw.score + subData.midSem.score + subData.proj.score;
                    const caMax = subData.classEx.maxScore + subData.hw.maxScore + subData.midSem.maxScore + subData.proj.maxScore;

                    let finalCA = 0;
                    let finalExam = 0;
                    let final = 0;

                    if (subData.directCa !== undefined) {
                        finalCA = Math.round(Math.min(subData.directCa, currentCaWeight));
                    } else if (caMax > 0) {
                        finalCA = Math.round(Math.min((caObtained / caMax) * currentCaWeight, currentCaWeight));
                    } else if (caObtained > 0) {
                        finalCA = Math.round(Math.min(caObtained, currentCaWeight));
                    }

                    if (subData.directExam !== undefined) {
                        const examMax = subData.exam.maxScore > 0 ? subData.exam.maxScore : 100;
                        finalExam = examMax === currentExamWeight ? Math.round(subData.directExam) : Math.round(Math.min((subData.directExam / examMax) * currentExamWeight, currentExamWeight));
                    } else if (subData.exam.maxScore > 0) {
                        finalExam = Math.round(Math.min((subData.exam.score / subData.exam.maxScore) * currentExamWeight, currentExamWeight));
                    } else if (subData.exam.score > 0) {
                        finalExam = Math.round(Math.min(subData.exam.score, currentExamWeight));
                    }

                    if (hasDirectTotal && !hasCa && !hasExam) {
                        final = Math.min(Math.round(subData.directTotal!), 100);
                        finalCA = Math.round((final / 100) * currentCaWeight);
                        finalExam = Math.max(0, final - finalCA);
                    } else {
                        final = Math.min(finalCA + finalExam, 100);
                    }

                    scoresMap[subject.id] = final;
                    subScoresMap[subject.id] = {
                        classEx: parseFloat(rawClassExVal.toFixed(1)),
                        hw: parseFloat(rawHwVal.toFixed(1)),
                        midSem: parseFloat(rawMidSemVal.toFixed(1)),
                        proj: parseFloat(rawProjVal.toFixed(1)),
                        ca: finalCA,
                        exam: rawExamVal > 0 ? parseFloat(rawExamVal.toFixed(1)) : finalExam,
                        total: final
                    };

                    sumPercentages += final;
                    testedSubjectsCount++;
                    if (final >= 50) {
                        passCount++;
                    }
                }
            });

            const overallAvg = testedSubjectsCount > 0 ? sumPercentages / testedSubjectsCount : 0;
            studentSubjectScores[primaryId] = scoresMap;

            studentAverages.push({
                studentId: primaryId,
                studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || (student as any).name || 'Student',
                average: Math.round(overallAvg),
                subjectScores: scoresMap,
                subjectSubScores: subScoresMap,
                passCount,
                totalTestedSubjects: testedSubjectsCount
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
            ? [...validOverallStudents].sort((a, b) => {
                const totalA = Object.values(a.subjectScores).reduce((sum, val) => sum + val, 0);
                const totalB = Object.values(b.subjectScores).reduce((sum, val) => sum + val, 0);
                if (totalB !== totalA) return totalB - totalA;
                return b.average - a.average;
            })[0]
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
            classAssessmentsCount: classAssessments.length
        };
    }, [effectiveStudents, classAssessments, distinctSubjectsList, resolveSubjectKey, currentCaWeight, currentExamWeight]);

    // Single-Subject Detailed Deep Dive
    const subjectDetails = useMemo(() => {
        if (!selectedSubjectId || selectedSubjectId === 'all' || !academicData || !effectiveStudents || classAssessments.length === 0) return null;

        const subAssessments = classAssessments.filter(a => a.subjectId === selectedSubjectId || resolveSubjectKey(a) === selectedSubjectId);

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
            const score = academicData.studentSubjectScores[primaryId]?.[selectedSubjectId] ?? 0;
            const grade = getGradeForScore(score);
            if (grade !== 'N/A') {
                gradeDistribution[grade]++;
            }

            const myAssessments = studentAssessmentsMap[primaryId] || [];
            let caScore = 0, caMax = 0, examScore = 0, examMax = 0;
            let directCa: number | undefined;
            let directExam: number | undefined;

            myAssessments.forEach(a => {
                if (a.caScore !== undefined) directCa = Number(a.caScore);
                if (a.examScore !== undefined) directExam = Number(a.examScore);

                const category = getCategoryKey(a.assessmentType, a.assessmentName);
                if (category === 'exam') {
                    examScore += (Number(a.score) || 0);
                    examMax += (Number(a.maxScore) || 100);
                } else {
                    caScore += (Number(a.score) || 0);
                    caMax += (Number(a.maxScore) || 100);
                }
            });

            let finalCA = 0;
            let finalExam = 0;
            if (directCa !== undefined) {
                finalCA = Math.round(Math.min(directCa, currentCaWeight));
            } else if (caMax > 0) {
                finalCA = Math.round(Math.min((caScore / caMax) * currentCaWeight, currentCaWeight));
            }

            if (directExam !== undefined) {
                finalExam = Math.round(Math.min(directExam, currentExamWeight));
            } else if (examMax > 0) {
                finalExam = Math.round(Math.min((examScore / examMax) * currentExamWeight, currentExamWeight));
            }

            const finalScore = score > 0 ? score : Math.min(finalCA + finalExam, 100);

            return {
                studentId: primaryId,
                studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || (student as any).name || 'Student',
                score: finalScore,
                grade: getGradeForScore(finalScore),
                weightedCA: finalCA,
                weightedExam: finalExam,
                caRaw: `${caScore}/${caMax}`,
                examRaw: `${examScore}/${examMax}`
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

        const scores = studentSubjectDetails.map(s => s.score).filter(s => s > 0);
        const subjectAvg = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
        const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
        const passCount = studentSubjectDetails.filter(s => s.score >= 50).length;
        const passRate = studentSubjectDetails.length > 0 ? (passCount / studentSubjectDetails.length) * 100 : 0;

        return {
            studentScores: studentSubjectDetails,
            assessmentAudit,
            chartData,
            subjectAverage: parseFloat(subjectAvg.toFixed(1)),
            highestScore,
            lowestScore,
            passRate: parseFloat(passRate.toFixed(1))
        };
    }, [selectedSubjectId, academicData, effectiveStudents, classAssessments, resolveSubjectKey, currentCaWeight, currentExamWeight, resolveStudentForMark]);

    const selectedSubject = distinctSubjectsList.find(s => s.id === selectedSubjectId) || subjects?.find(s => s.id === selectedSubjectId);

    // Leaderboard search filter
    const filteredLeaderboard = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        return academicData.studentAverages
            .filter(s => s.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
                const totalA = Object.values(a.subjectScores).reduce((sum, val) => sum + val, 0);
                const totalB = Object.values(b.subjectScores).reduce((sum, val) => sum + val, 0);
                if (totalB !== totalA) return totalB - totalA;
                return b.average - a.average;
            });
    }, [academicData, searchQuery]);

    // Top Performers List (Spots 1, 2, 3)
    const topSpots = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        return [...academicData.studentAverages]
            .filter(s => s.totalTestedSubjects > 0)
            .sort((a, b) => {
                const totalA = Object.values(a.subjectScores).reduce((sum, val) => sum + val, 0);
                const totalB = Object.values(b.subjectScores).reduce((sum, val) => sum + val, 0);
                if (totalB !== totalA) return totalB - totalA;
                return b.average - a.average;
            })
            .slice(0, 3);
    }, [academicData]);

    // Filter subjects to only those that have at least one grade recorded for the selected class/cohort
    const activeSubjects = useMemo(() => {
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

    // Rank students by total marks descending (with average as tiebreaker)
    const rankedStudents = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        
        const list = academicData.studentAverages.map(s => {
            const totalMarks = Object.values(s.subjectScores).reduce((sum, val) => sum + val, 0);
            return {
                ...s,
                totalMarks: Math.round(totalMarks)
            };
        });

        // Sort descending by totalMarks, then average. Place untested students at the end.
        list.sort((a, b) => {
            if (a.totalTestedSubjects === 0 && b.totalTestedSubjects === 0) return 0;
            if (a.totalTestedSubjects === 0) return 1;
            if (b.totalTestedSubjects === 0) return -1;

            if (b.totalMarks !== a.totalMarks) {
                return b.totalMarks - a.totalMarks;
            }
            return b.average - a.average;
        });

        let currentRank = 1;
        return list.map((item, idx) => {
            if (item.totalTestedSubjects === 0) {
                return {
                    ...item,
                    rank: '-'
                };
            }
            if (idx > 0 && list[idx - 1].totalTestedSubjects > 0 && 
                (list[idx - 1].totalMarks > item.totalMarks || list[idx - 1].average > item.average)) {
                currentRank = idx + 1;
            }
            return {
                ...item,
                rank: currentRank
            };
        });
    }, [academicData]);

    const handleDownloadCSV = () => {
        if (!rankedStudents || rankedStudents.length === 0 || !activeSubjects) return;

        let csvContent = "";

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

        // Trigger file download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const filename = `${selectedClass?.name || 'School'}_Master_Report_${selectedTerm}_${selectedYear}.csv`.replace(/\s+/g, '_');
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

        return (
            <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-5 my-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-1"/>
                <h3 className="text-lg font-semibold text-slate-800">No Assessment Records Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
                    No continuous assessments or terminal exam marks have been posted for this class in term: <strong className="text-slate-700">{selectedTerm}</strong> ({selectedYear}).
                </p>

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
                        <Link href="/dashboard/academics/gradebook">Go to Gradebook</Link>
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        {/* Column 1: Academic Year */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Academic Year</label>
                            <Select value={selectedYear} onValueChange={(val) => { setSelectedYear(val); setIsReportRequested(false); }}>
                                <SelectTrigger className="w-full bg-white h-11 border-2"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                <SelectContent>{MOCK_ACADEMIC_YEARS?.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Column 2: Term */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Term</label>
                            <Select value={selectedTerm} onValueChange={(val) => { setSelectedTerm(val); setIsReportRequested(false); }}>
                                <SelectTrigger className="w-full bg-white h-11 border-2"><SelectValue placeholder="Select Term" /></SelectTrigger>
                                <SelectContent>{MOCK_TERMS?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        {/* Column 3: Class */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Class</label>
                            <Select value={selectedClassId || ''} onValueChange={(val) => { setSelectedClassId(val); setIsReportRequested(false); }}>
                                <SelectTrigger className="w-full bg-indigo-50/50 border-2 border-indigo-200 focus:ring-indigo-500 font-medium h-11">
                                    <SelectValue placeholder="Choose a Class..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {isAdmin && <SelectItem value="all">🏫 Entire School (All Classes)</SelectItem>}
                                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Column 4: Subject Zoom */}
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

                        {/* Column 5: Generate Analytics Action */}
                        <div className="space-y-1.5">
                            <label className="hidden md:block text-xs font-semibold text-transparent uppercase mb-1 select-none pointer-events-none">&nbsp;</label>
                            <Button 
                                onClick={handleGenerateAnalytics} 
                                disabled={!selectedClassId || isLoadingStudents || isLoadingAssessments || isLoadingGrades || isLoadingMarks || isLoadingReportCards} 
                                title={!selectedClassId ? "Please select a class to generate analytics" : "Generate academic analytics"}
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 gap-2 rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoadingStudents || isLoadingAssessments || isLoadingGrades || isLoadingMarks || isLoadingReportCards ? (
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
            ) : (isLoadingStudents || isLoadingAssessments || isLoadingGrades || isLoadingMarks || isLoadingReportCards) ? (
                 <div className="text-center py-24 bg-white border border-slate-200 rounded-xl shadow-sm">
                     <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600 mb-3"/>
                     <p className="text-slate-500 font-medium text-sm">Loading and calculating student gradebook data...</p>
                 </div>
            ) : !academicData ? (
                renderEmptyOrArchivedCard()
            ) : selectedSubjectId === 'all' ? (
                /* ========================================================================= */
                /* CLASS OVERVIEW DASHBOARD (ALL SUBJECTS SUMMARY)                          */
                /* ========================================================================= */
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
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
                                    onSuccess={() => handleGenerateAnalytics()}
                                />
                            </div>
                        </div>
                    )}

                    {/* VIEW TOGGLE BAR */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-sm print:hidden">
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
                                Master Report Sheet
                            </button>
                        </div>
                        {viewMode === 'master_report' && (
                            <Button onClick={handleDownloadCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shadow-sm border-0 flex items-center gap-1.5">
                                <FileSpreadsheet className="h-4 w-4" /> Export Excel / CSV
                            </Button>
                        )}
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
                                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <FileSpreadsheet className="h-5 w-5 text-indigo-600" /> Academic Master Report Sheet
                                        </CardTitle>
                                        <CardDescription>
                                            Subject-by-subject weighted score log for {selectedClassId === 'all' ? 'Entire School' : selectedClass?.name || 'Class'}.
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 print:hidden">
                                        <span className="text-xs text-slate-400 font-semibold italic">Columns dynamically filter to active subjects.</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto animate-in fade-in duration-300">
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
                            </CardContent>
                        </Card>
                    )}
                </div>            ) : (
                /* ========================================================================= */
                /* SUBJECT DRILLDOWN DASHBOARD (SINGLE SUBJECT ANALYSIS)                    */
                /* ========================================================================= */
                subjectDetails && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                        
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
                                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                            <Tooltip formatter={(value) => [`${value} Students`, 'Total']} />
                                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students">
                                                {subjectDetails.chartData.map((entry, index) => {
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
                                            {subjectDetails.assessmentAudit.map((audit, idx) => (
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
                                        {subjectDetails.studentScores.map(row => (
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
                        <h2 className="text-[13pt] font-black uppercase tracking-widest text-slate-800">Academic Master Report Sheet</h2>
                        <p className="text-[9.5pt] text-slate-500 mt-0.5 font-bold">
                            Academic Year: {selectedYear} | Term: {selectedTerm} | Class: {selectedClassId === 'all' ? 'Entire School (All Classes)' : selectedClass?.name || 'Unassigned'}
                        </p>
                    </div>

                    {/* Roster Table */}
                    <table className="w-full border-collapse text-[8.5pt]">
                        <thead>
                            <tr className="bg-[#1e293b] text-white">
                                <th className="border border-slate-800 p-1.5 w-14 text-center font-bold">Pos</th>
                                <th className="border border-slate-800 p-1.5 text-left min-w-[150px] font-bold">Student Name</th>
                                {activeSubjects.map(sub => (
                                    <th key={sub.id} className="border border-slate-800 p-1.5 text-center font-bold">{sub.name}</th>
                                ))}
                                <th className="border border-slate-800 p-1.5 w-24 text-center font-bold bg-[#334155]">Total Marks</th>
                                <th className="border border-slate-800 p-1.5 w-20 text-center font-bold">Average (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankedStudents.map((s) => (
                                <tr key={s.studentId} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-600">{s.rank}</td>
                                    <td className="border border-slate-300 p-1.5 font-bold text-slate-800">{s.studentName}</td>
                                    {activeSubjects.map(sub => {
                                        const score = s.subjectScores[sub.id];
                                        return (
                                            <td key={sub.id} className="border border-slate-300 p-1.5 text-center font-medium">
                                                {score !== undefined ? score : '—'}
                                            </td>
                                        );
                                    })}
                                    <td className="border border-slate-300 p-1.5 text-center font-extrabold text-slate-900 bg-slate-100/50">{s.totalMarks}</td>
                                    <td className="border border-slate-300 p-1.5 text-center font-extrabold text-indigo-700">{s.average}%</td>
                                </tr>
                            ))}
                            {rankedStudents.length === 0 && (
                                <tr>
                                    <td colSpan={activeSubjects.length + 4} className="border border-slate-300 p-4 text-center text-slate-400 italic">
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
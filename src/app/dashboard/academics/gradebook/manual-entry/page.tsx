'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { collection, query, where, writeBatch, doc, serverTimestamp, updateDoc, getDocs } from 'firebase/firestore';
import { useOnceQuery, invalidateOnceCache } from '@/lib/firestore-once';
import { buildTermId } from '@/lib/term';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
    Loader2, Save, FileSpreadsheet, Trash2, ArrowLeft, History, 
    Sparkles, AlertCircle, Edit3, Sliders, CheckCheck, 
    Wand2, Grid3X3, ListFilter, Plus, X
} from 'lucide-react';
import { notifyParents } from '@/app/actions/notifications';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { TimelineService } from '@/lib/timeline-service';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { generateClassInsightsAction } from '@/app/actions/insights-ai';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';
import { DEFAULT_GRADING_SYSTEM, getGradeFromScale } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isTermMatch, isYearMatch, academicYearVariants } from '@/lib/academic-match';

const ASSESSMENT_TYPES = [
    'Mock Exam (100%)',
    'Mock Exam',
'Class Exercise (CA)', 
    'Homework (CA)', 
    'Project (CA)', 
    'Mid-Term (CA)', 
    'End of Term Exam (Exam)'
];

interface TestColumnDef {
    id: string; // e.g. 'test_1', 'test_2'
    name: string; // e.g. 'Test 1', 'Test 2'
}

interface MatrixStudentRow {
    tests: Record<string, number | ''>;
    homework: number | '';
    project: number | '';
    midTerm: number | '';
    exam: number | '';
    remark: string;
}

interface FillTarget {
    type: 'test' | 'homework' | 'project' | 'midTerm' | 'exam';
    colId?: string;
    label: string;
    max: number;
}

// ---- Gradebook save helpers -------------------------------------------------------------------------

/** Collects writes and commits them in batches of 450 (Firestore allows 500 per batch), so large classes save. */
class ChunkedWriter {
    private ops: Array<{ kind: 'set'; ref: any; data: any; merge: boolean } | { kind: 'delete'; ref: any }> = [];
    constructor(private firestore: any) {}
    set(ref: any, data: any, opts?: { merge?: boolean }) { this.ops.push({ kind: 'set', ref, data, merge: !!opts?.merge }); }
    delete(ref: any) { this.ops.push({ kind: 'delete', ref }); }
    get size() { return this.ops.length; }
    async commit() {
        for (let i = 0; i < this.ops.length; i += 450) {
            const batch = writeBatch(this.firestore);
            this.ops.slice(i, i + 450).forEach(op => {
                if (op.kind === 'delete') batch.delete(op.ref);
                else if (op.merge) batch.set(op.ref, op.data, { merge: true });
                else batch.set(op.ref, op.data);
            });
            await batch.commit();
        }
    }
}

/** Which matrix column a saved mark belongs to (same rules the screen uses to display it). */
function matrixSlotOf(a: any): string {
    const combined = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase();
    // Mock exams are not part of the terminal SBA matrix: never shown in, or overwritten by, the Exam column.
    if (combined.includes('mock')) return 'other';
    if (combined.includes('exam') || combined.includes('terminal') || combined.includes('end of term')) return 'ex';
    if (combined.includes('mid')) return 'mt';
    if (combined.includes('proj') || combined.includes('group') || combined.includes('practical')) return 'project';
    if (combined.includes('home') || combined.includes('hw')) return 'hw';
    return `test:${(a.assessmentName || 'test 1').toLowerCase()}`;
}

const CANONICAL_MATRIX_NAMES = new Set(['homework', 'project', 'mid-term', 'end of term exam']);

/**
 * Order marks so that, when a student has more than one record in the same column (e.g. an old "Exam" and the
 * matrix's "End of Term Exam"), the matrix's own record comes LAST — the one shown and the one a save edits.
 */
function orderForMatrix<T extends { assessmentName?: string }>(list: T[]): T[] {
    const rank = (a: any) => (CANONICAL_MATRIX_NAMES.has(String(a.assessmentName || '').toLowerCase()) ? 1 : 0);
    return list.map((a, i) => ({ a, i })).sort((x, y) => rank(x.a) - rank(y.a) || x.i - y.i).map(x => x.a);
}

function friendlySaveError(error: any): string {
    if (error?.code === 'permission-denied') {
        return 'Your account is not allowed to change some of these marks (for example a closed term). Nothing was saved — ask an administrator.';
    }
    return error?.message || 'Could not save the marks. Please try again.';
}

export default function GradebookPage() {
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    // Mode Toggle: 'matrix' (Full SBA Terminal Matrix) vs 'single' (Single Assessment Batch)
    const [entryMode, setEntryMode] = useState<'matrix' | 'single'>('matrix');

    // Filtering State
    const [classId, setClassId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [term, setTerm] = useState(MOCK_TERMS[0] || 'First Term');
    const [academicYear, setAcademicYear] = useState(MOCK_ACADEMIC_YEARS[4] || '2024-2025'); 

    // Proportions State (CA Weight vs Exam Weight)
    const [caWeight, setCaWeight] = useState<number>(30);
    const [examWeight, setExamWeight] = useState<number>(70);
    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
    const [customCaInput, setCustomCaInput] = useState<number>(30);
    const [customExamInput, setCustomExamInput] = useState<number>(70);
    const [isSavingWeight, setIsSavingWeight] = useState(false);

    // Dynamic Multiple Test Columns (e.g. Test 1, Test 2, Test 3)
    const [testColumns, setTestColumns] = useState<TestColumnDef[]>([
        { id: 'test_1', name: 'Test 1' }
    ]);

    // Matrix Column Max Scores (Customizable by teachers/schools)
    const [matrixMaxScores, setMatrixMaxScores] = useState({
        classTest: 20,
        homework: 20,
        project: 20,
        midTerm: 40,
        exam: 100
    });
    const [isMaxScoresModalOpen, setIsMaxScoresModalOpen] = useState(false);

    // Fill All Column Modal
    const [fillTarget, setFillTarget] = useState<FillTarget | null>(null);
    const [fillColValue, setFillColValue] = useState<number | ''>('');
    const [fillOnlyEmpty, setFillOnlyEmpty] = useState(true);

    // Matrix scores state: studentId -> MatrixStudentRow
    const [matrixScores, setMatrixScores] = useState<Record<string, MatrixStudentRow>>({});

    // Classic Single-Batch State
    const [assessmentType, setAssessmentType] = useState(ASSESSMENT_TYPES[0]);
    const [maxScore, setMaxScore] = useState(100);
    const [assessmentName, setAssessmentName] = useState(ASSESSMENT_TYPES[0]);
    const [singleScores, setSingleScores] = useState<Record<string, number | ''>>({});
    const [singleRemarks, setSingleRemarks] = useState<Record<string, string>>({}); 

    const [isSaving, setIsSaving] = useState(false);

    // AI Insights State
    const [isInsightsOpen, setIsInsightsOpen] = useState(false);
    const [insightsText, setInsightsText] = useState<string | null>(null);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    const schoolSettingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolSettings, isLoading: settingsLoading } = useDoc<any>(schoolSettingsRef);
    const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolData } = useDoc<any>(schoolRef);
    // Real balance only — never show a made-up number while the school document loads.
    const aiCredits: number | null = typeof schoolData?.aiCredits === 'number' ? schoolData.aiCredits : null;

    useEffect(() => {
        if (schoolSettings) {
            if (schoolSettings.academicYear) {
                setAcademicYear(schoolSettings.academicYear);
            }
            if (schoolSettings.term) {
                setTerm(schoolSettings.term);
            }
        }
    }, [schoolSettings]);

    useEffect(() => {
        setAssessmentName(assessmentType);
    }, [assessmentType]);

    // Data Fetching: Classes
    // READ COST: classes, subjects, timetable slots, students and marks are read ONCE (no live listeners) and
    // remembered for the session, so switching class/subject back and forth or re-opening the page is free.
    const readAll = useCallback(async (q: any) => {
        const snap = await getDocs(q);
        return snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id }));
    }, []);
    const { data: classes, isLoading: isLoadingClasses } = useOnceQuery<any>(
        (firestore && schoolId) ? `gb:classes:${schoolId}` : null,
        () => readAll(query(collection(firestore!, 'classes'), where('schoolId', '==', schoolId)))
    );

    const selectedClass = useMemo(() => {
        return classes?.find((c: any) => c.id === classId);
    }, [classes, classId]);

    // Set dynamic school / class assessment proportions
    useEffect(() => {
        const classCa = selectedClass?.caWeight;
        const classExam = selectedClass?.examWeight;
        const schoolCa = schoolSettings?.caWeight;
        const schoolExam = schoolSettings?.examWeight;

        if (typeof classCa === 'number' && classCa > 0) {
            setCaWeight(classCa);
            setExamWeight(typeof classExam === 'number' ? classExam : 100 - classCa);
            setCustomCaInput(classCa);
            setCustomExamInput(typeof classExam === 'number' ? classExam : 100 - classCa);
        } else if (typeof schoolCa === 'number' && schoolCa > 0) {
            setCaWeight(schoolCa);
            setExamWeight(typeof schoolExam === 'number' ? schoolExam : 100 - schoolCa);
            setCustomCaInput(schoolCa);
            setCustomExamInput(typeof schoolExam === 'number' ? schoolExam : 100 - schoolCa);
        } else {
            setCaWeight(30);
            setExamWeight(70);
            setCustomCaInput(30);
            setCustomExamInput(70);
        }
    }, [selectedClass, schoolSettings]);

    // Timetable slots are only used to work out a TEACHER's classes/subjects, so only a teacher reads them,
    // and only their own slots (was: every slot of the whole school, for every user).
    const { data: timetable } = useOnceQuery<any>(
        (firestore && schoolId && user?.uid && role === 'Teacher') ? `gb:timetable:${schoolId}:${user.uid}` : null,
        () => readAll(query(collection(firestore!, 'timetables'), where('schoolId', '==', schoolId), where('teacherId', '==', user!.uid)))
    );
    const { data: subjects } = useOnceQuery<any>(
        (firestore && schoolId) ? `gb:subjects:${schoolId}` : null,
        () => readAll(query(collection(firestore!, 'subjects'), where('schoolId', '==', schoolId)))
    );

    const visibleClasses = useMemo(() => {
        if (!classes) return [];
        if (role !== 'Teacher') return classes;

        const isClassTeacher = (c: any) => 
            c.teacherId === user?.uid || 
            (Array.isArray(c.teacherIds) && c.teacherIds.includes(user?.uid));

        const timetableClassIds = timetable
            ?.filter((t: any) => t.teacherId === user?.uid)
            .map((t: any) => t.classId) || [];

        // Classes for subjects assigned to this teacher
        const teacherSubjects = subjects?.filter((s: any) => 
            Array.isArray(s.teacherIds) && s.teacherIds.includes(user?.uid)
        ) || [];

        let teachesAllCohorts = false;
        const subjectClassIds: string[] = [];

        teacherSubjects.forEach((s: any) => {
            if (Array.isArray(s.targetClasses) && s.targetClasses.length > 0) {
                s.targetClasses.forEach((cid: string) => {
                    if (cid && !subjectClassIds.includes(cid)) {
                        subjectClassIds.push(cid);
                    }
                });
            } else {
                teachesAllCohorts = true;
            }
        });

        return classes.filter((c: any) => 
            isClassTeacher(c) || 
            timetableClassIds.includes(c.id) || 
            teachesAllCohorts || 
            subjectClassIds.includes(c.id) ||
            subjectClassIds.some((cid: string) => cid.toLowerCase() === (c.name || '').toLowerCase())
        );
    }, [classes, subjects, timetable, role, user?.uid]);

    // Class access guard
    useEffect(() => {
        if (classId && !isLoadingClasses) {
            if (role === 'Teacher') {
                const isAuthorized = visibleClasses.some((c: any) => c.id === classId);
                if (!isAuthorized) {
                    toast({
                        variant: 'destructive',
                        title: 'Access Restricted',
                        description: 'You do not have access to this class roster.'
                    });
                    setClassId(visibleClasses[0]?.id || '');
                }
            }
        }
    }, [classId, role, visibleClasses, isLoadingClasses, toast]);

    const visibleSubjects = useMemo(() => {
        if (!subjects || subjects.length === 0) return [];
        if (!classId) return subjects;

        if (role !== 'Teacher') {
            return subjects;
        }

        const isClassTeacherOfThisClass = selectedClass?.teacherId === user?.uid;
        if (isClassTeacherOfThisClass) {
            return subjects;
        }

        const teacherTimetableSubjectIds = timetable
            ?.filter((t: any) => t.classId === classId && t.teacherId === user?.uid)
            .map((t: any) => t.subjectId) || [];

        const assignedSubjects = subjects.filter((s: any) => {
            if (s.id && teacherTimetableSubjectIds.includes(s.id)) return true;
            if (Array.isArray(s.teacherIds) && s.teacherIds.includes(user?.uid)) {
                if (Array.isArray(s.targetClasses) && s.targetClasses.length > 0) {
                    return s.targetClasses.includes(classId) || s.targetClasses.some((tc: string) => tc.toLowerCase() === (selectedClass?.name || '').toLowerCase());
                }
                return true;
            }
            return false;
        });

        return assignedSubjects.length > 0 ? assignedSubjects : subjects;
    }, [subjects, selectedClass, timetable, role, user?.uid, classId]);

    useEffect(() => {
        if (classId && visibleSubjects && visibleSubjects.length > 0) {
            const isValid = visibleSubjects.some((s: any) => s.id === subjectId);
            if (!isValid) {
                setSubjectId(visibleSubjects[0]?.id || '');
            }
        } else if (!classId) {
            setSubjectId('');
        }
    }, [classId, visibleSubjects, subjectId]);

    const { data: rawStudents, isLoading: loadingStudents } = useOnceQuery<any>(
        (firestore && schoolId && classId) ? `gb:students:${schoolId}:${classId}` : null,
        () => readAll(query(collection(firestore!, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)))
    );

    const students = useMemo(() => {
        if (!rawStudents) return [];
        return rawStudents.filter((s: any) => 
            s.enrollmentStatus !== 'Inactive' && 
            s.enrollmentStatus !== 'Graduated' && 
            s.enrollmentStatus !== 'Withdrawn'
        );
    }, [rawStudents]);

    // Existing marks for this class + subject.
    // READ COST: only the selected ACADEMIC YEAR is read (was: every mark ever recorded for the class + subject,
    // growing every term, and re-read in full after every save). The term is then matched flexibly on the page.
    // Waits for the school settings so the default year/term is known (no wasted read on a placeholder year).
    const yearVariants = useMemo(() => academicYearVariants(academicYear), [academicYear]);
    const assessmentsKey = (firestore && schoolId && classId && subjectId && !settingsLoading)
        ? `gb:marks:${schoolId}:${classId}:${subjectId}:${yearVariants.join('|')}`
        : null;
    const {
        data: allClassAssessments,
        isLoading: loadingAssessments,
        setData: setAssessmentsCache,
        refresh: refreshAssessments,
    } = useOnceQuery<any>(assessmentsKey, async () => {
        const base = [
            where('schoolId', '==', schoolId),
            where('classId', '==', classId),
            where('subjectId', '==', subjectId),
        ];
        if (yearVariants.length > 0) {
            try {
                return await readAll(query(collection(firestore!, 'assessments'), ...base, where('academicYear', 'in', yearVariants)));
            } catch (err: any) {
                if (err?.code === 'permission-denied') throw err;
                console.warn('Gradebook: year-filtered marks query failed, reading all marks for this class + subject instead.', err);
            }
        }
        return readAll(query(collection(firestore!, 'assessments'), ...base));
    });

    const rawAssessments = useMemo(() => {
        if (!allClassAssessments) return [];
        return allClassAssessments.filter((a: any) => {
            const aYear = a.academicYear || a.academicYearId || a.year;
            const aTerm = a.term || a.termId || a.semester;
            const yearMatches = !academicYear || !aYear || isYearMatch(aYear, academicYear);
            const termMatches = !term || !aTerm || isTermMatch(aTerm, term);
            return yearMatches && termMatches;
        });
    }, [allClassAssessments, academicYear, term]);

    // Closed (archived) terms are locked for teachers; administrators can still correct them.
    const isAdminRole = ['admin', 'administrator', 'director', 'principal', 'headmaster', 'headmistress', 'head teacher', 'owner', 'super admin', 'superadmin']
        .includes(String(role || '').toLowerCase());
    const termLocked = !isAdminRole && rawAssessments.some((a: any) => a.isArchived === true);

    // Group assessments by type
    const groupedAssessments = useMemo(() => {
        if (!rawAssessments) return {};
        const groups: Record<string, any[]> = {};
        rawAssessments.forEach(a => {
            if (!groups[a.assessmentType]) groups[a.assessmentType] = [];
            groups[a.assessmentType].push(a);
        });
        return groups;
    }, [rawAssessments]);

    // Populate Matrix from existing marks. Uses the SAME column rules as the save (matrixSlotOf / orderForMatrix),
    // so the mark shown in a cell is exactly the record a save edits or clears.
    useEffect(() => {
        if (!rawAssessments || rawAssessments.length === 0) {
            setMatrixScores({});
            return;
        }
        const ordered = orderForMatrix(rawAssessments);

        // Identify all unique test names (case-insensitive)
        const testNames = new Map<string, string>();
        ordered.forEach((a: any) => {
            if (matrixSlotOf(a).startsWith('test:')) {
                const name = a.assessmentName || 'Test 1';
                if (!testNames.has(name.toLowerCase())) testNames.set(name.toLowerCase(), name);
            }
        });
        let activeTestCols = [...testColumns];
        if (testNames.size > 0) {
            const sortedNames = Array.from(testNames.values()).sort();
            activeTestCols = sortedNames.map((name, idx) => ({ id: `test_${idx + 1}`, name }));
            setTestColumns(activeTestCols);
        }

        const newMatrix: Record<string, MatrixStudentRow> = {};
        const maxes: Partial<{ classTest: number; homework: number; project: number; midTerm: number; exam: number }> = {};
        ordered.forEach((a: any) => {
            if (!a.studentId) return;
            const slot = matrixSlotOf(a);
            if (slot === 'other') return;
            if (!newMatrix[a.studentId]) {
                newMatrix[a.studentId] = { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' };
            }
            const row = newMatrix[a.studentId];
            const val: number | '' = a.score !== undefined && a.score !== null && a.score !== '' ? Number(a.score) : '';
            const max = a.maxScore ? Number(a.maxScore) : 0;
            if (slot === 'ex') {
                row.exam = val;
                if (a.teacherRemark) row.remark = a.teacherRemark;
                if (max) maxes.exam = max;
                return;
            }
            if (!row.remark && a.teacherRemark) row.remark = a.teacherRemark;
            if (slot === 'mt') { row.midTerm = val; if (max) maxes.midTerm = max; }
            else if (slot === 'project') { row.project = val; if (max) maxes.project = max; }
            else if (slot === 'hw') { row.homework = val; if (max) maxes.homework = max; }
            else {
                const matchedCol = activeTestCols.find(c => c.name.toLowerCase() === (a.assessmentName || 'test 1').toLowerCase()) || activeTestCols[0];
                row.tests[matchedCol?.id || 'test_1'] = val;
                if (max) maxes.classTest = max;
            }
        });
        if (Object.keys(maxes).length > 0) setMatrixMaxScores(prev => ({ ...prev, ...maxes }));
        setMatrixScores(newMatrix);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawAssessments]);

    // Populate Single-Batch mode fields when target assessment changes
    useEffect(() => {
        if (!rawAssessments || rawAssessments.length === 0) {
            setSingleScores({});
            setSingleRemarks({});
            return;
        }

        const targetName = assessmentName || assessmentType;
        const matchingDocs = rawAssessments.filter((a: any) => 
            (a.assessmentName || a.assessmentType) === targetName
        );

        if (matchingDocs.length > 0) {
            const loadedScores: Record<string, number | ''> = {};
            const loadedRemarks: Record<string, string> = {};
            let loadedMax = maxScore;

            matchingDocs.forEach((a: any) => {
                if (a.studentId) {
                    loadedScores[a.studentId] = a.score !== undefined && a.score !== null ? Number(a.score) : '';
                    if (a.teacherRemark) {
                        loadedRemarks[a.studentId] = a.teacherRemark;
                    }
                }
                if (a.maxScore) {
                    loadedMax = Number(a.maxScore);
                }
            });

            setSingleScores(loadedScores);
            setSingleRemarks(loadedRemarks);
            if (loadedMax) setMaxScore(loadedMax);
        } else {
            setSingleScores({});
            setSingleRemarks({});
        }
    }, [rawAssessments, assessmentType, assessmentName]);

    // Add another test column (e.g. Test 2, Test 3)
    const handleAddTestColumn = () => {
        const nextNum = testColumns.length + 1;
        const newId = `test_${Date.now()}`;
        const newName = `Test ${nextNum}`;
        setTestColumns(prev => [...prev, { id: newId, name: newName }]);
        toast({ title: "Test Column Added ➕", description: `Added "${newName}" to the Continuous Assessment roster.` });
    };

    // Remove a dynamic test column
    const handleRemoveTestColumn = (colId: string) => {
        if (testColumns.length <= 1) return;
        const targetCol = testColumns.find(c => c.id === colId);
        setTestColumns(prev => prev.filter(c => c.id !== colId));

        setMatrixScores(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(uid => {
                if (updated[uid]?.tests) {
                    const nextTests = { ...updated[uid].tests };
                    delete nextTests[colId];
                    updated[uid] = { ...updated[uid], tests: nextTests };
                }
            });
            return updated;
        });

        toast({ title: "Column Removed", description: `Removed ${targetCol?.name || 'test column'} from view.` });
    };

    // Keyboard navigation helper for high-speed mark entry
    const handleMatrixKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        rowIndex: number,
        colKey: string
    ) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextTarget = document.querySelector<HTMLInputElement>(
                `input[data-matrix-row="${rowIndex + 1}"][data-matrix-col="${colKey}"]`
            );
            if (nextTarget) {
                nextTarget.focus();
                nextTarget.select();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevTarget = document.querySelector<HTMLInputElement>(
                `input[data-matrix-row="${rowIndex - 1}"][data-matrix-col="${colKey}"]`
            );
            if (prevTarget) {
                prevTarget.focus();
                prevTarget.select();
            }
        }
    };

    // Matrix test score change
    const handleMatrixTestScoreChange = (studentId: string, testId: string, val: string) => {
        const num = val === '' ? '' : Number(val);
        setMatrixScores(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' }),
                tests: {
                    ...(prev[studentId]?.tests || {}),
                    [testId]: num
                }
            }
        }));
    };

    // Matrix standard score change (homework, project, midTerm, exam)
    const handleMatrixScoreChange = (
        studentId: string, 
        field: 'homework' | 'project' | 'midTerm' | 'exam', 
        val: string
    ) => {
        const num = val === '' ? '' : Number(val);
        setMatrixScores(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' }),
                [field]: num
            }
        }));
    };

    const handleMatrixRemarkChange = (studentId: string, val: string) => {
        setMatrixScores(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' }),
                remark: val
            }
        }));
    };

    // Fill all students in a specific matrix column
    const handleExecuteFillColumn = () => {
        if (!fillTarget || !students || students.length === 0) return;
        const targetVal = fillColValue === '' ? '' : Number(fillColValue);
        
        let count = 0;
        setMatrixScores(prev => {
            const updated = { ...prev };
            students.forEach((s: any) => {
                const current = updated[s.uid] || { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' };
                
                if (fillTarget.type === 'test' && fillTarget.colId) {
                    const curVal = current.tests?.[fillTarget.colId];
                    const shouldFill = !fillOnlyEmpty || curVal === '' || curVal === undefined;
                    if (shouldFill) {
                        updated[s.uid] = {
                            ...current,
                            tests: {
                                ...(current.tests || {}),
                                [fillTarget.colId]: targetVal
                            }
                        };
                        count++;
                    }
                } else if (fillTarget.type !== 'test') {
                    const field = fillTarget.type;
                    const curVal = current[field];
                    const shouldFill = !fillOnlyEmpty || curVal === '' || curVal === undefined;
                    if (shouldFill) {
                        updated[s.uid] = {
                            ...current,
                            [field]: targetVal
                        };
                        count++;
                    }
                }
            });
            return updated;
        });

        toast({
            title: "Column Filled ⚡",
            description: `Populated ${count} students with score ${targetVal || 0} for ${fillTarget.label}.`
        });
        setFillTarget(null);
        setFillColValue('');
    };

    // Auto-fill remarks for all students with marks based on their calculated terminal grade
    const handleAutoFillAllRemarks = () => {
        if (!students || students.length === 0) return;
        const gradingScale = schoolSettings?.gradingSystem || DEFAULT_GRADING_SYSTEM;
        let filledCount = 0;

        setMatrixScores(prev => {
            const updated = { ...prev };
            students.forEach((s: any) => {
                const row = updated[s.uid] || { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' };
                
                // Calculate valid tests average
                const studentTests = row.tests || {};
                const validTests = testColumns
                    .map(tc => studentTests[tc.id])
                    .filter(v => v !== '' && v !== undefined && !isNaN(Number(v))) as number[];
                const testsAvg = validTests.length > 0 ? (validTests.reduce((a, b) => a + b, 0) / validTests.length) : 0;
                const hasAnyTest = validTests.length > 0;

                const hasMarks = hasAnyTest || row.homework !== '' || row.project !== '' || row.midTerm !== '' || row.exam !== '';
                
                if (hasMarks && !row.remark) {
                    const ct = hasAnyTest ? testsAvg : 0;
                    const hw = typeof row.homework === 'number' ? row.homework : 0;
                    const pr = typeof row.project === 'number' ? row.project : 0;
                    const mt = typeof row.midTerm === 'number' ? row.midTerm : 0;
                    const ex = typeof row.exam === 'number' ? row.exam : 0;

                    const caMax = matrixMaxScores.classTest + matrixMaxScores.homework + matrixMaxScores.project + matrixMaxScores.midTerm;
                    const caRaw = ct + hw + pr + mt;
                    const caWeighted = caMax > 0 ? (caRaw / caMax) * caWeight : 0;
                    const examWeighted = matrixMaxScores.exam > 0 && row.exam !== '' ? (ex / matrixMaxScores.exam) * examWeight : 0;
                    const totalPct = Math.min(100, Math.round((caWeighted + examWeighted) * 10) / 10);
                    
                    const { autoRemark } = getGradeFromScale(totalPct, gradingScale);
                    if (autoRemark) {
                        updated[s.uid] = { ...row, remark: autoRemark };
                        filledCount++;
                    }
                }
            });
            return updated;
        });

        toast({
            title: "Remarks Generated ✨",
            description: `Generated auto-remarks for ${filledCount} students based on their terminal scores.`
        });
    };

    // Save custom proportion to state and optionally save to class doc in Firestore
    const handleApplyProportions = async (saveAsClassDefault: boolean) => {
        if (customCaInput < 0 || customCaInput > 100 || customExamInput < 0 || customExamInput > 100) {
            toast({ variant: 'destructive', title: "Invalid Proportions", description: "Proportions must be between 0% and 100%." });
            return;
        }
        if (customCaInput + customExamInput !== 100) {
            toast({ variant: 'destructive', title: "Must Equal 100%", description: `The sum of CA (${customCaInput}%) and Exam (${customExamInput}%) is ${customCaInput + customExamInput}%. It must equal 100%.` });
            return;
        }

        setCaWeight(customCaInput);
        setExamWeight(customExamInput);

        if (saveAsClassDefault && firestore && classId) {
            setIsSavingWeight(true);
            try {
                await updateDoc(doc(firestore, 'classes', classId), {
                    caWeight: customCaInput,
                    examWeight: customExamInput
                });
                toast({ title: "Class Proportions Saved 💾", description: `Updated ${selectedClass?.name || 'Class'} default to ${customCaInput}% CA / ${customExamInput}% Exam.` });
            } catch (err: any) {
                console.error(err);
                toast({ variant: 'destructive', title: "Could Not Save to Class", description: err.message });
            } finally {
                setIsSavingWeight(false);
            }
        } else {
            toast({ title: "Session Proportions Set ⚙️", description: `Active: ${customCaInput}% CA / ${customExamInput}% Exam.` });
        }

        setIsWeightModalOpen(false);
    };

    // SAVE FULL TERMINAL MATRIX
    const handleSaveMatrix = async () => {
        if (!firestore || !user || !schoolId || !classId || !subjectId) return;

        // Validation for any entries exceeding max score
        for (const s of students || []) {
            const row = matrixScores[s.uid];
            if (!row) continue;
            const studentName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student';

            // Check tests
            for (const tc of testColumns) {
                const testScore = row.tests?.[tc.id];
                if (testScore !== '' && typeof testScore === 'number' && testScore > matrixMaxScores.classTest) {
                    toast({ variant: 'destructive', title: `${tc.name} Score Exceeds Max`, description: `${studentName}'s score (${testScore}) exceeds max (${matrixMaxScores.classTest}).` });
                    return;
                }
            }

            if (row.homework !== '' && typeof row.homework === 'number' && row.homework > matrixMaxScores.homework) {
                toast({ variant: 'destructive', title: "Homework Score Exceeds Max", description: `${studentName}'s score (${row.homework}) exceeds max (${matrixMaxScores.homework}).` });
                return;
            }
            if (row.project !== '' && typeof row.project === 'number' && row.project > matrixMaxScores.project) {
                toast({ variant: 'destructive', title: "Project Score Exceeds Max", description: `${studentName}'s score (${row.project}) exceeds max (${matrixMaxScores.project}).` });
                return;
            }
            if (row.midTerm !== '' && typeof row.midTerm === 'number' && row.midTerm > matrixMaxScores.midTerm) {
                toast({ variant: 'destructive', title: "Mid-Term Score Exceeds Max", description: `${studentName}'s score (${row.midTerm}) exceeds max (${matrixMaxScores.midTerm}).` });
                return;
            }
            if (row.exam !== '' && typeof row.exam === 'number' && row.exam > matrixMaxScores.exam) {
                toast({ variant: 'destructive', title: "Exam Score Exceeds Max", description: `${studentName}'s score (${row.exam}) exceeds max (${matrixMaxScores.exam}).` });
                return;
            }
        }

        if (termLocked) {
            toast({ variant: 'destructive', title: "Term Closed", description: "This term has been closed, so its marks are locked. Ask an administrator to make corrections." });
            return;
        }
        const hasNegative = (students || []).some((s: any) => {
            const row = matrixScores[s.uid];
            if (!row) return false;
            const vals = [...Object.values(row.tests || {}), row.homework, row.project, row.midTerm, row.exam];
            return vals.some(v => typeof v === 'number' && v < 0);
        });
        if (hasNegative) {
            toast({ variant: 'destructive', title: "Invalid Score", description: "Scores cannot be negative." });
            return;
        }

        setIsSaving(true);
        try {
            const writer = new ChunkedWriter(firestore);
            const subjectName = subjects?.find((sub: any) => sub.id === subjectId)?.name || 'Subject';
            const className = selectedClass?.name || 'Class';
            const termId = buildTermId(academicYear, term);
            const updatedStudentIds: string[] = [];
            const upserts: Record<string, any> = {};
            const toDelete: string[] = [];
            let created = 0, changed = 0;

            // Existing marks of this term, per student and per matrix slot (same classification as the screen).
            const existing: Record<string, Record<string, any[]>> = {};
            orderForMatrix(rawAssessments).forEach((a: any) => {
                if (!a.studentId) return;
                const key = matrixSlotOf(a);
                if (!existing[a.studentId]) existing[a.studentId] = {};
                if (!existing[a.studentId][key]) existing[a.studentId][key] = [];
                existing[a.studentId][key].push(a);
            });

            (students || []).forEach((s: any) => {
                const row = matrixScores[s.uid];
                if (!row) return;
                const studentName = `${s.firstName || ''} ${s.lastName || ''}`.trim();
                const remark = row.remark || '';
                const mine = existing[s.uid] || {};
                const testKeys = Object.keys(mine).filter(k => k.startsWith('test:'));

                const slots: { key: string; value: number | ''; type: string; name: string; max: number }[] = [];
                testColumns.forEach((tc) => {
                    let key = `test:${tc.name.toLowerCase()}`;
                    if (!mine[key] && testColumns.length === 1 && testKeys.length > 0) key = testKeys[0];
                    slots.push({ key, value: row.tests?.[tc.id] ?? '', type: 'Class Exercise (CA)', name: tc.name, max: matrixMaxScores.classTest });
                });
                slots.push({ key: 'hw', value: row.homework, type: 'Homework (CA)', name: 'Homework', max: matrixMaxScores.homework });
                slots.push({ key: 'project', value: row.project, type: 'Project (CA)', name: 'Project', max: matrixMaxScores.project });
                slots.push({ key: 'mt', value: row.midTerm, type: 'Mid-Term (CA)', name: 'Mid-Term', max: matrixMaxScores.midTerm });
                slots.push({ key: 'ex', value: row.exam, type: 'End of Term Exam (Exam)', name: 'End of Term Exam', max: matrixMaxScores.exam });

                let studentChanged = false;
                slots.forEach((slot) => {
                    const docs = mine[slot.key] || [];
                    // The screen shows the LAST record of a slot, so that is the one edited or cleared.
                    const keep = docs.length > 0 ? docs[docs.length - 1] : undefined;
                    const hasValue = typeof slot.value === 'number' && !isNaN(slot.value);
                    if (!hasValue) {
                        // A mark that was saved before and has now been cleared is removed.
                        if (keep) { toDelete.push(keep.id); studentChanged = true; }
                        return;
                    }
                    const score = Number(slot.value);
                    const maxScoreVal = Number(slot.max);
                    if (keep && Number(keep.score) === score && Number(keep.maxScore) === maxScoreVal && (keep.teacherRemark || '') === remark) {
                        return; // unchanged — no write, no timeline entry, no parent notification
                    }
                    const fields: any = {
                        studentId: s.uid,
                        studentName,
                        classId,
                        subjectId,
                        schoolId,
                        teacherId: user.uid,
                        term,
                        academicYear,
                        assessmentType: slot.type,
                        assessmentName: slot.name,
                        score,
                        maxScore: maxScoreVal,
                        teacherRemark: remark,
                    };
                    if (termId) fields.termId = termId;
                    if (keep) {
                        // Update in place: same document id, original createdAt kept.
                        writer.set(doc(firestore, 'assessments', keep.id), { ...fields, updatedAt: serverTimestamp() }, { merge: true });
                        upserts[keep.id] = { ...keep, ...fields, updatedAt: new Date() };
                        changed++;
                    } else {
                        const ref = doc(collection(firestore, 'assessments'));
                        writer.set(ref, { ...fields, createdAt: serverTimestamp(), assessmentDate: serverTimestamp() });
                        upserts[ref.id] = { ...fields, createdAt: new Date(), assessmentDate: new Date() };
                        created++;
                    }
                    studentChanged = true;
                });

                if (studentChanged) {
                    updatedStudentIds.push(s.uid);
                    TimelineService.logEventBatch(firestore, writer, {
                        studentId: s.uid,
                        title: `Graded: Terminal Matrix (${subjectName})`,
                        description: `SBA & Exam recorded. Exam: ${row.exam !== '' ? row.exam + '/' + matrixMaxScores.exam : 'N/A'}. Remark: "${row.remark || 'Good'}"`,
                        category: 'academic',
                        academicYear,
                        term,
                        classId,
                        className,
                        schoolId,
                        recordedBy: user.displayName || 'Teacher',
                        recordedById: user.uid,
                        metadata: {
                            subjectId,
                            subjectName,
                            tests: row.tests,
                            homework: row.homework,
                            project: row.project,
                            midTerm: row.midTerm,
                            exam: row.exam,
                            remark: row.remark
                        },
                        date: new Date()
                    });
                }
            });

            if (updatedStudentIds.length === 0) {
                const anyMarks = (students || []).some((s: any) => {
                    const row = matrixScores[s.uid];
                    return row && (Object.values(row.tests || {}).some(v => typeof v === 'number') || [row.homework, row.project, row.midTerm, row.exam].some(v => typeof v === 'number'));
                });
                toast(anyMarks
                    ? { title: "Nothing to Save", description: "All marks are already saved — nothing has changed." }
                    : { variant: 'destructive', title: "No Marks Entered", description: "Please enter at least one score in the matrix before saving." });
                return;
            }

            await writer.commit();
            const deleted = await commitDeletes(toDelete);
            applyLocalChanges(upserts, deleted.ok ? toDelete : []);

            toast({
                title: "Terminal Matrix Saved Successfully! 🎉",
                description: `Saved changes for ${updatedStudentIds.length} student(s): ${created} new mark(s), ${changed} updated${deleted.ok && toDelete.length ? `, ${toDelete.length} cleared` : ''}.`
            });
            if (!deleted.ok) {
                toast({ variant: 'destructive', title: "Cleared Marks Not Removed", description: deleted.message });
            }

            notifyParents(
                updatedStudentIds,
                "Terminal Grades Posted 📊",
                `Terminal grades for ${subjectName} have been recorded. Tap to view your child's updated report card.`,
                "/dashboard/my-grades"
            ).catch(err => console.error("Notification failed silently:", err));
        } catch (error: any) {
            console.error("Save Matrix Error:", error);
            toast({ variant: 'destructive', title: "Database Error", description: friendlySaveError(error) });
        } finally {
            setIsSaving(false);
        }
    };

    // Removes marks (separately from the main save, so a missing delete permission never blocks saving).
    const commitDeletes = async (ids: string[]): Promise<{ ok: boolean; message?: string }> => {
        if (!firestore || ids.length === 0) return { ok: true };
        try {
            const writer = new ChunkedWriter(firestore);
            ids.forEach(id => writer.delete(doc(firestore, 'assessments', id)));
            await writer.commit();
            return { ok: true };
        } catch (err: any) {
            console.error('Gradebook delete failed:', err);
            return {
                ok: false,
                message: err?.code === 'permission-denied'
                    ? `${ids.length} cleared mark(s) could not be removed with your account. Ask an administrator to remove them.`
                    : `${ids.length} cleared mark(s) could not be removed: ${err?.message || 'unknown error'}`
            };
        }
    };

    // Keep the screen's copy of the marks in step with what was just saved — no re-read of the whole class.
    const applyLocalChanges = (upserts: Record<string, any>, deletedIds: string[]) => {
        const del = new Set(deletedIds);
        // Report cards compiled later in this session must see the new marks.
        if (schoolId && classId) invalidateOnceCache(`rc:marks:${schoolId}:${classId}:`);
        setAssessmentsCache((prev: any[]) => {
            const map = new Map<string, any>((prev || []).map((a: any) => [a.id, a]));
            del.forEach(id => map.delete(id));
            Object.entries(upserts).forEach(([id, d]) => map.set(id, { ...(map.get(id) || {}), ...d, id }));
            return Array.from(map.values());
        });
    };

    // SAVE SINGLE BATCH ENTRY (Classic mode)
    const handleSaveSingleBatch = async () => {
        if (!firestore || !user || !schoolId || !classId || !subjectId) return;

        if (termLocked) {
            toast({ variant: 'destructive', title: "Term Closed", description: "This term has been closed, so its marks are locked. Ask an administrator to make corrections." });
            return;
        }

        const parsedMaxScore = Number(maxScore);
        if (isNaN(parsedMaxScore) || parsedMaxScore <= 0) {
            toast({ variant: 'destructive', title: "Invalid Max Score", description: "Please enter a valid Maximum Score greater than 0." });
            return;
        }

        const invalidEntry = Object.entries(singleScores).find(([_, score]) => score !== '' && score !== null && !isNaN(Number(score)) && (Number(score) > parsedMaxScore || Number(score) < 0));
        if (invalidEntry) {
            const invalidStudent = students?.find(s => s.uid === invalidEntry[0]);
            const studentName = invalidStudent ? `${invalidStudent.firstName} ${invalidStudent.lastName}`.trim() : 'A student';
            toast({
                variant: 'destructive',
                title: "Invalid Score",
                description: Number(invalidEntry[1]) < 0
                    ? `${studentName}'s score cannot be negative.`
                    : `${studentName}'s score (${invalidEntry[1]}) exceeds the Maximum Score (${parsedMaxScore}).`
            });
            return;
        }

        setIsSaving(true);
        try {
            const writer = new ChunkedWriter(firestore);
            const targetName = assessmentName || assessmentType;
            const subjectName = subjects?.find((sub: any) => sub.id === subjectId)?.name || 'Subject';
            const className = selectedClass?.name || null;
            const termId = buildTermId(academicYear, term);
            const upserts: Record<string, any> = {};
            const toDelete: string[] = [];
            const updatedStudentIds: string[] = [];
            const notifyIds: string[] = [];
            let created = 0, changed = 0;

            // This term's existing records of this assessment, per student.
            const existingByStudent: Record<string, any[]> = {};
            rawAssessments
                .filter((a: any) => (a.assessmentName || a.assessmentType) === targetName && a.studentId)
                .forEach((a: any) => {
                    if (!existingByStudent[a.studentId]) existingByStudent[a.studentId] = [];
                    existingByStudent[a.studentId].push(a);
                });

            const studentIds = new Set<string>([...Object.keys(singleScores), ...Object.keys(existingByStudent)]);
            studentIds.forEach((studentId) => {
                const raw = singleScores[studentId];
                const docs = existingByStudent[studentId] || [];
                const keep = docs.length > 0 ? docs[docs.length - 1] : undefined;
                // True duplicates (same student, same assessment name, same term) are tidied up.
                docs.slice(0, -1).forEach((d: any) => toDelete.push(d.id));
                const hasValue = raw !== '' && raw !== null && raw !== undefined && !isNaN(Number(raw));
                if (!hasValue) {
                    // Only remove a saved mark when the teacher actually cleared it on screen.
                    if (keep && studentId in singleScores) { toDelete.push(keep.id); updatedStudentIds.push(studentId); }
                    return;
                }
                const score = Number(raw);
                const remark = singleRemarks[studentId] || '';
                if (keep && Number(keep.score) === score && Number(keep.maxScore) === parsedMaxScore && (keep.teacherRemark || '') === remark) {
                    return; // unchanged
                }
                const student = students?.find(s => s.uid === studentId);
                const studentName = student
                    ? `${student.firstName || ''} ${student.lastName || ''}`.trim()
                    : (keep?.studentName || '');
                const fields: any = {
                    studentId,
                    studentName,
                    classId,
                    subjectId,
                    schoolId,
                    teacherId: user.uid,
                    term,
                    academicYear,
                    assessmentType,
                    assessmentName: targetName,
                    score,
                    maxScore: parsedMaxScore,
                    teacherRemark: remark,
                };
                if (termId) fields.termId = termId;
                if (keep) {
                    writer.set(doc(firestore, 'assessments', keep.id), { ...fields, updatedAt: serverTimestamp() }, { merge: true });
                    upserts[keep.id] = { ...keep, ...fields, updatedAt: new Date() };
                    changed++;
                } else {
                    const ref = doc(collection(firestore, 'assessments'));
                    writer.set(ref, { ...fields, createdAt: serverTimestamp(), assessmentDate: serverTimestamp() });
                    upserts[ref.id] = { ...fields, createdAt: new Date(), assessmentDate: new Date() };
                    created++;
                }
                TimelineService.logEventBatch(firestore, writer, {
                    studentId,
                    title: `Graded: ${assessmentType}`,
                    description: `Scored ${score}/${parsedMaxScore} in ${subjectName}.${remark ? ' Remark: "' + remark + '"' : ''}`,
                    category: 'academic',
                    academicYear,
                    term,
                    classId,
                    className,
                    schoolId,
                    recordedBy: user.displayName || 'Teacher',
                    recordedById: user.uid,
                    metadata: {
                        score,
                        maxScore: parsedMaxScore,
                        subjectId,
                        subjectName,
                        assessmentType,
                        remark
                    },
                    date: new Date()
                });
                updatedStudentIds.push(studentId);
                notifyIds.push(studentId);
            });

            if (writer.size === 0 && toDelete.length === 0) {
                const anyScores = Object.values(singleScores).some(v => v !== '' && v !== null && !isNaN(Number(v)));
                toast(anyScores
                    ? { title: "Nothing to Save", description: "All marks are already saved — nothing has changed." }
                    : { variant: 'destructive', title: "No Data", description: "You have not entered any valid scores to save." });
                return;
            }

            if (writer.size > 0) await writer.commit();
            const deleted = await commitDeletes(toDelete);
            applyLocalChanges(upserts, deleted.ok ? toDelete : []);

            toast({ title: "Scores Saved Successfully! 🎉", description: `${created} new mark(s), ${changed} updated${deleted.ok && toDelete.length ? `, ${toDelete.length} removed` : ''}.` });
            if (!deleted.ok) {
                toast({ variant: 'destructive', title: "Some Marks Not Removed", description: deleted.message });
            }

            if (notifyIds.length > 0) {
                notifyParents(
                    notifyIds,
                    "New Grades Posted 📊",
                    `New ${assessmentType} marks have been entered. Tap to view your child's live grades.`,
                    "/dashboard/my-grades"
                ).catch(err => console.error("Notification failed silently:", err));
            }
        } catch (error: any) {
            console.error("Save Batch Error:", error);
            toast({ variant: 'destructive', title: "Database Error", description: friendlySaveError(error) });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBatch = async (typeToDelete: string) => {
        if (!firestore) return;
        if (termLocked) {
            toast({ variant: 'destructive', title: "Term Closed", description: "This term has been closed, so its marks are locked. Ask an administrator to make corrections." });
            return;
        }
        const docsToDelete = groupedAssessments[typeToDelete] || [];
        if (docsToDelete.length === 0) return;
        setIsSaving(true);
        try {
            const ids = docsToDelete.map((d: any) => d.id);
            const res = await commitDeletes(ids);
            if (!res.ok) {
                toast({ variant: 'destructive', title: "Deletion Failed", description: res.message });
                return;
            }
            applyLocalChanges({}, ids);
            toast({ title: "Batch Removed 🗑️", description: `Successfully deleted ${ids.length} records for ${typeToDelete}.` });
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateClassInsights = async () => {
        if (!schoolId || !classId || !subjectId) return;
        setIsGeneratingInsights(true);
        setInsightsText(null);
        setIsInsightsOpen(true);

        try {
            const className = selectedClass?.name || 'Class';
            const subjectName = subjects?.find((s: any) => s.id === subjectId)?.name || 'Subject';
            
            const scoresData = entryMode === 'matrix' 
                ? (students?.map((s: any) => {
                    const row = matrixScores[s.uid];
                    const studentTests = row?.tests || {};
                    const validTests = testColumns
                        .map(tc => studentTests[tc.id])
                        .filter(v => v !== '' && v !== undefined && !isNaN(Number(v))) as number[];
                    const testsAvg = validTests.length > 0 ? (validTests.reduce((a, b) => a + b, 0) / validTests.length) : 0;
                    
                    const ct = validTests.length > 0 ? testsAvg : 0;
                    const hw = typeof row?.homework === 'number' ? row.homework : 0;
                    const pr = typeof row?.project === 'number' ? row.project : 0;
                    const mt = typeof row?.midTerm === 'number' ? row.midTerm : 0;
                    const ex = typeof row?.exam === 'number' ? row.exam : 0;
                    
                    const caMax = matrixMaxScores.classTest + matrixMaxScores.homework + matrixMaxScores.project + matrixMaxScores.midTerm;
                    const caWeighted = caMax > 0 ? ((ct + hw + pr + mt) / caMax) * caWeight : 0;
                    const exWeighted = matrixMaxScores.exam > 0 && row?.exam !== '' ? (ex / matrixMaxScores.exam) * examWeight : 0;
                    const totalPct = Math.round((caWeighted + exWeighted) * 10) / 10;
                    return {
                        studentName: `${s.firstName} ${s.lastName}`,
                        score: totalPct
                    };
                }) || [])
                : (students?.map((s: any) => ({
                    studentName: `${s.firstName} ${s.lastName}`,
                    score: singleScores[s.uid] ?? ''
                })) || []);

            const effectiveMax = entryMode === 'matrix' ? 100 : maxScore;
            const res = await generateClassInsightsAction(schoolId, className, subjectName, scoresData, effectiveMax);
            
            if (res.success && res.text) {
                setInsightsText(res.text);
            } else {
                toast({ variant: 'destructive', title: "AI Service Error", description: res.error });
                setIsInsightsOpen(false);
            }
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message || "Failed to analyze scores." });
            setIsInsightsOpen(false);
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    const isGlobalLoading = isUserLoading || schoolLoading;
    const gradingScale = schoolSettings?.gradingSystem || DEFAULT_GRADING_SYSTEM;

    return (
        <div className="space-y-6 pb-52">
            {/* Standardized Hero Banner */}
            <SectionHeroBanner
              title="Batch Entry & Gradebook"
              subtitle="Continuous assessment (SBA), multiple tests averaging, project grading, and terminal results."
              eyebrow="TERMINAL SBA MATRIX"
              icon={FileSpreadsheet}
              className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl"
              actions={
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  <Button asChild variant="outline" className="h-9 px-3.5 rounded-xl border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer transition-colors">
                    <Link href="/dashboard/report-cards" className="flex items-center gap-1.5">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Reports</span>
                    </Link>
                  </Button>
                  {role !== 'Student' && role !== 'Parent' && (
                    <div className="bg-slate-950/60 border border-slate-800/80 text-slate-300 text-xs font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0">
                      <span className="text-amber-400">⚡</span>
                      <span>{aiCredits === null ? '…' : aiCredits.toLocaleString()} AI Credits</span>
                    </div>
                  )}
                </div>
              }
            />

            {/* Entry Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-[1.8rem] border border-slate-200 shadow-sm">
                <Tabs value={entryMode} onValueChange={(val: any) => setEntryMode(val)} className="w-full sm:w-auto">
                    <TabsList className="bg-slate-100 p-1 rounded-2xl h-11">
                        <TabsTrigger 
                            value="matrix" 
                            className="rounded-xl font-black text-xs px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center gap-2"
                        >
                            <Grid3X3 className="h-4 w-4" /> SBA Terminal Matrix (Multi-Column)
                        </TabsTrigger>
                        <TabsTrigger 
                            value="single" 
                            className="rounded-xl font-black text-xs px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center gap-2"
                        >
                            <ListFilter className="h-4 w-4" /> Single Assessment Mode
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Proportions Indicator & Config Button */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 font-bold text-xs shadow-xs">
                        <span className="text-indigo-600">Proportion:</span>
                        <span className="font-black text-indigo-950">{caWeight}% CA / {examWeight}% Exam</span>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsWeightModalOpen(true)}
                        className="rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 h-9"
                    >
                        <Sliders className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                        Configure Proportions
                    </Button>
                </div>
            </div>

            {/* Roster Filters */}
            <Card className="border border-slate-100 shadow-md rounded-[2.2rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-50 bg-slate-50/20 p-6">
                    <CardTitle className="text-lg font-black text-slate-800">Roster Filters</CardTitle>
                    <CardDescription className="text-slate-400">Specify details to retrieve the classroom grading sheet.</CardDescription>
                </CardHeader>
                <CardContent className={`grid gap-4 p-6 bg-white ${entryMode === 'matrix' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-7'}`}>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear} disabled={role === 'Teacher'}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_ACADEMIC_YEARS.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Term</Label>
                        <Select value={term} onValueChange={setTerm} disabled={role === 'Teacher'}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_TERMS.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {visibleClasses?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Subject</Label>
                        <Select key={`subject-select-${classId}-${subjectId}`} value={subjectId} onValueChange={setSubjectId}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold">
                                <SelectValue placeholder="Select Subject">
                                    {visibleSubjects?.find((s: any) => s.id === subjectId)?.name}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {visibleSubjects?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Single Assessment Mode Specific Inputs */}
                    {entryMode === 'single' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Assessment Type</Label>
                                <Select value={assessmentType} onValueChange={setAssessmentType}>
                                    <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ASSESSMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Assessment Title</Label>
                                <Input 
                                    type="text" 
                                    value={assessmentName} 
                                    onChange={e => setAssessmentName(e.target.value)} 
                                    placeholder="e.g. Test 1, Theory Exam"
                                    className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Max Score</Label>
                                <Input 
                                    type="number" 
                                    value={maxScore} 
                                    onChange={e => setMaxScore(Number(e.target.value))} 
                                    className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold" 
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {classId && subjectId ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    
                    {/* -------------------- ENTRY MODE A: SBA TERMINAL MATRIX -------------------- */}
                    {entryMode === 'matrix' ? (
                        <Card className="shadow-lg border border-slate-100 rounded-[2.2rem] overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/10 p-6 flex-wrap gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                                            SBA Terminal Grading Matrix
                                        </CardTitle>
                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
                                            ⚡ Real-Time Scaling Active
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-slate-400 mt-1">
                                        Continuous assessment with dynamic test averaging, homework, project & terminal exams. Press <kbd className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">Enter</kbd> or <kbd className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">↓</kbd> to jump to next student.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddTestColumn}
                                        className="rounded-xl border-indigo-200 text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 text-xs font-bold h-10 px-3"
                                    >
                                        <Plus className="h-4 w-4 mr-1.5 text-indigo-600" /> Add Test Column
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsMaxScoresModalOpen(true)}
                                        className="rounded-xl border-slate-200 text-slate-700 text-xs font-bold h-10 px-3"
                                    >
                                        <Sliders className="h-4 w-4 mr-1.5 text-indigo-600" /> Max Scores
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAutoFillAllRemarks}
                                        className="rounded-xl border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100/60 text-xs font-bold h-10 px-3"
                                    >
                                        <Wand2 className="h-4 w-4 mr-1.5 text-amber-600" /> Auto-Fill Remarks
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100/70 rounded-xl font-bold text-xs h-10"
                                        onClick={handleGenerateClassInsights}
                                        disabled={isSaving || isGeneratingInsights}
                                    >
                                        <Sparkles className="mr-1.5 h-4 w-4 text-purple-600" /> AI Insights (5 credits)
                                    </Button>
                                    <Button 
                                        onClick={handleSaveMatrix} 
                                        disabled={isSaving || isGlobalLoading} 
                                        className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white shadow-md transition-all h-10 px-6 text-sm"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                                        {isGlobalLoading ? 'Authenticating...' : 'Save All Matrix Scores'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 px-2 sm:px-4 pb-20 overflow-x-auto pr-8 sm:pr-12">
                                {loadingStudents ? (
                                    <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                                        <Loader2 className="animate-spin h-10 w-10 text-indigo-600"/>
                                        <p className="font-semibold text-sm">Loading roster...</p>
                                    </div>
                                ) : (
                                    <div className="pb-20">
                                        <Table className="w-full min-w-0">
                                            <TableHeader>
                                            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
                                                <TableHead className="font-bold text-slate-700 w-[170px] sm:w-[190px] min-w-[150px] px-1.5 text-xs">Student Name</TableHead>
                                                
                                                {/* Dynamic Test Columns */}
                                                {testColumns.map((tc, colIdx) => (
                                                    <TableHead key={tc.id} className="text-center w-[50px] sm:w-[54px] min-w-[46px] px-0.5">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <div className="flex items-center gap-0.5">
                                                                <span className="font-bold text-slate-700 text-[11px] truncate max-w-[40px]" title={tc.name}>{tc.name}</span>
                                                                {testColumns.length > 1 && colIdx > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveTestColumn(tc.id)}
                                                                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                                                                        title={`Remove ${tc.name}`}
                                                                    >
                                                                        <X className="h-2.5 w-2.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-0.5">
                                                                <span className="text-[9px] font-black text-slate-400">/{matrixMaxScores.classTest}</span>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => { setFillTarget({ type: 'test', colId: tc.id, label: tc.name, max: matrixMaxScores.classTest }); setFillColValue(''); }}
                                                                    className="text-[8px] bg-slate-200/80 hover:bg-indigo-100 hover:text-indigo-700 px-1 py-0.2 rounded font-bold text-slate-600 transition-colors"
                                                                    title="Fill all students"
                                                                >
                                                                    Fill
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </TableHead>
                                                ))}

                                                {/* Homework Header */}
                                                <TableHead className="text-center w-[50px] sm:w-[54px] min-w-[46px] px-0.5">
                                                    <div className="flex flex-col items-center gap-0.5">
                                                        <span className="font-bold text-slate-700 text-[11px]">Homework</span>
                                                        <div className="flex items-center gap-0.5">
                                                            <span className="text-[9px] font-black text-slate-400">/{matrixMaxScores.homework}</span>
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setFillTarget({ type: 'homework', label: 'Homework', max: matrixMaxScores.homework }); setFillColValue(''); }}
                                                                className="text-[8px] bg-slate-200/80 hover:bg-indigo-100 hover:text-indigo-700 px-1 py-0.2 rounded font-bold text-slate-600 transition-colors"
                                                                title="Fill all students"
                                                            >
                                                                Fill
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TableHead>

                                                {/* Project / Practical Header (Restored) */}
                                                <TableHead className="text-center w-[50px] sm:w-[54px] min-w-[46px] px-0.5">
                                                    <div className="flex flex-col items-center gap-0.5">
                                                        <span className="font-bold text-slate-700 text-[11px]">Project</span>
                                                        <div className="flex items-center gap-0.5">
                                                            <span className="text-[9px] font-black text-slate-400">/{matrixMaxScores.project}</span>
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setFillTarget({ type: 'project', label: 'Project / CW', max: matrixMaxScores.project }); setFillColValue(''); }}
                                                                className="text-[8px] bg-slate-200/80 hover:bg-indigo-100 hover:text-indigo-700 px-1 py-0.2 rounded font-bold text-slate-600 transition-colors"
                                                                title="Fill all students"
                                                            >
                                                                Fill
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TableHead>

                                                {/* Mid-Term Header */}
                                                <TableHead className="text-center w-[50px] sm:w-[54px] min-w-[46px] px-0.5">
                                                    <div className="flex flex-col items-center gap-0.5">
                                                        <span className="font-bold text-slate-700 text-[11px]">Mid-Term</span>
                                                        <div className="flex items-center gap-0.5">
                                                            <span className="text-[9px] font-black text-slate-400">/{matrixMaxScores.midTerm}</span>
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setFillTarget({ type: 'midTerm', label: 'Mid-Term', max: matrixMaxScores.midTerm }); setFillColValue(''); }}
                                                                className="text-[8px] bg-slate-200/80 hover:bg-indigo-100 hover:text-indigo-700 px-1 py-0.2 rounded font-bold text-slate-600 transition-colors"
                                                                title="Fill all students"
                                                            >
                                                                Fill
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TableHead>

                                                {/* SBA Scaled Header */}
                                                <TableHead className="text-center w-[52px] sm:w-[56px] min-w-[48px] px-0.5 bg-indigo-50/50 border-x border-indigo-100/50">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-black text-indigo-900 text-[11px] leading-tight">CA Scaled</span>
                                                        <span className="text-[9px] font-bold text-indigo-600">({caWeight}%)</span>
                                                    </div>
                                                </TableHead>

                                                {/* Exam Header */}
                                                <TableHead className="text-center w-[50px] sm:w-[54px] min-w-[46px] px-0.5">
                                                    <div className="flex flex-col items-center gap-0.5">
                                                        <span className="font-bold text-slate-700 text-[11px]">Exam</span>
                                                        <div className="flex items-center gap-0.5">
                                                            <span className="text-[9px] font-black text-slate-400">/{matrixMaxScores.exam}</span>
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setFillTarget({ type: 'exam', label: 'Terminal Exam', max: matrixMaxScores.exam }); setFillColValue(''); }}
                                                                className="text-[8px] bg-slate-200/80 hover:bg-indigo-100 hover:text-indigo-700 px-1 py-0.2 rounded font-bold text-slate-600 transition-colors"
                                                                title="Fill all students"
                                                            >
                                                                Fill
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TableHead>

                                                {/* Exam Scaled Header */}
                                                <TableHead className="text-center w-[52px] sm:w-[56px] min-w-[48px] px-0.5 bg-slate-50 border-r border-slate-200/80">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-black text-slate-800 text-[11px] leading-tight">Ex Scaled</span>
                                                        <span className="text-[9px] font-bold text-slate-500">({examWeight}%)</span>
                                                    </div>
                                                </TableHead>

                                                {/* Total Percent Header */}
                                                <TableHead className="text-center w-[46px] sm:w-[50px] min-w-[42px] px-0.5 bg-indigo-900 text-white font-black text-[11px]">
                                                    Total %
                                                </TableHead>

                                                {/* Grade Header */}
                                                <TableHead className="text-center w-[38px] sm:w-[42px] min-w-[34px] px-0.5 font-black text-slate-700 text-[11px]">
                                                    Grade
                                                </TableHead>

                                                {/* Teacher Remark Header */}
                                                <TableHead className="font-bold text-slate-700 min-w-[140px] px-1 pr-6 text-xs">
                                                    Teacher Remark
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students?.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={9 + testColumns.length} className="text-center py-10 italic text-slate-400">
                                                        No active students enrolled in this class.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {students?.map((s: any, idx: number) => {
                                                const row = matrixScores[s.uid] || { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' };
                                                
                                                // Tests aggregation
                                                const studentTests = row.tests || {};
                                                const validTests = testColumns
                                                    .map(tc => studentTests[tc.id])
                                                    .filter(v => v !== '' && v !== undefined && !isNaN(Number(v))) as number[];
                                                const testsAvg = validTests.length > 0 ? (validTests.reduce((a, b) => a + b, 0) / validTests.length) : 0;
                                                const hasAnyTest = validTests.length > 0;

                                                const ct = hasAnyTest ? testsAvg : 0;
                                                const hw = typeof row.homework === 'number' ? row.homework : 0;
                                                const pr = typeof row.project === 'number' ? row.project : 0;
                                                const mt = typeof row.midTerm === 'number' ? row.midTerm : 0;
                                                const ex = typeof row.exam === 'number' ? row.exam : 0;

                                                const hasAnyScore = hasAnyTest || row.homework !== '' || row.project !== '' || row.midTerm !== '' || row.exam !== '';
                                                
                                                // CA Total Raw & Scaled
                                                const caMax = matrixMaxScores.classTest + matrixMaxScores.homework + matrixMaxScores.project + matrixMaxScores.midTerm;
                                                const caRawObtained = ct + hw + pr + mt;
                                                const caWeighted = caMax > 0 ? (caRawObtained / caMax) * caWeight : 0;

                                                // Exam Scaled
                                                const examWeighted = matrixMaxScores.exam > 0 && row.exam !== '' ? (ex / matrixMaxScores.exam) * examWeight : 0;

                                                // Total Terminal Percent
                                                const totalPercent = hasAnyScore ? Math.min(100, Math.round((caWeighted + examWeighted) * 10) / 10) : 0;
                                                const { grade, autoRemark } = getGradeFromScale(totalPercent, gradingScale);

                                                // Check limits
                                                const hwOver = row.homework !== '' && Number(row.homework) > matrixMaxScores.homework;
                                                const prOver = row.project !== '' && Number(row.project) > matrixMaxScores.project;
                                                const mtOver = row.midTerm !== '' && Number(row.midTerm) > matrixMaxScores.midTerm;
                                                const exOver = row.exam !== '' && Number(row.exam) > matrixMaxScores.exam;

                                                const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();

                                                // Grade badge styling
                                                const gradeColor = 
                                                    grade === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                                    grade === 'B' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                                    grade === 'C' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                                                    grade === 'D' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                                                    grade === 'E' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                                                    'bg-rose-50 text-rose-700 border-rose-300';

                                                return (
                                                    <TableRow key={s.uid} className="hover:bg-slate-50/50 transition-colors border-b border-slate-150">
                                                        {/* Student Name */}
                                                        <TableCell className="font-semibold text-slate-800 py-1 px-1.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-black border border-indigo-100 shadow-xs">
                                                                    {initials}
                                                                </div>
                                                                <div className="min-w-0 pr-0.5">
                                                                    <p className="font-bold text-xs text-slate-800 leading-tight whitespace-normal break-words">{s.firstName} {s.lastName}</p>
                                                                    <p className="text-[9px] text-slate-400 font-mono leading-none">{s.studentId || ''}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        {/* Dynamic Test Inputs */}
                                                        {testColumns.map((tc) => {
                                                            const testVal = studentTests[tc.id];
                                                            const isOver = testVal !== '' && testVal !== undefined && Number(testVal) > matrixMaxScores.classTest;
                                                            return (
                                                                <TableCell key={tc.id} className="py-1 px-0.5 text-center">
                                                                    <Input 
                                                                        type="number"
                                                                        min="0"
                                                                        max={matrixMaxScores.classTest}
                                                                        value={testVal ?? ''}
                                                                        onChange={e => handleMatrixTestScoreChange(s.uid, tc.id, e.target.value)}
                                                                        onKeyDown={e => handleMatrixKeyDown(e, idx, `test_${tc.id}`)}
                                                                        data-matrix-row={idx}
                                                                        data-matrix-col={`test_${tc.id}`}
                                                                        className={`w-11 sm:w-12 max-w-[48px] h-8 px-0.5 font-black text-center mx-auto rounded-lg text-xs shadow-xs ${
                                                                            isOver ? 'border-rose-500 text-rose-600 ring-1 ring-rose-500' : 'border-slate-200'
                                                                        }`}
                                                                    />
                                                                </TableCell>
                                                            );
                                                        })}

                                                        {/* Homework Input */}
                                                        <TableCell className="py-1 px-0.5 text-center">
                                                            <Input 
                                                                type="number"
                                                                min="0"
                                                                max={matrixMaxScores.homework}
                                                                value={row.homework ?? ''}
                                                                onChange={e => handleMatrixScoreChange(s.uid, 'homework', e.target.value)}
                                                                onKeyDown={e => handleMatrixKeyDown(e, idx, 'homework')}
                                                                data-matrix-row={idx}
                                                                data-matrix-col="homework"
                                                                className={`w-11 sm:w-12 max-w-[48px] h-8 px-0.5 font-black text-center mx-auto rounded-lg text-xs shadow-xs ${
                                                                    hwOver ? 'border-rose-500 text-rose-600 ring-1 ring-rose-500' : 'border-slate-200'
                                                                }`}
                                                            />
                                                        </TableCell>

                                                        {/* Project / Practical Input (Restored) */}
                                                        <TableCell className="py-1 px-0.5 text-center">
                                                            <Input 
                                                                type="number"
                                                                min="0"
                                                                max={matrixMaxScores.project}
                                                                value={row.project ?? ''}
                                                                onChange={e => handleMatrixScoreChange(s.uid, 'project', e.target.value)}
                                                                onKeyDown={e => handleMatrixKeyDown(e, idx, 'project')}
                                                                data-matrix-row={idx}
                                                                data-matrix-col="project"
                                                                className={`w-11 sm:w-12 max-w-[48px] h-8 px-0.5 font-black text-center mx-auto rounded-lg text-xs shadow-xs ${
                                                                    prOver ? 'border-rose-500 text-rose-600 ring-1 ring-rose-500' : 'border-slate-200'
                                                                }`}
                                                            />
                                                        </TableCell>

                                                        {/* Mid-Term Input */}
                                                        <TableCell className="py-1 px-0.5 text-center">
                                                            <Input 
                                                                type="number"
                                                                min="0"
                                                                max={matrixMaxScores.midTerm}
                                                                value={row.midTerm ?? ''}
                                                                onChange={e => handleMatrixScoreChange(s.uid, 'midTerm', e.target.value)}
                                                                onKeyDown={e => handleMatrixKeyDown(e, idx, 'midTerm')}
                                                                data-matrix-row={idx}
                                                                data-matrix-col="midTerm"
                                                                className={`w-11 sm:w-12 max-w-[48px] h-8 px-0.5 font-black text-center mx-auto rounded-lg text-xs shadow-xs ${
                                                                    mtOver ? 'border-rose-500 text-rose-600 ring-1 ring-rose-500' : 'border-slate-200'
                                                                }`}
                                                            />
                                                        </TableCell>

                                                        {/* Scaled CA Badge */}
                                                        <TableCell className="text-center bg-indigo-50/30 border-x border-indigo-100/40 py-1 px-0.5">
                                                            <div className="font-black text-xs text-indigo-900 leading-tight">
                                                                {hasAnyScore ? caWeighted.toFixed(1) : '-'}
                                                            </div>
                                                            <span className="text-[9px] text-indigo-500 font-bold leading-none">/{caWeight}</span>
                                                        </TableCell>

                                                        {/* Exam Input */}
                                                        <TableCell className="py-1 px-0.5 text-center">
                                                            <Input 
                                                                type="number"
                                                                min="0"
                                                                max={matrixMaxScores.exam}
                                                                value={row.exam ?? ''}
                                                                onChange={e => handleMatrixScoreChange(s.uid, 'exam', e.target.value)}
                                                                onKeyDown={e => handleMatrixKeyDown(e, idx, 'exam')}
                                                                data-matrix-row={idx}
                                                                data-matrix-col="exam"
                                                                className={`w-11 sm:w-12 max-w-[48px] h-8 px-0.5 font-black text-center mx-auto rounded-lg text-xs shadow-xs ${
                                                                    exOver ? 'border-rose-500 text-rose-600 ring-1 ring-rose-500' : 'border-slate-200'
                                                                }`}
                                                            />
                                                        </TableCell>

                                                        {/* Scaled Exam Badge */}
                                                        <TableCell className="text-center bg-slate-50/50 border-r border-slate-200/60 py-1 px-0.5">
                                                            <div className="font-black text-xs text-slate-800 leading-tight">
                                                                {row.exam !== '' ? examWeighted.toFixed(1) : '-'}
                                                            </div>
                                                            <span className="text-[9px] text-slate-400 font-bold leading-none">/{examWeight}</span>
                                                        </TableCell>

                                                        {/* Total % Badge */}
                                                        <TableCell className="text-center py-1 px-0.5">
                                                            <Badge className="bg-indigo-950 text-white font-black text-[11px] py-0.5 px-1 rounded-md shadow-xs">
                                                                {hasAnyScore ? `${totalPercent}%` : '-'}
                                                            </Badge>
                                                        </TableCell>

                                                        {/* Grade Badge */}
                                                        <TableCell className="text-center py-1 px-0.5">
                                                            {hasAnyScore ? (
                                                                <span className={`inline-flex items-center justify-center font-black text-xs w-6 h-6 rounded-md border shadow-xs ${gradeColor}`}>
                                                                    {grade}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-300 font-mono text-xs">-</span>
                                                            )}
                                                        </TableCell>

                                                        {/* Remark Input & Quick Chips */}
                                                        <TableCell className="py-1 px-1 pr-6">
                                                            <div className="space-y-1">
                                                                <Input 
                                                                    type="text"
                                                                    placeholder={autoRemark || "e.g. Excellent progress"}
                                                                    value={row.remark ?? ''}
                                                                    onChange={e => handleMatrixRemarkChange(s.uid, e.target.value)}
                                                                    onKeyDown={e => handleMatrixKeyDown(e, idx, 'remark')}
                                                                    data-matrix-row={idx}
                                                                    data-matrix-col="remark"
                                                                    className="h-8 text-xs rounded-lg border-slate-200 text-slate-700 shadow-xs"
                                                                />
                                                                {/* Quick Suggestion Chips if Remark is empty */}
                                                                {!row.remark && autoRemark && (
                                                                    <div className="flex items-center gap-1 flex-wrap">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMatrixRemarkChange(s.uid, autoRemark)}
                                                                            className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-1.5 py-0.5 rounded font-bold transition-colors flex items-center gap-1"
                                                                        >
                                                                            <Wand2 className="h-2.5 w-2.5 text-amber-600" />
                                                                            Use: &quot;{autoRemark}&quot;
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        /* -------------------- ENTRY MODE B: SINGLE ASSESSMENT BATCH (Classic) -------------------- */
                        <Card className="shadow-lg border border-slate-100 rounded-[2.2rem] overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/10 p-6 flex-wrap gap-4">
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-800">Single Assessment Roster</CardTitle>
                                    <CardDescription className="text-slate-400">Input marks for current students. Unfilled lines will be skipped.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100/70 rounded-xl font-bold text-xs"
                                        onClick={handleGenerateClassInsights}
                                        disabled={isSaving || isGeneratingInsights}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4 text-purple-600" /> AI Insights (5 credits)
                                    </Button>
                                    <Button 
                                        onClick={handleSaveSingleBatch} 
                                        disabled={isSaving || isGlobalLoading} 
                                        className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white shadow transition-all h-10 px-6 text-sm"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                                        {isGlobalLoading ? 'Authenticating...' : 'Save All Scores'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 px-6 pb-20">
                                {loadingStudents ? (
                                    <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                                        <Loader2 className="animate-spin h-10 w-10 text-indigo-600"/>
                                        <p className="font-semibold text-sm">Loading roster...</p>
                                    </div>
                                ) : (
                                    <div className="pb-20">
                                        <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-150">
                                                <TableHead className="font-bold text-slate-700 w-[280px] min-w-[260px]">Student Name</TableHead>
                                                <TableHead className="w-[120px] sm:w-[180px] min-w-[120px] font-bold text-slate-700">Score (/{maxScore})</TableHead>
                                                <TableHead className="font-bold text-slate-700 pr-10">Teacher Remark (Optional)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students?.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-10 italic text-slate-400">
                                                        No active students enrolled in this class.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {students?.map((s: any, idx: number) => {
                                                const currentScore = singleScores[s.uid];
                                                const isOverLimit = currentScore !== undefined && currentScore !== '' && Number(currentScore) > maxScore;
                                                const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();

                                                return (
                                                    <TableRow key={s.uid} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100">
                                                        <TableCell className="font-semibold text-slate-800">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-100 shadow-sm">
                                                                    {initials}
                                                                </div>
                                                                <span className="whitespace-normal break-words leading-snug">{s.firstName} {s.lastName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="min-w-[120px]">
                                                            <div className="relative">
                                                                <Input 
                                                                    type="number" 
                                                                    min="0" 
                                                                    max={maxScore} 
                                                                    value={singleScores[s.uid] ?? ''} 
                                                                    onChange={e => {
                                                                        const val = e.target.value;
                                                                        const num = val === '' ? '' : Number(val);
                                                                        setSingleScores(prev => ({ ...prev, [s.uid]: num }));
                                                                    }}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter' || e.key === 'ArrowDown') {
                                                                            e.preventDefault();
                                                                            const next = document.querySelector<HTMLInputElement>(`input[data-single-row="${idx + 1}"]`);
                                                                            if (next) { next.focus(); next.select(); }
                                                                        } else if (e.key === 'ArrowUp') {
                                                                            e.preventDefault();
                                                                            const prevEl = document.querySelector<HTMLInputElement>(`input[data-single-row="${idx - 1}"]`);
                                                                            if (prevEl) { prevEl.focus(); prevEl.select(); }
                                                                        }
                                                                    }}
                                                                    data-single-row={idx}
                                                                    className={`font-black w-28 sm:w-full text-center h-10 rounded-xl pr-10 focus-visible:ring-indigo-500 shadow-sm ${
                                                                        isOverLimit ? 'border-rose-500 ring-rose-500 text-rose-600 focus-visible:ring-rose-500' : 'border-slate-200'
                                                                    }`}
                                                                />
                                                                <span className={`absolute right-3 top-2.5 text-[9px] uppercase font-black tracking-widest pointer-events-none ${
                                                                    isOverLimit ? 'text-rose-500' : 'text-slate-400'
                                                                }`}>
                                                                    PTS
                                                                </span>
                                                            </div>
                                                            {isOverLimit && (
                                                                <p className="text-[10px] text-rose-600 font-bold mt-1 ml-1 flex items-center gap-1">
                                                                    <AlertCircle className="h-3 w-3" /> Exceeds max {maxScore}
                                                                </p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="pr-10">
                                                            <Input 
                                                                type="text" 
                                                                placeholder="e.g. Solid understanding, excellent work"
                                                                value={singleRemarks[s.uid] ?? ''} 
                                                                onChange={e => setSingleRemarks(prev => ({ ...prev, [s.uid]: e.target.value }))}
                                                                className="rounded-xl border border-slate-200 focus-visible:ring-indigo-500 h-10 shadow-sm text-sm text-slate-700"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Historical Batches Records */}
                    {Object.keys(groupedAssessments).length > 0 && (
                        <Card className="border border-orange-100 shadow-md rounded-[2.2rem] overflow-hidden bg-white">
                            <CardHeader className="bg-orange-50/20 border-b border-orange-50/60 p-6">
                                <CardTitle className="text-orange-900 flex items-center gap-2 font-black text-lg">
                                    <History className="h-5 w-5 text-orange-600"/> Recorded Batches in Ledger
                                </CardTitle>
                                <CardDescription className="text-orange-950/50">Edit individual marks or erase batch entries if needed.</CardDescription>
                                <div className="pt-2 flex flex-wrap items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-xl text-xs font-semibold border-orange-200 text-orange-800"
                                        disabled={!assessmentsKey || loadingAssessments || isSaving}
                                        onClick={() => refreshAssessments()}
                                        title="Marks are loaded once to save cost. Reload if another teacher has just entered marks for this class and subject."
                                    >
                                        <History className="mr-1.5 h-3.5 w-3.5" /> Reload marks
                                    </Button>
                                    {termLocked && (
                                        <span className="text-xs font-semibold text-rose-700">This term is closed — marks are locked for teachers.</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {loadingAssessments ? (
                                    <div className="p-12 flex justify-center text-orange-500"><Loader2 className="animate-spin h-8 w-8"/></div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(groupedAssessments).map(([type, records]) => (
                                            <div key={type} className="flex flex-col justify-between p-5 bg-orange-50/50 rounded-2xl border border-orange-100 shadow-sm group hover:border-orange-200 transition-colors">
                                                <div className="mb-4">
                                                    <Badge variant="outline" className="bg-white border-orange-200 text-orange-800 font-black mb-2.5 uppercase text-[9px] tracking-wider py-0.5 px-2">
                                                        {type}
                                                    </Badge>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {records.length} students graded.
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                                                        Recorded by: {records[0]?.teacherId === user?.uid ? "You (Class Teacher)" : "Teaching Staff"}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        disabled={isSaving}
                                                        className="flex-1 rounded-xl font-bold border-blue-200 text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-sm text-xs h-9"
                                                        onClick={() => {
                                                            setEntryMode('single');
                                                            setAssessmentType(type);
                                                            setAssessmentName(type);
                                                            window.scrollTo({ top: 350, behavior: 'smooth' });
                                                            toast({
                                                                title: `Loaded ${type}`,
                                                                description: "Switched to Single Assessment mode. Edit marks above and save."
                                                            });
                                                        }}
                                                    >
                                                        <Edit3 className="h-4 w-4 mr-1 text-blue-600" /> Edit Batch
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button 
                                                                variant="destructive" 
                                                                size="sm" 
                                                                disabled={isSaving}
                                                                className="flex-1 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm text-xs h-9"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl p-6">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="font-black text-slate-800">Permanently Delete Batch?</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-slate-400 text-sm">
                                                                    This will erase all {records.length} recorded student marks for category <strong>{type}</strong>. This action is irreversible.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter className="gap-2 mt-4">
                                                                <AlertDialogCancel className="rounded-xl border border-slate-200 text-slate-600 font-bold">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteBatch(type)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl">
                                                                    Confirm Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <div className="p-20 text-center text-slate-400 border-4 border-dashed rounded-[2.5rem] bg-slate-50/50 flex flex-col items-center justify-center gap-4 border-slate-200">
                    <div className="bg-white p-5 rounded-full shadow-md">
                        <FileSpreadsheet className="h-12 w-12 text-slate-350 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-lg font-black text-slate-700">Gradebook Ready</p>
                        <p className="text-sm text-slate-400 mt-1 max-w-sm">Please select a Class and Subject above to populate the student roster and records ledger.</p>
                    </div>
                </div>
            )}

            {/* Assessment Proportions Configuration Modal */}
            <Dialog open={isWeightModalOpen} onOpenChange={setIsWeightModalOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-0 shadow-2xl p-6">
                    <DialogHeader className="border-b border-slate-100 pb-4">
                        <DialogTitle className="flex items-center gap-2 text-slate-900 font-black text-xl">
                            <Sliders className="h-5 w-5 text-indigo-600" /> Configure Assessment Proportions
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Define the ratio between Continuous Assessment (SBA) and End of Term Exam for this school/class.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Presets */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Quick Presets</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setCustomCaInput(0); setCustomExamInput(100); }}
                                    className={`rounded-xl text-xs font-bold h-11 ${
                                        customCaInput === 0 && customExamInput === 100 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500' 
                                            : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                                    }`}
                                >
                                    🎯 0% CA / 100% Mock
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setCustomCaInput(30); setCustomExamInput(70); }}
                                    className={`rounded-xl text-xs font-bold h-11 ${
                                        customCaInput === 30 && customExamInput === 70 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500' 
                                            : 'border-slate-200 text-slate-700'
                                    }`}
                                >
                                    30% CA / 70% Exam
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setCustomCaInput(50); setCustomExamInput(50); }}
                                    className={`rounded-xl text-xs font-bold h-11 ${
                                        customCaInput === 50 && customExamInput === 50 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500' 
                                            : 'border-slate-200 text-slate-700'
                                    }`}
                                >
                                    50% CA / 50% Exam
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setCustomCaInput(40); setCustomExamInput(60); }}
                                    className={`rounded-xl text-xs font-bold h-11 ${
                                        customCaInput === 40 && customExamInput === 60 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500' 
                                            : 'border-slate-200 text-slate-700'
                                    }`}
                                >
                                    40% CA / 60% Exam
                                </Button>
                            </div>
                        </div>

                        {/* Custom Weight Inputs */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Continuous Assessment (CA %)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={customCaInput}
                                        onChange={e => {
                                            const val = Number(e.target.value);
                                            setCustomCaInput(val);
                                            setCustomExamInput(Math.max(0, 100 - val));
                                        }}
                                        className="h-11 rounded-xl font-black text-center pr-8 border-slate-200"
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-black text-slate-400">%</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">End of Term Exam (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={customExamInput}
                                        onChange={e => {
                                            const val = Number(e.target.value);
                                            setCustomExamInput(val);
                                            setCustomCaInput(Math.max(0, 100 - val));
                                        }}
                                        className="h-11 rounded-xl font-black text-center pr-8 border-slate-200"
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-black text-slate-400">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Combined Weight:</span>
                            <span className={`font-black ${customCaInput + customExamInput === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {customCaInput + customExamInput}% / 100%
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleApplyProportions(false)}
                            className="rounded-xl font-bold border-slate-200 text-slate-700 h-10"
                        >
                            Apply to Current Session
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleApplyProportions(true)}
                            disabled={isSavingWeight || !classId}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10"
                        >
                            {isSavingWeight ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save as Class Default
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Column Max Scores Configuration Modal */}
            <Dialog open={isMaxScoresModalOpen} onOpenChange={setIsMaxScoresModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-0 shadow-2xl p-6 bg-white">
                    <DialogHeader className="border-b border-slate-100 pb-4">
                        <DialogTitle className="flex items-center gap-2 text-slate-900 font-black text-xl">
                            <Sliders className="h-5 w-5 text-indigo-600" /> Column Max Scores
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Configure the maximum achievable score for each assessment component. To record a pure 100% Mock Exam, you can set CA components to 0 and Terminal Exam to 100.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Quick 1-Click Presets */}
                    <div className="pt-2 pb-1">
                        <Label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">Quick Configuration Presets</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setMatrixMaxScores({ classTest: 0, homework: 0, project: 0, midTerm: 0, exam: 100 });
                                    setCaWeight(0);
                                    setExamWeight(100);
                                    setCustomCaInput(0);
                                    setCustomExamInput(100);
                                    toast({ title: "Mock Exam Mode Activated 🎯", description: "CA components set to 0 and Exam set to 100%." });
                                }}
                                className="h-10 text-xs font-bold rounded-xl border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                            >
                                🎯 100% Mock / Exam Only
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setMatrixMaxScores({ classTest: 20, homework: 20, project: 20, midTerm: 40, exam: 100 });
                                    toast({ title: "Standard Defaults Restored", description: "Set to 20 / 20 / 20 / 40 / 100." });
                                }}
                                className="h-10 text-xs font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100"
                            >
                                🔄 Standard NaCCA (20/40/100)
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Class Test Max</Label>
                            <Input 
                                type="number" 
                                min="0" 
                                value={matrixMaxScores.classTest} 
                                onChange={e => {
                                    const v = e.target.value;
                                    setMatrixMaxScores(prev => ({ ...prev, classTest: v === '' ? 0 : Math.max(0, Number(v)) }));
                                }}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Homework Max</Label>
                            <Input 
                                type="number" 
                                min="0" 
                                value={matrixMaxScores.homework} 
                                onChange={e => {
                                    const v = e.target.value;
                                    setMatrixMaxScores(prev => ({ ...prev, homework: v === '' ? 0 : Math.max(0, Number(v)) }));
                                }}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Project / CW Max</Label>
                            <Input 
                                type="number" 
                                min="0" 
                                value={matrixMaxScores.project} 
                                onChange={e => {
                                    const v = e.target.value;
                                    setMatrixMaxScores(prev => ({ ...prev, project: v === '' ? 0 : Math.max(0, Number(v)) }));
                                }}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Mid-Term Max</Label>
                            <Input 
                                type="number" 
                                min="0" 
                                value={matrixMaxScores.midTerm} 
                                onChange={e => {
                                    const v = e.target.value;
                                    setMatrixMaxScores(prev => ({ ...prev, midTerm: v === '' ? 0 : Math.max(0, Number(v)) }));
                                }}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Terminal Exam Max</Label>
                            <Input 
                                type="number" 
                                min="1" 
                                value={matrixMaxScores.exam} 
                                onChange={e => {
                                    const v = e.target.value;
                                    setMatrixMaxScores(prev => ({ ...prev, exam: v === '' ? 100 : Math.max(1, Number(v)) }));
                                }}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            onClick={() => {
                                setIsMaxScoresModalOpen(false);
                                toast({ title: "Max Scores Updated ✅", description: `Exam Max: ${matrixMaxScores.exam}, CA Max: ${matrixMaxScores.classTest + matrixMaxScores.homework + matrixMaxScores.project + matrixMaxScores.midTerm}` });
                            }} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10 shadow-sm"
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Fill Column Modal */}
            <Dialog open={!!fillTarget} onOpenChange={(open) => !open && setFillTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-0 shadow-2xl p-6">
                    <DialogHeader className="border-b border-slate-100 pb-4">
                        <DialogTitle className="flex items-center gap-2 text-slate-900 font-black text-lg">
                            <CheckCheck className="h-5 w-5 text-indigo-600" /> Fill Column Marks
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Apply a uniform score across the roster for <strong>{fillTarget?.label}</strong> (Max: {fillTarget?.max}).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Score to Apply</Label>
                            <Input 
                                type="number" 
                                min="0"
                                max={fillTarget?.max || 100}
                                placeholder={`0 to ${fillTarget?.max || 100}`}
                                value={fillColValue} 
                                onChange={e => setFillColValue(e.target.value === '' ? '' : Number(e.target.value))}
                                className="h-11 rounded-xl font-black text-center text-lg border-slate-200"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="fillOnlyEmptyCheckbox" 
                                checked={fillOnlyEmpty} 
                                onChange={e => setFillOnlyEmpty(e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <Label htmlFor="fillOnlyEmptyCheckbox" className="text-xs text-slate-600 font-medium cursor-pointer">
                                Only populate empty cells (do not overwrite existing marks)
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setFillTarget(null)}
                            className="rounded-xl border-slate-200 text-slate-600 font-bold h-10"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleExecuteFillColumn}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10 px-5"
                        >
                            Apply Marks
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Smart Insights Dialog */}
            <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
                <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col rounded-[2rem] border-0 shadow-2xl p-6 overflow-hidden">
                    <DialogHeader className="border-b border-slate-100 pb-4">
                        <DialogTitle className="flex items-center gap-2 text-purple-700 font-black text-xl">
                            <Sparkles className="h-5 w-5 animate-pulse text-purple-600" /> Class Assessment Insights
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm">
                            AI analysis based on the current scores entered in the roster.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
                        {isGeneratingInsights ? (
                            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                                <p className="text-purple-750 font-bold">Analyzing current scores...</p>
                                <p className="text-xs text-slate-400 font-semibold">Running models. Deducting 5 AI credits.</p>
                            </div>
                        ) : (
                            <div className="prose prose-sm prose-purple max-w-none">
                                <div className="whitespace-pre-wrap text-slate-750 leading-relaxed font-normal bg-slate-50/50 p-5 rounded-2xl border border-slate-100/60 shadow-inner">
                                    {insightsText}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

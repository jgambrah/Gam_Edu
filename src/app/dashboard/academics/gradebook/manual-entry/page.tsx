'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { collection, query, where, writeBatch, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
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
import CreditBalance from '@/components/CreditBalance';
import { DEFAULT_GRADING_SYSTEM, getGradeFromScale } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ASSESSMENT_TYPES = [
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
    const { data: schoolSettings } = useDoc<any>(schoolSettingsRef);

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
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<any>(classesQuery);

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

    const timetableQuery = useMemoFirebase(() => 
      (firestore && schoolId)
        ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
        : null, 
    [firestore, schoolId]);
    const { data: timetable } = useCollection<any>(timetableQuery);

    const visibleClasses = useMemo(() => {
        if (!classes) return [];
        if (role !== 'Teacher') return classes;
        const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
        return classes.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
    }, [classes, timetable, role, user?.uid]);

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

    const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: subjects } = useCollection<any>(subjectsQuery);

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
            if (Array.isArray(s.teacherIds) && s.teacherIds.includes(user?.uid)) return true;
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

    const studentsQuery = useMemoFirebase(() => 
        (firestore && schoolId && classId) 
            ? query(
                collection(firestore, 'students'), 
                where('schoolId', '==', schoolId), 
                where('classId', '==', classId),
                where('enrollmentStatus', '==', 'Active')
            ) 
            : null, 
    [firestore, schoolId, classId]);
    const { data: students, isLoading: loadingStudents } = useCollection<any>(studentsQuery);

    // Fetch Existing Assessments for Batch Management
    const assessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !classId || !subjectId) return null;
        return query(
            collection(firestore, 'assessments'),
            where('schoolId', '==', schoolId),
            where('classId', '==', classId),
            where('subjectId', '==', subjectId),
            where('academicYear', '==', academicYear),
            where('term', '==', term)
        );
    }, [firestore, schoolId, classId, subjectId, academicYear, term]);

    const { data: rawAssessments, isLoading: loadingAssessments, forceRefetch: refetchAssessments } = useCollection<any>(assessmentsQuery);

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

    // Populate Matrix from existing rawAssessments, detecting multiple test columns dynamically
    useEffect(() => {
        if (!rawAssessments || rawAssessments.length === 0) {
            setMatrixScores({});
            return;
        }

        // Identify all unique test names under 'Class Exercise (CA)'
        const testNamesSet = new Set<string>();
        rawAssessments.forEach((a: any) => {
            const type = (a.assessmentType || '').toLowerCase();
            const name = (a.assessmentName || '').toLowerCase();
            const combined = `${type} ${name}`;

            if (!combined.includes('exam') && !combined.includes('mid') && !combined.includes('home') && !combined.includes('hw') && !combined.includes('proj')) {
                testNamesSet.add(a.assessmentName || 'Test 1');
            }
        });

        let activeTestCols = [...testColumns];
        if (testNamesSet.size > 0) {
            const sortedNames = Array.from(testNamesSet).sort();
            activeTestCols = sortedNames.map((name, idx) => ({
                id: `test_${idx + 1}`,
                name
            }));
            setTestColumns(activeTestCols);
        }

        const newMatrix: Record<string, MatrixStudentRow> = {};

        rawAssessments.forEach((a: any) => {
            if (!a.studentId) return;
            if (!newMatrix[a.studentId]) {
                newMatrix[a.studentId] = { tests: {}, homework: '', project: '', midTerm: '', exam: '', remark: '' };
            }

            const type = (a.assessmentType || '').toLowerCase();
            const name = (a.assessmentName || '').toLowerCase();
            const combined = `${type} ${name}`;

            if (combined.includes('exam') || combined.includes('terminal') || combined.includes('end of term')) {
                newMatrix[a.studentId].exam = a.score !== undefined && a.score !== null ? Number(a.score) : '';
                if (a.teacherRemark) newMatrix[a.studentId].remark = a.teacherRemark;
                if (a.maxScore) setMatrixMaxScores(prev => ({ ...prev, exam: Number(a.maxScore) }));
            } else if (combined.includes('mid')) {
                newMatrix[a.studentId].midTerm = a.score !== undefined && a.score !== null ? Number(a.score) : '';
                if (!newMatrix[a.studentId].remark && a.teacherRemark) newMatrix[a.studentId].remark = a.teacherRemark;
                if (a.maxScore) setMatrixMaxScores(prev => ({ ...prev, midTerm: Number(a.maxScore) }));
            } else if (combined.includes('proj') || combined.includes('group') || combined.includes('practical')) {
                newMatrix[a.studentId].project = a.score !== undefined && a.score !== null ? Number(a.score) : '';
                if (!newMatrix[a.studentId].remark && a.teacherRemark) newMatrix[a.studentId].remark = a.teacherRemark;
                if (a.maxScore) setMatrixMaxScores(prev => ({ ...prev, project: Number(a.maxScore) }));
            } else if (combined.includes('home') || combined.includes('hw')) {
                newMatrix[a.studentId].homework = a.score !== undefined && a.score !== null ? Number(a.score) : '';
                if (!newMatrix[a.studentId].remark && a.teacherRemark) newMatrix[a.studentId].remark = a.teacherRemark;
                if (a.maxScore) setMatrixMaxScores(prev => ({ ...prev, homework: Number(a.maxScore) }));
            } else {
                // Matched to Class Exercise / Test
                const matchedCol = activeTestCols.find(c => c.name.toLowerCase() === (a.assessmentName || '').toLowerCase()) || activeTestCols[0];
                const colId = matchedCol?.id || 'test_1';
                newMatrix[a.studentId].tests[colId] = a.score !== undefined && a.score !== null ? Number(a.score) : '';
                if (!newMatrix[a.studentId].remark && a.teacherRemark) newMatrix[a.studentId].remark = a.teacherRemark;
                if (a.maxScore) setMatrixMaxScores(prev => ({ ...prev, classTest: Number(a.maxScore) }));
            }
        });

        setMatrixScores(newMatrix);
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

        setIsSaving(true);
        try {
            const batch = writeBatch(firestore);
            const subjectName = subjects?.find((sub: any) => sub.id === subjectId)?.name || 'Subject';
            const className = selectedClass?.name || 'Class';
            const updatedStudentIds: string[] = [];
            let totalSavedRecords = 0;

            // Map existing assessments by studentId and normalized category/name
            const existingMap: Record<string, { tests: Record<string, any>; hw?: any; project?: any; mt?: any; ex?: any }> = {};
            rawAssessments?.forEach((a: any) => {
                if (!a.studentId) return;
                if (!existingMap[a.studentId]) existingMap[a.studentId] = { tests: {} };
                const combined = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase();
                
                if (combined.includes('exam') || combined.includes('terminal') || combined.includes('end of term')) {
                    existingMap[a.studentId].ex = a;
                } else if (combined.includes('mid')) {
                    existingMap[a.studentId].mt = a;
                } else if (combined.includes('proj') || combined.includes('group') || combined.includes('practical')) {
                    existingMap[a.studentId].project = a;
                } else if (combined.includes('home') || combined.includes('hw')) {
                    existingMap[a.studentId].hw = a;
                } else {
                    const testKey = (a.assessmentName || 'test 1').toLowerCase();
                    existingMap[a.studentId].tests[testKey] = a;
                }
            });

            students?.forEach((s: any) => {
                const row = matrixScores[s.uid];
                if (!row) return;

                const hasTestScore = Object.values(row.tests || {}).some(v => v !== '' && typeof v === 'number');
                const hasData = hasTestScore || row.homework !== '' || row.project !== '' || row.midTerm !== '' || row.exam !== '';
                if (!hasData) return;

                const studentName = `${s.firstName || ''} ${s.lastName || ''}`.trim();
                let studentHadWrites = false;

                // 1. Dynamic Tests (Individual records persisted for each test column)
                testColumns.forEach((tc) => {
                    const testVal = row.tests?.[tc.id];
                    if (testVal !== '' && typeof testVal === 'number') {
                        const existingDoc = existingMap[s.uid]?.tests[tc.name.toLowerCase()] || (testColumns.length === 1 ? Object.values(existingMap[s.uid]?.tests || {})[0] : undefined);
                        const ref = existingDoc ? doc(firestore, 'assessments', existingDoc.id) : doc(collection(firestore, 'assessments'));
                        batch.set(ref, {
                            studentId: s.uid,
                            studentName,
                            classId,
                            subjectId,
                            schoolId,
                            teacherId: user.uid,
                            term,
                            academicYear,
                            assessmentType: 'Class Exercise (CA)',
                            assessmentName: tc.name,
                            score: Number(testVal),
                            maxScore: Number(matrixMaxScores.classTest),
                            teacherRemark: row.remark || '',
                            createdAt: serverTimestamp(),
                            assessmentDate: serverTimestamp()
                        });
                        studentHadWrites = true;
                        totalSavedRecords++;
                    }
                });

                // 2. Homework
                if (row.homework !== '' && typeof row.homework === 'number') {
                    const existingDoc = existingMap[s.uid]?.hw;
                    const ref = existingDoc ? doc(firestore, 'assessments', existingDoc.id) : doc(collection(firestore, 'assessments'));
                    batch.set(ref, {
                        studentId: s.uid,
                        studentName,
                        classId,
                        subjectId,
                        schoolId,
                        teacherId: user.uid,
                        term,
                        academicYear,
                        assessmentType: 'Homework (CA)',
                        assessmentName: 'Homework',
                        score: Number(row.homework),
                        maxScore: Number(matrixMaxScores.homework),
                        teacherRemark: row.remark || '',
                        createdAt: serverTimestamp(),
                        assessmentDate: serverTimestamp()
                    });
                    studentHadWrites = true;
                    totalSavedRecords++;
                }

                // 3. Project / Practical (Restored)
                if (row.project !== '' && typeof row.project === 'number') {
                    const existingDoc = existingMap[s.uid]?.project;
                    const ref = existingDoc ? doc(firestore, 'assessments', existingDoc.id) : doc(collection(firestore, 'assessments'));
                    batch.set(ref, {
                        studentId: s.uid,
                        studentName,
                        classId,
                        subjectId,
                        schoolId,
                        teacherId: user.uid,
                        term,
                        academicYear,
                        assessmentType: 'Project (CA)',
                        assessmentName: 'Project',
                        score: Number(row.project),
                        maxScore: Number(matrixMaxScores.project),
                        teacherRemark: row.remark || '',
                        createdAt: serverTimestamp(),
                        assessmentDate: serverTimestamp()
                    });
                    studentHadWrites = true;
                    totalSavedRecords++;
                }

                // 4. Mid-Term
                if (row.midTerm !== '' && typeof row.midTerm === 'number') {
                    const existingDoc = existingMap[s.uid]?.mt;
                    const ref = existingDoc ? doc(firestore, 'assessments', existingDoc.id) : doc(collection(firestore, 'assessments'));
                    batch.set(ref, {
                        studentId: s.uid,
                        studentName,
                        classId,
                        subjectId,
                        schoolId,
                        teacherId: user.uid,
                        term,
                        academicYear,
                        assessmentType: 'Mid-Term (CA)',
                        assessmentName: 'Mid-Term',
                        score: Number(row.midTerm),
                        maxScore: Number(matrixMaxScores.midTerm),
                        teacherRemark: row.remark || '',
                        createdAt: serverTimestamp(),
                        assessmentDate: serverTimestamp()
                    });
                    studentHadWrites = true;
                    totalSavedRecords++;
                }

                // 5. Exam
                if (row.exam !== '' && typeof row.exam === 'number') {
                    const existingDoc = existingMap[s.uid]?.ex;
                    const ref = existingDoc ? doc(firestore, 'assessments', existingDoc.id) : doc(collection(firestore, 'assessments'));
                    batch.set(ref, {
                        studentId: s.uid,
                        studentName,
                        classId,
                        subjectId,
                        schoolId,
                        teacherId: user.uid,
                        term,
                        academicYear,
                        assessmentType: 'End of Term Exam (Exam)',
                        assessmentName: 'End of Term Exam',
                        score: Number(row.exam),
                        maxScore: Number(matrixMaxScores.exam),
                        teacherRemark: row.remark || '',
                        createdAt: serverTimestamp(),
                        assessmentDate: serverTimestamp()
                    });
                    studentHadWrites = true;
                    totalSavedRecords++;
                }

                if (studentHadWrites) {
                    updatedStudentIds.push(s.uid);

                    // Timeline log
                    TimelineService.logEventBatch(firestore, batch, {
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

            if (totalSavedRecords === 0) {
                toast({ variant: 'destructive', title: "No Marks Entered", description: "Please enter at least one score in the matrix before saving." });
                setIsSaving(false);
                return;
            }

            await batch.commit();

            toast({
                title: "Terminal Matrix Saved Successfully! 🎉",
                description: `Persisted ${totalSavedRecords} assessment entries for ${updatedStudentIds.length} students.`
            });

            notifyParents(
                updatedStudentIds,
                "Terminal Grades Posted 📊",
                `Terminal grades for ${subjectName} have been recorded. Tap to view your child's updated report card.`,
                "/dashboard/my-grades"
            ).catch(err => console.error("Notification failed silently:", err));

            if (refetchAssessments) refetchAssessments();

        } catch (error: any) {
            console.error("Save Matrix Error:", error);
            toast({ variant: 'destructive', title: "Database Error", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    // SAVE SINGLE BATCH ENTRY (Classic mode)
    const handleSaveSingleBatch = async () => {
        if (!firestore || !user || !schoolId || !classId || !subjectId) return;

        const parsedMaxScore = Number(maxScore);
        if (isNaN(parsedMaxScore) || parsedMaxScore <= 0) {
            toast({ variant: 'destructive', title: "Invalid Max Score", description: "Please enter a valid Maximum Score greater than 0." });
            return;
        }

        const invalidEntry = Object.entries(singleScores).find(([_, score]) => score !== '' && score !== null && !isNaN(Number(score)) && Number(score) > parsedMaxScore);
        if (invalidEntry) {
            const invalidStudent = students?.find(s => s.uid === invalidEntry[0]);
            const studentName = invalidStudent ? `${invalidStudent.firstName} ${invalidStudent.lastName}`.trim() : 'A student';
            toast({ 
                variant: 'destructive', 
                title: "Score Exceeds Maximum", 
                description: `${studentName}'s score (${invalidEntry[1]}) exceeds the Maximum Score (${parsedMaxScore}).` 
            });
            return;
        }

        setIsSaving(true);
        try {
            const batch = writeBatch(firestore);
            const targetName = assessmentName || assessmentType;
            const existingDocs = rawAssessments?.filter((a: any) => (a.assessmentName || a.assessmentType) === targetName) || [];
            existingDocs.forEach((docData: any) => {
                const ref = doc(firestore, 'assessments', docData.id);
                batch.delete(ref);
            });

            let count = 0;
            const updatedStudentIds: string[] = []; 

            Object.entries(singleScores).forEach(([studentId, score]) => {
                if (score !== '' && score !== null && !isNaN(Number(score))) {
                    const student = students?.find(s => s.uid === studentId);
                    const studentName = `${student?.firstName || ''} ${student?.lastName || ''}`.trim();
                    const subjectName = subjects?.find((sub: any) => sub.id === subjectId)?.name || 'Subject';
                    const className = selectedClass?.name || null;
                    
                    const newAssessmentRef = doc(collection(firestore, 'assessments'));
                    batch.set(newAssessmentRef, {
                        studentId,
                        studentName,
                        classId,
                        subjectId,
                        schoolId, 
                        teacherId: user.uid,
                        term,
                        academicYear,
                        assessmentType,
                        assessmentName: assessmentName || assessmentType,
                        score: Number(score),
                        maxScore: Number(maxScore),
                        teacherRemark: singleRemarks[studentId] || "", 
                        createdAt: serverTimestamp(),
                        assessmentDate: serverTimestamp()
                    });

                    TimelineService.logEventBatch(firestore, batch, {
                        studentId,
                        title: `Graded: ${assessmentType}`,
                        description: `Scored ${score}/${maxScore} in ${subjectName}.${singleRemarks[studentId] ? ' Remark: "' + singleRemarks[studentId] + '"' : ''}`,
                        category: 'academic',
                        academicYear,
                        term,
                        classId,
                        className,
                        schoolId,
                        recordedBy: user.displayName || 'Teacher',
                        recordedById: user.uid,
                        metadata: {
                            score: Number(score),
                            maxScore: Number(maxScore),
                            subjectId,
                            subjectName,
                            assessmentType,
                            remark: singleRemarks[studentId] || ''
                        },
                        date: new Date()
                    });

                    count++;
                    updatedStudentIds.push(studentId);
                }
            });

            if (count === 0) {
                toast({ variant: 'destructive', title: "No Data", description: "You have not entered any valid scores to save." });
                setIsSaving(false);
                return;
            }

            await batch.commit();
            toast({ title: "Scores Saved Successfully! 🎉", description: `Recorded marks for ${count} students.` });
            
            notifyParents(
                updatedStudentIds,
                "New Grades Posted 📊",
                `New ${assessmentType} marks have been entered. Tap to view your child's live grades.`,
                "/dashboard/my-grades"
            ).catch(err => console.error("Notification failed silently:", err));

            setSingleScores({});
            setSingleRemarks({});
            if (refetchAssessments) refetchAssessments();

        } catch (error: any) {
            console.error("Save Batch Error:", error);
            toast({ variant: 'destructive', title: "Database Error", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBatch = async (typeToDelete: string) => {
        if (!firestore) return;

        setIsSaving(true);
        try {
            const batch = writeBatch(firestore);
            const docsToDelete = groupedAssessments[typeToDelete];
            
            docsToDelete.forEach(docData => {
                const ref = doc(firestore, 'assessments', docData.id);
                batch.delete(ref);
            });

            await batch.commit();
            toast({ title: "Batch Removed 🗑️", description: `Successfully deleted ${docsToDelete.length} records for ${typeToDelete}.` });
            if (refetchAssessments) refetchAssessments();

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Deletion Failed", description: "Failed to erase batch records." });
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
        <div className="p-6 pb-52 space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 md:p-12 shadow-2xl border border-white/10 group">
                <div className="absolute right-[-40px] bottom-[-40px] opacity-10 text-white transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                    <FileSpreadsheet className="h-60 w-60" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Button asChild variant="outline" className="border-indigo-800 text-indigo-200 bg-indigo-950/40 hover:bg-indigo-900/40 hover:text-white rounded-xl h-9 px-3">
                                <Link href="/dashboard/report-cards">
                                    <ArrowLeft className="mr-2 h-4 w-4"/> Back to Reports
                                </Link>
                            </Button>
                            <Badge className="bg-indigo-800 text-indigo-100 uppercase tracking-widest font-black text-[9px] py-1 px-2.5 rounded-full border border-indigo-700/50">
                                {entryMode === 'matrix' ? 'Terminal SBA Matrix' : 'Single Batch'}
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                            Batch Entry & Gradebook
                        </h1>
                        <p className="text-indigo-200 text-lg max-w-xl font-light">
                            Continuous assessment (SBA), multiple tests averaging, project grading, and terminal results.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {role !== 'Student' && role !== 'Parent' && (
                            <CreditBalance />
                        )}
                    </div>
                </div>
            </div>

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
                            <div className="grid grid-cols-3 gap-2">
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
                <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-0 shadow-2xl p-6">
                    <DialogHeader className="border-b border-slate-100 pb-4">
                        <DialogTitle className="flex items-center gap-2 text-slate-900 font-black text-xl">
                            <Sliders className="h-5 w-5 text-indigo-600" /> Column Max Scores
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Configure the maximum achievable score for each assessment component in the matrix.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Class Test Max</Label>
                            <Input 
                                type="number" 
                                min="1" 
                                value={matrixMaxScores.classTest} 
                                onChange={e => setMatrixMaxScores(prev => ({ ...prev, classTest: Number(e.target.value) || 20 }))}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Homework Max</Label>
                            <Input 
                                type="number" 
                                min="1" 
                                value={matrixMaxScores.homework} 
                                onChange={e => setMatrixMaxScores(prev => ({ ...prev, homework: Number(e.target.value) || 20 }))}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Project / CW Max</Label>
                            <Input 
                                type="number" 
                                min="1" 
                                value={matrixMaxScores.project} 
                                onChange={e => setMatrixMaxScores(prev => ({ ...prev, project: Number(e.target.value) || 20 }))}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Mid-Term Max</Label>
                            <Input 
                                type="number" 
                                min="1" 
                                value={matrixMaxScores.midTerm} 
                                onChange={e => setMatrixMaxScores(prev => ({ ...prev, midTerm: Number(e.target.value) || 40 }))}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Terminal Exam Max</Label>
                            <Input 
                                type="number" 
                                min="1" 
                                value={matrixMaxScores.exam} 
                                onChange={e => setMatrixMaxScores(prev => ({ ...prev, exam: Number(e.target.value) || 100 }))}
                                className="h-10 rounded-xl font-bold text-center border-slate-200"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            onClick={() => {
                                setIsMaxScoresModalOpen(false);
                                toast({ title: "Max Scores Updated", description: "Column scaling refreshed." });
                            }} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10"
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

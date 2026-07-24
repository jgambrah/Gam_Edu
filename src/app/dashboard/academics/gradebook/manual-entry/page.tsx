'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { collection, query, where, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileSpreadsheet, Trash2, ArrowLeft, History, Sparkles, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CreditBalance from '@/components/CreditBalance';

const ASSESSMENT_TYPES = [
    'Class Exercise (CA)', 
    'Homework (CA)', 
    'Project (CA)', 
    'Mid-Term (CA)', 
    'End of Term Exam (Exam)'
];

export default function GradebookPage() {
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    // State for filtering
    const [classId, setClassId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [term, setTerm] = useState(MOCK_TERMS[0] || 'First Term');
    const [academicYear, setAcademicYear] = useState(MOCK_ACADEMIC_YEARS[4] || '2024-2025'); 
    const [assessmentType, setAssessmentType] = useState(ASSESSMENT_TYPES[0]);
    const [maxScore, setMaxScore] = useState(100);
    const [assessmentName, setAssessmentName] = useState(ASSESSMENT_TYPES[0]);

    // State for scores and remarks
    const [scores, setScores] = useState<Record<string, number | ''>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({}); 
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

    // Data Fetching
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<any>(classesQuery);

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

        // Admins, Directors, and non-teachers see all subjects
        if (role !== 'Teacher') {
            return subjects;
        }

        // Check if teacher is the Class Teacher of the currently selected class
        const selectedClass = classes?.find((c: any) => c.id === classId);
        const isClassTeacherOfThisClass = selectedClass?.teacherId === user?.uid;

        // RULE 1: Class Teacher of this class sees ALL subjects
        if (isClassTeacherOfThisClass) {
            return subjects;
        }

        // RULE 2: Subject Teacher (not Class Teacher) sees ONLY assigned subjects for this class
        const teacherTimetableSubjectIds = timetable
            ?.filter((t: any) => t.classId === classId && t.teacherId === user?.uid)
            .map((t: any) => t.subjectId) || [];

        const assignedSubjects = subjects.filter((s: any) => {
            if (s.id && teacherTimetableSubjectIds.includes(s.id)) return true;
            if (Array.isArray(s.teacherIds) && s.teacherIds.includes(user?.uid)) return true;
            return false;
        });

        // Fallback: If no explicit assignment mapping exists, return all subjects
        return assignedSubjects.length > 0 ? assignedSubjects : subjects;
    }, [subjects, classes, timetable, role, user?.uid, classId]);

    // Subject selection auto-reset for all roles
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

    // Auto-populate existing scores and remarks when rawAssessments, assessmentType, or assessmentName changes
    useEffect(() => {
        if (!rawAssessments || rawAssessments.length === 0) {
            setScores({});
            setRemarks({});
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

            setScores(loadedScores);
            setRemarks(loadedRemarks);
            if (loadedMax) setMaxScore(loadedMax);
        } else {
            setScores({});
            setRemarks({});
        }
    }, [rawAssessments, assessmentType, assessmentName]);

    const handleScoreChange = (studentId: string, val: string) => {
        const num = val === '' ? '' : Number(val);
        setScores(prev => ({ ...prev, [studentId]: num }));
    };

    const handleSaveBatch = async () => {
        if (!firestore || !user || !schoolId || !classId || !subjectId) return;

        // Validation for values exceeding max score
        const parsedMaxScore = Number(maxScore);
        if (isNaN(parsedMaxScore) || parsedMaxScore <= 0) {
            toast({ variant: 'destructive', title: "Invalid Max Score", description: "Please enter a valid Maximum Score greater than 0." });
            return;
        }

        const invalidEntry = Object.entries(scores).find(([_, score]) => score !== '' && score !== null && !isNaN(Number(score)) && Number(score) > parsedMaxScore);
        if (invalidEntry) {
            const invalidStudent = students?.find(s => s.uid === invalidEntry[0]);
            const studentName = invalidStudent ? `${invalidStudent.firstName} ${invalidStudent.lastName}`.trim() : 'A student';
            toast({ 
                variant: 'destructive', 
                title: "Score Exceeds Maximum", 
                description: `${studentName}'s score (${invalidEntry[1]}) exceeds the Maximum Score (${parsedMaxScore}). Please correct it before saving.` 
            });
            return;
        }

        setIsSaving(true);
        try {
            const batch = writeBatch(firestore);
            
            // Purge existing assessments of this same specific name to avoid duplicate values for that test/exam
            const targetName = assessmentName || assessmentType;
            const existingDocs = rawAssessments?.filter((a: any) => (a.assessmentName || a.assessmentType) === targetName) || [];
            existingDocs.forEach((docData: any) => {
                const ref = doc(firestore, 'assessments', docData.id);
                batch.delete(ref);
            });

            let count = 0;
            const updatedStudentIds: string[] = []; 

            Object.entries(scores).forEach(([studentId, score]) => {
                if (score !== '' && score !== null && !isNaN(Number(score))) {
                    const student = students?.find(s => s.uid === studentId);
                    const studentName = `${student?.firstName || ''} ${student?.lastName || ''}`.trim();
                    const subjectName = subjects?.find((sub: any) => sub.id === subjectId)?.name || 'Subject';
                    const className = classes?.find((c: any) => c.id === classId)?.name || null;
                    
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
                        teacherRemark: remarks[studentId] || "", 
                        createdAt: serverTimestamp(),
                        assessmentDate: serverTimestamp()
                    });

                    // Log to timeline
                    TimelineService.logEventBatch(firestore, batch, {
                        studentId,
                        title: `Graded: ${assessmentType}`,
                        description: `Scored ${score}/${maxScore} in ${subjectName}.${remarks[studentId] ? ' Remark: "' + remarks[studentId] + '"' : ''}`,
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
                            remark: remarks[studentId] || ''
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

            setScores({});
            setRemarks({});
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
            const className = classes?.find((c: any) => c.id === classId)?.name || 'Class';
            const subjectName = subjects?.find((s: any) => s.id === subjectId)?.name || 'Subject';
            
            const scoresData = students?.map((s: any) => ({
                studentName: `${s.firstName} ${s.lastName}`,
                score: scores[s.uid] ?? ''
            })) || [];

            const res = await generateClassInsightsAction(schoolId, className, subjectName, scoresData, maxScore);
            
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

    return (
        <div className="p-6 space-y-6">
            {/* Premium Gradient Header Banner */}
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
                            <Badge className="bg-indigo-800 text-indigo-150 uppercase tracking-widest font-black text-[9px] py-1 px-2.5 rounded-full border border-indigo-700/50">
                                Batch Mode
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                            Batch Entry & Management
                        </h1>
                        <p className="text-indigo-200 text-lg max-w-xl font-light">
                            Batch enter continuous assessments and manage past classroom records in one visual panel.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {role !== 'Student' && role !== 'Parent' && (
                            <CreditBalance />
                        )}
                    </div>
                </div>
            </div>

            {/* Assessment Details Filter Form */}
            <Card className="border border-slate-100 shadow-md rounded-[2.2rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-50 bg-slate-50/20 p-6">
                    <CardTitle className="text-lg font-black text-slate-800">Roster Filters</CardTitle>
                    <CardDescription className="text-slate-400">Specify details to retrieve the correct grading roster.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 p-6 bg-white">
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear} disabled={role === 'Teacher'}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
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
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
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
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
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
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue placeholder="Select Subject">
                                    {visibleSubjects?.find((s: any) => s.id === subjectId)?.name}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {visibleSubjects?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Assessment Type</Label>
                        <Select value={assessmentType} onValueChange={setAssessmentType}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
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
                </CardContent>
            </Card>

            {classId && subjectId ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Score Roster Card */}
                    <Card className="shadow-lg border border-slate-100 rounded-[2.2rem] overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/10 p-6 flex-wrap gap-4">
                            <div>
                                <CardTitle className="text-lg font-black text-slate-800">Score Entry Roster</CardTitle>
                                <CardDescription className="text-slate-400">Input marks for current students. Unfilled lines will be skipped.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="border-purple-200 text-purple-755 bg-purple-50 hover:bg-purple-100/70 rounded-xl font-bold text-xs"
                                    onClick={handleGenerateClassInsights}
                                    disabled={isSaving || isGeneratingInsights}
                                >
                                    <Sparkles className="mr-2 h-4 w-4 text-purple-650" /> AI Insights (5 credits)
                                </Button>
                                <Button 
                                    onClick={handleSaveBatch} 
                                    disabled={isSaving || isGlobalLoading} 
                                    className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white shadow transition-all h-10 px-6 text-sm"
                                >
                                    {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                                    {isGlobalLoading ? 'Authenticating...' : 'Save All Scores'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 px-6">
                            {loadingStudents ? (
                                <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Loader2 className="animate-spin h-10 w-10 text-indigo-600"/>
                                    <p className="font-semibold text-sm">Loading roster...</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-150">
                                            <TableHead className="font-bold text-slate-700">Student Name</TableHead>
                                            <TableHead className="w-[120px] sm:w-[180px] min-w-[120px] font-bold text-slate-700">Score (/{maxScore})</TableHead>
                                            <TableHead className="font-bold text-slate-700">Teacher Remark (Optional)</TableHead>
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
                                        {students?.map((s: any) => {
                                            const currentScore = scores[s.uid];
                                            const isOverLimit = currentScore !== undefined && currentScore !== '' && Number(currentScore) > maxScore;
                                            
                                            // Extract initials
                                            const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();

                                            return (
                                                <TableRow key={s.uid} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100">
                                                    <TableCell className="font-semibold text-slate-800">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-100 shadow-sm">
                                                                {initials}
                                                            </div>
                                                            <span>{s.firstName} {s.lastName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="min-w-[120px]">
                                                        <div className="relative">
                                                            <Input 
                                                                type="number" 
                                                                min="0" 
                                                                max={maxScore}
                                                                value={scores[s.uid] ?? ''} 
                                                                onChange={e => handleScoreChange(s.uid, e.target.value)}
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
                                                    <TableCell>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="e.g. Solid understanding, excellent work"
                                                            value={remarks[s.uid] ?? ''} 
                                                            onChange={e => setRemarks(prev => ({ ...prev, [s.uid]: e.target.value }))}
                                                            className="rounded-xl border border-slate-200 focus-visible:ring-indigo-500 h-10 shadow-sm text-sm text-slate-700"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Existing Batches Records */}
                    {Object.keys(groupedAssessments).length > 0 && (
                        <Card className="border border-orange-100 shadow-md rounded-[2.2rem] overflow-hidden bg-white">
                            <CardHeader className="bg-orange-50/20 border-b border-orange-50/60 p-6">
                                <CardTitle className="text-orange-900 flex items-center gap-2 font-black text-lg">
                                    <History className="h-5 w-5 text-orange-650"/> Existing Batches for Context
                                </CardTitle>
                                <CardDescription className="text-orange-950/40">Select an existing entry below to edit individual student marks or delete the batch if needed.</CardDescription>
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
                                                            setAssessmentType(type);
                                                            setAssessmentName(type);
                                                            window.scrollTo({ top: 350, behavior: 'smooth' });
                                                            toast({
                                                                title: `Loaded ${type}`,
                                                                description: "Modifications ready! Edit individual student scores above and click 'Save All Scores'."
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
                                                                    This will erase all {records.length} recorded student marks for category <strong>{type}</strong>. This operational action is irreversible.
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

            {/* AI Smart Insights Dialog */}
            <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
                <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col rounded-[2rem] border-0 shadow-2xl p-6 overflow-hidden">
                    <DialogHeader className="border-b border-slate-100 pb-4">
                        <DialogTitle className="flex items-center gap-2 text-purple-700 font-black text-xl">
                            <Sparkles className="h-5 w-5 animate-pulse text-purple-650" /> Class Assessment Insights
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

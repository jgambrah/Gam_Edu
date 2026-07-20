'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { collection, query, where, writeBatch, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileSpreadsheet, Trash2, History, Sparkles } from 'lucide-react';
import { notifyParents } from '@/app/actions/notifications';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
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
      (firestore && schoolId && role === 'Teacher')
        ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
        : null, 
    [firestore, schoolId, role]);
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
        if (!subjects) return [];
        if (role !== 'Teacher') return subjects;
        if (!classId) return [];
        
        const assignedSubjectIds = timetable?.filter((t: any) => t.teacherId === user?.uid && t.classId === classId).map((t: any) => t.subjectId) || [];
        return subjects.filter((s: any) => assignedSubjectIds.includes(s.id));
    }, [subjects, timetable, role, user?.uid, classId]);

    // Subject selection auto-reset for teachers
    useEffect(() => {
        if (role === 'Teacher' && classId && visibleSubjects.length > 0) {
            const isValid = visibleSubjects.some((s: any) => s.id === subjectId);
            if (!isValid) {
                setSubjectId(visibleSubjects[0]?.id || '');
            }
        }
    }, [classId, visibleSubjects, subjectId, role]);

    // Fetch the entire class roster
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

    // Fetch existing entries for the selected context
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

    // Group assessments for the management list
    const groupedAssessments = useMemo(() => {
        if (!rawAssessments) return {};
        const groups: Record<string, any[]> = {};
        rawAssessments.forEach(a => {
            if (!groups[a.assessmentType]) groups[a.assessmentType] = [];
            groups[a.assessmentType].push(a);
        });
        return groups;
    }, [rawAssessments]);

    const handleScoreChange = (studentId: string, val: string) => {
        const num = val === '' ? '' : Number(val);
        if (typeof num === 'number' && num > maxScore) return; 
        setScores(prev => ({ ...prev, [studentId]: num }));
    };

    const handleSaveBatch = async () => {
        if (!firestore || !user || !schoolId || !classId || !subjectId) return;

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
            
            toast({ title: "Success", description: `Saved ${count} scores successfully.` });
            
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
            toast({ title: "Deleted", description: `Removed ${docsToDelete.length} scores for ${typeToDelete}.` });
            if (refetchAssessments) refetchAssessments();

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to delete scores." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateInsights = async () => {
        if (!schoolId || !classId || !subjectId) return;
        setIsGeneratingInsights(true);
        setInsightsText(null);
        setIsInsightsOpen(true);

        try {
            const className = classes?.find((c: any) => c.id === classId)?.name || 'Class';
            const subjectName = subjects?.find((s: any) => s.id === subjectId)?.name || 'Subject';
            
            // Format scores for the AI
            const scoresData = students?.map((s: any) => ({
                studentName: `${s.firstName} ${s.lastName}`,
                score: scores[s.uid] ?? ''
            })) || [];

            const res = await generateClassInsightsAction(schoolId, className, subjectName, scoresData, maxScore);
            
            if (res.success && res.text) {
                setInsightsText(res.text);
            } else {
                toast({ variant: 'destructive', title: "AI Error", description: res.error });
                setIsInsightsOpen(false);
            }
        } catch (e) {
            console.error(e);
            setIsInsightsOpen(false);
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    const isGlobalLoading = isUserLoading || schoolLoading;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileSpreadsheet className="text-blue-600"/> Gradebook Entry
                </h1>
                <p className="text-muted-foreground">Batch enter continuous assessments and exam scores.</p>
            </div>

            <Card className="border-t-4 border-t-blue-600 shadow-sm">
                <CardHeader>
                    <CardTitle>Assessment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear} disabled={role === 'Teacher'}>
                            <SelectTrigger className="bg-white border-2">
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
                        <Label>Term</Label>
                        <Select value={term} onValueChange={setTerm} disabled={role === 'Teacher'}>
                            <SelectTrigger className="bg-white border-2">
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
                        <Label>Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="bg-white border-2"><SelectValue placeholder="Select Class"/></SelectTrigger>
                            <SelectContent>
                                {visibleClasses?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select value={subjectId} onValueChange={setSubjectId}>
                            <SelectTrigger className="bg-white border-2"><SelectValue placeholder="Select Subject"/></SelectTrigger>
                            <SelectContent>
                                {visibleSubjects?.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={assessmentType} onValueChange={setAssessmentType}>
                            <SelectTrigger className="bg-white border-2"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {ASSESSMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Assessment Title</Label>
                        <Input 
                            type="text" 
                            value={assessmentName} 
                            onChange={e => setAssessmentName(e.target.value)} 
                            placeholder="e.g. Test 1, Theory Exam"
                            className="bg-white border-2" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Max Score</Label>
                        <Input type="number" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} className="bg-white border-2" />
                    </div>
                </CardContent>
            </Card>

            {classId && subjectId ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                            <div>
                                <CardTitle>Student Roster</CardTitle>
                                <CardDescription>Enter marks for the selected class and subject.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
                                    onClick={handleGenerateInsights}
                                    disabled={isSaving || isGeneratingInsights}
                                >
                                    <Sparkles className="mr-2 h-4 w-4" /> AI Insights
                                </Button>
                                <Button 
                                    onClick={handleSaveBatch} 
                                    disabled={isSaving || isGlobalLoading} 
                                    className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold"
                                >
                                    {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                                    {isGlobalLoading ? 'Authenticating...' : 'Save All Scores'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {loadingStudents ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead className="w-[100px] sm:w-[150px] min-w-[100px]">Score (/{maxScore})</TableHead>
                                            <TableHead>Teacher Remark (Optional)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No active students in this class.</TableCell></TableRow>}
                                        {students?.map((s:any) => (
                                            <TableRow key={s.uid}>
                                                <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                                                <TableCell className="min-w-[100px]">
                                                    <div className="relative">
                                                        <Input 
                                                            type="number" 
                                                            min="0" max={maxScore}
                                                            value={scores[s.uid] ?? ''} 
                                                            onChange={e => handleScoreChange(s.uid, e.target.value)}
                                                            className={`font-bold w-24 sm:w-full pr-3 sm:pr-10 ${Number(scores[s.uid]) > maxScore ? 'border-red-500 text-red-500' : ''}`}
                                                        />
                                                        <span className="hidden sm:inline absolute right-3 top-2 text-[10px] text-muted-foreground uppercase font-bold">PTS</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        type="text" 
                                                        placeholder="e.g. Excellent progress"
                                                        value={remarks[s.uid] ?? ''} 
                                                        onChange={e => setRemarks(prev => ({ ...prev, [s.uid]: e.target.value }))}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* RENDER EXISTING ENTRIES */}
                    {Object.keys(groupedAssessments).length > 0 && (
                        <Card className="border-t-4 border-t-orange-400 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-orange-800 flex items-center gap-2">
                                    <History className="h-5 w-5"/> Existing Entries for this Class
                                </CardTitle>
                                <CardDescription>If you made a mistake, delete the batch here and re-enter the scores above.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingAssessments ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500"/></div> : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(groupedAssessments).map(([type, records]) => (
                                            <div key={type} className="flex flex-col justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm group">
                                                <div className="mb-4">
                                                    <Badge variant="outline" className="bg-white border-orange-200 text-orange-700 font-black mb-2 uppercase text-[10px]">
                                                        {type}
                                                    </Badge>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {records.length} students graded.
                                                    </p>
                                                </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm" 
                                                            disabled={isSaving}
                                                            className="w-full rounded-xl"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Batch
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Batch: {type}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the scores for all {records.length} students in this category. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteBatch(type)} className="bg-red-600 hover:bg-red-700">
                                                                Yes, Delete All
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <div className="p-20 text-center text-muted-foreground border-4 border-dashed rounded-[2.5rem] bg-slate-50 flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-full shadow-sm">
                        <FileSpreadsheet className="h-12 w-12 text-slate-300" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-600">Gradebook Ready</p>
                        <p className="text-sm">Please select a Class and Subject to load the student roster.</p>
                    </div>
                </div>
            )}

            <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-purple-700">
                            <Sparkles className="h-5 w-5" /> Smart Class Insights
                        </DialogTitle>
                        <DialogDescription>
                            AI analysis based on the current scores entered in the roster.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto pr-2 mt-4">
                        {isGeneratingInsights ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                                <p className="text-purple-600 font-medium">Analyzing student performance...</p>
                                <p className="text-xs text-muted-foreground">This costs 5 AI credits.</p>
                            </div>
                        ) : (
                            <div className="prose prose-sm prose-purple max-w-none">
                                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
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

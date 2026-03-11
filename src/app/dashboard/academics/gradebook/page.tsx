'use client';

import { useState, useMemo } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ASSESSMENT_TYPES = [
    'Class Exercise (CA)', 
    'Homework (CA)', 
    'Project (CA)', 
    'Mid-Term (CA)', 
    'End of Term Exam (Exam)'
];

export default function GradebookPage() {
    const { user } = useAuth();
    const { role, loading: roleLoading } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();
    const router = useRouter();

    // State for filtering
    const [classId, setClassId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [term, setTerm] = useState('First Term');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [assessmentType, setAssessmentType] = useState(ASSESSMENT_TYPES[0]);
    const [maxScore, setMaxScore] = useState(100);

    // State for scores: { studentId: score }
    const [scores, setScores] = useState<Record<string, number | ''>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Role Guard
    useEffect(() => {
        if (!roleLoading && (role === 'Parent' || role === 'Student')) {
            router.replace('/dashboard/report-cards');
        }
    }, [role, roleLoading, router]);

    // Data Fetching
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<any>(classesQuery);

    const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: subjects } = useCollection<any>(subjectsQuery);

    const studentsQuery = useMemoFirebase(() => (firestore && schoolId && classId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)) : null, [firestore, schoolId, classId]);
    const { data: students, isLoading: loadingStudents } = useCollection<any>(studentsQuery);

    const handleScoreChange = (studentId: string, val: string) => {
        const num = val === '' ? '' : Number(val);
        if (typeof num === 'number' && num > maxScore) return; // Prevent over-scoring
        setScores(prev => ({ ...prev, [studentId]: num }));
    };

    const handleSaveBatch = async () => {
        if (!firestore || !schoolId || !user) return;
        if (!classId || !subjectId) {
            toast({ variant: 'destructive', title: "Error", description: "Select Class and Subject." });
            return;
        }

        setIsSaving(true);
        try {
            const batch = writeBatch(firestore);
            let count = 0;

            const subjectName = subjects?.find(s => s.id === subjectId)?.name || 'Unknown Subject';

            Object.entries(scores).forEach(([studentId, score]) => {
                if (score !== '') {
                    const newAssessmentRef = doc(collection(firestore, 'assessments'));
                    batch.set(newAssessmentRef, {
                        studentId,
                        classId,
                        subjectId,
                        subjectName, // Added for consistency with other assessment logs
                        schoolId, // SAAS requirement
                        teacherId: user.uid,
                        term,
                        academicYear,
                        assessmentType,
                        assessmentName: `${assessmentType} - ${format(new Date(), 'dd/MM/yy')}`, // Added required field
                        assessmentDate: serverTimestamp(), // Use server timestamp for accuracy
                        score: Number(score),
                        maxScore: Number(maxScore),
                        createdAt: serverTimestamp(),
                        gradedAt: serverTimestamp(),
                    });
                    count++;
                }
            });

            if (count === 0) {
                toast({ variant: 'destructive', title: "Empty", description: "No scores entered." });
                setIsSaving(false);
                return;
            }

            await batch.commit();
            toast({ title: "Success", description: `Saved ${count} scores successfully.` });
            
            // Clear scores for next entry
            setScores({});

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (roleLoading || schoolLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const isStaff = ['Teacher', 'Administrator', 'Director', 'Accountant'].includes(role || '');

    if (!isStaff) {
        return (
             <div className="p-6 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>
                            The full gradebook management system is for school staff only. 
                            Students and parents can view finalized results in the "Report Cards" section.
                        </CardDescription>
                    </CardHeader>
                </Card>
             </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2"><FileSpreadsheet className="text-blue-600"/> Gradebook Entry</h1>
                <p className="text-muted-foreground">Batch enter continuous assessments and exam scores.</p>
            </div>

            <Card className="border-t-4 border-t-blue-600 shadow-sm">
                <CardHeader>
                    <CardTitle>Assessment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Input value={academicYear} onChange={e => setAcademicYear(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Term</Label>
                        <Select value={term} onValueChange={setTerm}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="First Term">First Term</SelectItem>
                                <SelectItem value="Second Term">Second Term</SelectItem>
                                <SelectItem value="Third Term">Third Term</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger>
                            <SelectContent>
                                {classes?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select value={subjectId} onValueChange={setSubjectId}>
                            <SelectTrigger><SelectValue placeholder="Select Subject"/></SelectTrigger>
                            <SelectContent>
                                {subjects?.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={assessmentType} onValueChange={setAssessmentType}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {ASSESSMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Max Score</Label>
                        <Input type="number" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} />
                    </div>
                </CardContent>
            </Card>

            {classId && subjectId ? (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student Roster</CardTitle>
                        <Button onClick={handleSaveBatch} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                            {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                            Save All Scores
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loadingStudents ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead className="w-[150px]">Score (/{maxScore})</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students?.length === 0 && <TableRow><TableCell colSpan={2} className="text-center">No students in this class.</TableCell></TableRow>}
                                    {students?.map((s:any) => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    min="0" 
                                                    max={maxScore}
                                                    value={scores[s.uid] ?? ''} 
                                                    onChange={e => handleScoreChange(s.uid, e.target.value)}
                                                    className={`font-bold ${Number(scores[s.uid]) > maxScore ? 'border-red-500 text-red-500' : ''}`}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                    Please select a Class and Subject to load the roster.
                </div>
            )}
        </div>
    );
}

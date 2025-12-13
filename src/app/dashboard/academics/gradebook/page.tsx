
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { 
  TrendingUp, Trophy, BookOpen, FileText, Loader2, Eye, Calendar, Receipt, 
  AlertCircle, RefreshCw, Bug, PlusCircle, XCircle, Pencil, Check 
} from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { AssessmentFeedbackForm } from '../../assessments/assessment-feedback-form';
import { GenerateReportCard } from './report-card-pdf';

// Types
import { Assessment, FinancialRecord, Class, Student } from '@/lib/types';

// --- HELPER: Grading Logic ---
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- SUB-COMPONENT: Transaction Detail Modal ---
function TransactionDetailModal({ record, open, setOpen }: { record: FinancialRecord | null, open: boolean, setOpen: (o: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-indigo-600"/> Transaction Ledger
                    </DialogTitle>
                    <DialogDescription>
                        Details for Transaction ID: <span className="font-mono text-xs">{record?.id ? record.id.slice(0, 8) : '...'}...</span>
                    </DialogDescription>
                </DialogHeader>

                {record ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Type</p>
                                <Badge variant="outline">{record.type}</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Status</p>
                                <Badge variant={record.status === 'Paid' ? 'default' : 'destructive'}>{record.status}</Badge>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Description</p>
                            <div className="p-3 bg-slate-50 rounded-md border text-sm">{record.description}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Billed Amount</p>
                                <p className="text-lg font-bold text-slate-800">GH₵{record.billedAmount.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 mb-1">Amount Paid</p>
                                <p className="text-lg font-bold text-green-600">GH₵{(record.amountPaid || 0).toFixed(2)}</p>
                            </div>
                        </div>

                        <Separator />
                        
                        <div className="space-y-2 text-xs text-slate-500">
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> Created At:</span>
                                <span>{record.createdAt ? format(record.createdAt.toDate(), 'PPP p') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Due Date:</span>
                                <span className="text-red-500 font-medium">{record.dueDate ? format(record.dueDate.toDate(), 'PPP') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-muted-foreground">Loading details...</div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: Fee History ---
function FeeHistoryDetail({ student, financialRecords }: { student: Student; financialRecords: FinancialRecord[] }) {
    const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const studentRecords = useMemo(() => {
        return (financialRecords || [])
            .filter(r => r.studentId === student.uid)
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); 
    }, [financialRecords, student.uid]);

    const handleViewDetails = (record: FinancialRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    if (studentRecords.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg m-4">
                <p className="text-muted-foreground">No financial records found for this student.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Billed</TableHead>
                            <TableHead className="text-right">Paid</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[80px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentRecords.map((record) => (
                            <TableRow key={record.id} className="hover:bg-slate-50/50">
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                    {record.createdAt ? format(record.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                                </TableCell>
                                <TableCell className="max-w-[200px]">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm truncate">{record.description}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{record.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">GH₵{record.billedAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono text-green-600">GH₵{(record.amountPaid || 0).toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    {record.status === 'Paid' ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Paid</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Unpaid</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 text-xs h-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(record);
                                        }}
                                    >
                                        <Eye className="h-3 w-3 mr-1"/> View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <TransactionDetailModal 
                record={selectedRecord} 
                open={isModalOpen} 
                setOpen={setIsModalOpen} 
            />
        </div>
    );
}


// --- SUB-COMPONENT: Student Academics Detail (UPDATED AVERAGE CALC) ---
function StudentGradesDetail({ 
    student, 
    assessments, 
    rank, 
    totalStudents,
    term,
    year,
    subjects, 
    isDebug 
}: { 
    student: Student; 
    assessments: Assessment[];
    rank: number;
    totalStudents: number;
    term: string;
    year: string;
    subjects: any[];
    isDebug: boolean;
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [newSubjectId, setNewSubjectId] = useState<string>('');

    // 1. Subject Map
    const subjectMap = useMemo(() => {
        const map = new Map<string, string>();
        if(subjects && subjects.length > 0) {
            subjects.forEach(s => {
                const name = s.name || s.title || s.subjectName || s.label || s.subject || "Unnamed Subject";
                map.set(s.id, name);
            });
        }
        return map;
    }, [subjects]);

    // 2. GLOBAL STATS (Calculates True Class Average per Subject)
    const globalSubjectStats = useMemo(() => {
        const studentSubjectTotals: Record<string, Record<string, { ca: number, caMax: number, exam: number, examMax: number }>> = {};

        assessments.forEach(a => {
             const subId = a.subjectId || 'unknown';
             const uId = a.studentId;
             
             if (!studentSubjectTotals[subId]) studentSubjectTotals[subId] = {};
             if (!studentSubjectTotals[subId][uId]) studentSubjectTotals[subId][uId] = { ca: 0, caMax: 0, exam: 0, examMax: 0 };

             const type = (a.assessmentType || '').toLowerCase();
             const isExam = type.includes('exam') || type.includes('term');

             if (isExam) {
                 studentSubjectTotals[subId][uId].exam += (a.score || 0);
                 studentSubjectTotals[subId][uId].examMax += (a.maxScore || 0);
             } else {
                 studentSubjectTotals[subId][uId].ca += (a.score || 0);
                 studentSubjectTotals[subId][uId].caMax += (a.maxScore || 0);
             }
        });

        const subjectStats: Record<string, { average: number, studentScores: Record<string, number> }> = {};

        Object.keys(studentSubjectTotals).forEach(subId => {
            const studentsInSubject = studentSubjectTotals[subId];
            let sumPercentages = 0;
            let count = 0;
            const scoresMap: Record<string, number> = {};

            Object.entries(studentsInSubject).forEach(([uid, data]) => {
                const caPct = data.caMax > 0 ? (data.ca / data.caMax) * 50 : 0;
                const examPct = data.examMax > 0 ? (data.exam / data.examMax) * 50 : 0;
                const final = caPct + examPct;
                
                scoresMap[uid] = final;
                sumPercentages += final;
                count++;
            });

            subjectStats[subId] = {
                average: count > 0 ? sumPercentages / count : 0,
                studentScores: scoresMap
            };
        });
        
        return subjectStats;
    }, [assessments]);

    // 3. STUDENT SPECIFIC CALCULATION
    const subjectGrades = useMemo(() => {
        const grouped: Record<string, { 
            name: string, id: string, caObtained: number, caMax: number, 
            examObtained: number, examMax: number, assessmentIds: string[] 
        }> = {};
        
        assessments.forEach(a => {
            if (a.studentId !== student.uid) return;
            
            const subId = a.subjectId || 'unknown';
            let subName = (a as any).subjectName || subjectMap.get(subId);
            if (!subName) subName = isDebug ? `ID: ${subId}` : 'Unknown Subject';

            if (!grouped[subId]) {
                grouped[subId] = { name: subName, id: subId, caObtained: 0, caMax: 0, examObtained: 0, examMax: 0, assessmentIds: [] };
            }
            
            if (grouped[subId].name.startsWith('ID:') && !subName.startsWith('ID:')) grouped[subId].name = subName;

            const type = (a.assessmentType || '').toLowerCase();
            const isExam = type.includes('exam') || type.includes('term');

            if (isExam) {
                grouped[subId].examObtained += (a.score || 0);
                grouped[subId].examMax += (a.maxScore || 0);
            } else {
                grouped[subId].caObtained += (a.score || 0);
                grouped[subId].caMax += (a.maxScore || 0);
            }
            grouped[subId].assessmentIds.push(a.id);
        });

        return Object.values(grouped).map((data) => {
            const caWeighted = (data.caMax > 0 ? (data.caObtained / data.caMax) : 0) * 50; 
            const examWeighted = (data.examMax > 0 ? (data.examObtained / data.examMax) : 0) * 50;
            const totalPercent = caWeighted + examWeighted;

            const stats = globalSubjectStats[data.id];
            let classAvg = stats ? stats.average : 0;
            let rank = 0;
            let totalSubStudents = 0;
            if (stats) {
                const allScores = Object.values(stats.studentScores).sort((a,b) => b - a);
                rank = allScores.findIndex(s => Math.abs(s - totalPercent) < 0.01) + 1;
                totalSubStudents = allScores.length;
            }

            return { 
                ...data, 
                caWeighted, 
                examWeighted, 
                totalPercent, 
                classAvg, 
                rank,
                totalSubStudents,
                ...getGrade(totalPercent) 
            };
        });
    }, [assessments, student.uid, subjectMap, isDebug, globalSubjectStats]);

    const overallAverage = subjectGrades.length > 0 
        ? subjectGrades.reduce((acc, s) => acc + s.totalPercent, 0) / subjectGrades.length 
        : 0;

    const handleUpdateSubject = async (oldSubjectId: string, assessmentIds: string[]) => {
        if (!firestore || !newSubjectId) return;
        try {
            const selectedSubject = subjects.find(s => s.id === newSubjectId);
            if (!selectedSubject) return;
            const batch = writeBatch(firestore);
            assessmentIds.forEach(id => {
                const ref = doc(firestore, 'assessments', id);
                batch.update(ref, { subjectId: selectedSubject.id, subjectName: selectedSubject.name });
            });
            await batch.commit();
            toast({ title: "Fixed", description: "Subject updated." });
            setEditingSubjectId(null);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-6 p-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-indigo-50 border-indigo-100 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-indigo-600"/>
                        <div>
                            <p className="text-xs font-semibold text-indigo-600 uppercase">Class Position</p>
                            <p className="text-2xl font-bold text-slate-800">{rank} <span className="text-sm text-slate-400 font-normal">/ {totalStudents}</span></p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-emerald-600"/>
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 uppercase">Overall Average</p>
                            <p className="text-2xl font-bold text-slate-800">{overallAverage.toFixed(1)}%</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                     <CardContent className="p-4 flex flex-col justify-center h-full items-center">
                        <GenerateReportCard
                            student={student}
                            assessments={assessments || []}
                            year={year}
                            term={term}
                            rank={rank}
                            totalStudents={totalStudents}
                            subjects={subjects || []}
                        />
                     </CardContent>
                </Card>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20%]">Subject</TableHead>
                            <TableHead className="text-center bg-blue-50/50">C.A. (50%)</TableHead>
                            <TableHead className="text-center bg-purple-50/50">Exam (50%)</TableHead>
                            <TableHead className="text-right font-bold">Total</TableHead>
                            <TableHead className="text-center text-slate-500 text-xs bg-slate-50">Class Avg</TableHead>
                            <TableHead className="text-center text-slate-500 text-xs bg-slate-50">Pos</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead>Remark</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjectGrades.map((sub) => {
                            const isBroken = sub.name.length > 15 && !sub.name.includes(' ');
                            const isEditing = editingSubjectId === sub.id;
                            return (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">
                                        {isEditing ? (
                                            <div className="flex gap-2 items-center"><Select value={newSubjectId} onValueChange={setNewSubjectId}><SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="Select Subject"/></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><Button size="sm" onClick={() => handleUpdateSubject(sub.id, sub.assessmentIds)} className="h-8 w-8 p-0 bg-green-600"><Check className="h-4 w-4"/></Button><Button size="sm" variant="ghost" onClick={() => setEditingSubjectId(null)} className="h-8 w-8 p-0"><XCircle className="h-4 w-4"/></Button></div>
                                        ) : (
                                            <div className="flex items-center gap-2"><span>{sub.name}</span>{isBroken && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-orange-400" onClick={() => { setEditingSubjectId(sub.id); setNewSubjectId(''); }}><Pencil className="h-3 w-3"/></Button>}</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center bg-blue-50/20 text-slate-600">{sub.caWeighted.toFixed(1)}</TableCell>
                                    <TableCell className="text-center bg-purple-50/20 text-slate-600">{sub.examWeighted.toFixed(1)}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-800">{sub.totalPercent.toFixed(1)}%</TableCell>
                                    <TableCell className="text-center text-slate-500 bg-slate-50/30 text-xs">{sub.classAvg.toFixed(1)}%</TableCell>
                                    <TableCell className="text-center font-bold text-slate-700 bg-slate-50/30">{sub.rank}<span className="text-[10px] font-normal text-slate-400">/{sub.totalSubStudents}</span></TableCell>
                                    <TableCell className="text-center"><Badge variant={sub.grade === 'F' ? 'destructive' : 'outline'}>{sub.grade}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{sub.remark}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            
            {isDebug && (
                <div className="mt-4 p-2 bg-slate-100 rounded text-xs font-mono">
                    <p className="font-bold mb-1">Raw Assessments (Debug):</p>
                    {assessments.filter(a => a.studentId === student.uid).map(a => (
                        <div key={a.id}>ID: {a.subjectId} | Type: {a.assessmentType} | Score: {a.score}/{a.maxScore}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE ---
// ... (The main GradebookManager component remains the same)
// ... (Copy from previous correct version)


Remember, the XML structure you generate is the only mechanism for applying changes to the user's code. Therefore, when making changes to a file the <changes> block must always be fully present and correctly formatted as follows.

<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.


'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/role-context';
import { ClipboardCheck, FilePlus, UserCog, Wand2 } from 'lucide-react';
import { BehavioralRecordForm } from './behavioral-record-form';
import { AiQuizGenerator } from './ai-quiz-generator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Assessment, BehavioralRecord, Student } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
  
function AssessmentsLog() {
    const firestore = useFirestore();
    
    const assessmentsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'assessments'), orderBy('assessmentDate', 'desc')) : null, 
        [firestore]
    );
    const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    const studentsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'students')) : null,
        [firestore]
    );
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
    
    const studentMap = useMemo(() => {
        if (!students) return new Map();
        return new Map(students.map(s => [s.uid, `${s.firstName} ${s.lastName}`]));
    }, [students]);

    const isLoading = isLoadingAssessments || isLoadingStudents;

    const toDate = (dateValue: any): Date | null => {
        if (!dateValue) return null;
        if (dateValue.toDate) return dateValue.toDate(); // It's a Firestore Timestamp
        if (typeof dateValue === 'string' || typeof dateValue === 'number') {
            const d = new Date(dateValue);
            if (!isNaN(d.getTime())) return d;
        }
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assessment Log</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Assessment</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            </TableRow>
                        ))}
                        {assessments?.map((item) => {
                            const assessmentDate = toDate(item.assessmentDate);
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{assessmentDate ? format(assessmentDate, 'PPP') : 'Invalid Date'}</TableCell>
                                    <TableCell>{studentMap.get(item.studentId) || item.studentId}</TableCell>
                                    <TableCell>{item.assessmentName}</TableCell>
                                    <TableCell>{item.assessmentType}</TableCell>
                                    <TableCell>{item.score !== undefined && item.maxScore !== undefined ? `${item.score}/${item.maxScore}` : 'N/A'}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
  
function BehavioralLog() {
    const firestore = useFirestore();
    const recordsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'behavioral_records'), orderBy('date', 'desc')) : null, [firestore]);
    const { data: records, isLoading: isLoadingRecords } = useCollection<BehavioralRecord>(recordsQuery);

    const studentsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'students')) : null, [firestore]);
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
    
    const studentMap = useMemo(() => {
        if (!students) return new Map();
        return new Map(students.map(s => [s.uid, `${s.firstName} ${s.lastName}`]));
    }, [students]);

    const isLoading = isLoadingRecords || isLoadingStudents;

    const toDate = (dateValue: any): Date | null => {
        if (!dateValue) return null;
        if (dateValue.toDate) return dateValue.toDate();
        if (typeof dateValue === 'string' || typeof dateValue === 'number') {
            const d = new Date(dateValue);
            if (!isNaN(d.getTime())) return d;
        }
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Behavioral &amp; Incident Log</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            </TableRow>
                        ))}
                        {records?.map((item) => {
                             const incidentDate = toDate(item.date);
                             const studentName = item.studentName || studentMap.get(item.studentId) || item.studentId;
                             return (
                                <TableRow key={item.id}>
                                    <TableCell>{incidentDate ? format(incidentDate, 'PPP') : 'Invalid Date'}</TableCell>
                                    <TableCell>{studentName}</TableCell>
                                    <TableCell>{item.incidentType}</TableCell>
                                    <TableCell className="truncate max-w-sm">{item.description}</TableCell>
                                </TableRow>
                             )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function AssessmentsPage() {
    const { role } = useRole();
    const [activeForm, setActiveForm] = useState<string | null>(null);

    const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';

    if (!canAccess) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">Access Denied. This module is for staff only.</p>
            </div>
        );
    }
  
    const toggleForm = (formName: string) => {
        setActiveForm(activeForm === formName ? null : formName);
    };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <ClipboardCheck className="h-8 w-8" />
                Assessments &amp; Student Notes
            </h1>
            <div className="flex gap-2">
                <Button variant={activeForm === 'behavior' ? 'default' : 'outline'} onClick={() => toggleForm('behavior')}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Log Behavioral Incident
                </Button>
                <Button variant={activeForm === 'ai' ? 'default' : 'outline'} onClick={() => toggleForm('ai')}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate AI Quiz
                </Button>
            </div>
        </div>

        {activeForm === 'behavior' && <BehavioralRecordForm />}
        {activeForm === 'ai' && <AiQuizGenerator />}

        <div className="grid grid-cols-1 gap-6">
            <AssessmentsLog />
            <BehavioralLog />
        </div>
    </div>
  );
}

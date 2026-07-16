'use client';

import { useState, useMemo, useEffect, Fragment } from 'react';
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
    GraduationCap, Info, FileSpreadsheet, RefreshCw, BookOpenCheck, UserCheck 
} from 'lucide-react';
import { Class, Subject, Student, Assessment } from '@/lib/types';
import Link from 'next/link';
import { useUser } from '@/firebase/provider';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { cn } from '@/lib/utils';

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
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    // Query Subjects
    const subjectsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess) return null;
        return query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess]);
    const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

    // Query Students (dependent on selectedClassId)
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !selectedClassId || !schoolId || isRoleLoading || !canAccess) return null;
        if (selectedClassId === 'all') {
            if (!isAdmin) return null;
            return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
        }
        return query(collection(firestore, 'students'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId));
    }, [firestore, selectedClassId, schoolId, isRoleLoading, canAccess, isAdmin]);
    const { data: rawStudents, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

    const students = useMemo(() => {
        if (!rawStudents) return [];
        return rawStudents.filter(s => s.enrollmentStatus !== 'Inactive');
    }, [rawStudents]);

    // Query Assessments for the selected class, filtered by academic year and term to reduce database reads
    const assessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !selectedClassId || !schoolId || isRoleLoading || !canAccess || !selectedYear || !selectedTerm) return null;
        if (selectedClassId === 'all') {
            if (!isAdmin) return null;
            return query(
                collection(firestore, 'assessments'), 
                where('schoolId', '==', schoolId),
                where('academicYear', '==', selectedYear),
                where('term', '==', selectedTerm)
            );
        }
        return query(
            collection(firestore, 'assessments'), 
            where('schoolId', '==', schoolId), 
            where('classId', '==', selectedClassId),
            where('academicYear', '==', selectedYear),
            where('term', '==', selectedTerm)
        );
    }, [firestore, selectedClassId, schoolId, isRoleLoading, canAccess, selectedYear, selectedTerm, isAdmin]);
    const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    // Fetch School Settings for standard weighting overrides
    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const CA_WEIGHT = schoolProfile?.caWeight ?? 30;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 70;

    const selectedClass = classes?.find(c => c.id === selectedClassId);
    const currentCaWeight = selectedClass?.caWeight ?? CA_WEIGHT;
    const currentExamWeight = selectedClass?.examWeight ?? EXAM_WEIGHT;

    // Filter assessments by Selected Term and Academic Year
    const classAssessments = useMemo(() => {
        if (!assessments) return [];
        return assessments.filter(a => a.academicYear === selectedYear && a.term === selectedTerm);
    }, [assessments, selectedYear, selectedTerm]);

    // Data Aggregation Engine (Aggregates assessments by student & subject)
    const getCategoryKey = (type: string) => {
        const t = (type || '').toLowerCase();
        if (t.includes('class exercise') || t.includes('class ex')) return 'classEx';
        if (t.includes('homework') || t.includes('h/w')) return 'hw';
        if (t.includes('project') || t.includes('proj')) return 'proj';
        if (t.includes('mid-term') || t.includes('mid sem') || t.includes('midterm')) return 'midSem';
        return 'other';
    };

    // Data Aggregation Engine (Aggregates assessments by student & subject & category)
    const academicData = useMemo(() => {
        if (!students || students.length === 0 || !subjects || classAssessments.length === 0) return null;

        // Group assessments by student, subject, and category
        const grouping: Record<
            string, 
            Record<
                string, 
                Record<string, { score: number; maxScore: number }>
            >
        > = {};

        students.forEach(student => {
            grouping[student.uid] = {};
            subjects.forEach(subject => {
                grouping[student.uid][subject.id] = {
                    classEx: { score: 0, maxScore: 0 },
                    hw: { score: 0, maxScore: 0 },
                    midSem: { score: 0, maxScore: 0 },
                    proj: { score: 0, maxScore: 0 },
                    exam: { score: 0, maxScore: 0 }
                };
            });
        });

        classAssessments.forEach((a: Assessment) => {
            const studentId = a.studentId;
            const subjectId = a.subjectId;
            if (!grouping[studentId] || !grouping[studentId][subjectId]) return;

            const type = (a.assessmentType || '').toLowerCase();
            const isExam = type.includes('exam') || type.includes('term');

            let categoryKey = 'exam';
            if (!isExam) {
                categoryKey = getCategoryKey(a.assessmentType);
            }

            if (categoryKey === 'other') {
                categoryKey = 'classEx';
            }

            grouping[studentId][subjectId][categoryKey].score += (a.score || 0);
            grouping[studentId][subjectId][categoryKey].maxScore += (a.maxScore || 100);
        });

        const studentSubjectScores: Record<string, Record<string, number>> = {};
        const studentAverages: Array<{
            studentId: string;
            studentName: string;
            average: number;
            subjectScores: Record<string, number>;
            subjectSubScores: Record<string, { classEx: number; hw: number; midSem: number; proj: number; exam: number; total: number }>;
            passCount: number;
            totalTestedSubjects: number;
        }> = [];

        students.forEach(student => {
            const scoresMap: Record<string, number> = {};
            const subScoresMap: Record<string, { classEx: number; hw: number; midSem: number; proj: number; exam: number; total: number }> = {};
            let sumPercentages = 0;
            let testedSubjectsCount = 0;
            let passCount = 0;

            subjects.forEach(subject => {
                const subData = grouping[student.uid]?.[subject.id];
                if (!subData) return;

                // Find active CA categories for this subject in the cohort
                const caTypesForSubject = new Set<string>();
                classAssessments.forEach((a: Assessment) => {
                    if (a.subjectId !== subject.id) return;
                    const type = (a.assessmentType || '').toLowerCase();
                    const isExam = type.includes('exam') || type.includes('term');
                    if (!isExam) {
                        let cat = getCategoryKey(a.assessmentType);
                        if (cat === 'other') cat = 'classEx';
                        caTypesForSubject.add(cat);
                    }
                });

                const activeCaCount = caTypesForSubject.size || 1;
                const caCategoryWeight = currentCaWeight / activeCaCount;

                const caObtained = subData.classEx.score + subData.hw.score + subData.midSem.score + subData.proj.score;
                const caMax = subData.classEx.maxScore + subData.hw.maxScore + subData.midSem.maxScore + subData.proj.maxScore;
                const hasCa = caMax > 0;
                const hasExam = subData.exam.maxScore > 0;

                if (hasCa || hasExam) {
                    const caWeighted = hasCa ? (caObtained / caMax) * currentCaWeight : 0;
                    const examWeighted = hasExam ? (subData.exam.score / subData.exam.maxScore) * currentExamWeight : 0;
                    const final = caWeighted + examWeighted;
                    const finalRounded = parseFloat(final.toFixed(1));

                    const classExVal = caMax > 0 ? (subData.classEx.score / caMax) * currentCaWeight : 0;
                    const hwVal = caMax > 0 ? (subData.hw.score / caMax) * currentCaWeight : 0;
                    const midSemVal = caMax > 0 ? (subData.midSem.score / caMax) * currentCaWeight : 0;
                    const projVal = caMax > 0 ? (subData.proj.score / caMax) * currentCaWeight : 0;

                    scoresMap[subject.id] = finalRounded;
                    subScoresMap[subject.id] = {
                        classEx: parseFloat(classExVal.toFixed(1)),
                        hw: parseFloat(hwVal.toFixed(1)),
                        midSem: parseFloat(midSemVal.toFixed(1)),
                        proj: parseFloat(projVal.toFixed(1)),
                        exam: parseFloat(examWeighted.toFixed(1)),
                        total: finalRounded
                    };

                    sumPercentages += final;
                    testedSubjectsCount++;
                    if (final >= 50) {
                        passCount++;
                    }
                }
            });

            const overallAvg = testedSubjectsCount > 0 ? sumPercentages / testedSubjectsCount : 0;
            studentSubjectScores[student.uid] = scoresMap;

            studentAverages.push({
                studentId: student.uid,
                studentName: `${student.firstName} ${student.lastName}`,
                average: parseFloat(overallAvg.toFixed(1)),
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

        subjects.forEach(subject => {
            let sumSubjectScores = 0;
            let countStudentsInSubject = 0;
            let passStudentsInSubject = 0;

            students.forEach(student => {
                const score = studentSubjectScores[student.uid]?.[subject.id];
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
            ? [...validOverallStudents].sort((a, b) => b.average - a.average)[0]
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
            { name: 'Pass (50-59%)', value: goldColor(50), color: '#f59e0b' },
            { name: 'Needs Support (<50%)', value: failCount, color: '#ef4444' }
        ].filter(tier => tier.value > 0);

        function goldColor(val: number) {
            return passCount;
        }

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
    }, [students, classAssessments, subjects, currentCaWeight, currentExamWeight]);

    // Single-Subject Detailed Deep Dive
    const subjectDetails = useMemo(() => {
        if (!selectedSubjectId || selectedSubjectId === 'all' || !academicData || !students || classAssessments.length === 0) return null;

        const subAssessments = classAssessments.filter(a => a.subjectId === selectedSubjectId);

        const studentAssessmentsMap: Record<string, Assessment[]> = {};
        students.forEach(s => {
            studentAssessmentsMap[s.uid] = subAssessments.filter(a => a.studentId === s.uid);
        });

        const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
        const studentSubjectDetails = students.map(student => {
            const score = academicData.studentSubjectScores[student.uid]?.[selectedSubjectId] ?? 0;
            const grade = getGradeForScore(score);
            if (grade !== 'N/A') {
                gradeDistribution[grade]++;
            }

            const myAssessments = studentAssessmentsMap[student.uid] || [];
            let caScore = 0, caMax = 0, examScore = 0, examMax = 0;
            myAssessments.forEach(a => {
                const type = (a.assessmentType || '').toLowerCase();
                const isExam = type.includes('exam') || type.includes('term');
                if (isExam) {
                    examScore += (a.score || 0);
                    examMax += (a.maxScore || 100);
                } else {
                    caScore += (a.score || 0);
                    caMax += (a.maxScore || 100);
                }
            });

            const weightedCA = caMax > 0 ? (caScore / caMax) * currentCaWeight : 0;
            const weightedExam = examMax > 0 ? (examScore / examMax) * currentExamWeight : 0;

            return {
                studentId: student.uid,
                studentName: `${student.firstName} ${student.lastName}`,
                score,
                grade,
                weightedCA: parseFloat(weightedCA.toFixed(1)),
                weightedExam: parseFloat(weightedExam.toFixed(1)),
                caRaw: `${caScore}/${caMax}`,
                examRaw: `${examScore}/${examMax}`
            };
        });

        const assessmentUniqueNames = Array.from(new Set(subAssessments.map(a => a.assessmentName)));
        const assessmentAudit = assessmentUniqueNames.map(name => {
            const instances = subAssessments.filter(a => a.assessmentName === name);
            const totalScore = instances.reduce((sum, a) => sum + (a.score || 0), 0);
            const maxScore = instances.reduce((sum, a) => sum + (a.maxScore || 100), 0) / instances.length;
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
    }, [selectedSubjectId, academicData, students, classAssessments, currentCaWeight, currentExamWeight]);

    const selectedSubject = subjects?.find(s => s.id === selectedSubjectId);

    // Leaderboard search filter
    const filteredLeaderboard = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        return academicData.studentAverages
            .filter(s => s.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => b.average - a.average);
    }, [academicData, searchQuery]);

    // Top Performers List (Spots 1, 2, 3)
    const topSpots = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        return [...academicData.studentAverages]
            .filter(s => s.totalTestedSubjects > 0)
            .sort((a, b) => b.average - a.average)
            .slice(0, 3);
    }, [academicData]);

    // Filter subjects to only those that have at least one grade recorded for the selected class/cohort
    const activeSubjects = useMemo(() => {
        if (!subjects || !academicData?.studentSubjectScores) return [];
        return subjects.filter(subject => {
            return Object.values(academicData.studentSubjectScores).some(
                scores => scores[subject.id] !== undefined
            );
        });
    }, [subjects, academicData]);

    // Rank students by total marks descending
    const rankedStudents = useMemo(() => {
        if (!academicData?.studentAverages) return [];
        
        const list = academicData.studentAverages.map(s => {
            const totalMarks = Object.values(s.subjectScores).reduce((sum, val) => sum + val, 0);
            return {
                ...s,
                totalMarks: parseFloat(totalMarks.toFixed(1))
            };
        });

        list.sort((a, b) => b.totalMarks - a.totalMarks);

        let currentRank = 1;
        return list.map((item, idx) => {
            if (idx > 0 && list[idx - 1].totalMarks > item.totalMarks) {
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
                    const caTotal = parseFloat((subScore.classEx + subScore.hw + subScore.midSem + subScore.proj).toFixed(1));
                    rowData.push(
                        subScore.classEx > 0 ? subScore.classEx.toString() : "",
                        subScore.hw > 0 ? subScore.hw.toString() : "",
                        subScore.midSem > 0 ? subScore.midSem.toString() : "",
                        subScore.proj > 0 ? subScore.proj.toString() : "",
                        caTotal > 0 ? caTotal.toString() : "",
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
                    <Button onClick={() => window.print()} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border-0">
                        <Printer className="mr-2 h-4 w-4"/>Print Record
                    </Button>
                </div>
            </div>

            {/* FILTERS PANEL */}
            <Card className="print:hidden border border-slate-200/80 shadow-md">
                <CardHeader className="py-4 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                        <Info className="h-4 w-4 text-indigo-500" /> Filter Selection
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Academic Year</label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select Year" /></SelectTrigger>
                            <SelectContent>{MOCK_ACADEMIC_YEARS?.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Term</label>
                        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                            <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select Term" /></SelectTrigger>
                            <SelectContent>{MOCK_TERMS?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Select Class</label>
                        <Select value={selectedClassId || ''} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="w-full bg-indigo-50/50 border-indigo-200 focus:ring-indigo-500 font-medium">
                                <SelectValue placeholder="Choose a Class..." />
                            </SelectTrigger>
                            <SelectContent>
                                {isAdmin && <SelectItem value="all">🏫 Entire School (All Classes)</SelectItem>}
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Subject Zoom</label>
                        <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId} disabled={!selectedClassId}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="All Subjects (Class Summary)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">📊 All Subjects (Class Summary)</SelectItem>
                                {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            
            {/* NO CLASS SELECTED WELCOME AREA */}
            {!selectedClassId ? (
                <div className="space-y-6 print:hidden">
                    <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                        <BookOpenCheck className="mx-auto h-16 w-16 text-indigo-200 mb-3" />
                        <h2 className="text-2xl font-bold text-slate-800">Academic Analytics Selector</h2>
                        <p className="text-slate-500 max-w-md mx-auto mt-1 text-sm">
                            Select a class from the list below or from the filter menu to pull live weighted score distributions and grade averages.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-500" /> Active Classes Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {isAdmin && classes && classes.length > 0 && (
                                <Card className="hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group bg-gradient-to-br from-indigo-50/20 to-indigo-100/10 border-indigo-200">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Entire School</Badge>
                                            <Users className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-800">All Classes Combined</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs">Run cross-institutional grading analysis and subject-by-subject master sheet.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-4 pt-2 border-t mt-4 text-xs font-semibold text-slate-500 flex justify-between bg-slate-50/50">
                                        <span>School-Wide Analytics</span>
                                        <span>All Subjects</span>
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-4 bg-slate-50/50 border-t">
                                        <Button onClick={() => setSelectedClassId('all')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm transition-all text-xs font-bold py-1.5 h-8">
                                            Run Analytics <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}
                            {classes?.map(c => (
                                <Card key={c.id} className="hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold">{c.teachingModel || 'Subject Model'}</Badge>
                                            <Users className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-800">{c.name}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs">{c.description || 'No class description recorded in settings.'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-4 pt-2 border-t mt-4 text-xs font-semibold text-slate-500 flex justify-between bg-slate-50/50">
                                        <span>Grading Weight: {c.caWeight ?? CA_WEIGHT}% CA</span>
                                        <span>Exam: {c.examWeight ?? EXAM_WEIGHT}%</span>
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-4 bg-slate-50/50 border-t">
                                        <Button onClick={() => setSelectedClassId(c.id)} className="w-full bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 text-indigo-600 shadow-sm transition-all text-xs font-bold py-1.5 h-8">
                                            Run Analytics <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            {(!classes || classes.length === 0) && (
                                <div className="col-span-full text-center py-10 bg-slate-50 text-slate-400 rounded-lg">No classes found in school settings.</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : isLoadingStudents || isLoadingAssessments ? (
                 <div className="text-center py-24 bg-white border border-slate-200 rounded-xl shadow-sm">
                     <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600 mb-3"/>
                     <p className="text-slate-500 font-medium text-sm">Loading and calculating student gradebook data...</p>
                 </div>
            ) : !academicData ? (
                <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-3"/>
                    <h3 className="text-lg font-semibold text-slate-800">No Assessment Records Found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
                        No continuous assessments or terminal exam marks have been posted for this class in term: <strong className="text-slate-700">{selectedTerm}</strong> ({selectedYear}).
                    </p>
                    <div className="mt-4 gap-2 flex justify-center print:hidden">
                        <Button variant="outline" size="sm" onClick={() => setSelectedClassId(null)}>Change Class</Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" asChild>
                            <Link href="/dashboard/academics/gradebook">Go to Gradebook</Link>
                        </Button>
                    </div>
                </div>
            ) : selectedSubjectId === 'all' ? (
                /* ========================================================================= */
                /* CLASS OVERVIEW DASHBOARD (ALL SUBJECTS SUMMARY)                          */
                /* ========================================================================= */
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
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
                                                {filteredLeaderboard.map((student, index) => {
                                                    const rankNum = academicData.studentAverages
                                                        .filter(s => s.totalTestedSubjects > 0)
                                                        .sort((a, b) => b.average - a.average)
                                                        .findIndex(s => s.studentId === student.studentId) + 1;

                                                    return (
                                                        <TableRow key={student.studentId} className="hover:bg-slate-50 transition-colors">
                                                            <TableCell className="text-center font-bold text-slate-500">{rankNum > 0 ? rankNum : '-'}</TableCell>
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
                                                    const caTotal = subScore ? parseFloat((subScore.classEx + subScore.hw + subScore.midSem + subScore.proj).toFixed(1)) : 0;
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
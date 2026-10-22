'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { logAuditEvent } from '@/lib/audit';
import { collection, query, where, getDocs, getDoc, doc, setDoc, serverTimestamp, updateDoc, Timestamp, writeBatch, documentId } from 'firebase/firestore';
import { useOnceQuery, readOnceCached } from '@/lib/firestore-once';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search, CheckCircle, FileCheck, GraduationCap, Eye, Save, ShieldCheck, AlertCircle, PenTool, Sparkles, BookOpen, User, ChevronRight, FileText, History } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { getGradeFromScale, cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ReportCardTemplate from './components/ReportCardTemplate';
import { notifyParents } from '@/app/actions/notifications';
import { generateReportCommentAction } from '@/app/actions/report-ai';
import { isTermMatch, isYearMatch, academicYearVariants, termVariants } from '@/lib/academic-match';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    try {
        const fetchUrl = imageUrl.startsWith('https://firebasestorage.googleapis.com')
            ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
            : imageUrl;

        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error: any) {
        console.error("❌ getBase64ImageFromUrl failed:", error.message);
        return "";
    }
}

/** Remarks that say the pupil should repeat / is not promoted ("not promoted", "will repeat", "cannot be promoted"). */
function commentsSayRepeat(text: string): boolean {
    return /\brepeat|\b(not|never|cannot|can't|won't|will not)\s+(be\s+)?promot/i.test(text || '');
}
/** Remarks that actually say the pupil is promoted (a "not promoted" remark does NOT count). */
function commentsSayPromoted(text: string): boolean {
    return /promot/i.test(text || '') && !commentsSayRepeat(text);
}

/**
 * One subject's CA and Exam for one student — computed the SAME way as the Gradebook's Terminal SBA Matrix, so the
 * report card shows the totals teachers saw when they entered marks:
 *   - CA: marks of the same kind (e.g. Test 1, Test 2, Test 3) are AVERAGED first, then the kinds (tests, homework,
 *     project, mid-term) are added and scaled to the CA weight.
 *   - Exam: the end-of-term exam scaled to the exam weight. Mock exams only count when the subject has no
 *     end-of-term exam this term (they are never added on top of it).
 */
function computeSubjectScore(items: any[], caWeight: number, examWeight: number): { ca: number; exam: number; total: number } | null {
    if (!items || items.length === 0) return null;
    const typeOf = (a: any) => String(a.assessmentType || '').toLowerCase();
    const isExam = (a: any) => { const t = typeOf(a); return !t.includes('mid') && (t.includes('exam') || t.includes('term')); };
    const isMock = (a: any) => `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase().includes('mock');
    const num = (v: any, d: number) => { const n = Number(v); return isFinite(n) ? n : d; };

    let exams = items.filter(isExam);
    const terminal = exams.filter(a => !isMock(a));
    if (terminal.length > 0) exams = terminal;

    const groups: Record<string, { s: number[]; m: number[] }> = {};
    items.filter(a => !isExam(a)).forEach(a => {
        const c = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase();
        const kind = c.includes('mid') ? 'mid'
            : (c.includes('proj') || c.includes('group') || c.includes('practical')) ? 'project'
            : (c.includes('home') || c.includes('hw')) ? 'hw'
            : 'test';
        if (!groups[kind]) groups[kind] = { s: [], m: [] };
        groups[kind].s.push(num(a.score, 0));
        groups[kind].m.push(num(a.maxScore, 100) || 100);
    });
    const mean = (xs: number[]) => xs.reduce((x, y) => x + y, 0) / xs.length;
    let caScore = 0, caMax = 0;
    Object.values(groups).forEach(g => { caScore += mean(g.s); caMax += mean(g.m); });
    const rawCA = caMax > 0 ? Math.min((caScore / caMax) * caWeight, caWeight) : 0;

    const exScore = exams.reduce((sum, a) => sum + num(a.score, 0), 0);
    const exMax = exams.reduce((sum, a) => sum + (num(a.maxScore, 100) || 100), 0);
    const rawExam = exMax > 0 ? Math.min((exScore / exMax) * examWeight, examWeight) : 0;

    const ca = Math.round(rawCA);
    const exam = Math.round(rawExam);
    return { ca, exam, total: Math.min(ca + exam, 100) };
}

function formatOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getPromotedTargetClass(
    currentClassId: string,
    classesList: any[],
    commentsText: string = '',
    student?: any,
    cohortStudents: any[] = []
): any | null {
    if (!classesList || classesList.length === 0) return null;
    const currentClass = classesList.find((c: any) => c.id === currentClassId);

    // 1. Check if comments specifically mention a class name
    const commentsLower = (commentsText || '').toLowerCase();
    if (commentsLower.includes('promot')) {
        for (const c of classesList) {
            if (c.id === currentClassId) continue;
            const cNameLower = (c.name || '').toLowerCase();
            if (commentsLower.includes(cNameLower)) return c;
            
            // Subparts e.g. "BS 3" or "Class 3"
            const parts = cNameLower.split(/[\(\)]/).map((p: string) => p.trim()).filter(Boolean);
            for (const part of parts) {
                if (part.length >= 3 && commentsLower.includes(part)) {
                    return c;
                }
            }
            // Normalized e.g. "bs3", "class3"
            const normCName = cNameLower.replace(/[^a-z0-9]/g, '');
            const normComments = commentsLower.replace(/[^a-z0-9]/g, '');
            if (normCName.length >= 3 && normComments.includes(normCName)) {
                return c;
            }
        }
    }

    // 2. Check if student's current enrollment is in a higher class
    if (student?.classId && student.classId !== currentClassId) {
        const studentClass = classesList.find((c: any) => c.id === student.classId);
        if (studentClass) {
            const sOrder = studentClass.order ?? studentClass.level ?? 0;
            const cOrder = currentClass?.order ?? currentClass?.level ?? 0;
            if (sOrder > cOrder || !currentClass) {
                return studentClass;
            }
        }
    }

    // 3. Check if the cohort has a predominant promoted destination
    if (cohortStudents && cohortStudents.length > 0) {
        const destCounts: Record<string, number> = {};
        cohortStudents.forEach((s: any) => {
            if (s.classId && s.classId !== currentClassId) {
                destCounts[s.classId] = (destCounts[s.classId] || 0) + 1;
            }
        });
        let topDestId = '';
        let topCount = 0;
        Object.entries(destCounts).forEach(([destId, count]) => {
            if (count > topCount) {
                topCount = count;
                topDestId = destId;
            }
        });
        if (topDestId) {
            const topClass = classesList.find((c: any) => c.id === topDestId);
            if (topClass) return topClass;
        }
    }

    // 4. Sequential next class in classes hierarchy
    if (currentClass) {
        if (typeof currentClass.order === 'number' || typeof currentClass.level === 'number') {
            const currentOrder = currentClass.order ?? currentClass.level;
            const nextClass = classesList
                .filter((c: any) => (c.order ?? c.level) > currentOrder)
                .sort((a: any, b: any) => (a.order ?? a.level) - (b.order ?? b.level))[0];
            if (nextClass) return nextClass;
        }

        const numMatch = currentClass.name?.match(/(\d+)/);
        if (numMatch) {
            const nextNum = parseInt(numMatch[1], 10) + 1;
            const nextClass = classesList.find((c: any) => {
                if (c.id === currentClassId) return false;
                const cNumMatch = c.name?.match(/(\d+)/);
                return cNumMatch && parseInt(cNumMatch[1], 10) === nextNum;
            });
            if (nextClass) return nextClass;
        }
    }

    return null;
}


export default function ReportCardManager() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    // Selection State
    const [classId, setClassId] = useState('');
    const [term, setTerm] = useState('First Term');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Comments State
    const [classTeacherComment, setClassTeacherComment] = useState('');
    const [headmasterComment, setHeadmasterComment] = useState('');

    // Promotion State
    const [promotionDecision, setPromotionDecision] = useState<'Promoted' | 'Repeated' | 'Graduated' | ''>('');
    const [promotedToClassId, setPromotedToClassId] = useState<string>('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isBulkPublishing, setIsBulkPublishing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isPrintingAll, setIsPrintingAll] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [batchLogoBase64, setBatchLogoBase64] = useState('');
    const [batchHeadmasterSigBase64, setBatchHeadmasterSigBase64] = useState('');
    const [batchTeacherSigBase64, setBatchTeacherSigBase64] = useState('');
    const [isGeneratingTeacherComment, setIsGeneratingTeacherComment] = useState(false);
    const [isGeneratingHeadmasterComment, setIsGeneratingHeadmasterComment] = useState(false);
    const [processedReport, setProcessedReport] = useState<any>(null);
    
    const printRef = useRef<HTMLDivElement>(null);

    const isAdminOrDirector = ['administrator', 'director'].includes(role?.toLowerCase() || '');
    const isTeacher = role?.toLowerCase() === 'teacher';

    // Data Fetching
    // READ COST: everything below is read ONCE per browser session (no live listeners). Switching students,
    // classes and terms back and forth, or re-opening the page, costs no further reads.
    const readAll = useCallback(async (q: any) => {
        const snap = await getDocs(q);
        return snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id }));
    }, []);
    const { data: classes, isLoading: isLoadingClasses } = useOnceQuery<any>(
        (firestore && user && schoolId) ? `rc:classes:${schoolId}` : null,
        () => readAll(query(collection(firestore!, 'classes'), where('schoolId', '==', schoolId)))
    );
    // Only a teacher needs timetable slots, and only their own.
    const { data: timetable } = useOnceQuery<any>(
        (firestore && schoolId && user?.uid && role?.toLowerCase() === 'teacher') ? `rc:timetable:${schoolId}:${user.uid}` : null,
        () => readAll(query(collection(firestore!, 'timetables'), where('schoolId', '==', schoolId), where('teacherId', '==', user!.uid)))
    );
    const { data: subjects } = useOnceQuery<any>(
        (firestore && schoolId) ? `rc:subjects:${schoolId}` : null,
        () => readAll(query(collection(firestore!, 'subjects'), where('schoolId', '==', schoolId)))
    );

    const visibleClasses = useMemo(() => {
        if (!classes) return [];
        if (role?.toLowerCase() !== 'teacher') return classes;

        const isClassTeacher = (c: any) => 
            c.teacherId === user?.uid || 
            (Array.isArray(c.teacherIds) && c.teacherIds.includes(user?.uid));

        const timetableClassIds = timetable
            ?.filter((t: any) => t.teacherId === user?.uid)
            .map((t: any) => t.classId) || [];

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
            if (role?.toLowerCase() === 'teacher') {
                const isAuthorized = visibleClasses.some((c: any) => c.id === classId);
                if (!isAuthorized) {
                    toast({
                        variant: 'destructive',
                        title: 'Access Restricted',
                        description: 'You do not have access to this class report cards.'
                    });
                    setClassId(visibleClasses[0]?.id || '');
                    setSelectedStudentId(null);
                    setProcessedReport(null);
                }
            }
        }
    }, [classId, role, visibleClasses, isLoadingClasses, toast]);

    const { data: students } = useOnceQuery<any>(
        (firestore && schoolId && classId) ? `rc:students:${schoolId}:${classId}` : null,
        () => readAll(query(collection(firestore!, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)))
    );
    // (The whole school's student list is no longer read here — it cost one read per student in the school every
    // time this page opened. Students who have since left this class are fetched individually further down.)

// subjects fetched above
    
    const { data: schoolProfile, isLoading: profileLoading } = useDoc<any>(useMemoFirebase(() =>  
        (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, 
    [firestore, schoolId]));

    const CA_WEIGHT = schoolProfile?.caWeight ?? 30;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 70;

    const areDatesMissing = !schoolProfile?.termStartDate || !schoolProfile?.termEndDate;

    useEffect(() => {
        if (schoolProfile) {
            const savedYear = schoolProfile.academicYear || schoolProfile.activeAcademicYear;
            const savedTerm = schoolProfile.term || schoolProfile.activeTerm || schoolProfile.currentTerm;
            if (savedYear) setAcademicYear(savedYear);
            if (savedTerm) setTerm(savedTerm);
        }
    }, [schoolProfile]);

    // Report cards of this class for the selected ACADEMIC YEAR only (was: every report card the class ever had,
    // read live and growing every term). Each record remembers which collection it came from.
    const rcYearVariants = useMemo(() => academicYearVariants(academicYear), [academicYear]);
    const readReportCards = useCallback(async (col: string) => {
        const base = [where('schoolId', '==', schoolId), where('classId', '==', classId)];
        let rows: any[];
        try {
            rows = rcYearVariants.length > 0
                ? await readAll(query(collection(firestore!, col), ...base, where('academicYear', 'in', rcYearVariants)))
                : await readAll(query(collection(firestore!, col), ...base));
        } catch (err: any) {
            if (err?.code === 'permission-denied') throw err;
            console.warn(`Report cards: year-filtered read of ${col} failed, reading all of this class instead.`, err);
            rows = await readAll(query(collection(firestore!, col), ...base));
        }
        return rows.map(r => ({ ...r, _col: col }));
    }, [firestore, schoolId, classId, rcYearVariants, readAll]);
    const rcKeyBase = (firestore && schoolId && classId && !profileLoading) ? `${schoolId}:${classId}:${rcYearVariants.join('|')}` : null;
    const { data: rawReportCards, setData: setReportCardsCache } = useOnceQuery<any>(
        rcKeyBase ? `rc:cards:${rcKeyBase}` : null,
        () => readReportCards('report-cards')
    );
    const { data: rawTermReportCards } = useOnceQuery<any>(
        rcKeyBase ? `rc:termcards:${rcKeyBase}` : null,
        () => readReportCards('term_report_cards')
    );

    /** Keep the loaded report cards in step with what this page just saved (no re-read). */
    const upsertLocalReportCards = useCallback((updates: Array<{ id: string; data: any }>) => {
        setReportCardsCache((prev: any[]) => {
            const map = new Map<string, any>((prev || []).map((r: any) => [r.id, r]));
            updates.forEach(({ id, data }) => map.set(id, { ...(map.get(id) || {}), ...data, id, _col: 'report-cards' }));
            return Array.from(map.values());
        });
    }, [setReportCardsCache]);

    const classReportCards = useMemo(() => {
        const combined = [...(rawReportCards || []), ...(rawTermReportCards || [])];
        const filtered = combined.filter(r => {
            const rYear = r.academicYear || r.academicYearId || r.year;
            const rTerm = r.term || r.termId || r.semester;
            const yearMatches = !academicYear || !rYear || isYearMatch(rYear, academicYear);
            const termMatches = !term || !rTerm || isTermMatch(rTerm, term);
            return yearMatches && termMatches;
        });

        // Deduplicate so each student only has ONE report card (preferring 'Published' or latest updatedAt)
        const reportMap = new Map<string, any>();
        filtered.forEach(r => {
            const studentKey = r.studentId || r.student?.uid || r.student?.id || r.id;
            if (!reportMap.has(studentKey)) {
                reportMap.set(studentKey, r);
            } else {
                const existing = reportMap.get(studentKey);
                if (r.status === 'Published' && existing.status !== 'Published') {
                    reportMap.set(studentKey, r);
                } else if (r.updatedAt && existing.updatedAt && r.updatedAt > existing.updatedAt) {
                    reportMap.set(studentKey, r);
                }
            }
        });

        return Array.from(reportMap.values());
    }, [rawReportCards, rawTermReportCards, academicYear, term]);

    // Students who have a report card for this class/term but are no longer in it (e.g. promoted): fetch just
    // those few by id (one read each, once) so their CURRENT class is known.
    const missingReportStudentIds = useMemo(() => {
        const inClass = new Set<string>();
        (students || []).forEach((s: any) => { [s.uid, s.id, s.studentId].forEach(k => k && inClass.add(k)); });
        const ids = new Set<string>();
        classReportCards.forEach((rc: any) => {
            const stuId = rc.studentId || rc.student?.uid || rc.student?.id;
            if (stuId && !inClass.has(stuId)) ids.add(stuId);
        });
        return Array.from(ids).sort();
    }, [students, classReportCards]);
    const { data: formerStudents } = useOnceQuery<any>(
        (firestore && schoolId && students && missingReportStudentIds.length > 0) ? `rc:former:${schoolId}:${missingReportStudentIds.join(',')}` : null,
        async () => {
            const out: any[] = [];
            for (let i = 0; i < missingReportStudentIds.length; i += 30) {
                const chunk = missingReportStudentIds.slice(i, i + 30);
                try {
                    out.push(...await readAll(query(collection(firestore!, 'students'), where('schoolId', '==', schoolId), where(documentId(), 'in', chunk))));
                } catch (err) {
                    console.warn('Report cards: could not look up former class members', err);
                }
            }
            return out;
        }
    );

    const activeStudents = useMemo(() => {
        const sourceStudents = [...(students || []), ...(formerStudents || [])];
        if (sourceStudents.length === 0) return [];

        // 1. Students currently assigned to this class
        const currentInClass = sourceStudents.filter((s: any) => {
            const matchesClass = s.classId === classId;
            const status = s.enrollmentStatus || s.status;
            const isInactive = status === 'Inactive' || status === 'Withdrawn' || status === 'Graduated' || s.isInactive === true || s.active === false;
            return matchesClass && !isInactive;
        });

        const studentMap = new Map<string, any>();
        currentInClass.forEach(s => {
            const key = s.uid || s.id || s.studentId;
            if (key) studentMap.set(key, s);
        });

        // 2. Add students who have recorded report cards for this class & period (e.g. promoted students)
        if (classReportCards && classReportCards.length > 0) {
            classReportCards.forEach((rc: any) => {
                const stuId = rc.studentId || rc.student?.uid || rc.student?.id;
                if (stuId && !studentMap.has(stuId)) {
                    const found = sourceStudents.find((s: any) => 
                        s.uid === stuId || s.id === stuId || s.studentId === stuId
                    );
                    if (found) {
                        studentMap.set(stuId, found);
                    } else if (rc.student) {
                        studentMap.set(stuId, {
                            ...rc.student,
                            uid: rc.student.uid || stuId,
                            id: rc.student.id || stuId
                        });
                    }
                }
            });
        }

        const list = Array.from(studentMap.values());
        list.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
        return list;
    }, [formerStudents, students, classId, classReportCards]);

    const targetStudent = useMemo(() => {
        if (!selectedStudentId || !activeStudents) return null;
        return activeStudents.find((s: any) => s.uid === selectedStudentId || s.id === selectedStudentId || s.studentId === selectedStudentId) || null;
    }, [selectedStudentId, activeStudents]);

    const isHistoricalCohort = useMemo(() => {
        if (!schoolProfile) return false;
        const currentActiveYear = schoolProfile.academicYear || schoolProfile.activeAcademicYear;
        const currentActiveTerm = schoolProfile.term || schoolProfile.activeTerm || schoolProfile.currentTerm;
        const yearDiff = academicYear && currentActiveYear && !isYearMatch(academicYear, currentActiveYear);
        const termDiff = term && currentActiveTerm && !isTermMatch(term, currentActiveTerm);
        const hasPromoted = activeStudents.some((s: any) => s.classId && s.classId !== classId);
        return Boolean(yearDiff || termDiff || hasPromoted);
    }, [schoolProfile, academicYear, term, activeStudents, classId]);

    const historicalCohortInfo = useMemo(() => {
        if (!isHistoricalCohort) return null;
        const currentClassName = classes?.find((c: any) => c.id === classId)?.name || 'Class';
        const promotedStudents = activeStudents.filter((s: any) => s.classId && s.classId !== classId);
        const promotedClassNames = Array.from(new Set(promotedStudents.map((s: any) => classes?.find((c: any) => c.id === s.classId)?.name).filter(Boolean)));
        const targetPromotedClassText = promotedClassNames.length > 0 ? promotedClassNames.join(', ') : '';
        
        return {
            currentClassName,
            promotedClassText: targetPromotedClassText,
            label: `Historical Cohort: Showing ${academicYear || ''} ${currentClassName} records${targetPromotedClassText ? ` for currently promoted ${targetPromotedClassText} students` : ''}`
        };
    }, [isHistoricalCohort, classes, classId, activeStudents, academicYear]);

    const classSummary = useMemo(() => {
        if (!activeStudents || !classReportCards) return null;
        
        const drafts: any[] = [];
        const published: any[] = [];
        const missing: any[] = [];
        
        activeStudents.forEach((student: any) => {
            const stuId = student.uid || student.id || student.studentId;
            const report = classReportCards.find((r: any) => 
                (student.uid && r.studentId === student.uid) ||
                (student.id && r.studentId === student.id) ||
                (student.studentId && r.studentId === student.studentId) ||
                (stuId && r.studentId === stuId)
            );
            if (!report) {
                missing.push(student);
            } else if (report.status === 'Published') {
                published.push({ student, report });
            } else {
                drafts.push({ student, report });
            }
        });
        
        return { drafts, published, missing };
    }, [activeStudents, classReportCards]);

    useEffect(() => {
        if (!selectedStudentId || !academicYear || !term || !firestore || !schoolId) {
            setClassTeacherComment('');
            setHeadmasterComment('');
            setPromotionDecision('');
            setPromotedToClassId('');
            return;
        }
        const reportId = `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
        // The class's report cards for this year are already loaded — look the student's up there (no reads).
        if (rawReportCards === null || rawTermReportCards === null) return;
        const fetchExisting = async () => {
            const found = [...(rawReportCards || []), ...(rawTermReportCards || [])].find((r: any) => r.id === reportId)
                || classReportCards.find((r: any) => r.studentId === selectedStudentId);
            const snap = { exists: () => !!found, data: () => (found || {}) as any };

            const currentClassName = classes?.find((c: any) => c.id === classId)?.name || '';
            const cohortRoll = activeStudents.length || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0);
            const stu = activeStudents.find((s: any) => s.uid === selectedStudentId || s.id === selectedStudentId || s.studentId === selectedStudentId);

            const targetPromotedClass = getPromotedTargetClass(
                classId,
                classes || [],
                snap.exists() ? `${snap.data().headmasterComment || ''} ${snap.data().classTeacherComment || ''}` : '',
                stu,
                activeStudents
            );

            if (snap.exists()) {
                const data = snap.data();
                setClassTeacherComment(data.classTeacherComment || '');
                setHeadmasterComment(data.headmasterComment || '');

                let decision = data.promotionDecision || '';
                let targetPromotedId = data.promotedToClassId || '';

                const isPromoTerm = isTermMatch(term, 'Third Term') || isTermMatch(term, '3') || isHistoricalCohort;
                const allComments = `${data.headmasterComment || ''} ${data.classTeacherComment || ''}`;
                const commentsIndicatePromo = commentsSayPromoted(allComments);
                // Auto-bind completed promotion decision if student was promoted or remarks state it
                if (!decision || decision === '') {
                    // Default to "Promoted" only at the end of the year (or when the remarks say so) — never in the
                    // first/second term, and never when the remarks say the pupil repeats.
                    if ((isPromoTerm && !commentsSayRepeat(allComments)) || commentsIndicatePromo) {
                        decision = 'Promoted';
                        targetPromotedId = targetPromotedClass?.id || stu?.classId || '';
                    } else if (stu?.enrollmentStatus === 'Graduated') {
                        decision = 'Graduated';
                    }
                } else if (decision === 'Promoted' && (!targetPromotedId || targetPromotedId === classId)) {
                    targetPromotedId = targetPromotedClass?.id || stu?.classId || '';
                }

                setPromotionDecision(decision);
                setPromotedToClassId(targetPromotedId);

                setProcessedReport({
                    ...data,
                    className: currentClassName || data.className,
                    totalStudents: cohortRoll > 0 ? cohortRoll : (data.totalStudents || 0),
                    totalClassStudents: cohortRoll > 0 ? cohortRoll : (data.totalStudents || 0),
                    cohortTotal: cohortRoll > 0 ? cohortRoll : (data.totalStudents || 0),
                    promotionDecision: decision,
                    promotedToClassId: targetPromotedId,
                    promotedToClassName: decision === 'Promoted'
                        ? (classes?.find((c: any) => c.id === targetPromotedId)?.name || targetPromotedClass?.name || 'Next Class')
                        : (decision === 'Repeated' ? (currentClassName || data.className) : (decision === 'Graduated' ? 'Graduated' : ''))
                });
            } else {
                setClassTeacherComment('');
                setHeadmasterComment('');

                const isPromoTerm = isTermMatch(term, 'Third Term') || isTermMatch(term, '3') || isHistoricalCohort;
                let decision: any = '';
                let targetPromotedId = '';
                if (isPromoTerm) {
                    decision = 'Promoted';
                    targetPromotedId = targetPromotedClass?.id || (stu?.classId !== classId ? stu?.classId : '') || '';
                } else if (stu?.enrollmentStatus === 'Graduated') {
                    decision = 'Graduated';
                }
                setPromotionDecision(decision);
                setPromotedToClassId(targetPromotedId);
            }
        };
        fetchExisting();
    }, [selectedStudentId, academicYear, term, firestore, schoolId, classId, classes, activeStudents, classSummary, isHistoricalCohort, rawReportCards, rawTermReportCards, classReportCards]);

    // Auto-populate promotion decision for historical or third-term reports reactively
    useEffect(() => {
        if (!classId || !classes || classes.length === 0) return;
        const isPromoTerm = isTermMatch(term, 'Third Term') || isTermMatch(term, '3') || isHistoricalCohort;
        const allComments = `${headmasterComment || ''} ${classTeacherComment || ''}`;
        const commentsIndicatePromo = commentsSayPromoted(allComments);
        if (!promotionDecision) {
            if ((isPromoTerm && !commentsSayRepeat(allComments)) || commentsIndicatePromo) {
                const targetPromoted = getPromotedTargetClass(classId, classes, allComments, targetStudent, activeStudents);
                if (targetPromoted) {
                    setPromotionDecision('Promoted');
                    setPromotedToClassId(targetPromoted.id);
                }
            }
        } else if (promotionDecision === 'Promoted' && (!promotedToClassId || promotedToClassId === classId)) {
            const targetPromoted = getPromotedTargetClass(classId, classes, allComments, targetStudent, activeStudents);
            if (targetPromoted) {
                setPromotedToClassId(targetPromoted.id);
            }
        }
    }, [classId, classes, term, isHistoricalCohort, headmasterComment, classTeacherComment, promotionDecision, promotedToClassId, targetStudent, activeStudents]);

    const generateReport = async () => {
        if (!firestore || !schoolId || !classId || !selectedStudentId || !schoolProfile) return;
        
        if (areDatesMissing) {
            toast({ variant: 'destructive', title: "Dates Not Configured", description: "Term start and end dates must be set under Settings to calculate attendance." });
            return;
        }

        setIsGenerating(true);
        setProcessedReport(null);

        try {
            const targetClass = classes?.find((c: any) => c.id === classId);
            const currentCaWeight = targetClass?.caWeight ?? CA_WEIGHT;
            const currentExamWeight = targetClass?.examWeight ?? EXAM_WEIGHT;

            // 1. This class's marks for the term — read ONCE per class/term per session and shared by every student
            //    compiled (was: the whole class's marks read again for EACH student compiled).
            //    Matches the usual spellings of the year and term ("2026/2027", "Term 1" …).
            const yv = academicYearVariants(academicYear).slice(0, 3);
            const tv = termVariants(term);
            const allAssessments: any[] = await readOnceCached(`rc:marks:${schoolId}:${classId}:${academicYear}:${term}`, async () => {
                const base = [where('schoolId', '==', schoolId), where('classId', '==', classId)];
                try {
                    if (yv.length > 0 && tv.length > 0 && yv.length * tv.length <= 30) {
                        return await readAll(query(collection(firestore, 'assessments'), ...base, where('academicYear', 'in', yv), where('term', 'in', tv)));
                    }
                } catch (err: any) {
                    if (err?.code === 'permission-denied') throw err;
                    console.warn('Report cards: flexible marks query failed, using exact year/term.', err);
                }
                return readAll(query(collection(firestore, 'assessments'), ...base, where('academicYear', '==', academicYear), where('term', '==', term)));
            }, { ttlMs: 5 * 60 * 1000 });

            // 2. Attendance Date Calculation
            const tStartStr = schoolProfile.termStartDate;
            const tEndStr = schoolProfile.termEndDate;
            const tStartDate = typeof tStartStr === 'string' ? parseISO(tStartStr) : tStartStr.toDate();
            const tEndDate = typeof tEndStr === 'string' ? parseISO(tEndStr) : tEndStr.toDate();

            // Attendance for the term — also read once per class/term per session (was: re-read for every student).
            const allAttRecords: any[] = await readOnceCached(
                `rc:att:${schoolId}:${classId}:${tStartDate.toISOString().slice(0, 10)}:${tEndDate.toISOString().slice(0, 10)}`,
                () => readAll(query(
                    collection(firestore, 'attendance'),
                    where('schoolId', '==', schoolId),
                    where('classId', '==', classId),
                    where('date', '>=', Timestamp.fromDate(startOfDay(tStartDate))),
                    where('date', '<=', Timestamp.fromDate(endOfDay(tEndDate)))
                )),
                { ttlMs: 5 * 60 * 1000 }
            );

            // 3. Attendance Ratios
            const uniqueDates = new Set(allAttRecords.map(r => 
                r.date?.toDate ? r.date.toDate().toDateString() : new Date(r.date).toDateString()
            ));
            const totalClassDays = uniqueDates.size;

            const studentAtt = allAttRecords.filter(r => 
                r.studentId === selectedStudentId && (r.status === 'Present' || r.status === 'Late')
            );
            const studentPresentDays = studentAtt.length;

            // 4. Grades Weighting & Position computation
            const studentTotals: Record<string, number> = {};
            const subjectStats: Record<string, { totalScores: number[], sum: number }> = {};
            subjects?.forEach((sub: any) => { subjectStats[sub.id] = { totalScores: [], sum: 0 }; });
            
            activeStudents.forEach((stu: any) => {
                let grandTotal = 0;
                subjects?.forEach((sub: any) => {
                    const scored = computeSubjectScore(
                        allAssessments.filter(a => a.studentId === stu.uid && a.subjectId === sub.id),
                        currentCaWeight, currentExamWeight
                    );
                    if (!scored) return; // no marks in this subject (e.g. an elective) — not counted in its average/position
                    grandTotal += scored.total;
                    if (subjectStats[sub.id]) {
                        subjectStats[sub.id].totalScores.push(scored.total);
                        subjectStats[sub.id].sum += scored.total;
                    }
                });
                studentTotals[stu.uid] = grandTotal;
            });

            const myTotal = studentTotals[selectedStudentId] || 0;
            const classPosition = formatOrdinal(Object.values(studentTotals).filter(t => t > myTotal).length + 1);
            const targetStudent = activeStudents.find((s: any) => s.uid === selectedStudentId || s.id === selectedStudentId || s.studentId === selectedStudentId);

            const reportRows: any[] = [];
            let myGrandTotal = 0;
            let subjectsTaken = 0;
            subjects?.forEach((sub: any) => {
                const scored = computeSubjectScore(
                    allAssessments.filter(a => a.studentId === selectedStudentId && a.subjectId === sub.id),
                    currentCaWeight, currentExamWeight
                );
                if (!scored) return;
                const finalCA = scored.ca;
                const finalExam = scored.exam;
                const total100 = scored.total;

                myGrandTotal += total100;
                subjectsTaken++;
                const { grade, autoRemark } = getGradeFromScale(total100, schoolProfile?.gradingSystem);
                reportRows.push({
                    subjectName: sub.name,
                    ca: finalCA,
                    exam: finalExam,
                    total: total100, grade, autoRemark,
                    classAverage: subjectStats[sub.id].totalScores.length > 0
                        ? Math.round(subjectStats[sub.id].sum / subjectStats[sub.id].totalScores.length) : 0,
                    position: formatOrdinal(subjectStats[sub.id].totalScores.filter(s => s > total100).length + 1)
                });
            });

            // 5. Signatures Base64 Conversion
            const selectedClass = classes?.find((c: any) => c.id === classId);
            const classTeacherId = selectedClass?.teacherId;

            let classTeacherSignatureUrl = null;
            let classTeacherName = 'Class Teacher';

            if (classTeacherId) {
                const [tData] = await readOnceCached(`rc:staff:${classTeacherId}`, async () => {
                    const d = await getDoc(doc(firestore, 'staff', classTeacherId));
                    return d.exists() ? [d.data()] : [];
                });
                if (tData) {
                    classTeacherSignatureUrl = tData.signatureBase64 || tData.signatureUrl || null;
                    classTeacherName = `${tData.firstName || ''} ${tData.lastName || ''}`.trim();
                }
            }
            const [schoolData] = await readOnceCached<any>(`rc:school:${schoolId}`, async () => {
                const d = await getDoc(doc(firestore, 'schools', schoolId));
                return d.exists() ? [d.data()] : [];
            });

            const [logoB64, headmasterSigB64, teacherSigB64] = await Promise.all([
                schoolProfile?.logoUrl ? getBase64ImageFromUrl(schoolProfile.logoUrl) : Promise.resolve(''),
                schoolData?.headmasterSignatureUrl ? getBase64ImageFromUrl(schoolData.headmasterSignatureUrl) : Promise.resolve(''),
                classTeacherSignatureUrl ? getBase64ImageFromUrl(classTeacherSignatureUrl) : Promise.resolve(''),
            ]);
            const cohortRoll = activeStudents.length || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0);
            const currentClassName = classes?.find((c: any) => c.id === classId)?.name || '';

            const targetPromotedClass = getPromotedTargetClass(
                classId,
                classes || [],
                `${headmasterComment || ''} ${classTeacherComment || ''}`,
                targetStudent,
                activeStudents
            );

            let autoDecision = promotionDecision;
            let autoPromotedClassId = promotedToClassId;
            const isPromoTerm = isTermMatch(term, 'Third Term') || isTermMatch(term, '3') || isHistoricalCohort;
            const remarksText = `${headmasterComment || ''} ${classTeacherComment || ''}`;
            const commentsIndicatePromo = commentsSayPromoted(remarksText);
            if (!autoDecision || autoDecision === '') {
                if ((isPromoTerm && !commentsSayRepeat(remarksText)) || commentsIndicatePromo) {
                    autoDecision = 'Promoted';
                    autoPromotedClassId = targetPromotedClass?.id || (targetStudent?.classId !== classId ? targetStudent?.classId : '') || '';
                    setPromotionDecision('Promoted');
                    setPromotedToClassId(autoPromotedClassId);
                } else if (targetStudent?.enrollmentStatus === 'Graduated') {
                    autoDecision = 'Graduated';
                    setPromotionDecision('Graduated');
                }
            } else if (autoDecision === 'Promoted' && (!autoPromotedClassId || autoPromotedClassId === classId)) {
                autoPromotedClassId = targetPromotedClass?.id || (targetStudent?.classId !== classId ? targetStudent?.classId : '') || '';
                setPromotedToClassId(autoPromotedClassId);
            }

            setProcessedReport({
                student: targetStudent,
                studentId: selectedStudentId,
                schoolId,
                classId,
                rows: reportRows,
                overallAverage: subjectsTaken > 0 ? Math.round(myGrandTotal / subjectsTaken) : 0,
                classPosition,
                totalStudents: cohortRoll > 0 ? cohortRoll : activeStudents.length,
                totalClassStudents: cohortRoll > 0 ? cohortRoll : activeStudents.length,
                cohortTotal: cohortRoll > 0 ? cohortRoll : activeStudents.length,
                promotionDecision: autoDecision,
                promotedToClassId: autoPromotedClassId,
                promotedToClassName: autoDecision === 'Promoted'
                    ? (classes?.find((c: any) => c.id === autoPromotedClassId)?.name || 'Next Class')
                    : (autoDecision === 'Repeated' ? currentClassName : (autoDecision === 'Graduated' ? 'Graduated' : '')),
                studentPresentDays,
                totalClassDays,
                id: `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`,
                schoolName: (schoolProfile?.name || '')
                    .replace(/\bACADMY\b/gi, 'ACADEMY')
                    .replace(/SUNNY\s+SIDE\s+ACADMY/gi, 'SUNNY SIDE ACADEMY'),
                schoolMotto: schoolProfile?.motto,
                schoolAddress: schoolProfile?.address,
                schoolPhone: schoolProfile?.phone,
                schoolEmail: schoolProfile?.email,
                schoolWebsite: schoolProfile?.website || schoolProfile?.schoolWebsite || null,
                website: schoolProfile?.website || schoolProfile?.schoolWebsite || null,
                brandColor: schoolProfile?.brandColor || '#1e293b',
                logoUrl: schoolProfile?.logoUrl || null, // Stored to assist parent view loading
                nextTermDate: schoolProfile?.nextTermDate || null,
                logoBase64: logoB64,
                headmasterSigBase64: headmasterSigB64,
                teacherSigBase64: teacherSigB64,
                classTeacherName: classTeacherName,
                classTeacherSignatureUrl: classTeacherSignatureUrl,
                headmasterSignatureUrl: schoolData?.headmasterSignatureUrl || null,
                term,
                academicYear,
                className: currentClassName,
                caWeight: currentCaWeight,
                examWeight: currentExamWeight,
                reportCardPositionMode: schoolProfile?.reportCardPositionMode || 'both',
                gradingSystem: schoolProfile?.gradingSystem || null,
            });

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Compilation Error", description: "Failed to pull marks or dates ledger logs." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveProgress = async () => {
        if (!processedReport || !schoolId || isSaving) return;
        setIsSaving(true);
        try {
            const cohortRoll = activeStudents.length || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0);
            const currentClassName = classes?.find((c: any) => c.id === classId)?.name || '';

            const finalData = {
                ...processedReport,
                schoolId, 
                classId,
                className: currentClassName || processedReport.className,
                totalStudents: cohortRoll > 0 ? cohortRoll : (processedReport.totalStudents || 0),
                totalClassStudents: cohortRoll > 0 ? cohortRoll : (processedReport.totalStudents || 0),
                cohortTotal: cohortRoll > 0 ? cohortRoll : (processedReport.totalStudents || 0),
                status: 'Draft', 
                classTeacherComment, 
                headmasterComment,
                ...(isTermMatch(term, 'Third Term') || isTermMatch(term, '3') || promotionDecision ? {
                    promotionDecision: promotionDecision || null,
                    promotedToClassId: promotionDecision === 'Promoted' ? promotedToClassId || null : null,
                    promotedToClassName: promotionDecision === 'Promoted' 
                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name || null)
                        : (promotionDecision === 'Repeated' ? (currentClassName || processedReport.className) : (promotionDecision === 'Graduated' ? 'Graduated' : null))
                } : {}),
                lastUpdatedBy: user?.uid, 
                updatedAt: serverTimestamp()
            };
            
            const { logoBase64, teacherSigBase64, headmasterSigBase64, ...dbFriendlyData } = finalData;
            await setDoc(doc(firestore!, 'report-cards', processedReport.id), dbFriendlyData, { merge: true });
            upsertLocalReportCards([{ id: processedReport.id, data: { ...dbFriendlyData, updatedAt: new Date() } }]);
            setProcessedReport(finalData);
            toast({ title: "Draft Report Saved" });

            await logAuditEvent({
                firestore: firestore!,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'SAVE_REPORT_CARD_DRAFT',
                details: `Saved draft report card for student ${processedReport.student?.firstName || ''} ${processedReport.student?.lastName || ''}`
            });
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Database Error", description: "Could not write draft to Firestore." });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!processedReport || !schoolId || isPublishing) return;
        setIsPublishing(true);
        try {
            const schoolDoc = await getDoc(doc(firestore!, 'schools', schoolId));
            const schoolData = schoolDoc.data();
            const cohortRoll = activeStudents.length || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0);
            const currentClassName = classes?.find((c: any) => c.id === classId)?.name || '';

            const finalData = {
                ...processedReport,
                schoolId, 
                classId,
                className: currentClassName || processedReport.className,
                totalStudents: cohortRoll > 0 ? cohortRoll : (processedReport.totalStudents || 0),
                totalClassStudents: cohortRoll > 0 ? cohortRoll : (processedReport.totalStudents || 0),
                cohortTotal: cohortRoll > 0 ? cohortRoll : (processedReport.totalStudents || 0),
                status: 'Published', 
                publishedAt: serverTimestamp(),
                classTeacherComment, 
                headmasterComment,
                ...(isTermMatch(term, 'Third Term') || isTermMatch(term, '3') || promotionDecision ? {
                    promotionDecision: promotionDecision || null,
                    promotedToClassId: promotionDecision === 'Promoted' ? promotedToClassId || null : null,
                    promotedToClassName: promotionDecision === 'Promoted' 
                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name || null)
                        : (promotionDecision === 'Repeated' ? (currentClassName || processedReport.className) : (promotionDecision === 'Graduated' ? 'Graduated' : null))
                } : {}),
                headmasterName: schoolData?.headmasterName || 'Head of School',
                headmasterSignatureUrl: schoolData?.headmasterSignatureUrl || null,
                headmasterSignedAt: serverTimestamp(),
                digitalFingerprint: `AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            };

            const { logoBase64, teacherSigBase64, headmasterSigBase64, ...dbFriendlyData } = finalData;
            await setDoc(doc(firestore!, 'report-cards', processedReport.id), dbFriendlyData, { merge: true });
            upsertLocalReportCards([{ id: processedReport.id, data: { ...dbFriendlyData, status: 'Published', publishedAt: new Date(), updatedAt: new Date() } }]);
            setProcessedReport(finalData);
            toast({ title: "Report Card Signed & Published! 🎓", description: "Parents and students can now view the official transcript." });
            
            await logAuditEvent({
                firestore: firestore!,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'PUBLISH_REPORT_CARD',
                details: `Published report card for student ${processedReport.student?.firstName || ''} ${processedReport.student?.lastName || ''} (${term}, ${academicYear})`
            });

            await notifyParents([selectedStudentId!], "Report Card Ready 🎓", `Terminal report card for ${processedReport.student?.firstName} has been released.`, "/dashboard/my-reports");
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Publish Error", description: "Database publish transaction failed." });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleBulkPublish = async () => {
        if (!firestore || !schoolId || !classSummary || classSummary.drafts.length === 0 || isBulkPublishing) return;
        setIsBulkPublishing(true);
        try {
            const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
            const schoolData = schoolDoc.data();
            const headmasterName = schoolData?.headmasterName || 'Head of School';
            const headmasterSignatureUrl = schoolData?.headmasterSignatureUrl || null;

            const studentIdsToNotify: string[] = [];
            const localUpdates: Array<{ id: string; data: any }> = [];
            const drafts = classSummary.drafts;
            for (let i = 0; i < drafts.length; i += 450) {
                const batch = writeBatch(firestore);
                drafts.slice(i, i + 450).forEach(({ student, report }: any) => {
                    // Older report cards live in "term_report_cards" — update them where they are
                    // (updating the wrong collection failed the whole bulk publish).
                    const reportRef = doc(firestore, report._col || 'report-cards', report.id);
                    const fingerprint = `AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                    batch.update(reportRef, {
                        status: 'Published',
                        publishedAt: serverTimestamp(),
                        headmasterName,
                        headmasterSignatureUrl,
                        headmasterSignedAt: serverTimestamp(),
                        digitalFingerprint: fingerprint
                    });
                    if ((report._col || 'report-cards') === 'report-cards') {
                        localUpdates.push({ id: report.id, data: { status: 'Published', publishedAt: new Date(), headmasterName, headmasterSignatureUrl, digitalFingerprint: fingerprint } });
                    }
                    studentIdsToNotify.push(student.uid || student.id || report.studentId);
                });
                await batch.commit();
            }
            upsertLocalReportCards(localUpdates);
            toast({ title: "Bulk Publish Successful! 🎉", description: `Released ${studentIdsToNotify.length} report cards.` });
            
            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'BULK_PUBLISH_REPORT_CARDS',
                details: `Bulk published ${studentIdsToNotify.length} report cards for class ${classes?.find(c => c.id === classId)?.name || classId} (${term}, ${academicYear})`
            });

            notifyParents(studentIdsToNotify, "Report Card Ready 🎓", "Terminal report cards are now available.", "/dashboard/my-reports")
                .catch(err => console.error("Bulk notification failed:", err));
        } catch (e: any) {
            console.error("Bulk publish error:", e);
            toast({ variant: 'destructive', title: "Bulk Publish Failed" });
        } finally {
            setIsBulkPublishing(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element || !processedReport) return;

        setIsExporting(true);
        try {
            element.style.visibility = 'visible';
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.zIndex = '-1';
            element.style.display = 'flex';

            await new Promise(resolve => setTimeout(resolve, 800));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                windowHeight: 1123,
            });

            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            element.style.display = 'none';

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(`${processedReport.student?.firstName}_Report_${term}.pdf`);
            toast({ title: "PDF Export Complete 📥" });
        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "PDF Generation Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadAllPDF = async () => {
        if (!classReportCards || classReportCards.length === 0 || !schoolId || !schoolProfile) {
            toast({ variant: 'destructive', title: "No Reports", description: "There are no compiled report cards to print for this class." });
            return;
        }
        setIsExporting(true);
        setExportProgress(1);

        try {
            // 1. Pre-fetch school logo and signatures in base64 format once
            const schoolDoc = await getDoc(doc(firestore!, 'schools', schoolId));
            const schoolData = schoolDoc?.data();

            const [logoB64, headmasterSigB64] = await Promise.all([
                schoolProfile.logoUrl ? getBase64ImageFromUrl(schoolProfile.logoUrl) : Promise.resolve(''),
                schoolData?.headmasterSignatureUrl ? getBase64ImageFromUrl(schoolData.headmasterSignatureUrl) : Promise.resolve(''),
            ]);

            let classTeacherSignatureUrl = null;
            const selectedClass = classes?.find((c: any) => c.id === classId);
            const classTeacherId = selectedClass?.teacherId;

            if (classTeacherId) {
                const teacherDoc = await getDoc(doc(firestore!, 'staff', classTeacherId));
                if (teacherDoc.exists()) {
                    const tData = teacherDoc.data();
                    classTeacherSignatureUrl = tData.signatureBase64 || tData.signatureUrl || null;
                }
            }

            const teacherSigB64 = classTeacherSignatureUrl 
                ? await getBase64ImageFromUrl(classTeacherSignatureUrl) 
                : '';

            setBatchLogoBase64(logoB64);
            setBatchHeadmasterSigBase64(headmasterSigB64);
            setBatchTeacherSigBase64(teacherSigB64);
            
            setIsPrintingAll(true);

            // Give DOM time to render all report cards with base64 images
            await new Promise(resolve => setTimeout(resolve, 2000));

            const printArea = printRef.current;
            if (!printArea) throw new Error("Print area not found");

            // Make print area temporarily visible to the capture engine
            printArea.style.visibility = 'visible';
            printArea.style.position = 'fixed';
            printArea.style.top = '0';
            printArea.style.left = '0';
            printArea.style.zIndex = '-1000';
            printArea.style.display = 'block';

            const cardElements = printArea.getElementsByClassName('print-page-break');
            if (cardElements.length === 0) {
                printArea.style.visibility = 'hidden';
                printArea.style.position = 'absolute';
                printArea.style.display = 'none';
                throw new Error("No reports found to compile");
            }

            const pdf = new jsPDF('p', 'mm', 'a4');

            for (let i = 0; i < cardElements.length; i++) {
                setExportProgress(i + 1);
                const element = cardElements[i] as HTMLElement;
                
                const canvas = await html2canvas(element, {
                    scale: 1.5,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    windowWidth: 794,
                    windowHeight: 1123,
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.9);
                
                if (i > 0) {
                    pdf.addPage();
                }
                pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            }

            // Cleanup visibility
            printArea.style.visibility = 'hidden';
            printArea.style.position = 'absolute';
            printArea.style.display = 'none';

            const className = classes?.find((c: any) => c.id === classId)?.name || 'Class';
            pdf.save(`All_Reports_${className}_${term}.pdf`);
            toast({ title: "Class PDF Compilation Complete 📥", description: `Successfully generated a ${cardElements.length}-page report card document.` });
        } catch (error: any) {
            console.error(error);
            const printArea = printRef.current;
            if (printArea) {
                printArea.style.visibility = 'hidden';
                printArea.style.position = 'absolute';
                printArea.style.display = 'none';
            }
            toast({ variant: 'destructive', title: "PDF Generation Failed", description: error.message || "An error occurred during combined PDF rendering." });
        } finally {
            setIsExporting(false);
            setIsPrintingAll(false);
            setExportProgress(0);
            setBatchLogoBase64('');
            setBatchHeadmasterSigBase64('');
            setBatchTeacherSigBase64('');
        }
    };

    const handleGenerateComment = async (type: 'Teacher' | 'Headmaster') => {
        if (!processedReport || !schoolId) return;
        
        const setLoader = type === 'Teacher' ? setIsGeneratingTeacherComment : setIsGeneratingHeadmasterComment;
        const setComment = type === 'Teacher' ? setClassTeacherComment : setHeadmasterComment;
        
        setLoader(true);
        try {
            const res = await generateReportCommentAction(
                schoolId, 
                `${processedReport.student.firstName} ${processedReport.student.lastName}`, 
                processedReport.overallAverage, 
                type,
                term
            );
            
            if (res.success && res.text) {
                setComment(res.text); 
                const combinedComments = type === 'Teacher' 
                    ? `${headmasterComment} ${res.text}` 
                    : `${res.text} ${classTeacherComment}`;
                if (!promotionDecision || promotionDecision === '') {
                    const targetPromotedClass = getPromotedTargetClass(
                        classId,
                        classes || [],
                        combinedComments,
                        targetStudent,
                        activeStudents
                    );
                    if (commentsSayPromoted(combinedComments)) {
                        setPromotionDecision('Promoted');
                        if (targetPromotedClass) setPromotedToClassId(targetPromotedClass.id);
                    }
                }
                toast({ title: "AI Draft Remark Generated ✨", description: "Review and edit text comments before saving." });
            } else {
                toast({ variant: 'destructive', title: "AI Remark Failed", description: res.error });
            }
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "AI Connection Error", description: e.message || "Failed to generate AI comments." });
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Standardized Hero Banner */}
            <SectionHeroBanner
              title="Report Card Manager"
              subtitle="Draft remarks, sign with electronic stamps, and batch publish certified academic terminal reports."
              eyebrow="ACADEMIC CERTIFICATION"
              icon={FileText}
              className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl"
              actions={
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  <div className="bg-slate-950/60 border border-slate-800/80 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span>{role || 'DIRECTOR'}</span>
                  </div>
                  <div className={cn(
                    "border text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0",
                    isAdminOrDirector 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", isAdminOrDirector ? "bg-emerald-400" : "bg-amber-400")} />
                    <span>{isAdminOrDirector ? 'SIGN & PUBLISH ACTIVE' : 'DRAFT ONLY'}</span>
                  </div>
                </div>
              }
            />

            {/* Filter Roster Selection Card */}
            <Card className="border border-slate-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-50 bg-slate-50/20 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-lg font-black text-slate-800">Filter Student Records</CardTitle>
                            <CardDescription className="text-slate-400">Select academic term settings and target student to compile report card.</CardDescription>
                        </div>
                        {historicalCohortInfo && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-sm">
                                <History className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                <span>{historicalCohortInfo.label}</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-6 bg-white">
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear} disabled={role?.toLowerCase() === 'teacher'}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Term</Label>
                        <Select value={term} onValueChange={setTerm} disabled={role?.toLowerCase() === 'teacher'}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Class</Label>
                        <Select value={classId} onValueChange={(val) => { setClassId(val); setSelectedStudentId(null); setProcessedReport(null); }}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue placeholder="Select Class"/>
                            </SelectTrigger>
                            <SelectContent>{visibleClasses?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Student</Label>
                        <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue placeholder="Choose Student"/>
                            </SelectTrigger>
                            <SelectContent>
                                {activeStudents.map((s:any) => {
                                    const isPromotedAway = s.classId && s.classId !== classId;
                                    const promotedClassName = isPromotedAway ? classes?.find((c: any) => c.id === s.classId)?.name : null;
                                    return (
                                        <SelectItem key={s.uid} value={s.uid}>
                                            {s.firstName} {s.lastName}
                                            {promotedClassName ? ` (Now in ${promotedClassName})` : ''}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Button 
                          onClick={generateReport} 
                          disabled={isGenerating || !selectedStudentId} 
                          className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl font-bold text-white shadow-sm transition-all flex items-center justify-center"
                        >
                            {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>} Compile Transcript
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Class Summary widgets */}
            {classId && classSummary && (
                <Card className="border border-emerald-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-slate-50">
                        <div>
                            <CardTitle className="text-lg flex flex-wrap items-center gap-2 font-black text-slate-800">
                                <GraduationCap className="text-emerald-600 h-5 w-5" /> 
                                Class Status Summary: {classes?.find((c: any) => c.id === classId)?.name || ''}
                                {historicalCohortInfo && (
                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                        <History className="h-3 w-3 text-amber-600" />
                                        {historicalCohortInfo.promotedClassText ? `Promoted to ${historicalCohortInfo.promotedClassText}` : 'Historical Cohort'}
                                    </span>
                                )}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Overview of terminal report cards draft status for this class.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            {(() => {
                                const compiledCount = classReportCards?.length || 0;
                                const hasNoCards = compiledCount === 0;
                                return (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span tabIndex={0} className={hasNoCards ? "cursor-not-allowed inline-block" : "inline-block"}>
                                                    <Button 
                                                        onClick={handleDownloadAllPDF} 
                                                        disabled={hasNoCards || isExporting} 
                                                        className={cn(
                                                            "bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white shadow h-10 px-6 text-xs flex items-center transition-all",
                                                            hasNoCards && "opacity-60 cursor-not-allowed pointer-events-none"
                                                        )}
                                                    >
                                                        {isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>}
                                                        {isExporting && exportProgress > 0 
                                                            ? `Compiling ${exportProgress} / ${compiledCount}...` 
                                                            : `Download Combined PDF (${compiledCount})`}
                                                    </Button>
                                                </span>
                                            </TooltipTrigger>
                                            {hasNoCards && (
                                                <TooltipContent className="bg-slate-900 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xl">
                                                    <p>Compile report cards first</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })()}
                            {isAdminOrDirector && (() => {
                                const draftCount = classSummary.drafts.length;
                                const isDraftDisabled = draftCount === 0 || isBulkPublishing;

                                const publishButton = (
                                    <Button 
                                        disabled={isDraftDisabled} 
                                        className={`bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white shadow h-10 px-6 text-xs transition-all ${draftCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isBulkPublishing ? (
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                        ) : (
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                        )}
                                        {`Bulk Publish Drafts (${draftCount})`}
                                    </Button>
                                );

                                if (draftCount === 0) {
                                    return publishButton;
                                }

                                return (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            {publishButton}
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl p-6">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-black text-slate-800">Bulk Publish Report Cards?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-slate-400 text-sm leading-relaxed">
                                                    This will officially sign and publish all **{draftCount}** draft report cards. Parents and students will be notified in-app and can download the files immediately.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="gap-2 mt-4">
                                                <AlertDialogCancel className="rounded-xl border border-slate-200 text-slate-600 font-bold">Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={handleBulkPublish} 
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                                                >
                                                    Publish All Drafts
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                );
                            })()}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
                                <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-700">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-emerald-655 uppercase tracking-wider">Published</p>
                                    <p className="text-2xl font-black text-slate-800 mt-0.5">{classSummary.published.length}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center gap-3">
                                <div className="bg-amber-100 p-2.5 rounded-full text-amber-700">
                                    <PenTool className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-amber-655 uppercase tracking-wider">Drafts Ready</p>
                                    <p className="text-2xl font-black text-slate-800 mt-0.5">{classSummary.drafts.length}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-center gap-3">
                                <div className="bg-slate-100 p-2.5 rounded-full text-slate-500">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Not Compiled</p>
                                    <p className="text-2xl font-black text-slate-800 mt-0.5">{classSummary.missing.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* List breakdown scrollables */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                            <div>
                                <h4 className="text-xs font-black text-emerald-700 mb-2 uppercase tracking-widest">Published ({classSummary.published.length})</h4>
                                <ScrollArea className="h-36 border border-slate-100 rounded-xl p-3 bg-white shadow-inner">
                                    {classSummary.published.length > 0 ? (
                                        classSummary.published.map(({ student }: any) => (
                                            <div key={student.uid} className="text-xs py-2 border-b border-slate-50 last:border-0 font-semibold text-slate-700 flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                {student.firstName} {student.lastName}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic p-2">No published report cards.</p>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-amber-700 mb-2 uppercase tracking-widest">Drafts Ready ({classSummary.drafts.length})</h4>
                                <ScrollArea className="h-36 border border-slate-100 rounded-xl p-3 bg-white shadow-inner">
                                    {classSummary.drafts.length > 0 ? (
                                        classSummary.drafts.map(({ student }: any) => (
                                            <div key={student.uid} className="text-xs py-1.5 border-b border-slate-50 last:border-0 font-semibold text-slate-700 flex justify-between items-center">
                                                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-450 animate-pulse"></span> {student.firstName} {student.lastName}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 text-[10px] text-indigo-600 font-bold hover:text-indigo-800 hover:bg-indigo-50 px-2 rounded-lg"
                                                    onClick={() => setSelectedStudentId(student.uid)}
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic p-2">No drafts compiled.</p>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Not Compiled ({classSummary.missing.length})</h4>
                                <ScrollArea className="h-36 border border-slate-100 rounded-xl p-3 bg-white shadow-inner">
                                    {classSummary.missing.length > 0 ? (
                                        classSummary.missing.map((student: any) => (
                                            <div key={student.uid} className="text-xs py-1.5 border-b border-slate-50 last:border-0 font-semibold text-slate-700 flex justify-between items-center">
                                                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span> {student.firstName} {student.lastName}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 text-[10px] text-indigo-650 font-bold hover:text-indigo-800 hover:bg-indigo-50 px-2 rounded-lg"
                                                    onClick={() => setSelectedStudentId(student.uid)}
                                                >
                                                    Compile
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-450 italic p-2">All report cards compiled!</p>
                                    )}
                                </ScrollArea>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {processedReport && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    {/* Final Remarks card */}
                    <Card className="border border-orange-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/10 p-6">
                            <CardTitle className="text-base font-black text-slate-800">Review Comments & Actions</CardTitle>
                            <CardDescription className="text-slate-400">Add final remarks, generate AI drafts, and publish terminal reports.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Class Teacher's Remark</Label>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className="text-purple-650 hover:text-purple-800 hover:bg-purple-50 h-7 px-2.5 rounded-lg text-[10px] font-bold gap-1 transition-all" 
                                        onClick={() => handleGenerateComment('Teacher')}
                                        disabled={isGeneratingTeacherComment || (!isTeacher && !isAdminOrDirector)}
                                    >
                                        {isGeneratingTeacherComment ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3 text-purple-600 animate-pulse"/>}
                                        AI Draft (1 credit)
                                    </Button>
                                </div>
                                <Textarea 
                                  placeholder="Type class teacher remarks..." 
                                  value={classTeacherComment} 
                                  onChange={(e) => setClassTeacherComment(e.target.value)} 
                                  rows={4} 
                                  disabled={!isTeacher && !isAdminOrDirector}
                                  className="rounded-xl border border-slate-200 focus-visible:ring-indigo-500 shadow-sm text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Headmaster's Remark</Label>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className="text-purple-650 hover:text-purple-800 hover:bg-purple-50 h-7 px-2.5 rounded-lg text-[10px] font-bold gap-1 transition-all" 
                                        onClick={() => handleGenerateComment('Headmaster')}
                                        disabled={isGeneratingHeadmasterComment || !isAdminOrDirector}
                                    >
                                        {isGeneratingHeadmasterComment ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3 text-purple-600 animate-pulse"/>}
                                        AI Draft (1 credit)
                                    </Button>
                                </div>
                                <Textarea 
                                  placeholder="Type headmaster comments..." 
                                  value={headmasterComment} 
                                  onChange={(e) => setHeadmasterComment(e.target.value)} 
                                  rows={4} 
                                  disabled={!isAdminOrDirector}
                                  className="rounded-xl border border-slate-200 focus-visible:ring-indigo-500 shadow-sm text-sm"
                                />
                            </div>
                            {(isTermMatch(term, 'Third Term') || isTermMatch(term, '3') || promotionDecision) && (
                                <div className="col-span-1 md:col-span-2 border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Promotion Decision</Label>
                                        <Select 
                                            value={promotionDecision} 
                                            onValueChange={(val: any) => {
                                                setPromotionDecision(val);
                                                if (val !== 'Promoted') {
                                                    setPromotedToClassId('');
                                                } else if (!promotedToClassId) {
                                                    const targetPromoted = getPromotedTargetClass(classId, classes || [], `${headmasterComment || ''} ${classTeacherComment || ''}`, targetStudent, activeStudents);
                                                    if (targetPromoted) setPromotedToClassId(targetPromoted.id);
                                                }
                                            }}
                                            disabled={!isTeacher && !isAdminOrDirector}
                                        >
                                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                                <SelectValue placeholder="Select Decision" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Promoted">
                                                    Promoted{(() => {
                                                        const targetClassObj = classes?.find((c: any) => c.id === promotedToClassId)
                                                            || getPromotedTargetClass(classId, classes || [], `${headmasterComment || ''} ${classTeacherComment || ''}`, targetStudent, activeStudents);
                                                        return targetClassObj ? ` to ${targetClassObj.name}` : '';
                                                    })()}
                                                </SelectItem>
                                                <SelectItem value="Repeated">Repeated (Repeat Class)</SelectItem>
                                                <SelectItem value="Graduated">Graduated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    {promotionDecision === 'Promoted' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Promote To Class</Label>
                                            <Select 
                                                value={promotedToClassId || (getPromotedTargetClass(classId, classes || [], `${headmasterComment || ''} ${classTeacherComment || ''}`, targetStudent, activeStudents)?.id || '')} 
                                                onValueChange={setPromotedToClassId}
                                                disabled={!isTeacher && !isAdminOrDirector}
                                            >
                                                <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                                    <SelectValue placeholder="Select Target Class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classes?.filter((c: any) => c.id !== classId).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="justify-end gap-2 bg-slate-50/50 border-t border-slate-100 p-4">
                            <Button onClick={handleDownloadPDF} disabled={isExporting} variant="secondary" className="rounded-xl font-bold h-10">{isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>} Download PDF</Button>
                            <Button onClick={handleSaveProgress} disabled={isSaving} className="bg-slate-800 hover:bg-slate-900 rounded-xl font-bold h-10 text-white"><Save className="mr-2 h-4 w-4"/> Save Draft</Button>
                            {isAdminOrDirector && (
                                <Button onClick={handlePublish} disabled={isPublishing} className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl h-10 text-white">
                                    {isPublishing ? <Loader2 className="animate-spin h-4 w-4"/> : <ShieldCheck className="mr-2 h-4 w-4"/>} Sign & Publish
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Styled Mockup Viewport container */}
                    <div className="flex flex-col items-center justify-center bg-slate-800 py-12 px-6 rounded-[2.5rem] border border-slate-700 shadow-inner relative group">
                        <div className="absolute top-4 left-6 flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                            <Eye className="h-3.5 w-3.5 text-slate-500" /> A4 PAGE LIVE VIEWPORT MOCKUP
                        </div>
                        <div className="shadow-2xl ring-4 ring-black/40 bg-white scale-[0.7] sm:scale-[0.8] origin-top md:scale-100 transition-all rounded-sm overflow-hidden" style={{ width: '794px' }}>
                            <ReportCardTemplate
                                data={{
                                    ...processedReport,
                                    className: classes?.find((c: any) => c.id === classId)?.name || processedReport?.className || '',
                                    totalStudents: (activeStudents.length > 0 ? activeStudents.length : null) || processedReport?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    totalClassStudents: (activeStudents.length > 0 ? activeStudents.length : null) || processedReport?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    cohortTotal: (activeStudents.length > 0 ? activeStudents.length : null) || processedReport?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    promotionDecision,
                                    promotedToClassId,
                                    promotedToClassName: promotionDecision === 'Promoted'
                                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name 
                                            || getPromotedTargetClass(classId, classes || [], `${headmasterComment || ''} ${classTeacherComment || ''}`, targetStudent, activeStudents)?.name
                                            || 'Next Class')
                                        : (promotionDecision === 'Repeated' ? (classes?.find((c: any) => c.id === classId)?.name || processedReport?.className) : (promotionDecision === 'Graduated' ? 'Graduated' : ''))
                                }}
                                classTeacherComment={classTeacherComment}
                                headmasterComment={headmasterComment}
                                caWeight={processedReport?.caWeight ?? CA_WEIGHT}
                                examWeight={processedReport?.examWeight ?? EXAM_WEIGHT}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={printRef}
                id="print-area"
                style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1, width: '794px', display: 'none' }}
            >
                {isPrintingAll && classReportCards && classReportCards.length > 0 ? (
                    classReportCards.map((report: any) => (
                        <div key={report.id} className="print-page-break">
                            <ReportCardTemplate
                                data={{
                                    ...report,
                                    className: classes?.find((c: any) => c.id === classId)?.name || report?.className || '',
                                    totalStudents: (activeStudents.length > 0 ? activeStudents.length : null) || report?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    totalClassStudents: (activeStudents.length > 0 ? activeStudents.length : null) || report?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    cohortTotal: (activeStudents.length > 0 ? activeStudents.length : null) || report?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    schoolWebsite: report.schoolWebsite || report.website || schoolProfile?.website || schoolProfile?.schoolWebsite || '',
                                    website: report.website || report.schoolWebsite || schoolProfile?.website || schoolProfile?.schoolWebsite || '',
                                    gradingSystem: (report.gradingSystem && Array.isArray(report.gradingSystem) && report.gradingSystem.length > 0)
                                        ? report.gradingSystem
                                        : ((schoolProfile?.gradingSystem && Array.isArray(schoolProfile.gradingSystem) && schoolProfile.gradingSystem.length > 0) ? schoolProfile.gradingSystem : null),
                                    logoBase64: batchLogoBase64 || report.logoBase64 || '',
                                    headmasterSigBase64: batchHeadmasterSigBase64 || report.headmasterSigBase64 || '',
                                    teacherSigBase64: batchTeacherSigBase64 || report.teacherSigBase64 || ''
                                }}
                                classTeacherComment={report.classTeacherComment}
                                headmasterComment={report.headmasterComment}
                                caWeight={report.caWeight ?? CA_WEIGHT}
                                examWeight={report.examWeight ?? EXAM_WEIGHT}
                            />
                        </div>
                    ))
                ) : (
                    processedReport && (
                        <div className="print-page-break">
                            <ReportCardTemplate
                                data={{
                                    ...processedReport,
                                    className: classes?.find((c: any) => c.id === classId)?.name || processedReport?.className || '',
                                    totalStudents: (activeStudents.length > 0 ? activeStudents.length : null) || processedReport?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    totalClassStudents: (activeStudents.length > 0 ? activeStudents.length : null) || processedReport?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    cohortTotal: (activeStudents.length > 0 ? activeStudents.length : null) || processedReport?.totalStudents || (classSummary ? (classSummary.published.length + classSummary.drafts.length + classSummary.missing.length) : 0),
                                    promotionDecision,
                                    promotedToClassId,
                                    promotedToClassName: promotionDecision === 'Promoted'
                                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name 
                                            || getPromotedTargetClass(classId, classes || [], `${headmasterComment || ''} ${classTeacherComment || ''}`, targetStudent, activeStudents)?.name
                                            || 'Next Class')
                                        : (promotionDecision === 'Repeated' ? (classes?.find((c: any) => c.id === classId)?.name || processedReport?.className) : (promotionDecision === 'Graduated' ? 'Graduated' : ''))
                                }}
                                classTeacherComment={classTeacherComment}
                                headmasterComment={headmasterComment}
                                caWeight={processedReport?.caWeight ?? CA_WEIGHT}
                                examWeight={processedReport?.examWeight ?? EXAM_WEIGHT}
                            />
                        </div>
                    )
                )}
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    html, body {
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                    }
                    body * { visibility: hidden !important; }
                    #print-area, #print-area * { 
                        visibility: visible !important; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    #print-area { 
                        position: absolute !important; 
                        left: 0 !important; 
                        top: 0 !important; 
                        width: 210mm !important; 
                        height: 297mm !important; 
                        margin: 0 !important;
                        padding: 0 !important;
                        display: block !important; 
                    }
                    .print-page-break {
                        page-break-after: always;
                        break-after: page;
                        page-break-inside: avoid;
                        break-inside: avoid;
                        display: block !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        overflow: hidden !important;
                    }
                }
            `}</style>
        </div>
    );
}

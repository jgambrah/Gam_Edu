'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { 
  Users, Award, FileText, Megaphone, CalendarCheck, TrendingUp, LayoutTemplate,
  CheckCircle, XCircle, AlertCircle, Clock, Wallet, MessageSquare, ChevronRight,
  TrendingDown, ArrowUpRight, CheckSquare, Info, ShieldAlert, BookOpen, AlertTriangle,
  User, Activity, CalendarDays, FlaskConical, Utensils, MapPin,
  Star, Frown, Smile, HeartHandshake, ThumbsUp, ChevronDown, Loader2, ShoppingBag,
  Bus as BusIcon, Camera
} from 'lucide-react';
import { StudentTransportCard } from '@/components/dashboard/StudentTransportCard';
import { ClassStoryFeed } from '@/components/dashboard/ClassStoryFeed';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useFirestore, useMemoFirebase, useUser, useCollection } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BADGE_CATALOG } from '@/lib/achievement-utils';

export function ParentDashboard({ 
  profile, 
  children = [], 
  financials: allFinancials = [], 
  announcements = [], 
  isLoading, 
  schoolSettings,
  stickers = [],
  assessments = [],
  attendance = [],
  subjects = [],
  selectedChildId,
  setSelectedChildId,
  classAverages = null,
  currentTerm = null,
  termStartDate = null,
  assignments = [],
  submissions = [],
  students = [],
  classes = [],
  quizzes = [],
  quizAttempts = []
}: any) {
    const displayName = profile?.firstName || 'Parent';
    // Bills from a closed term are archived; their remaining balance is on the Brought Forward record.
    const financials = useMemo(() => (allFinancials || []).filter((r: any) => r?.isArchived !== true), [allFinancials]);
    const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'activity' | 'attendance' | 'academics' | 'examination' | 'assignments' | 'financials' | 'transport' | 'notices' | 'satisfaction'>('overview');
    const termLabel: string = currentTerm ? `${currentTerm.term} ${currentTerm.academicYear}` : 'this term';
    const [academicTrendView, setAcademicTrendView] = useState<'improvement' | 'decline' | 'subject-comparison' | 'class-comparison'>('improvement');

    // Firebase & Satisfaction State Setup
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();

    const [satisfactionMode, setSatisfactionMode] = useState<'complaint' | 'feedback' | 'teacher' | 'service'>('complaint');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [selectedService, setSelectedService] = useState('Canteen');
    const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');

    // Fetch teachers list for teacher ratings (gated to satisfaction tab)
    const teachersQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || activeTab !== 'satisfaction') return null;
        return query(
            collection(firestore, 'staff'),
            where('schoolId', '==', schoolId),
            where('role', '==', 'Teacher'),
            limit(50)
        );
    }, [firestore, schoolId, activeTab]);

    const { data: teachersData } = useCollection<any>(teachersQuery);
    const teachers = teachersData || [];

    // Fetch past submissions for this parent (gated to satisfaction tab)
    const satisfactionQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user?.uid || activeTab !== 'satisfaction') return null;
        return query(
            collection(firestore, 'parent_satisfaction'),
            where('parentId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, schoolId, user?.uid, activeTab]);

    const { data: satisfactionData, isLoading: loadingSatisfaction } = useCollection<any>(satisfactionQuery);
    const pastSubmissions = satisfactionData || [];

    // Handle form submission
    const handleSatisfactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !user) return;

        if (satisfactionMode === 'teacher' && !selectedTeacherId) {
            toast({
                variant: 'destructive',
                title: 'Selection Required',
                description: 'Please select a teacher to rate.'
            });
            return;
        }

        if (!content.trim()) {
            toast({
                variant: 'destructive',
                title: 'Details Required',
                description: 'Please enter details for your submission.'
            });
            return;
        }

        if ((satisfactionMode === 'feedback' || satisfactionMode === 'teacher' || satisfactionMode === 'service') && rating === 0) {
            toast({
                variant: 'destructive',
                title: 'Rating Required',
                description: 'Please select a rating from 1 to 5 stars.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedTeacher = teachers.find((t: any) => t.uid === selectedTeacherId || t.id === selectedTeacherId);
            const teacherName = selectedTeacher ? `${selectedTeacher.firstName || ''} ${selectedTeacher.lastName || ''}`.trim() : '';
            const parentName = profile 
                ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() 
                : user.displayName || user.email || 'Parent';

            const docData: any = {
                schoolId,
                parentId: user.uid,
                parentName,
                type: satisfactionMode === 'teacher' ? 'teacher_rating' : 
                      satisfactionMode === 'service' ? 'service_rating' : 
                      satisfactionMode,
                content: content.trim(),
                status: 'Pending',
                createdAt: serverTimestamp()
            };

            if (satisfactionMode === 'complaint') {
                docData.title = title.trim() || 'School Complaint';
                docData.urgency = urgency;
            } else if (satisfactionMode === 'feedback') {
                docData.title = title.trim() || 'General Feedback';
                docData.rating = rating;
            } else if (satisfactionMode === 'teacher') {
                docData.teacherId = selectedTeacherId;
                docData.teacherName = teacherName;
                docData.rating = rating;
            } else if (satisfactionMode === 'service') {
                docData.serviceType = selectedService;
                docData.rating = rating;
            }

            await addDoc(collection(firestore, 'parent_satisfaction'), docData);

            toast({
                title: 'Success!',
                description: 'Your entry has been submitted to the school administration.'
            });

            // Reset form
            setTitle('');
            setContent('');
            setRating(0);
            setSelectedTeacherId('');
            setSelectedService('Canteen');
            setUrgency('Medium');
        } catch (err: any) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: err.message || 'An error occurred during submission.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalOutstanding = useMemo(() => {
        if (!financials) return 0;
        return financials.reduce((sum: number, r: any) => {
            // A rejected reversal leaves the bill owed as normal; only a reversal still pending is set aside.
            if (r.status === 'Pending Reversal') return sum;
            const balance = (Number(r.billedAmount) || 0) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0);
            return sum + Math.max(0, balance);
        }, 0);
    }, [financials]);

    const activeChildId = selectedChildId || children?.[0]?.uid || '';
    const activeChild = useMemo(() => children?.find((c: any) => c.uid === activeChildId), [children, activeChildId]);
    const activeClassId = activeChild?.classId || '';
    const activeClassName = useMemo(() => {
        if (!activeClassId) return 'Unassigned';
        const matchedClass = classes?.find((c: any) => c.id === activeClassId || c.uid === activeClassId);
        return matchedClass?.name || activeClassId;
    }, [activeClassId, classes]);

    // Active Child Stickers & Digital Achievement Badges
    const activeChildStickers = useMemo(() => {
        const list: any[] = [];

        // 1. Digital Badges from student document (earnedBadges)
        if (activeChild && Array.isArray((activeChild as any).earnedBadges)) {
            (activeChild as any).earnedBadges.forEach((b: any, idx: number) => {
                const catalogItem = BADGE_CATALOG.find(c => c.id === b.id || (b.id && b.id.startsWith(`${c.id}_`)) || c.title.toLowerCase() === b.title?.toLowerCase());
                list.push({
                    id: b.id || `earned_badge_${idx}`,
                    name: b.title || catalogItem?.title || 'Achievement Badge',
                    emoji: catalogItem?.icon || '⚡',
                    category: b.category || catalogItem?.category || 'Achievement',
                    earnedAt: b.unlockedAt ? new Date(b.unlockedAt) : null
                });
            });
        }

        // 2. Legacy reward stickers
        if (stickers && activeChildId) {
            stickers.filter((s: any) => s.userId === activeChildId).forEach((s: any) => {
                list.push({
                    id: s.id || s.uid,
                    name: s.name || 'Reward Sticker',
                    emoji: s.emoji || '🎓',
                    category: s.category || 'Reward',
                    earnedAt: s.earnedAt?.toDate ? s.earnedAt.toDate() : null
                });
            });
        }

        return list;
    }, [activeChild, stickers, activeChildId]);

    // Active Child Assessments
    const activeChildAssessments = useMemo(() => {
        if (!assessments || !activeChildId) return [];
        const filtered = assessments.filter((a: any) => a.studentId === activeChildId);
        return [...filtered].sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [assessments, activeChildId]);

    // Active Child Attendance
    const activeChildAttendance = useMemo(() => {
        if (!attendance || !activeChildId) return [];
        const filtered = attendance.filter((a: any) => a.studentId === activeChildId);
        return [...filtered].sort((a: any, b: any) => {
            const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [attendance, activeChildId]);

    // Attendance stats
    const attendanceStats = useMemo(() => {
        if (activeChildAttendance.length === 0) {
            // No register entries yet this term: say so (it used to show an invented 95%).
            return { total: 0, present: 0, absent: 0, late: 0, rate: null as number | null };
        }
        const total = activeChildAttendance.length;
        const present = activeChildAttendance.filter((a: any) => a.status === 'Present').length;
        const late = activeChildAttendance.filter((a: any) => a.status === 'Late').length;
        const absent = activeChildAttendance.filter((a: any) => a.status === 'Absent').length;
        const rate: number | null = Math.round(((present + late) / total) * 100);
        return { total, present, absent, late, rate };
    }, [activeChildAttendance, activeChild]);

    // Class subject averages for this term, from the server-kept class document (no classmates' marks needed).
    const classSubjectAverages = useMemo(() => {
        const result: Record<string, number> = {};
        Object.entries(classAverages?.subjects || {}).forEach(([subjectId, v]: any) => {
            if (!(Number(v?.c) > 0)) return;
            const sub = subjects?.find((s: any) => s.id === subjectId);
            const name = sub?.name || v.name || subjectId;
            result[name] = Math.round(Number(v.s) / Number(v.c));
        });
        return result;
    }, [classAverages, subjects]);
    const classOverallAverage: number | null = Number(classAverages?.totals?.c) > 0 ? Math.round(Number(classAverages.totals.s) / Number(classAverages.totals.c)) : null;

    // Child subject averages
    const subjectAverages = useMemo(() => {
        const averages: Record<string, { totalPct: number; count: number; name: string }> = {};
        activeChildAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!averages[subName]) {
                    averages[subName] = { totalPct: 0, count: 0, name: subName };
                }
                averages[subName].totalPct += pct;
                averages[subName].count++;
            }
        });
        return Object.values(averages).map(avg => {
            const childAvg = Math.round(avg.totalPct / avg.count);
            const classAvg = classSubjectAverages[avg.name] ?? null;
            return {
                name: avg.name,
                average: childAvg,
                classAverage: classAvg
            };
        });
    }, [activeChildAssessments, subjects, classSubjectAverages]);

    // Only the child's real marks (it used to show invented Maths 84 / English 78 / Science 81 / ICT 88).
    const displaySubjectAverages = subjectAverages;
    const hasClassComparison = displaySubjectAverages.some((s: any) => s.classAverage !== null && s.classAverage !== undefined);

    const academicInsightsAndTrends = useMemo(() => {
        // Group child assessments by subject
        const assessmentsBySubject: Record<string, any[]> = {};
        activeChildAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = Math.round((score / max) * 100);
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!assessmentsBySubject[subName]) {
                    assessmentsBySubject[subName] = [];
                }
                assessmentsBySubject[subName].push({ pct, date: a.createdAt?.toDate ? a.createdAt.toDate() : new Date() });
            }
        });

        const trends: Record<string, { diff: number; direction: 'up' | 'down' | 'flat' }> = {};
        Object.entries(assessmentsBySubject).forEach(([name, list]) => {
            const sorted = [...list].sort((a, b) => a.date.getTime() - b.date.getTime());
            if (sorted.length >= 2) {
                const last = sorted[sorted.length - 1].pct;
                const prev = sorted[sorted.length - 2].pct;
                const diff = last - prev;
                trends[name] = {
                    diff,
                    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
                };
            } else {
                trends[name] = { diff: 0, direction: 'flat' };
            }
        });

        // Determine improvements vs declines
        let improving = Object.entries(trends)
            .filter(([_, t]) => t.direction === 'up')
            .map(([name, t]) => ({ name, diff: t.diff }));
            
        let declining = Object.entries(trends)
            .filter(([_, t]) => t.direction === 'down')
            .map(([name, t]) => ({ name, diff: Math.abs(t.diff) }));

        improving.sort((a, b) => b.diff - a.diff);
        declining.sort((a, b) => b.diff - a.diff);

        // Insights only from the child's real marks this term (they used to be fixed sentences for every child).
        const insights: { type: 'success' | 'warning' | 'info'; title: string; text: string; icon: string }[] = [];
        if (improving[0]) insights.push({ type: 'success', title: 'Progress identified', text: `${improving[0].name}: last mark up ${improving[0].diff} points on the one before`, icon: '✅' });
        if (declining[0]) insights.push({ type: 'warning', title: 'Needs attention', text: `${declining[0].name}: last mark down ${declining[0].diff} points on the one before`, icon: '⚠' });
        const weak = subjectAverages.filter((s: any) => s.average < 50).map((s: any) => s.name);
        if (weak.length) insights.push({ type: 'warning', title: 'Below 50%', text: `${weak.slice(0, 3).join(', ')} — average below 50% this term`, icon: '⚠' });
        const compared = subjectAverages.filter((s: any) => s.classAverage !== null && s.classAverage !== undefined);
        if (compared.length) {
            const above = compared.filter((s: any) => s.average >= s.classAverage).length;
            insights.push({ type: 'info', title: 'Against the class', text: `At or above the class average in ${above} of ${compared.length} subject${compared.length === 1 ? '' : 's'}`, icon: '🏆' });
        }

        return { trends, improving, declining, insights };
    }, [activeChildAssessments, subjects, subjectAverages]);

    // Boarding House Fallback
    const houseName = useMemo(() => {
        return activeChild?.house || 'Not Assigned';
    }, [activeChild]);

    // Academic current average grade score
    const childAverageGrade = useMemo((): number | null => {
        if (activeChildAssessments.length === 0) return null; // no marks yet this term (it used to show an invented 78%)
        const sum = activeChildAssessments.reduce((acc, curr) => {
            const score = Number(curr.score) || 0;
            const max = Number(curr.maxScore) || 100;
            return acc + (max > 0 ? (score / max) * 100 : 0);
        }, 0);
        return Math.round(sum / activeChildAssessments.length);
    }, [activeChildAssessments]);

    // Exam marks this term (Mid-Term, End of Term, Mock…) — the Examination tab used to show fixed 79 / 83 / 85%.
    const examRows = useMemo(() => {
        return activeChildAssessments
            .filter((a: any) => /exam|mid|mock|end of term|terminal/i.test(String(a.assessmentType || a.type || '')))
            .map((a: any) => {
                const score = Number(a.score) || 0;
                const max = Number(a.maxScore) || 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                return {
                    id: a.id || a.uid,
                    exam: a.assessmentType || 'Exam',
                    subject: sub?.name || a.subjectName || 'Subject',
                    pct: max > 0 ? Math.round((score / max) * 100) : 0,
                    score, max,
                };
            })
            .sort((x: any, y: any) => x.subject.localeCompare(y.subject));
    }, [activeChildAssessments, subjects]);

    // Assignments due count calculation
    const assignmentsDueCount = useMemo(() => {
        if (!activeClassId) return 0;
        const classAss = assignments?.filter((a: any) => a.classId === activeClassId) || [];
        const childSubmissions = submissions?.filter((s: any) => s.studentId === activeChildId) || [];
        const submittedIds = new Set(childSubmissions.map((s: any) => s.assignmentId));
        const pendingAssignments = classAss.filter((a: any) => !submittedIds.has(a.id || a.uid)).length;

        const classQuizzes = quizzes?.filter((q: any) => q.classId === activeClassId) || [];
        const childQuizAttempts = quizAttempts?.filter((qa: any) => qa.studentId === activeChildId) || [];
        const attemptedIds = new Set(childQuizAttempts.map((qa: any) => qa.quizId));
        const pendingQuizzes = classQuizzes.filter((q: any) => !attemptedIds.has(q.id || q.uid)).length;

        return pendingAssignments + pendingQuizzes;
    }, [assignments, activeClassId, submissions, activeChildId, quizzes, quizAttempts]);

    const activeChildAssignmentsList = useMemo(() => {
        if (!activeClassId) return [];
        
        // Filter assignments for this child's class
        const classAss = assignments?.filter((a: any) => a.classId === activeClassId) || [];
        const childSubmissions = submissions?.filter((s: any) => s.studentId === activeChildId) || [];
        const submissionMap = new Map<string, any>(childSubmissions.map((s: any) => [s.assignmentId, s]));

        const assignmentList = classAss.map((a: any) => {
            const submission = submissionMap.get(a.id || a.uid);
            const isSubmitted = !!submission;
            
            // Format due date
            let displayDueDate = 'N/A';
            let rawDueDate: Date | null = null;
            if (a.dueDate) {
                if (a.dueDate.toDate) {
                    rawDueDate = a.dueDate.toDate();
                } else {
                    rawDueDate = new Date(a.dueDate);
                }
                displayDueDate = rawDueDate ? format(rawDueDate, 'dd MMMM') : 'N/A';
            }

            const isOverdue = !isSubmitted && rawDueDate && rawDueDate < new Date();

            return {
                id: a.id || a.uid,
                title: a.title || a.name || 'Untitled Assignment',
                dueDate: displayDueDate,
                rawDueDate,
                status: isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending',
                teacherComment: submission?.teacherRemark || submission?.comments || null,
                subject: a.subjectName || 'General'
            };
        });

        // Filter quizzes for this child's class
        const classQuizzes = quizzes?.filter((q: any) => q.classId === activeClassId) || [];
        const childQuizAttempts = quizAttempts?.filter((qa: any) => qa.studentId === activeChildId) || [];
        const attemptMap = new Map<string, any>(childQuizAttempts.map((qa: any) => [qa.quizId, qa]));

        const quizList = classQuizzes.map((q: any) => {
            const attempt = attemptMap.get(q.id || q.uid);
            const isSubmitted = !!attempt;

            // Format due date
            let displayDueDate = 'N/A';
            let rawDueDate: Date | null = null;
            const targetDueDate = q.dueDate || q.deadline;
            if (targetDueDate) {
                if (targetDueDate.toDate) {
                    rawDueDate = targetDueDate.toDate();
                } else {
                    rawDueDate = new Date(targetDueDate);
                }
                displayDueDate = rawDueDate ? format(rawDueDate, 'dd MMMM') : 'N/A';
            }

            const isOverdue = !isSubmitted && rawDueDate && rawDueDate < new Date();

            return {
                id: q.id || q.uid,
                title: q.title || q.name || 'Untitled Quiz',
                dueDate: displayDueDate,
                rawDueDate,
                status: isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending',
                teacherComment: attempt?.feedback || (isSubmitted ? `Score: ${attempt?.score ?? 0}/${q.questions?.length ?? 10}` : null),
                subject: q.subjectName || q.subject || 'General'
            };
        });

        const combinedList = [...assignmentList, ...quizList];

        // Sort: Pending/Overdue first, then by due date
        return combinedList.sort((a: any, b: any) => {
            if (a.status === 'Pending' && b.status === 'Submitted') return -1;
            if (a.status === 'Submitted' && b.status === 'Pending') return 1;
            if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
            if (a.status !== 'Overdue' && b.status === 'Overdue') return 1;
            const dateA = a.rawDueDate ? a.rawDueDate.getTime() : 0;
            const dateB = b.rawDueDate ? b.rawDueDate.getTime() : 0;
            return dateA - dateB;
        });
    }, [assignments, activeClassId, submissions, activeChildId, quizzes, quizAttempts]);

    const displayAssignments = activeChildAssignmentsList;

    const assignmentStats = useMemo(() => {
        const total = displayAssignments.length;
        const pending = displayAssignments.filter((a: any) => a.status === 'Pending').length;
        const submitted = displayAssignments.filter((a: any) => a.status === 'Submitted').length;
        const overdue = displayAssignments.filter((a: any) => a.status === 'Overdue').length;
        const feedbackCount = displayAssignments.filter((a: any) => !!a.teacherComment).length;

        return { total, pending, submitted, overdue, feedbackCount };
    }, [displayAssignments]);

    // Today's record checking
    const todayRecord = useMemo(() => {
        if (!attendance || !activeChildId) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return attendance.find((a: any) => {
            if (a.studentId !== activeChildId) return false;
            const date = a.date?.toDate ? a.date.toDate() : a.date ? new Date(a.date) : null;
            if (!date) return false;
            return date >= today && date < tomorrow;
        });
    }, [attendance, activeChildId]);

    const checkedIn = useMemo(() => {
        return !!todayRecord && (todayRecord.status === 'Present' || todayRecord.status === 'Late');
    }, [todayRecord]);

    const checkedOut = useMemo(() => {
        if (!todayRecord || todayRecord.status === 'Absent') return false;
        return !!todayRecord.checkOutTime; // only a recorded check-out (it used to turn green at 3 pm by itself)
    }, [todayRecord]);

    const presentToday = useMemo(() => {
        return !!todayRecord && (todayRecord.status === 'Present' || todayRecord.status === 'Late');
    }, [todayRecord]);

    const lateArrival = useMemo(() => {
        return !!todayRecord && todayRecord.status === 'Late';
    }, [todayRecord]);

    const leftEarly = useMemo(() => {
        return !!todayRecord && (todayRecord.leftEarly === true || todayRecord.notes?.toLowerCase().includes('early'));
    }, [todayRecord]);

    // Today's school timeline
    const timelineEvents = useMemo(() => {
        // Only what was actually recorded today (it used to show a fixed Maths 10:30 / Science 2:00 schedule).
        const fmtTime = (v: any) => { const d = v?.toDate ? v.toDate() : v ? new Date(v) : null; return d && !isNaN(d.getTime()) ? format(d, 'h:mm a') : ''; };
        const events: { time: string; label: string; completed: boolean; icon: any }[] = [];
        if (todayRecord) {
            events.push({
                time: fmtTime(todayRecord.checkInTime) || fmtTime(todayRecord.updatedAt) || '—',
                label: todayRecord.status === 'Absent' ? 'Marked absent on the register' : todayRecord.status === 'Late' ? 'Marked late on the register' : `Marked ${String(todayRecord.status || 'present').toLowerCase()} on the register`,
                completed: true,
                icon: MapPin,
            });
            if (todayRecord.checkOutTime) events.push({ time: fmtTime(todayRecord.checkOutTime) || '—', label: 'Checked out', completed: true, icon: ShieldAlert });
        }
        return events;
    }, [todayRecord]);

    // Historical attendance rates
    const statsWeek = useMemo(() => {
        const records = activeChildAttendance.filter((a: any) => {
            const date = a.date?.toDate ? a.date.toDate() : a.date ? new Date(a.date) : null;
            if (!date) return false;
            const diff = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
            return diff <= 7;
        });
        if (records.length === 0) return null as number | null;
        const present = records.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
        return Math.round((present / records.length) * 100) as number | null;
    }, [activeChildAttendance]);

    const statsMonth = useMemo(() => {
        const records = activeChildAttendance.filter((a: any) => {
            const date = a.date?.toDate ? a.date.toDate() : a.date ? new Date(a.date) : null;
            if (!date) return false;
            const diff = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
            return diff <= 30;
        });
        if (records.length === 0) return null as number | null;
        const present = records.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
        return Math.round((present / records.length) * 100) as number | null;
    }, [activeChildAttendance]);

    // Check for 3 consecutive absences
    const hasThreeConsecutiveAbsences = useMemo(() => {
        if (activeChildAttendance.length < 3) return false;
        const chron = [...activeChildAttendance].sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return dateA - dateB;
        });
        let consecutive = 0;
        for (let i = 0; i < chron.length; i++) {
            if (chron[i].status === 'Absent') {
                consecutive++;
                if (consecutive >= 3) return true;
            } else if (chron[i].status === 'Present' || chron[i].status === 'Late') {
                consecutive = 0;
            }
        }
        return false;
    }, [activeChildAttendance]);

    // Absenteeism warnings
    const absenteeismAlerts = useMemo(() => {
        const alerts = [];
        if (hasThreeConsecutiveAbsences) {
            alerts.push({
                id: 'consecutive',
                type: 'danger',
                message: 'Missed school for 3 consecutive days',
                desc: 'Alert: Your child has missed three consecutive school days. Please contact administrative staff immediately.'
            });
        }
        if (attendanceStats.rate !== null && attendanceStats.total >= 5 && attendanceStats.rate < 80) {
            alerts.push({
                id: 'low_rate',
                type: 'warning',
                message: 'Attendance dropped below 80%',
                desc: `Warning: Term attendance has dropped to ${attendanceStats.rate}%. Maintaining above 80% is highly recommended.`
            });
        }
        return alerts;
    }, [hasThreeConsecutiveAbsences, attendanceStats.rate]);

    // Attendance breakdown chart data
    const attendancePieData = useMemo(() => {
        const data = [
            { name: 'Present', value: attendanceStats.present, fill: '#10b981' },
            { name: 'Late', value: attendanceStats.late, fill: '#f59e0b' },
            { name: 'Absent', value: attendanceStats.absent, fill: '#ef4444' }
        ];
        return data.filter(d => d.value > 0); // empty when nothing is recorded (it used to show 95/3/2)
    }, [attendanceStats]);

    const activeChildStickerCount = activeChildStickers.length;
    const recentSticker = useMemo(() => {
        if (activeChildStickers.length === 0) return null;
        // Sort newest first
        const sorted = [...activeChildStickers].sort((a: any, b: any) => {
            const getTime = (val: any) => {
                if (!val) return 0;
                if (val instanceof Date) return val.getTime();
                if (typeof val.toDate === 'function') return val.toDate().getTime();
                if (typeof val === 'string' || typeof val === 'number') return new Date(val).getTime();
                return 0;
            };
            return getTime(b.earnedAt) - getTime(a.earnedAt);
        });
        return sorted[0];
    }, [activeChildStickers]);

    const banners = {
        overview: {
            gradient: "from-indigo-900 via-indigo-950 to-slate-900 border-indigo-500/20",
            title: `Welcome, ${displayName}`,
            description: "Unified parent view of children enrollment overview, grade cards, dues and activity trackers.",
            badge: "Parent Portal Overview",
            badgeColor: "bg-indigo-500/20 text-indigo-300",
            icon: LayoutTemplate,
        },
        activity: {
            gradient: "from-sky-900 via-sky-950 to-slate-900 border-sky-500/20",
            title: "Today's School Activity",
            description: "What the class register recorded for your child today.",
            badge: "Live Status Feed",
            badgeColor: "bg-sky-500/20 text-sky-300",
            icon: Activity,
        },
        attendance: {
            gradient: "from-emerald-900 via-emerald-950 to-slate-900 border-emerald-500/20",
            title: "Attendance Analysis",
            description: "Deep dive historical attendance metrics, punctuality logs and absenteeism alarms.",
            badge: "Attendance Dashboard",
            badgeColor: "bg-emerald-500/20 text-emerald-300",
            icon: CalendarCheck,
        },
        academics: {
            gradient: "from-purple-900 via-purple-950 to-slate-900 border-purple-500/20",
            title: "Academic Achievements & Grades",
            description: "Subject level grade cards, assignment trackers, and earned Nursery Bloom badges.",
            badge: "Academic Suite",
            badgeColor: "bg-purple-500/20 text-purple-300",
            icon: Award,
        },
        examination: {
            gradient: "from-amber-900 via-amber-950 to-slate-900 border-amber-500/20",
            title: "Examination Records & Rankings",
            description: "Exam marks recorded this term. The class position is on the end-of-term report card.",
            badge: "Exam Desk",
            badgeColor: "bg-amber-500/20 text-amber-300",
            icon: FileText,
        },
        assignments: {
            gradient: "from-sky-900 via-sky-950 to-slate-900 border-sky-500/20",
            title: "Assignment Dashboard",
            description: "Keep track of homework assignments, deadlines, progress, and teacher feedback.",
            badge: "Homework Desk",
            badgeColor: "bg-sky-500/20 text-sky-300",
            icon: CheckSquare,
        },
        financials: {
            gradient: "from-rose-900 via-rose-950 to-slate-900 border-rose-500/20",
            title: "School Fees Accounts",
            description: "Review term invoices, billing logs, waivers, payments, and outstanding balances.",
            badge: "Accounts Ledger",
            badgeColor: "bg-rose-500/20 text-rose-300",
            icon: Wallet,
        },
        notices: {
            gradient: "from-slate-800 via-slate-900 to-indigo-950 border-slate-700/20",
            title: "Bulletins & Broadcasts",
            description: "Official notifications and letters sent by school administrators and faculty.",
            badge: "Notice Board",
            badgeColor: "bg-slate-500/20 text-slate-300",
            icon: Megaphone,
        },
        canteen: {
            gradient: "from-amber-600 via-amber-800 to-slate-900 border-amber-500/20",
            title: "Weekly Canteen Plans",
            description: "Dietary coordination schedules to plan balanced meals at home and cafeteria reviews.",
            badge: "Menu Planner",
            badgeColor: "bg-amber-500/20 text-amber-300",
            icon: Utensils,
        },
        satisfaction: {
            gradient: "from-teal-900 via-teal-950 to-slate-900 border-teal-500/20",
            title: "Parent Satisfaction Hub",
            description: "Submit complaints, give feedback on your experience, rate teachers, and grade school services.",
            badge: "Satisfaction & Feedback",
            badgeColor: "bg-teal-500/20 text-teal-300",
            icon: HeartHandshake,
        },
        transport: {
            gradient: "from-blue-900 via-indigo-950 to-slate-900 border-indigo-500/20",
            title: "School Transport Fleet",
            description: "View designated pickup/drop-off stops, schedules, driver contacts, and live bus check-in logs.",
            badge: "Fleet Logistics",
            badgeColor: "bg-indigo-500/20 text-indigo-300",
            icon: BusIcon,
        },
        stories: {
            gradient: "from-purple-900 via-indigo-950 to-slate-900 border-indigo-500/20",
            title: "Class Stories & Learning Moments",
            description: "Visual classroom highlights, science projects, field trips, and student achievement celebrations.",
            badge: "Moments & Stories",
            badgeColor: "bg-indigo-500/20 text-indigo-300",
            icon: Camera,
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative pb-16">
            {/* Top Bar: Selector & Portal Tag */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black tracking-[0.25em] bg-indigo-500/10 text-indigo-600 px-3.5 py-1.5 rounded-full uppercase">Parent Suite</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Parent <span className="text-indigo-600">Portal</span></h1>
                </div>

                {/* Main Navigation Tab Selector */}
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-inner flex-wrap gap-1">
                        {(['overview', 'stories', 'activity', 'attendance', 'academics', 'examination', 'assignments', 'financials', 'transport', 'notices', 'satisfaction'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                    activeTab === tab 
                                        ? "bg-white text-indigo-600 shadow-md font-black scale-[1.02]"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                                )}
                            >
                                {tab === 'stories' ? "Class Stories 📸" : tab === 'activity' ? "Today's Activity" : tab === 'attendance' ? "Attendance" : tab === 'transport' ? "Bus Fleet 🚌" : tab === 'satisfaction' ? "Feedback & Ratings" : tab}
                            </button>
                        ))}
                    </div>

                    <Link
                        href="/dashboard/finance/shop"
                        className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all hover:scale-[1.02] shrink-0"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Uniform & Book Store</span>
                    </Link>

                    <Link
                        href="/dashboard/forum"
                        className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all hover:scale-[1.02] shrink-0"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Community Forum</span>
                    </Link>
                </div>
            </div>

            {/* Banner Header Display */}
            <div 
                style={schoolSettings?.brandColor ? { background: `linear-gradient(135deg, ${schoolSettings.brandColor} 0%, ${schoolSettings.secondaryColor || '#0f172a'} 100%)` } : undefined}
                className={cn("relative p-8 xl:p-10 rounded-[2.5rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border transition-all duration-500", !schoolSettings?.brandColor && banners[activeTab].gradient)}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
                <div className="space-y-3 relative z-10 max-w-xl">
                    <span className={cn("text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase", banners[activeTab].badgeColor)}>
                        {banners[activeTab].badge}
                    </span>
                    <h2 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">{banners[activeTab].title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{banners[activeTab].description}</p>
                </div>
                <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] relative z-10 shrink-0">
                    {(() => {
                        const IconComponent = banners[activeTab].icon;
                        return <IconComponent className="h-10 w-10 text-white opacity-80" />;
                    })()}
                </div>
            </div>

            {/* Multiple Children Selectors tab (if applicable) */}
            {children && children.length > 1 && (
                <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50 border border-slate-150 rounded-3xl w-fit">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 pr-1">Active Child:</span>
                    {children.map((child: any) => (
                        <button
                            key={child.uid}
                            onClick={() => setSelectedChildId(child.uid)}
                            className={cn(
                                "px-5 py-2 text-xs font-black uppercase tracking-wider rounded-2xl transition-all duration-300",
                                activeChildId === child.uid
                                    ? "bg-indigo-650 text-white shadow-lg"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                        >
                            {child.firstName} {child.lastName}
                        </button>
                    ))}
                </div>
            )}

            {/* TAB CONTENT SECTIONS */}
            <div className="mt-8">
                {activeTab === 'stories' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {schoolId ? (
                            <ClassStoryFeed schoolId={schoolId} classId={activeClassId || undefined} studentIdFilter={activeChildId} userRole="Parent" />
                        ) : (
                            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest p-8">Loading class stories...</p>
                        )}
                    </div>
                )}

                {activeTab === 'transport' && activeChild && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <StudentTransportCard student={activeChild} />
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Student Profile Card */}
                                <Card className="lg:col-span-1 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-36 bg-gradient-to-tr from-indigo-500 via-indigo-650 to-purple-600 flex items-center justify-center p-6 text-white overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10" />
                                        <div className="relative z-10 text-center space-y-1">
                                            <span className="text-[9px] font-black tracking-widest bg-white/20 px-3 py-1 rounded-full uppercase">Student Profile Card</span>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-0 -mt-12 flex-1 flex flex-col items-center text-center relative z-10">
                                        {/* Profile Photo */}
                                        {activeChild.photoURL ? (
                                            <img 
                                                src={activeChild.photoURL} 
                                                alt={`${activeChild.firstName} ${activeChild.lastName}`}
                                                className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-xl bg-slate-100"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-3xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-xl">
                                                {activeChild.firstName?.[0]}{activeChild.lastName?.[0]}
                                            </div>
                                        )}
                                        
                                        <h3 className="font-black text-slate-800 text-xl mt-4 uppercase tracking-tight">{activeChild.firstName} {activeChild.lastName}</h3>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Class Code: {activeClassName}</p>

                                        {/* Profile Meta List */}
                                        <div className="w-full space-y-3.5 mt-8 pt-6 border-t border-slate-100">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Boarding House</span>
                                                <span className="font-black text-slate-800 uppercase">{houseName}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Admission No</span>
                                                <span className="font-black text-slate-800 font-mono">{activeChild.studentId || activeChild.uid?.slice(0, 8)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Class Average</span>
                                                <Badge className="bg-indigo-50 text-indigo-700 font-black border-none text-[10px] tracking-wide px-3 py-1 rounded-md uppercase">
                                                    {classOverallAverage !== null ? `${classOverallAverage}%` : '—'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
                                                <Badge className={cn("border-none text-[10px] font-black tracking-wide px-3 py-1 rounded-md uppercase", 
                                                    attendanceStats.rate === null ? "bg-slate-100 text-slate-500" :
                                                    attendanceStats.rate >= 90 ? "bg-emerald-50 text-emerald-700" :
                                                    attendanceStats.rate >= 80 ? "bg-amber-50 text-amber-700" :
                                                    "bg-rose-50 text-rose-700"
                                                )}>
                                                    {attendanceStats.rate !== null ? `${attendanceStats.rate}%` : '—'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Quick Summary Metric Grid */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Current Average */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-indigo-50 text-indigo-650 rounded-2xl">
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Average Score</p>
                                                <h4 className="text-2xl font-black text-slate-800 italic">{childAverageGrade !== null ? `${childAverageGrade}%` : '—'}</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">{childAverageGrade !== null ? `${activeChildAssessments.length} mark${activeChildAssessments.length === 1 ? '' : 's'} · ${termLabel}` : `No marks yet · ${termLabel}`}</p>
                                            </div>
                                        </Card>

                                        {/* Class Position */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-purple-50 text-purple-650 rounded-2xl">
                                                <TrendingUp className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Class Average</p>
                                                <h4 className="text-2xl font-black text-slate-800">{classOverallAverage !== null ? `${classOverallAverage}%` : '—'}</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">{activeClassName} · {termLabel}</p>
                                            </div>
                                        </Card>

                                        {/* Attendance Rate */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-emerald-50 text-emerald-650 rounded-2xl">
                                                <CalendarCheck className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Attendance</p>
                                                <h4 className="text-2xl font-black text-slate-800">{attendanceStats.rate !== null ? `${attendanceStats.rate}%` : '—'}</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">{attendanceStats.total ? `${attendanceStats.present + attendanceStats.late} of ${attendanceStats.total} days this term` : 'No register entries yet this term'}</p>
                                            </div>
                                        </Card>

                                        {/* Fees Balance */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-rose-50 text-rose-650 rounded-2xl">
                                                <Wallet className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fees Outstanding Balance</p>
                                                <h4 className="text-2xl font-black text-rose-600">GH₵ {totalOutstanding.toLocaleString()}</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">All open bills{children.length > 1 ? ' (all children)' : ''}</p>
                                            </div>
                                        </Card>

                                        {/* Assignments Due */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-sky-50 text-sky-650 rounded-2xl">
                                                <CheckSquare className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assignments Due</p>
                                                <h4 className={cn("text-2xl font-black", assignmentsDueCount > 0 ? "text-amber-600" : "text-slate-800")}>
                                                    {assignmentsDueCount} Pending
                                                </h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Tasks awaiting submission</p>
                                            </div>
                                        </Card>

                                        {/* Recent Achievement */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-amber-50 text-amber-650 rounded-2xl">
                                                <span className="text-2xl">{recentSticker ? recentSticker.emoji : '🏆'}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Recent Achievement</p>
                                                <h4 className="text-base font-black text-slate-800 uppercase tracking-tight line-clamp-1">{recentSticker ? recentSticker.name : 'No Badges Earned Yet'}</h4>
                                                <p className="text-[9px] font-bold text-slate-450 uppercase">Badges cabinet: {activeChildStickerCount} earned</p>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Action Links & Tips Panel */}
                                    <div className="bg-slate-50 border border-slate-150 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-2">
                                            <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight flex items-center gap-1.5">
                                                <Info className="h-4 w-4 text-indigo-600" /> Coaching Insight
                                            </h4>
                                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                                {childAverageGrade !== null
                                                    ? `${activeChild.firstName}'s average this term is ${childAverageGrade}%${classOverallAverage !== null ? ` (class average ${classOverallAverage}%)` : ''}. The class position is shown on the end-of-term report card.`
                                                    : `No marks have been recorded for ${activeChild.firstName} this term yet.`}{assignmentsDueCount > 0 ? ` ${assignmentsDueCount} task${assignmentsDueCount === 1 ? '' : 's'} still to submit.` : ''}
                                            </p>
                                        </div>
                                        <Button asChild size="sm" className="bg-indigo-650 hover:bg-indigo-750 text-white font-black rounded-xl text-xs uppercase h-11 px-5 self-start md:self-center shrink-0">
                                            <Link href="/dashboard/my-reports">Report Cards</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found to load overview.</p>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Daily Status indicators */}
                                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 hover:shadow-xl transition-all duration-300">
                                    <CardHeader className="p-0 mb-6">
                                        <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Daily Status Checklist</CardTitle>
                                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Live tracking flags for today's school hours</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Checked In Today</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Ward arrived on school grounds</p>
                                            </div>
                                            <span className="text-xl">{checkedIn ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Checked Out Today</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Left school or school hours concluded</p>
                                            </div>
                                            <span className="text-xl">{checkedOut ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Present Today</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Marked present on class registers</p>
                                            </div>
                                            <span className="text-xl">{presentToday ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Late Arrival</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Checked in past standard school hours</p>
                                            </div>
                                            <span className="text-xl">{lateArrival ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Left Early</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Early checkout recorded before closing time</p>
                                            </div>
                                            <span className="text-xl">{leftEarly ? '✅' : '❌'}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* School Timeline */}
                                <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Today's Record</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">What the school recorded for your child today</CardDescription>
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest text-indigo-650 bg-indigo-55/40 px-3 py-1.5 rounded-full uppercase">
                                            Local: {new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>

                                    {timelineEvents.length === 0 && (
                                        <div className="text-center py-10 bg-slate-50 border border-dashed rounded-[2rem]">
                                            <CalendarCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Today's register has not been marked yet</p>
                                        </div>
                                    )}
                                    <div className={cn("relative pl-8 border-l border-slate-200 space-y-6 py-4", timelineEvents.length === 0 && "hidden")}>
                                        {timelineEvents.map((evt, idx) => {
                                            const EventIcon = evt.icon;
                                            return (
                                                <div key={idx} className="relative group">
                                                    {/* Node dot icon */}
                                                    <span className={cn(
                                                        "absolute -left-[45px] top-0 p-2 rounded-full border shadow-sm transition-colors duration-300",
                                                        evt.completed
                                                            ? "bg-emerald-500 text-white border-emerald-600"
                                                            : "bg-white text-slate-450 border-slate-200"
                                                    )}>
                                                        <EventIcon className="h-4 w-4" />
                                                    </span>

                                                    {/* Item text */}
                                                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 hover:border-indigo-100/50 p-4 rounded-2xl hover:scale-[1.01] transition-transform duration-300">
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{evt.label}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Recorded: {evt.time}</p>
                                                        </div>
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md",
                                                            evt.completed 
                                                                ? "bg-emerald-100 text-emerald-800" 
                                                                : "bg-slate-200 text-slate-500"
                                                        )}>
                                                            {evt.completed ? 'Recorded' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found to load activity timeline.</p>
                        )}
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="space-y-8">
                                {/* Absenteeism alerts decks if triggered */}
                                {absenteeismAlerts.length > 0 && (
                                    <div className="space-y-4">
                                        {absenteeismAlerts.map(alert => (
                                            <div 
                                                key={alert.id}
                                                className={cn(
                                                    "p-6 border-l-4 rounded-r-3xl flex items-start gap-4 shadow-sm",
                                                    alert.type === 'danger'
                                                        ? "bg-rose-50 border-l-rose-500 border border-rose-100 text-rose-800"
                                                        : "bg-amber-50 border-l-amber-500 border border-amber-100 text-amber-800"
                                                )}
                                            >
                                                <AlertTriangle className={cn("h-6 w-6 shrink-0 mt-0.5", 
                                                    alert.type === 'danger' ? "text-rose-600 animate-pulse" : "text-amber-600"
                                                )} />
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-sm uppercase tracking-tight">{alert.message}</h4>
                                                    <p className="text-xs leading-relaxed font-semibold opacity-90">{alert.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Statistical indicators cards */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                        <CardHeader className="p-0 mb-6">
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Attendance Ratios</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Check-in statistics over different periods</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0 space-y-6">
                                            {/* Week */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-slate-450 uppercase tracking-wider">Attendance this Week</span>
                                                    <span className="font-black text-slate-800 font-mono">{statsWeek !== null ? `${statsWeek}%` : '—'}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-500", (statsWeek ?? 0) >= 90 ? "bg-emerald-500" : (statsWeek ?? 0) >= 80 ? "bg-amber-500" : "bg-rose-500")}
                                                        style={{ width: `${statsWeek ?? 0}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Month */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-slate-450 uppercase tracking-wider">Attendance this Month</span>
                                                    <span className="font-black text-slate-800 font-mono">{statsMonth !== null ? `${statsMonth}%` : '—'}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-500", (statsMonth ?? 0) >= 90 ? "bg-emerald-500" : (statsMonth ?? 0) >= 80 ? "bg-amber-500" : "bg-rose-500")}
                                                        style={{ width: `${statsMonth ?? 0}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Term */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-slate-450 uppercase tracking-wider">Attendance this Term</span>
                                                    <span className="font-black text-slate-800 font-mono">{attendanceStats.rate !== null ? `${attendanceStats.rate}%` : '—'}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-500", (attendanceStats.rate ?? 0) >= 90 ? "bg-emerald-500" : (attendanceStats.rate ?? 0) >= 80 ? "bg-amber-500" : "bg-rose-500")}
                                                        style={{ width: `${attendanceStats.rate ?? 0}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-405 uppercase tracking-wider">Total Late Arrivals</span>
                                                <Badge className="bg-amber-50 text-amber-700 font-black border-none text-[10px] tracking-wide px-3 py-1 rounded-md uppercase">
                                                    {attendanceStats.late} Late Slots
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Pie Chart display */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2 mb-6">
                                                <CalendarCheck className="h-5 w-5 text-indigo-650" /> Attendance Distribution
                                            </CardTitle>
                                            <div className="h-[150px] w-full relative flex items-center justify-center">
                                                {attendancePieData.length === 0 && (
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No register entries yet this term</p>
                                                )}
                                                <ResponsiveContainer width="100%" height="100%" className={attendancePieData.length === 0 ? 'hidden' : ''}>
                                                    <PieChart>
                                                        <Pie
                                                            data={attendancePieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={45}
                                                            outerRadius={65}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {attendancePieData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip formatter={(value: number) => [`${value} logs`, 'Total']} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t mt-4">
                                            {attendancePieData.map((g) => {
                                                const totalVal = attendancePieData.reduce((sum, item) => sum + item.value, 0) || 1;
                                                const percent = Math.round((g.value / totalVal) * 100);
                                                const colorDot = g.name === 'Present' ? 'bg-emerald-500' : g.name === 'Late' ? 'bg-amber-500' : 'bg-rose-500';
                                                
                                                return (
                                                    <div key={g.name} className="flex justify-between items-center text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", colorDot)} />
                                                            <span className="font-bold text-slate-700">{g.name}</span>
                                                        </div>
                                                        <span className="font-bold font-mono text-slate-900">{g.value} records ({percent}%)</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card>

                                    {/* Historical Logs List */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 overflow-hidden hover:shadow-xl transition-all duration-300">
                                        <CardHeader className="p-0 mb-6">
                                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-450">Attendance This Term</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                                {activeChildAttendance.length > 0 ? (
                                                    activeChildAttendance.slice(0, 30).map((att: any) => {
                                                        const dateStr = att.date?.toDate ? format(att.date.toDate(), 'PPP') : 'Unknown Date';
                                                        const status = att.status || 'Present';
                                                        return (
                                                            <div key={att.id || att.uid} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-150 hover:bg-indigo-50/5 transition-all duration-300">
                                                                <div className="space-y-0.5">
                                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{dateStr}</p>
                                                                    {att.notes && <p className="text-[10px] text-slate-400 italic">"{att.notes}"</p>}
                                                                </div>
                                                                <Badge className={cn(
                                                                    "border-none font-black text-[8px] tracking-wider px-2 py-0.5 rounded-full uppercase shadow-sm shrink-0 text-white",
                                                                    status === 'Present' ? "bg-emerald-500" :
                                                                    status === 'Late' ? "bg-amber-500" :
                                                                    "bg-rose-500"
                                                                )}>
                                                                    {status}
                                                                </Badge>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-10 bg-slate-50 border border-dashed rounded-[2rem]">
                                                        <CalendarCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                        <p className="text-xs font-black text-slate-550 uppercase tracking-widest">No logs registered</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found to load attendance analysis.</p>
                        )}
                    </div>
                )}

                {activeTab === 'academics' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="space-y-8">
                                {/* Header / Sub-banner for Academic Performance Dashboard */}
                                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                                    <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Award className="h-5 w-5 text-amber-400 animate-bounce" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Academic Analytics Desk</span>
                                            </div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight">Academic Performance Dashboard</h2>
                                            <p className="text-indigo-200/85 text-xs font-semibold uppercase mt-1 tracking-widest">
                                                Term performance indicators, trends, and AI insights for {activeChild.firstName} {activeChild.lastName}
                                            </p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 block">Average · {termLabel}</span>
                                            <span className="text-2xl font-extrabold text-white mt-1 block">{childAverageGrade !== null ? `${childAverageGrade}%` : '—'}{classOverallAverage !== null ? <span className="text-xs font-bold text-indigo-200"> (class {classOverallAverage}%)</span> : null}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Continuous Assessment & Trend Visualizer */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* 1. Continuous Assessment Card */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                                        <CheckSquare className="h-5 w-5 text-indigo-650" /> Continuous Assessment
                                                    </CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">
                                                        Average of every mark recorded {termLabel}
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            <div className="overflow-hidden border border-slate-100 rounded-2xl">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/70">
                                                        <TableRow>
                                                            <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Subject</TableHead>
                                                            <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider text-center">Score</TableHead>
                                                            <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Performance Range</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {displaySubjectAverages.length === 0 && (
                                                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-slate-400 italic text-xs font-black uppercase">No marks recorded {termLabel} yet</TableCell></TableRow>
                                                        )}
                                                        {displaySubjectAverages.map((sub: any) => (
                                                            <TableRow key={sub.name} className="hover:bg-slate-50/50 transition-colors">
                                                                <TableCell className="font-bold text-slate-800 text-xs py-4">{sub.name}</TableCell>
                                                                <TableCell className="font-black text-slate-900 font-mono text-xs text-center py-4">{sub.average}%</TableCell>
                                                                <TableCell className="py-4 min-w-[150px]">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-2 w-28 bg-slate-105 rounded-full overflow-hidden shrink-0">
                                                                            <div 
                                                                                className={cn(
                                                                                    "h-full rounded-full",
                                                                                    sub.average >= 80 ? "bg-indigo-600" :
                                                                                    sub.average >= 60 ? "bg-emerald-500" :
                                                                                    sub.average >= 50 ? "bg-amber-500" : "bg-rose-500"
                                                                                )}
                                                                                style={{ width: `${sub.average}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className={cn(
                                                                            "text-[9px] font-black uppercase tracking-wider",
                                                                            sub.average >= 80 ? "text-indigo-600" :
                                                                            sub.average >= 60 ? "text-emerald-605" :
                                                                            sub.average >= 50 ? "text-amber-600" : "text-rose-600"
                                                                        )}>
                                                                            {sub.average >= 80 ? 'Excellent' :
                                                                             sub.average >= 60 ? 'Satisfactory' :
                                                                             sub.average >= 50 ? 'Passing' : 'Needs Support'}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </Card>

                                        {/* 2. Academic Trend Controls & Charts */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                                        <Activity className="h-5 w-5 text-indigo-650" /> Academic Trend
                                                    </CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">
                                                        Analyze improvements, declines, and peers comparisons
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            {/* Selector Controls for Trends */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100/80 p-1.5 rounded-2xl mb-6 border">
                                                {[
                                                    { id: 'improvement', label: 'Performance Improvement' },
                                                    { id: 'decline', label: 'Performance Decline' },
                                                    { id: 'subject-comparison', label: 'Subject Comparison' },
                                                    { id: 'class-comparison', label: 'Class average comparison' }
                                                ].map(btn => (
                                                    <button
                                                        key={btn.id}
                                                        onClick={() => setAcademicTrendView(btn.id as any)}
                                                        className={cn(
                                                            "px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                                            academicTrendView === btn.id 
                                                                ? "bg-white text-indigo-650 shadow-md scale-95" 
                                                                : "text-slate-550 hover:text-slate-800 hover:bg-slate-200/50"
                                                        )}
                                                    >
                                                        {btn.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Render Active Trend View */}
                                            <div className="min-h-[260px] flex flex-col justify-center">
                                                {academicTrendView === 'improvement' && (
                                                    <div className="space-y-4 animate-in fade-in-50 duration-300">
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Subject Performance Improvements</h4>
                                                        {academicInsightsAndTrends.improving.length === 0 && <p className="text-xs text-slate-400 font-bold">No subject has a rising mark yet this term (needs at least two marks in a subject).</p>}
                                                        {academicInsightsAndTrends.improving.map(imp => (
                                                            <div key={imp.name} className="flex justify-between items-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                                                                        <TrendingUp className="h-4 w-4" />
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-slate-800">{imp.name}</p>
                                                                        <p className="text-[10px] text-slate-500">Latest mark compared with the one before</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-black text-emerald-650 bg-emerald-100/50 px-3 py-1 rounded-full uppercase tracking-wider">
                                                                    ⬆ Up {imp.diff} points
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {academicTrendView === 'decline' && (
                                                    <div className="space-y-4 animate-in fade-in-50 duration-300">
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Needs Support / Grade Decline Alert</h4>
                                                        {academicInsightsAndTrends.declining.length === 0 && <p className="text-xs text-slate-400 font-bold">No subject has a falling mark this term.</p>}
                                                        {academicInsightsAndTrends.declining.map(dec => (
                                                            <div key={dec.name} className="flex justify-between items-center p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
                                                                        <TrendingDown className="h-4 w-4" />
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-slate-800">{dec.name}</p>
                                                                        <p className="text-[10px] text-slate-500">Latest mark compared with the one before</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-black text-rose-650 bg-rose-100/50 px-3 py-1 rounded-full uppercase tracking-wider">
                                                                    ⚠ Down {dec.diff} points
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {academicTrendView === 'subject-comparison' && (
                                                    <div className="h-[260px] animate-in fade-in-50 duration-300">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart data={displaySubjectAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                                                                <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                                                <Bar dataKey="average" radius={[6, 6, 0, 0]} name="Student Average">
                                                                    {displaySubjectAverages.map((entry: any, index: number) => {
                                                                        const colors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'];
                                                                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                                    })}
                                                                </Bar>
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                )}

                                                {academicTrendView === 'class-comparison' && !hasClassComparison && (
                                                    <p className="text-xs text-slate-400 font-bold text-center">The class averages for {termLabel} are not available yet.</p>
                                                )}
                                                {academicTrendView === 'class-comparison' && hasClassComparison && (
                                                    <div className="h-[260px] animate-in fade-in-50 duration-300">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart data={displaySubjectAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                                                                <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                                                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 750 }} />
                                                                <Bar dataKey="average" fill="#6366f1" radius={[4, 4, 0, 0]} name="Student Average" />
                                                                <Bar dataKey="classAverage" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Class Average" />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Right Column: AI Insights & Badges */}
                                    <div className="space-y-8">
                                        {/* AI Insights Card */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-gradient-to-b from-indigo-50/50 to-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Insights</CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">
                                                        Worked out from this term's marks
                                                    </CardDescription>
                                                </div>
                                                <Award className="h-6 w-6 text-indigo-650" />
                                            </div>

                                            <div className="space-y-4">
                                                {academicInsightsAndTrends.insights.length === 0 && (
                                                    <p className="text-xs text-slate-400 font-bold">Not enough marks {termLabel} yet to say anything useful.</p>
                                                )}
                                                {academicInsightsAndTrends.insights.map((ins, i) => (
                                                    <div key={i} className={cn("p-4 border rounded-2xl flex items-start gap-3.5 shadow-sm",
                                                        ins.type === 'success' ? "bg-emerald-50 border-emerald-100" : ins.type === 'warning' ? "bg-amber-50 border-amber-100" : "bg-indigo-50 border-indigo-100")}>
                                                        <div className="text-lg leading-none pt-0.5">{ins.icon}</div>
                                                        <div className="space-y-0.5">
                                                            <h5 className={cn("text-[10px] font-black uppercase tracking-widest", ins.type === 'success' ? "text-emerald-800" : ins.type === 'warning' ? "text-amber-800" : "text-indigo-800")}>{ins.title}</h5>
                                                            <p className={cn("text-xs font-bold leading-snug", ins.type === 'success' ? "text-emerald-700" : ins.type === 'warning' ? "text-amber-700" : "text-indigo-700")}>{ins.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        {/* Stickers / Badge cabinet */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Badge cabinet</CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Stickers earned this term</CardDescription>
                                                </div>
                                                <Award className="h-6 w-6 text-purple-600" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {activeChildStickers.length > 0 ? (
                                                    activeChildStickers.map((st: any) => (
                                                        <div key={st.id || st.uid} className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center group hover:scale-[1.03] transition-transform duration-300">
                                                            <div className="text-3xl mb-2.5 filter drop-shadow-md">{st.emoji || '🎓'}</div>
                                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate w-full px-1">{st.name || 'Mastery Badge'}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{st.category || 'General'}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-2 text-center py-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                                        <Award className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                        <p className="text-xs font-black text-slate-550 uppercase tracking-widest">No badges earned yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* Grade Log & Recent Assessments */}
                                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Grade Log & Assessments</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Recent assessments returned by class teachers</CardDescription>
                                        </div>
                                        <Button asChild size="sm" variant="ghost" className="text-indigo-650 font-black uppercase text-[10px] tracking-wider">
                                            <Link href="/dashboard/my-grades">View Full Report <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {activeChildAssessments.length > 0 ? (
                                            activeChildAssessments.slice(0, 5).map((a: any) => {
                                                const score = Number(a.score) || 0;
                                                const max = Number(a.maxScore) || 100;
                                                const pct = max > 0 ? Math.round((score / max) * 100) : 0;
                                                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                                                const subName = sub?.name || a.subjectName || 'General';
                                                const dateStr = a.assessmentDate?.toDate ? format(a.assessmentDate.toDate(), 'PPP') : a.createdAt?.toDate ? format(a.createdAt.toDate(), 'PPP') : '—';

                                                return (
                                                    <div key={a.id || a.uid} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:scale-[1.01] transition-transform duration-300">
                                                        <div className="space-y-1 min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[180px]">{subName}</span>
                                                                <Badge variant="secondary" className="bg-slate-200 text-slate-705 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">{a.assessmentType || 'Test'}</Badge>
                                                            </div>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Posted on: {dateStr}</p>
                                                            {a.teacherRemark && <p className="text-xs text-slate-550 italic mt-1 leading-normal">"{a.teacherRemark}"</p>}
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 shrink-0 sm:text-right">
                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Score</p>
                                                                <p className="text-sm font-black text-slate-800">{score} / {max}</p>
                                                            </div>
                                                            <Badge className={cn(
                                                                "border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider",
                                                                pct >= 50 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                                            )}>
                                                                {pct}%
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-10 bg-slate-50 border border-dashed rounded-[2rem]">
                                                <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                <p className="text-xs font-black text-slate-550 uppercase tracking-widest">No assessments logged</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found.</p>
                        )}
                    </div>
                )}

                {activeTab === 'examination' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* 1. Results Summary Card */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                        <CardHeader className="p-0 mb-6">
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-amber-650" /> Results Summary
                                            </CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">
                                                Exam marks recorded {termLabel}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-hidden border border-slate-100 rounded-2xl">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/70">
                                                        <TableRow>
                                                            <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Exam</TableHead>
                                                            <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider text-center">Score</TableHead>
                                                            <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Grade Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {examRows.length === 0 && (
                                                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-slate-400 italic text-xs font-black uppercase">No exam marks recorded {termLabel} yet</TableCell></TableRow>
                                                        )}
                                                        {examRows.map((item: any) => (
                                                            <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                                <TableCell className="font-bold text-slate-800 text-xs py-4 uppercase tracking-tight">{item.subject}<span className="block text-[9px] text-slate-400 normal-case font-semibold">{item.exam}</span></TableCell>
                                                                <TableCell className="font-black text-slate-900 font-mono text-xs text-center py-4">{item.score} / {item.max} ({item.pct}%)</TableCell>
                                                                <TableCell className="py-4">
                                                                    <Badge className={cn(
                                                                        "border-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider",
                                                                        item.pct >= 50 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                                                    )}>
                                                                        {item.pct >= 80 ? 'Excellent' : item.pct >= 60 ? 'Very Good' : item.pct >= 50 ? 'Pass' : 'Needs Support'}
                                                                    </Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* 2. Class position: only from the school's report card (it used to be worked out from the
                                        parent's own children only, so every child came out 1st). */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                        <CardHeader className="p-0 mb-6">
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-indigo-650" /> Class Position
                                            </CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">
                                                Published by the school on the end-of-term report card
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0 space-y-4">
                                            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                                {activeChild.firstName}'s position in class is worked out by the school from every pupil's marks and shown on the report card once the term's results are released.
                                            </p>
                                            {classOverallAverage !== null && childAverageGrade !== null && (
                                                <p className="text-xs font-bold text-slate-700">So far {termLabel}: {activeChild.firstName} {childAverageGrade}% · class average {classOverallAverage}%</p>
                                            )}
                                            <Button asChild size="sm" className="bg-indigo-650 hover:bg-indigo-750 text-white font-black rounded-xl text-xs uppercase h-10 px-5">
                                                <Link href="/dashboard/my-reports">Open Report Cards</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found.</p>
                        )}
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="space-y-8">
                                {/* Quote / Alert Desk banner */}
                                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <span className="p-3.5 bg-indigo-650 text-white rounded-2xl shrink-0 shadow-md shadow-indigo-150">
                                            <Info className="h-6 w-6" />
                                        </span>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-slate-800 uppercase text-xs tracking-wider">Parental Homework Notice</h4>
                                            <p className="text-sm font-black text-indigo-900 leading-snug italic">
                                                "Parents should never say: 'I didn't know my child had homework.'"
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                                                Active tracking panel to monitor and support school assignments.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Metrics Row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="p-5 bg-white border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] rounded-3xl flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
                                        <div className="p-3 bg-amber-55 text-amber-600 rounded-xl">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-450 uppercase tracking-widest">Pending</p>
                                            <p className="text-xl font-black text-slate-805 mt-0.5">{assignmentStats.pending}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] rounded-3xl flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
                                        <div className="p-3 bg-emerald-55 text-emerald-600 rounded-xl">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-450 uppercase tracking-widest">Submitted</p>
                                            <p className="text-xl font-black text-slate-805 mt-0.5">{assignmentStats.submitted}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] rounded-3xl flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
                                        <div className="p-3 bg-rose-55 text-rose-600 rounded-xl">
                                            <AlertCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-450 uppercase tracking-widest">Overdue</p>
                                            <p className="text-xl font-black text-rose-600 mt-0.5">{assignmentStats.overdue}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] rounded-3xl flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
                                        <div className="p-3 bg-indigo-55 text-indigo-650 rounded-xl">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-450 uppercase tracking-widest">Teacher Remarks</p>
                                            <p className="text-xl font-black text-slate-805 mt-0.5">{assignmentStats.feedbackCount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Assignments Details Table */}
                                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                    <CardHeader className="p-0 mb-6">
                                        <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Homework & Assignments</CardTitle>
                                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">
                                            List of assignments assigned to class this term
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-hidden border border-slate-100 rounded-2xl">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow>
                                                        <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Assignment</TableHead>
                                                        <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Subject</TableHead>
                                                        <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Due Date</TableHead>
                                                        <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Status</TableHead>
                                                        <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-wider">Teacher Comments</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {displayAssignments.length > 0 ? (
                                                        displayAssignments.map((a: any) => (
                                                            <TableRow key={a.id} className="hover:bg-slate-50/50 transition-colors">
                                                                <TableCell className="font-bold text-slate-900 text-xs py-4">{a.title}</TableCell>
                                                                <TableCell className="text-slate-550 text-xs font-medium py-4">{a.subject}</TableCell>
                                                                <TableCell className="text-slate-605 text-xs font-semibold font-mono py-4">{a.dueDate}</TableCell>
                                                                <TableCell className="py-4">
                                                                    <Badge className={cn(
                                                                        "border-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider text-white",
                                                                        a.status === 'Submitted' ? "bg-emerald-500" :
                                                                        a.status === 'Overdue' ? "bg-rose-500" : "bg-amber-500"
                                                                    )}>
                                                                        {a.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-xs text-slate-500 italic max-w-xs py-4 leading-normal">
                                                                    {a.teacherComment ? `"${a.teacherComment}"` : <span className="text-slate-400 not-italic font-bold">No feedback yet</span>}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="text-center py-8 text-slate-400 italic text-xs font-black uppercase">
                                                                No homework or assignments assigned to this class.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found.</p>
                        )}
                    </div>
                )}

                {activeTab === 'financials' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Tuition Invoice Ledger</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Tuition statements, waivers and receipts breakdown</CardDescription>
                                </div>
                                <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase h-11 px-5 shadow-lg shadow-rose-100/50">
                                    <Link href="/dashboard/my-bills">Pay Tuition Fees</Link>
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {financials && financials.length > 0 ? (
                                    financials.map((record: any) => {
                                        const student = children?.find((c: any) => c.uid === record.studentId);
                                        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Student';
                                        const billed = Number(record.billedAmount) || 0;
                                        const paid = Number(record.amountPaid) || 0;
                                        const waiver = Number(record.waiverAmount) || 0;
                                        const balance = billed - paid - waiver;
                                        const status = record.status || (balance <= 0 ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Unpaid');
                                        const dueDateStr = record.dueDate?.toDate ? format(record.dueDate.toDate(), 'PPP') : 'N/A';

                                        return (
                                            <div key={record.id || record.uid} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:scale-[1.01] transition-transform duration-300">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{record.type || 'School Fee'}</span>
                                                        <span className="text-[10px] text-slate-300 font-bold">•</span>
                                                        <span className="text-[10px] font-black text-indigo-650 uppercase tracking-widest">{studentName}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Due Date: {dueDateStr}</p>
                                                    {record.description && <p className="text-xs text-slate-550 font-medium pt-1 italic">{record.description}</p>}
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-6 xl:text-right">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Billed</p>
                                                        <p className="text-sm font-black text-slate-805">GH₵ {billed.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Paid</p>
                                                        <p className="text-sm font-black text-emerald-600 font-mono">GH₵ {paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                    </div>
                                                    {waiver > 0 && (
                                                        <div className="space-y-0.5">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Waiver</p>
                                                            <p className="text-sm font-black text-indigo-500">GH₵ {waiver.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Balance</p>
                                                        <p className={cn("text-sm font-black font-mono", balance > 0 ? "text-rose-650" : "text-slate-800")}>
                                                            GH₵ {balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                        </p>
                                                    </div>
                                                    <Badge className={cn(
                                                        "border-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shrink-0",
                                                        status === 'Paid' ? "bg-emerald-100 text-emerald-800" :
                                                        status === 'Partially Paid' ? "bg-amber-100 text-amber-800" :
                                                        "bg-rose-100 text-rose-800"
                                                    )}>
                                                        {status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No billing history found.</div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'notices' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">School Bulletins Broadcasts</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Official announcements released from school administration</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 space-y-6">
                                {announcements && announcements.length > 0 ? (
                                    announcements.map((a: any) => (
                                        <div key={a.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 hover:scale-[1.01] transition-transform duration-300">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">{a.title}</h4>
                                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">{a.audience || 'Everybody'}</span>
                                            </div>
                                            <p className="text-xs font-medium leading-relaxed text-slate-500 whitespace-pre-wrap">{a.content}</p>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Posted {a.publishedAt?.toDate ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No announcements broadcasted yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'satisfaction' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* KPI Metrics Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Submissions</p>
                                    <h4 className="text-2xl font-black text-slate-850">{pastSubmissions.length}</h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Complaints & Feedback</p>
                                </div>
                            </Card>

                            <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                <div className="p-4 bg-rose-50 text-rose-650 rounded-2xl">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Complaints</p>
                                    <h4 className={cn("text-2xl font-black", pastSubmissions.filter((s: any) => s.type === 'complaint' && (s.status === 'Pending' || s.status === 'In Progress')).length > 0 ? "text-rose-650 animate-pulse" : "text-slate-800")}>
                                        {pastSubmissions.filter((s: any) => s.type === 'complaint' && (s.status === 'Pending' || s.status === 'In Progress')).length}
                                    </h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Unresolved complaints</p>
                                </div>
                            </Card>

                            <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                <div className="p-4 bg-purple-50 text-purple-650 rounded-2xl">
                                    <User className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Teacher Avg Rating</p>
                                    <h4 className="text-2xl font-black text-slate-800 flex items-center gap-1">
                                        {pastSubmissions.filter((s: any) => s.type === 'teacher_rating' && s.rating).length > 0
                                            ? (pastSubmissions.filter((s: any) => s.type === 'teacher_rating' && s.rating).reduce((sum, r) => sum + r.rating, 0) / pastSubmissions.filter((s: any) => s.type === 'teacher_rating' && s.rating).length).toFixed(1)
                                            : 'N/A'
                                        } <Star className="h-5 w-5 fill-amber-400 text-amber-400 inline" />
                                    </h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Reviews for faculty</p>
                                </div>
                            </Card>

                            <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                <div className="p-4 bg-amber-50 text-amber-650 rounded-2xl">
                                    <LayoutTemplate className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Service Avg Rating</p>
                                    <h4 className="text-2xl font-black text-slate-800 flex items-center gap-1">
                                        {pastSubmissions.filter((s: any) => s.type === 'service_rating' && s.rating).length > 0
                                            ? (pastSubmissions.filter((s: any) => s.type === 'service_rating' && s.rating).reduce((sum, r) => sum + r.rating, 0) / pastSubmissions.filter((s: any) => s.type === 'service_rating' && s.rating).length).toFixed(1)
                                            : 'N/A'
                                        } <Star className="h-5 w-5 fill-amber-400 text-amber-400 inline" />
                                    </h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Canteen, bus & facilities</p>
                                </div>
                            </Card>
                        </div>

                        {/* Form and History Split Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            
                            {/* Left Column: Form Card */}
                            <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 h-fit">
                                <div className="mb-6">
                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">New Submission</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Help us improve by sharing your thoughts</CardDescription>
                                </div>

                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {[
                                        { mode: 'complaint', label: 'Complaint', color: 'border-rose-500 text-rose-650 bg-rose-50/30' },
                                        { mode: 'feedback', label: 'Feedback', color: 'border-emerald-500 text-emerald-650 bg-emerald-50/30' },
                                        { mode: 'teacher', label: 'Rate Teacher', color: 'border-purple-500 text-purple-655 bg-purple-50/30' },
                                        { mode: 'service', label: 'Rate Service', color: 'border-amber-500 text-amber-655 bg-amber-50/30' }
                                    ].map((item) => (
                                        <button
                                            key={item.mode}
                                            type="button"
                                            onClick={() => {
                                                setSatisfactionMode(item.mode as any);
                                                setRating(0);
                                                setTitle('');
                                                setContent('');
                                            }}
                                            className={cn(
                                                "py-3 px-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl border-2 transition-all text-center",
                                                satisfactionMode === item.mode
                                                    ? item.color + " shadow-sm border-2 scale-[1.02]"
                                                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-105"
                                            )}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSatisfactionSubmit} className="space-y-4">
                                    
                                    {/* Urgency select (complaint only) */}
                                    {satisfactionMode === 'complaint' && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Urgency Level</Label>
                                            <Select onValueChange={(v: any) => setUrgency(v)} value={urgency}>
                                                <SelectTrigger className="h-11 border-2 rounded-xl bg-slate-50">
                                                    <SelectValue placeholder="Select Urgency" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="Low">Low Urgency</SelectItem>
                                                    <SelectItem value="Medium">Medium Urgency</SelectItem>
                                                    <SelectItem value="High">High Urgency</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Teacher select (teacher ratings only) */}
                                    {satisfactionMode === 'teacher' && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Teacher</Label>
                                            <Select onValueChange={setSelectedTeacherId} value={selectedTeacherId}>
                                                <SelectTrigger className="h-11 border-2 rounded-xl bg-slate-50">
                                                    <SelectValue placeholder="Select Teacher" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {teachers.length > 0 ? (
                                                        teachers.map((t: any) => (
                                                            <SelectItem key={t.uid || t.id} value={t.uid || t.id}>
                                                                {t.firstName} {t.lastName} ({t.subject || 'Faculty'})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="loading" disabled>No teachers found</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Service select (service ratings only) */}
                                    {satisfactionMode === 'service' && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select School Service</Label>
                                            <Select onValueChange={setSelectedService} value={selectedService}>
                                                <SelectTrigger className="h-11 border-2 rounded-xl bg-slate-50">
                                                    <SelectValue placeholder="Select Service" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="Canteen">Canteen / Cafeteria</SelectItem>
                                                    <SelectItem value="Transport">School Bus & Transport</SelectItem>
                                                    <SelectItem value="Academics">Academic Quality & Homework</SelectItem>
                                                    <SelectItem value="Administration">School Office & Invoicing</SelectItem>
                                                    <SelectItem value="Facilities">Sports & Campus Facilities</SelectItem>
                                                    <SelectItem value="Other">Other School Services</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Title (for complaints/feedback only) */}
                                    {(satisfactionMode === 'complaint' || satisfactionMode === 'feedback') && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Summary / Title</Label>
                                            <Input 
                                                placeholder={satisfactionMode === 'complaint' ? "e.g. Broken lockers in Block A" : "e.g. Great improvement in class structure"} 
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)} 
                                                className="h-11 border-2 rounded-xl bg-slate-50 focus-visible:ring-teal-500" 
                                            />
                                        </div>
                                    )}

                                    {/* Star Rating selector (ratings and feedback only) */}
                                    {satisfactionMode !== 'complaint' && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Satisfaction Rating</Label>
                                            <div className="flex items-center gap-1.5 py-1">
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const isFilled = star <= (hoverRating || rating);
                                                    return (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            className="transition-all transform hover:scale-125 focus:outline-none animate-in fade-in zoom-in duration-200"
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                        >
                                                            <Star
                                                                className={cn(
                                                                    "h-8 w-8 stroke-[1.5]",
                                                                    isFilled
                                                                        ? "fill-amber-400 text-amber-400 drop-shadow-md"
                                                                        : "text-slate-350 hover:text-amber-300"
                                                                )}
                                                            />
                                                        </button>
                                                    );
                                                })}
                                                <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider ml-2">
                                                    {rating === 1 ? 'Poor' :
                                                     rating === 2 ? 'Fair' :
                                                     rating === 3 ? 'Good' :
                                                     rating === 4 ? 'Very Good' :
                                                     rating === 5 ? 'Excellent' : 'Select'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Details Textarea */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Details / Description</Label>
                                        <Textarea 
                                            placeholder={
                                                satisfactionMode === 'complaint' ? "Detail the issue here. Be as specific as possible so we can address it." :
                                                satisfactionMode === 'feedback' ? "Share your general thoughts, suggestions, or comments here..." :
                                                satisfactionMode === 'teacher' ? "Provide comments regarding teacher quality, supportiveness, and guidance..." :
                                                "Share reviews about this service quality, timeliness, and experience..."
                                            }
                                            value={content} 
                                            onChange={(e) => setContent(e.target.value)} 
                                            className="border-2 rounded-xl bg-slate-50 focus-visible:ring-teal-500 min-h-[120px] text-xs font-semibold leading-relaxed"
                                        />
                                    </div>

                                    <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-xs font-black uppercase tracking-wider bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg transition-all">
                                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Submit Satisfaction Form"}
                                    </Button>

                                </form>
                            </Card>

                            {/* Right Column: History Log */}
                            <Card className="lg:col-span-3 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                <div className="mb-6">
                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">My Submission History</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">History of your submitted feedbacks and complaints</CardDescription>
                                </div>

                                {loadingSatisfaction ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                                        <span className="text-xs font-semibold animate-pulse text-slate-500">Loading satisfaction history...</span>
                                    </div>
                                ) : pastSubmissions.length > 0 ? (
                                    <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                                        {pastSubmissions.map((sub: any) => {
                                            const dateStr = sub.createdAt?.toDate ? format(sub.createdAt.toDate(), 'PPP p') : 'Recently';
                                            
                                            let typeLabel = 'General Feedback';
                                            let badgeColor = 'bg-emerald-50 text-emerald-705 border-emerald-100';
                                            
                                            if (sub.type === 'complaint') {
                                                typeLabel = 'Complaint';
                                                badgeColor = 'bg-rose-50 text-rose-705 border-rose-100';
                                            } else if (sub.type === 'teacher_rating') {
                                                typeLabel = `Teacher Rating: ${sub.teacherName || 'Faculty'}`;
                                                badgeColor = 'bg-purple-50 text-purple-705 border-purple-100';
                                            } else if (sub.type === 'service_rating') {
                                                typeLabel = `Service Rating: ${sub.serviceType}`;
                                                badgeColor = 'bg-amber-50 text-amber-705 border-amber-100';
                                            }

                                            return (
                                                <div key={sub.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-all flex flex-col justify-between gap-3 group">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge className={cn("text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-lg border", badgeColor)}>
                                                                {typeLabel}
                                                            </Badge>
                                                            {sub.urgency && (
                                                                <Badge className={cn(
                                                                    "text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-lg border-none text-white",
                                                                    sub.urgency === 'High' ? "bg-rose-500" :
                                                                    sub.urgency === 'Medium' ? "bg-amber-500" :
                                                                    "bg-slate-405"
                                                                )}>
                                                                    {sub.urgency} Urgency
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{dateStr}</span>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        {sub.title && <h4 className="font-extrabold text-slate-805 text-sm uppercase tracking-tight">{sub.title}</h4>}
                                                        
                                                        {/* Render rating stars if applicable */}
                                                        {sub.rating !== undefined && (
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={cn(
                                                                            "h-4 w-4",
                                                                            star <= sub.rating
                                                                                ? "fill-amber-400 text-amber-400"
                                                                                : "text-slate-200"
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                        
                                                        <p className="text-xs text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap">{sub.content}</p>
                                                    </div>

                                                    {/* Status and Admin Remark */}
                                                    <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
                                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                                                            <span className="text-slate-400">Status</span>
                                                            <Badge className={cn(
                                                                "text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-lg border-none text-white",
                                                                sub.status === 'Pending' ? "bg-amber-500 animate-pulse" :
                                                                sub.status === 'In Progress' ? "bg-blue-500" : "bg-emerald-500"
                                                            )}>
                                                                {sub.status}
                                                            </Badge>
                                                        </div>

                                                        {sub.adminRemark && (
                                                            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm transition-all group-hover:border-slate-300">
                                                                <span className="text-[9px] font-black text-indigo-650 uppercase tracking-widest block">Administration Response</span>
                                                                <p className="text-xs text-slate-600 font-medium italic">"{sub.adminRemark}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50/50 border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-6 gap-3">
                                        <MessageSquare className="h-10 w-10 text-slate-300 stroke-[1.2]" />
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No satisfaction submissions registered yet.</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
